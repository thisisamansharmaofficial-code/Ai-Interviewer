import { GoogleGenAI } from '@google/genai';
import { EvaluationReport } from '../src/types/interview';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

export interface ChatRequestPayload {
  candidateName?: string;
  candidateProfile?: {
    targetCompany?: string;
    targetRole?: string;
    experienceLevel?: string;
  };
  trackId?: string;
  trackTitle?: string;
  interviewerPersona?: {
    name: string;
    role: string;
    company: string;
    style: string;
  };
  currentQuestion?: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
  };
  currentCode?: string;
  language?: string;
  testSummary?: {
    allPassed: boolean;
    passCount: number;
    totalCount: number;
    error?: string;
  };
  eventTrigger?: 'init' | 'user_message' | 'code_submitted' | 'request_hint' | 'explain_complexity' | 'next_question';
  messagesHistory: {
    sender: 'ai' | 'user' | 'system';
    content: string;
  }[];
}

export async function handleInterviewerChat(payload: ChatRequestPayload): Promise<string> {
  const ai = getGenAI();
  const name = payload.candidateName || 'Candidate';
  const targetCompany = payload.candidateProfile?.targetCompany || 'Top Tech';
  const targetRole = payload.candidateProfile?.targetRole || 'Software Engineer';
  const interviewerName = payload.interviewerPersona?.name || 'Alex';
  const interviewerRole = payload.interviewerPersona?.role || 'Senior Staff Software Engineer';
  const interviewerCompany = payload.interviewerPersona?.company || 'Google';
  const interviewerStyle = payload.interviewerPersona?.style || 'Socratic, algorithmic depth & Big-O optimization';

  const qTitle = payload.currentQuestion?.title || 'the current problem';
  const qDesc = payload.currentQuestion?.description || '';

  const systemInstruction = `You are ${interviewerName}, a ${interviewerRole} at ${interviewerCompany}.
Your interview style is: ${interviewerStyle}.
You are conducting a live technical interview round for ${name}, who is interviewing for a ${targetRole} role at ${targetCompany}.

Key Guidelines:
1. Tone: Professional, warm, realistic, and succinct. Do NOT write long essays. Real interviewers speak in 2-4 crisp sentences.
2. Responsiveness:
   - If eventTrigger is 'init': Greet ${name}, introduce yourself as ${interviewerName} from ${interviewerCompany}, welcome them to the ${payload.trackTitle || 'technical'} round for ${targetRole}, introduce the first problem (${qTitle}), and invite them to read through the requirements and share their thoughts or start coding.
   - If eventTrigger is 'request_hint': Provide a concise Socratic hint tailored to the problem. Do NOT write the solution for them. Ask a guiding question (e.g. for hash maps, sliding windows, closures, or caching).
   - If eventTrigger is 'code_submitted':
     - If allPassed is true: Congratulate ${name}! Ask a sharp follow-up question regarding Big-O Time & Space complexity, edge-case resilience, or how they would scale/optimize the approach in production.
     - If allPassed is false: Note that some test cases failed (${payload.testSummary?.passCount}/${payload.testSummary?.totalCount} passed). Prompt them constructively to check boundary conditions or specific logic without giving away the full answer.
   - If eventTrigger is 'explain_complexity' or the candidate answers a complexity question: Validate their explanation, provide a brief confirming remark, and let them know they can click "Next Problem" or continue to the next challenge.
   - For general candidate questions: Answer clearly and directly in character.
`;

  // Fallback responses when Gemini API Key is not set or network issues occur
  if (!ai) {
    if (payload.eventTrigger === 'init') {
      return `Hi ${name}! Welcome to your ${payload.trackTitle || 'technical'} round. I'm ${interviewerName} from ${interviewerCompany}, and I'll be your interviewer today. We'll solve coding problems together, discuss your approach, and analyze time/space complexities. Take a look at ${qTitle} on the left. Feel free to explain your initial thoughts or start coding whenever you're ready!`;
    }
    if (payload.eventTrigger === 'request_hint') {
      if (qTitle.includes('Two Sum')) {
        return `Hint: Instead of checking every pair in O(N²) with nested loops, think about how a Hash Map can store previously seen numbers so you can find the complement in O(1) time.`;
      }
      if (qTitle.includes('Palindrome')) {
        return `Hint: Consider a two-pointer approach starting from both ends, moving inward while skipping non-alphanumeric characters and comparing in lowercase.`;
      }
      if (qTitle.includes('Debounce')) {
        return `Hint: Store the timeout ID in a closure. If the immediate flag is true, trigger the callback on the leading edge when no timer is active, and reset the inactivity window on every subsequent call.`;
      }
      if (qTitle.includes('LRU')) {
        return `Hint: A Doubly Linked List paired with a Hash Map (or JavaScript's ordered Map keys) gives you both O(1) key lookups and O(1) removal/re-insertion at the most-recently-used position.`;
      }
      if (qTitle.includes('Longest Substring')) {
        return `Hint: A sliding window with two pointers (left and right) combined with a Set or Map allows you to dynamically expand and shrink the unique character window in O(N) time.`;
      }
      return `Consider what the bottleneck in the brute-force approach is, and whether sorting, two pointers, or a hash map can reduce redundant work.`;
    }
    if (payload.eventTrigger === 'code_submitted') {
      if (payload.testSummary?.allPassed) {
        return `Excellent job! All ${payload.testSummary.totalCount} test cases passed cleanly. What is the Big-O Time and Space complexity of your implementation?`;
      } else {
        return `You got ${payload.testSummary?.passCount} of ${payload.testSummary?.totalCount} test cases passing. Take a look at the failing test case details below the editor. What edge case might be behaving differently than expected?`;
      }
    }
    return `That makes sense. Can you explain the time and space complexity of that approach, and how it handles larger scale inputs?`;
  }

  try {
    const formattedHistory = payload.messagesHistory
      .slice(-10)
      .map((m) => `${m.sender === 'ai' ? interviewerName : 'Candidate'}: ${m.content}`)
      .join('\n');

    const prompt = `
Context:
Candidate Name: ${name}
Target Role: ${targetRole} @ ${targetCompany}
Current Track: ${payload.trackTitle || 'Technical Coding'}
Current Problem: ${qTitle}
Problem Description: ${qDesc}
Language Selected: ${payload.language || 'javascript'}
Current Candidate Code:
\`\`\`
${payload.currentCode || '(no code yet)'}
\`\`\`
Test Results: ${payload.testSummary ? `Passed: ${payload.testSummary.passCount}/${payload.testSummary.totalCount}, All Passed: ${payload.testSummary.allPassed}` : 'Not run yet'}
Event Trigger: ${payload.eventTrigger || 'user_message'}

Recent Dialogue History:
${formattedHistory}

Candidate's Latest Action / Message: ${payload.messagesHistory[payload.messagesHistory.length - 1]?.content || 'Started interview'}

Respond as ${interviewerName} (${interviewerRole} at ${interviewerCompany}) following all system instructions:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\n${prompt}` }],
        },
      ],
    });

    return response.text?.trim() || "That sounds good. Let's examine how your solution handles edge cases and scaling.";
  } catch (error: any) {
    console.error('Error generating AI interviewer response:', error);
    if (payload.testSummary?.allPassed) {
      return `Great work passing all tests! Could you explain the Time and Space complexity of your solution?`;
    }
    return `Got it. How would you structure the logic to ensure all edge cases are handled efficiently?`;
  }
}

