import React, { useEffect, useState } from 'react';
import {
  Bot,
  Code2,
  FileCode,
  FileText,
  HelpCircle,
  LayoutGrid,
  MessageSquare,
  Play,
  Sparkles,
} from 'lucide-react';
import { requestEvaluationReport, requestInterviewerMessage } from './api/interviewApi';
import { ChatPanel } from './components/ChatPanel';
import { CodeEditor } from './components/CodeEditor';
import { EvaluationReportView } from './components/EvaluationReportView';
import { Header } from './components/Header';
import { InterviewTypeSelector } from './components/InterviewTypeSelector';
import { LoginPage } from './components/LoginPage';
import { ProblemStatement } from './components/ProblemStatement';
import { TestResultsPanel } from './components/TestResultsPanel';
import { QUESTIONS_BANK } from './data/questions';
import { INTERVIEW_TRACKS } from './data/tracks';
import {
  CandidateProfile,
  ChatMessage,
  EvaluationReport,
  ExecutionResponse,
  InterviewSession,
  InterviewTrack,
  InterviewTrackId,
  SupportedLanguage,
} from './types/interview';
import { executeCode } from './utils/codeRunner';
import {
  clearCandidateProfile,
  clearSession,
  createInitialSession,
  generateSessionId,
  getSavedCandidateProfile,
  getSessionIdFromUrl,
  loadSession,
  saveCandidateProfile,
  saveSession,
} from './utils/sessionStore';

type AppView = 'login' | 'track_select' | 'interview' | 'report';

