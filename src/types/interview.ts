export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'cpp' | 'java' | 'go';

export interface TestCase {
  id: string;
  input: string; // Displayed input format
  expectedOutput: string; // Displayed expected output format
  rawInput: any[]; // Arguments passed to the target function
  rawExpected: any; // Expected return value
  isHidden?: boolean;
  explanation?: string;
}

export type InterviewTrackId =
  | 'dsa'
  | 'system_design'
  | 'ml_ai'
  | 'data_sql'
  | 'devops_cloud'
  | 'cybersecurity'
  | 'frontend'
  | 'backend'
  | 'faang_mock'
  | 'fullstack'
  | 'custom';

export interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  trackId?: InterviewTrackId;
  timeEstimateMinutes: number;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: Record<SupportedLanguage, string>;
  functionName: string;
  testCases: TestCase[];
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  inputDisplay: string;
  expectedDisplay: string;
  actualDisplay: string;
  executionTimeMs: number;
  stdout?: string;
  error?: string;
}

export interface ExecutionResponse {
  success: boolean;
  results: TestResult[];
  allPassed: boolean;
  passCount: number;
  totalCount: number;
  compilerError?: string;
  runtimeError?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  content: string;
  timestamp: number;
  questionId?: string;
  isFollowUp?: boolean;
  isSubmissionEvent?: boolean;
  submissionSummary?: {
    passed: boolean;
    passCount: number;
    totalCount: number;
  };
}

export interface QuestionSubmission {
  questionId: string;
  language: SupportedLanguage;
  code: string;
  testResults: TestResult[];
  allPassed: boolean;
  submittedAt: number;
  candidateComplexityExplanation?: string;
}

export interface EvaluationReport {
  overallScore: number; // 0 - 100
  recommendation: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'Needs Improvement';
  summary: string;
  strengths: string[];
  improvementAreas: string[];
  questionEvaluations: {
    questionId: string;
    questionTitle: string;
    score: number; // 0 - 100
    problemSolvingRating: string;
    codeQualityRating: string;
    timeComplexityAnalysis: string;
    spaceComplexityAnalysis: string;
    testCasesPassed: string;
    feedback: string;
    suggestedOptimization?: string;
  }[];
  communicationFeedback: string;
  technicalProficiencyFeedback: string;
  generatedAt: number;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  targetCompany: string;
  targetRole: string;
  experienceLevel: 'Entry / Intern' | 'Junior (L3)' | 'Mid-Level (L4)' | 'Senior (L5)' | 'Staff+ (L6+)';
  avatarColor?: string;
  createdAt: number;
}

export interface InterviewTrack {
  id: InterviewTrackId;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  iconName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  questionCount: number;
  durationMinutes: number;
  targetCompanies: string[];
  topics: string[];
  questionIds: string[];
  interviewer: {
    name: string;
    role: string;
    company: string;
    style: string;
    avatar: string;
  };
}

export interface InterviewSession {
  sessionId: string;
  candidateName: string;
  candidateProfile?: CandidateProfile;
  trackId: InterviewTrackId;
  trackTitle?: string;
  currentQuestionIndex: number;
  selectedQuestionIds: string[];
  status: 'active' | 'evaluating' | 'completed';
  chatHistory: ChatMessage[];
  codeByQuestion: Record<string, Record<SupportedLanguage, string>>;
  activeLanguage: SupportedLanguage;
  submissions: Record<string, QuestionSubmission>;
  report: EvaluationReport | null;
  startedAt: number;
  completedAt?: number;
  timeLimitMinutes?: number;
}