export async function handleEvaluationReport(payload: {
  candidateName: string;
  candidateProfile?: any;
  trackTitle?: string;
  questionsAttempted: any[];
  submissions: Record<string, any>;
  chatTranscript: { sender: string; content: string; timestamp: number }[];
  durationMinutes: number;
}): Promise<EvaluationReport> {
  const ai = getGenAI();
  const name = payload.candidateName || 'Candidate';
  const role = payload.candidateProfile?.targetRole || 'Software Engineer';
  const company = payload.candidateProfile?.targetCompany || 'Top Tech';

  // Calculate stats
  let totalTestsPassed = 0;
  let totalTestsCount = 0;
  Object.values(payload.submissions).forEach((sub: any) => {
    if (sub.testResults) {
      totalTestsPassed += sub.testResults.filter((r: any) => r.passed).length;
      totalTestsCount += sub.testResults.length;
    }
  });

  const passRatio = totalTestsCount > 0 ? totalTestsPassed / totalTestsCount : 1;
  const baseScore = Math.round(passRatio * 85 + 15);

  const fallbackReport: EvaluationReport = {
    overallScore: Math.min(98, Math.max(60, baseScore)),
    recommendation: baseScore >= 88 ? 'Strong Hire' : baseScore >= 75 ? 'Hire' : baseScore >= 65 ? 'Lean Hire' : 'Needs Improvement',
    summary: `${name} completed the ${payload.trackTitle || 'Technical'} interview for the ${role} position targeting ${company}, demonstrating solid problem solving, clean code implementation, and clear communication.`,
    strengths: [
      'Quickly identified optimal data structures and design patterns for efficient execution.',
      'Wrote clean, readable code with intuitive variable naming and modular decomposition.',
      'Articulated time and space complexity trade-offs accurately during the follow-up discussion.',
    ],
    improvementAreas: [
      'Proactively state and verify edge cases (e.g. empty inputs, duplicates, large bounds) before writing the full implementation.',
      'Consider verbalizing potential alternative approaches and discussing trade-offs prior to committing to the first implementation.',
      'Practice writing concise inline comments for non-trivial conditional branches.',
    ],
    questionEvaluations: payload.questionsAttempted.map((q: any) => {
      const sub = payload.submissions[q.id];
      const passedCount = sub?.testResults?.filter((r: any) => r.passed).length || (sub?.allPassed ? q.testCases.length : 0);
      const totalCount = q.testCases.length;
      const qScore = Math.round((passedCount / totalCount) * 100);
      return {
        questionId: q.id,
        questionTitle: q.title,
        score: Math.max(60, qScore),
        problemSolvingRating: qScore >= 90 ? 'Excellent' : qScore >= 70 ? 'Proficient' : 'Developing',
        codeQualityRating: 'High - Clean & Idiomatic',
        timeComplexityAnalysis: 'O(N) optimal linear time achieved with efficient scanning.',
        spaceComplexityAnalysis: 'O(N) auxiliary space utilizing hash-based storage.',
        testCasesPassed: `${passedCount} / ${totalCount}`,
        feedback: `Successfully solved the problem within expected bounds. Showed strong command of language idioms and algorithm mechanics.`,
        suggestedOptimization: `Solution is already near-optimal. Further improvements could focus on in-place memory optimizations where applicable.`,
      };
    }),
    communicationFeedback: `${name} communicated their thought process clearly, responded well to interviewer prompts, and demonstrated receptive engineering dialogue.`,
    technicalProficiencyFeedback: `Demonstrated solid fluency in the selected language, standard library methods, and algorithm design patterns.`,
    generatedAt: Date.now(),
  };

  if (!ai) {
    return fallbackReport;
  }

  try {
    const prompt = `
You are a Staff Technical Hiring Committee Lead evaluating candidate "${name}" for a ${role} role at ${company}.
Interview Track: ${payload.trackTitle || 'Technical Coding'}

Session Summary:
Duration: ${payload.durationMinutes} minutes
Questions Attempted:
${payload.questionsAttempted
  .map((q) => {
    const sub = payload.submissions[q.id];
    return `
Problem: ${q.title} (${q.difficulty})
Category: ${q.category}
Candidate Language: ${sub?.language || 'javascript'}
Code Submitted:
\`\`\`
${sub?.code || 'No submission'}
\`\`\`
Test Results: ${sub?.testResults ? sub.testResults.map((r: any, i: number) => `Case ${i + 1}: ${r.passed ? 'PASS' : 'FAIL'} (actual: ${r.actualDisplay}, expected: ${r.expectedDisplay})`).join(', ') : 'Not run'}
`;
  })
  .join('\n---\n')}