export default function App() {
  // Authentication & Profile State
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(() =>
    getSavedCandidateProfile()
  );

  // Determine initial view
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const savedProf = getSavedCandidateProfile();
    if (!savedProf) return 'login';
    const params = new URLSearchParams(window.location.search);
    if (params.get('track_select')) return 'track_select';
    return 'track_select';
  });

  // Session State
  const [sessionId, setSessionId] = useState<string>(() => getSessionIdFromUrl());
  const [session, setSession] = useState<InterviewSession>(() => {
    const s = loadSession(sessionId);
    if (candidateProfile && !s.candidateProfile) {
      s.candidateProfile = candidateProfile;
      s.candidateName = candidateProfile.name;
    }
    return s;
  });

  // Current problem & UI state
  const [leftTab, setLeftTab] = useState<'problem' | 'chat'>('problem');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [testExecutionResponse, setTestExecutionResponse] = useState<ExecutionResponse | null>(null);

  // Pulse animation for new AI messages
  const [chatPulse, setChatPulse] = useState(false);
  useEffect(() => {
    const history = session.chatHistory;
    if (history.length > 0) {
      const lastMsg = history[history.length - 1];
      if (lastMsg.sender === 'interviewer' && leftTab !== 'chat') {
        setChatPulse(true);
        const timer = setTimeout(() => setChatPulse(false), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [session.chatHistory, leftTab]);

  // Active track
  const currentTrack =
    INTERVIEW_TRACKS.find((t) => t.id === session.trackId) || INTERVIEW_TRACKS[0];

  // Active question
  const currentQIndex = session.currentQuestionIndex;
  const activeQuestions = QUESTIONS_BANK.filter((q) =>
    session.selectedQuestionIds.includes(q.id)
  );
  const currentQuestion =
    activeQuestions[currentQIndex] || activeQuestions[0] || QUESTIONS_BANK[0];
  const activeLanguage = session.activeLanguage || 'java';
  const currentCode =
    session.codeByQuestion[currentQuestion.id]?.[activeLanguage] ??
    currentQuestion.starterCode[activeLanguage];

  // Save session whenever it changes
  useEffect(() => {
    saveSession(session);
  }, [session]);

  // Initial welcome greeting from AI Interviewer when starting an interview
  useEffect(() => {
    if (
      currentView === 'interview' &&
      session.chatHistory.length === 0 &&
      !isAiResponding
    ) {
      triggerAiInterviewerGreeting();
    }
  }, [currentView, sessionId, session.trackId]);

  // Global Keyboard Shortcuts (Cmd/Ctrl + Enter to Run / Submit)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (currentView !== 'interview') return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          handleSubmitSolution();
        } else {
          handleRunTests();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentView, currentCode, activeLanguage, currentQuestion, session]);

  // Handle Login flow
  const handleLogin = (profile: CandidateProfile) => {
    saveCandidateProfile(profile);
    setCandidateProfile(profile);
    setSession((prev) => ({
      ...prev,
      candidateProfile: profile,
      candidateName: profile.name,
    }));
    setCurrentView('track_select');
  };

  // Handle Logout
  const handleLogout = () => {
    clearCandidateProfile();
    setCandidateProfile(null);
    setCurrentView('login');
  };

  // Handle Track Selection
  const handleSelectTrack = (track: InterviewTrack | InterviewTrackId, customQuestionIds?: string[]) => {
    const newId = generateSessionId();
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('session', newId);
    newUrl.searchParams.delete('track_select');
    window.history.replaceState({}, '', newUrl.toString());

    const trackId: InterviewTrackId = typeof track === 'string' ? track : track.id;

    const newSession = createInitialSession(
      newId,
      candidateProfile?.name || 'Candidate',
      trackId,
      customQuestionIds,
      candidateProfile || undefined
    );

    setSessionId(newId);
    setSession(newSession);
    setTestExecutionResponse(null);
    setLeftTab('problem');
    setCurrentView('interview');
  };

  const triggerAiInterviewerGreeting = async () => {
    setIsAiResponding(true);
    try {
      const greeting = await requestInterviewerMessage({
        candidateName: session.candidateName,
        candidateProfile: candidateProfile || session.candidateProfile,
        trackId: currentTrack.id,
        trackTitle: currentTrack.title,
        interviewerPersona: currentTrack.interviewer,
        currentQuestion: {
          id: currentQuestion.id,
          title: currentQuestion.title,
          description: currentQuestion.description,
          difficulty: currentQuestion.difficulty,
          category: currentQuestion.category,
        },
        currentCode,
        language: activeLanguage,
        eventTrigger: 'init',
        messagesHistory: [],
      });

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        content: greeting,
        timestamp: Date.now(),
        questionId: currentQuestion.id,
      };

      setSession((prev) => ({
        ...prev,
        chatHistory: [newMsg],
      }));
    } catch (e) {
      console.error('Failed to get initial greeting', e);
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleSelectQuestion = (index: number) => {
    if (index < 0 || index >= activeQuestions.length) return;
    setSession((prev) => ({
      ...prev,
      currentQuestionIndex: index,
    }));
    setTestExecutionResponse(null);
  };

  const handleChangeLanguage = (lang: SupportedLanguage) => {
    setSession((prev) => ({
      ...prev,
      activeLanguage: lang,
    }));
  };

  const handleChangeCode = (newCode: string) => {
    setSession((prev) => {
      const updatedCodeMap = { ...prev.codeByQuestion };
      if (!updatedCodeMap[currentQuestion.id]) {
        updatedCodeMap[currentQuestion.id] = { ...currentQuestion.starterCode };
      }
      updatedCodeMap[currentQuestion.id][activeLanguage] = newCode;
      return {
        ...prev,
        codeByQuestion: updatedCodeMap,
      };
    });
  };

  const handleResetCode = () => {
    const starter = currentQuestion.starterCode[activeLanguage];
    handleChangeCode(starter);
    setTestExecutionResponse(null);
  };

  const handleRunTests = async (): Promise<ExecutionResponse> => {
    setIsRunningTests(true);
    try {
      const response = await executeCode(currentCode, activeLanguage, currentQuestion);
      setTestExecutionResponse(response);

      // Save submission record
      setSession((prev) => ({
        ...prev,
        submissions: {
          ...prev.submissions,
          [currentQuestion.id]: {
            questionId: currentQuestion.id,
            language: activeLanguage,
            code: currentCode,
            testResults: response.results,
            allPassed: response.allPassed,
            submittedAt: Date.now(),
          },
        },
      }));

      return response;
    } catch (err: any) {
      const fallbackErrorResponse: ExecutionResponse = {
        success: false,
        allPassed: false,
        passCount: 0,
        totalCount: currentQuestion.testCases.length,
        results: [],
        runtimeError: err.message || 'Execution error encountered',
      };
      setTestExecutionResponse(fallbackErrorResponse);
      return fallbackErrorResponse;
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleSubmitSolution = async () => {
    // 1. Run tests first
    const execRes = await handleRunTests();

    // 2. Open chat tab to continue interviewer dialogue
    setLeftTab('chat');

    // 3. Inform AI of submission and get follow-up
    const userSummaryMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: execRes.allPassed
        ? `I have completed my implementation in ${activeLanguage}. All ${execRes.passCount}/${execRes.totalCount} test cases passed!`
        : `I tested my solution in ${activeLanguage}, but ${execRes.passCount}/${execRes.totalCount} test cases passed. I would like your review on my approach.`,
      timestamp: Date.now(),
      questionId: currentQuestion.id,
      isSubmissionEvent: true,
      submissionSummary: {
        passed: execRes.allPassed,
        passCount: execRes.passCount,
        totalCount: execRes.totalCount,
      },
    };

    const updatedChat = [...session.chatHistory, userSummaryMsg];
    setSession((prev) => ({
      ...prev,
      chatHistory: updatedChat,
    }));

    setIsAiResponding(true);
    try {
      const aiResponse = await requestInterviewerMessage({
        candidateName: session.candidateName,
        candidateProfile: candidateProfile || session.candidateProfile,
        trackId: currentTrack.id,
        trackTitle: currentTrack.title,
        interviewerPersona: currentTrack.interviewer,
        currentQuestion: {
          id: currentQuestion.id,
          title: currentQuestion.title,
          description: currentQuestion.description,
          difficulty: currentQuestion.difficulty,
          category: currentQuestion.category,
        },
        currentCode,
        language: activeLanguage,
        eventTrigger: 'code_submitted',
        testSummary: {
          allPassed: execRes.allPassed,
          passCount: execRes.passCount,
          totalCount: execRes.totalCount,
        },
        messagesHistory: updatedChat,
      });

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        content: aiResponse,
        timestamp: Date.now(),
        questionId: currentQuestion.id,
      };

      setSession((prev) => ({
        ...prev,
        chatHistory: [...prev.chatHistory, aiMsg],
      }));
    } catch (e) {
      console.error('Failed to get AI response', e);
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: Date.now(),
      questionId: currentQuestion.id,
    };

    const updatedHistory = [...session.chatHistory, userMsg];
    setSession((prev) => ({
      ...prev,
      chatHistory: updatedHistory,
    }));

    setIsAiResponding(true);
    try {
      const reply = await requestInterviewerMessage({
        candidateName: session.candidateName,
        candidateProfile: candidateProfile || session.candidateProfile,
        trackId: currentTrack.id,
        trackTitle: currentTrack.title,
        interviewerPersona: currentTrack.interviewer,
        currentQuestion: {
          id: currentQuestion.id,
          title: currentQuestion.title,
          description: currentQuestion.description,
          difficulty: currentQuestion.difficulty,
          category: currentQuestion.category,
        },
        currentCode,
        language: activeLanguage,
        eventTrigger: 'user_message',
        messagesHistory: updatedHistory,
      });

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        content: reply,
        timestamp: Date.now(),
        questionId: currentQuestion.id,
      };

      setSession((prev) => ({
        ...prev,
        chatHistory: [...prev.chatHistory, aiMsg],
      }));
    } catch (e) {
      console.error('Chat error', e);
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleRequestHint = async () => {
    setLeftTab('chat');
    await handleSendMessage(
      'Could you give me a subtle hint to help guide my approach on this problem?'
    );
  };

  const handleExplainComplexity = async (explanation: string) => {
    setLeftTab('chat');
    await handleSendMessage(explanation);
  };

  const handleNextQuestion = () => {
    if (currentQIndex < activeQuestions.length - 1) {
      handleSelectQuestion(currentQIndex + 1);
      setLeftTab('problem');
    } else {
      handleEndInterview();
    }
  };

  const handleEndInterview = async () => {
    setIsEvaluating(true);
    const durationMinutes = Math.max(
      1,
      Math.round((Date.now() - session.startedAt) / 60000)
    );

    try {
      const report = await requestEvaluationReport({
        candidateName: session.candidateName,
        candidateProfile: candidateProfile || session.candidateProfile,
        trackTitle: currentTrack.title,
        questionsAttempted: activeQuestions,
        submissions: session.submissions,
        chatTranscript: session.chatHistory.map((m) => ({
          sender: m.sender,
          content: m.content,
          timestamp: m.timestamp,
        })),
        durationMinutes,
      });

      setSession((prev) => ({
        ...prev,
        status: 'completed',
        completedAt: Date.now(),
        report,
      }));
      setCurrentView('report');
    } catch (e) {
      console.error('Failed to generate report', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleStartNewSession = () => {
    const newId = generateSessionId();
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('session', newId);
    window.history.replaceState({}, '', newUrl.toString());

    const freshSession = createInitialSession(
      newId,
      candidateProfile?.name || session.candidateName,
      session.trackId,
      session.selectedQuestionIds,
      candidateProfile || undefined
    );
    setSessionId(newId);
    setSession(freshSession);
    setTestExecutionResponse(null);
    setLeftTab('problem');
    setCurrentView('interview');
  };

  // 1. Render Login Screen
  if (currentView === 'login' || !candidateProfile) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 2. Render Track Selector
  if (currentView === 'track_select') {
    return (
      <InterviewTypeSelector
        candidateProfile={candidateProfile}
        onSelectTrack={handleSelectTrack}
        onLogout={handleLogout}
      />
    );
  }

  // 3. Render Evaluation Report View
  if (currentView === 'report' && session.report) {
    return (
      <EvaluationReportView
        report={session.report}
        session={session}
        questions={activeQuestions}
        onStartNewSession={handleStartNewSession}
        onReturnToInterview={() => setCurrentView('interview')}
        onChangeTrack={() => setCurrentView('track_select')}
      />
    );
  }

  const currentSubmission = session.submissions[currentQuestion.id];

  // 4. Render Live Interview Workspace
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0A0A0A] text-[#eff1f6] font-sans">
      {/* Top Navigation & LeetCode Header */}
      <Header
        sessionId={session.sessionId}
        candidateName={candidateProfile.name || session.candidateName}
        candidateProfile={candidateProfile}
        trackTitle={currentTrack.title}
        trackId={currentTrack.id}
        onChangeTrack={() => setCurrentView('track_select')}
        onLogout={handleLogout}
        onChangeName={(name) => {
          const updated = { ...candidateProfile, name };
          setCandidateProfile(updated);
          saveCandidateProfile(updated);
          setSession((prev) => ({ ...prev, candidateName: name }));
        }}
        questions={activeQuestions}
        currentQuestionIndex={currentQIndex}
        onSelectQuestion={handleSelectQuestion}
        submissions={session.submissions}
        startedAt={session.startedAt}
        isRunningTests={isRunningTests}
        onRunTests={handleRunTests}
        onSubmitQuestion={handleSubmitSolution}
        onEndInterview={handleEndInterview}
        isCompleted={session.status === 'completed'}
        onViewReport={() => setCurrentView('report')}
      />

      {/* Main Split Body (LeetCode Workspace) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Split: Tabs (Problem Description / AI Interviewer Assistant) */}
        <div className="w-full md:w-[45%] lg:w-[42%] xl:w-[40%] flex flex-col border-r border-[#262626] bg-[#121212] shrink-0">
          {/* Tab Switcher (LeetCode exact style) */}
          <div className="flex items-center border-b border-[#262626] bg-[#1A1A1A] px-3 py-1.5 gap-2 shrink-0 select-none">
            <button
              id="tab-btn-problem"
              onClick={() => setLeftTab('problem')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                leftTab === 'problem'
                  ? 'bg-[#2f2f2f] text-white'
                  : 'text-[#8c8c8c] hover:text-[#d0d0d0]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#ffa116]" />
              <span>Description</span>
            </button>

            <button
              id="tab-btn-chat"
              onClick={() => setLeftTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer relative ${
                leftTab === 'chat'
                  ? 'bg-[#2f2f2f] text-white'
                  : chatPulse
                  ? 'animate-notify-pulse border border-[#ffa116]/50 shadow-[0_0_8px_rgba(255,161,22,0.2)] text-white'
                  : 'text-[#8c8c8c] hover:text-[#d0d0d0]'
              }`}
            >
              <Bot className={`w-3.5 h-3.5 ${chatPulse ? 'text-[#ffa116] animate-pulse' : 'text-[#ffa116]'}`} />
              <span>AI Interviewer ({currentTrack.interviewer.name})</span>
              {session.chatHistory.length > 0 && (
                <span className="text-[10px] bg-[#0A0A0A] text-[#ffa116] px-1.5 py-0.2 rounded-full border border-[#333333] font-mono">
                  {session.chatHistory.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-hidden relative bg-[#121212]">
            {leftTab === 'problem' ? (
              <ProblemStatement
                question={currentQuestion}
                questionNumber={currentQIndex + 1}
                totalQuestions={activeQuestions.length}
                onRequestHint={handleRequestHint}
                onOpenChatTab={() => setLeftTab('chat')}
                isPassed={currentSubmission?.allPassed}
              />
            ) : (
              <ChatPanel
                messages={session.chatHistory}
                isAiResponding={isAiResponding}
                onSendMessage={handleSendMessage}
                onRequestHint={handleRequestHint}
                onExplainComplexity={handleExplainComplexity}
                onNextQuestion={handleNextQuestion}
                candidateName={session.candidateName}
                hasSubmissionsPassed={Boolean(currentSubmission?.allPassed)}
                interviewer={currentTrack.interviewer}
              />
            )}
          </div>
        </div>

        {/* Right Split: Code Editor (top) + Test Case Console (bottom) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#121212] overflow-hidden">
          {/* Editor Area */}
          <div className="flex-1 min-h-[280px] overflow-hidden bg-[#121212]">
            <CodeEditor
              language={activeLanguage}
              onChangeLanguage={handleChangeLanguage}
              code={currentCode}
              onChangeCode={handleChangeCode}
              starterCode={currentQuestion.starterCode[activeLanguage]}
              onResetCode={handleResetCode}
              onRunTests={handleRunTests}
              isRunningTests={isRunningTests}
              testExecutionResponse={testExecutionResponse}
            />
          </div>

          {/* Test Case & Output Console */}
          <div className="h-[260px] lg:h-[290px] shrink-0 bg-[#121212]">
            <TestResultsPanel
              testCases={currentQuestion.testCases}
              executionResponse={testExecutionResponse}
              isRunning={isRunningTests}
              onRunTests={handleRunTests}
            />
          </div>
        </div>
      </main>

      {/* Evaluating Modal Overlay */}
      {isEvaluating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="relative w-14 h-14 mx-auto">
              <div className="absolute inset-0 rounded-full border-3 border-[#333333] border-t-[#ffa116] animate-spin" />
              <div className="absolute inset-2 rounded-full bg-[#ffa116]/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#ffa116] animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Compiling Assessment Report</h3>
              <p className="text-xs text-[#8c8c8c]">
                {currentTrack.interviewer.name} and the Interview Committee are evaluating your test results, algorithmic complexity, and dialogue...
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-[#303030] rounded-xl p-3.5 text-left space-y-1.5 text-[11px] text-[#cfcfcf]">
              <div className="flex items-center gap-2 text-[#2cbb5d]">
                <span>✓</span> Evaluated {activeQuestions.length} {currentTrack.title} solutions
              </div>
              <div className="flex items-center gap-2 text-[#2cbb5d]">
                <span>✓</span> Analyzed Big-O time and space complexity metrics
              </div>
              <div className="flex items-center gap-2 text-[#ffa116] animate-pulse">
                <span>•</span> Generating actionable strengths and growth recommendations...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
