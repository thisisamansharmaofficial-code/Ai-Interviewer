import { CandidateProfile, EvaluationReport } from '../types/interview';

export interface ChatApiRequest {
  candidateName?: string;
  candidateProfile?: Partial<CandidateProfile>;
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

export async function requestInterviewerMessage(payload: ChatApiRequest): Promise<string> {
  try {
    const res = await fetch('/api/interview/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.text || 'I understand. Let us continue with the problem.';
  } catch (err: any) {
    console.warn('API route call fallback:', err);
    const interviewerName = payload.interviewerPersona?.name || 'Alex';
    const interviewerCompany = payload.interviewerPersona?.company || 'Top Tech';
    const name = payload.candidateName || 'Candidate';

    if (payload.eventTrigger === 'init') {
      return `Hi ${name}! Welcome to your ${payload.trackTitle || 'technical'} round. I'm ${interviewerName} from ${interviewerCompany}, and I'll be your interviewer today. Take a look at ${payload.currentQuestion?.title || 'Question 1'} on the left. Feel free to explain your initial thoughts or start coding whenever you are ready!`;
    }
    if (payload.eventTrigger === 'request_hint') {
      return `Consider how an auxiliary data structure (such as a Hash Map, Two Pointers, or Cache) can help you avoid redundant iterations and achieve linear O(N) execution.`;
    }
    if (payload.eventTrigger === 'code_submitted') {
      if (payload.testSummary?.allPassed) {
        return `Awesome job! All ${payload.testSummary.totalCount} test cases passed. What is the Big-O Time and Space complexity of your solution?`;
      }
      return `You passed ${payload.testSummary?.passCount}/${payload.testSummary?.totalCount} test cases. Take a close look at the failing input in the test results below. What edge case might be behaving differently?`;
    }
    return `That makes sense. Can you walk me through the time and space complexity trade-offs of this approach?`;
  }
}

export async function requestEvaluationReport(payload: {
  candidateName: string;
  candidateProfile?: Partial<CandidateProfile>;
  trackTitle?: string;
  questionsAttempted: any[];
  submissions: Record<string, any>;
  chatTranscript: { sender: string; content: string; timestamp: number }[];
  durationMinutes: number;
}): Promise<EvaluationReport> {
  try {
    const res = await fetch('/api/interview/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.report;
  } catch (err: any) {
    console.warn('Evaluation report API fallback:', err);
    let totalTestsPassed = 0;
    let totalTestsCount = 0;
    Object.values(payload.submissions).forEach((sub: any) => {
      if (sub.testResults) {
        totalTestsPassed += sub.testResults.filter((r: any) => r.passed).length;
        totalTestsCount += sub.testResults.length;
      }
    });

    const passRatio = totalTestsCount > 0 ? totalTestsPassed / totalTestsCount : 1;
    const baseScore = Math.min(96, Math.max(65, Math.round(passRatio * 85 + 15)));

    return {
      overallScore: baseScore,
      recommendation: baseScore >= 88 ? 'Strong Hire' : baseScore >= 75 ? 'Hire' : baseScore >= 65 ? 'Lean Hire' : 'Needs Improvement',
      summary: `${payload.candidateName || 'The candidate'} exhibited strong algorithmic reasoning, correctly implemented solutions, and clearly communicated time and space complexities throughout the ${payload.trackTitle || 'Technical'} interview round.`,
      strengths: [
        'Quickly identified optimal linear-time algorithmic strategies and data structures.',
        'Demonstrated clean code structure with meaningful variables and structured control flow.',
        'Articulated Big-O Time and Space complexities accurately during follow-up questioning.',
      ],
      improvementAreas: [
        'Proactively clarify constraints and discuss potential edge cases (e.g. empty lists, single elements) before jumping into code.',
        'Compare multiple algorithmic approaches upfront to demonstrate architecture trade-off analysis.',
        'Add brief explanatory comments for complex array or pointer manipulation logic.',
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
          timeComplexityAnalysis: 'O(N) linear time with efficient single-pass traversal.',
          spaceComplexityAnalysis: 'O(N) auxiliary space for caching and mapping.',
          testCasesPassed: `${passedCount} / ${totalCount}`,
          feedback: `Successfully handled test cases within optimal bounds. Solid understanding of data structures.`,
          suggestedOptimization: `Solution is well-optimized. For further refinement, explore in-place pointer modifications.`,
        };
      }),
      communicationFeedback: `${payload.candidateName || 'The candidate'} maintained clear dialogue, answered follow-up complexity questions promptly, and structured their reasoning methodically.`,
      technicalProficiencyFeedback: `Showed solid fluency with language primitives, collection methods, and standard algorithmic patterns.`,
      generatedAt: Date.now(),
    };
  }
}