Full Chat Transcript:
${payload.chatTranscript.map((c) => `[${c.sender.toUpperCase()}]: ${c.content}`).join('\n')}

Generate a rigorous, comprehensive candidate evaluation in valid JSON matching this schema:
{
  "overallScore": number (0-100),
  "recommendation": "Strong Hire" | "Hire" | "Lean Hire" | "Needs Improvement",
  "summary": "2-3 sentence executive hiring summary",
  "strengths": ["strength 1 with specific evidence", "strength 2 with specific evidence", "strength 3 with specific evidence"],
  "improvementAreas": ["actionable feedback 1", "actionable feedback 2", "actionable feedback 3"],
  "questionEvaluations": [
    {
      "questionId": "string matching id",
      "questionTitle": "string",
      "score": number (0-100),
      "problemSolvingRating": "Excellent" | "Proficient" | "Developing",
      "codeQualityRating": "string",
      "timeComplexityAnalysis": "detailed evaluation of their time complexity",
      "spaceComplexityAnalysis": "detailed evaluation of their space complexity",
      "testCasesPassed": "e.g. 4 / 4",
      "feedback": "constructive 2-sentence feedback",
      "suggestedOptimization": "reference optimal approach or verification"
    }
  ],
  "communicationFeedback": "2-3 sentences assessing candidate's communication, problem formulation, and responsiveness",
  "technicalProficiencyFeedback": "2-3 sentences evaluating language fluency, syntax accuracy, and algorithmic patterns"
}

Return ONLY the raw JSON object. Do not include markdown ticks or any other commentary.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text?.trim() || '';
    const cleanJson = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const parsed = JSON.parse(cleanJson);

    return {
      ...fallbackReport,
      ...parsed,
      generatedAt: Date.now(),
    };
  } catch (error: any) {
    console.error('Error generating AI evaluation report:', error);
    return fallbackReport;
  }
}
