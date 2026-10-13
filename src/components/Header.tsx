import React, { useEffect, useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  FileText,
  ListFilter,
  LogOut,
  Play,
  RotateCcw,
  Send,
  Sliders,
  Sparkles,
  User,
} from 'lucide-react';
import { CandidateProfile, InterviewTrackId, Question } from '../types/interview';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  sessionId: string;
  candidateName: string;
  candidateProfile?: CandidateProfile;
  trackId?: InterviewTrackId;
  trackTitle?: string;
  onChangeName: (name: string) => void;
  questions: Question[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  submissions: Record<string, any>;
  startedAt: number;
  isRunningTests: boolean;
  onRunTests: () => void;
  onSubmitQuestion: () => void;
  onEndInterview: () => void;
  isCompleted: boolean;
  onViewReport: () => void;
  onChangeTrack: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sessionId,
  candidateName,
  candidateProfile,
  trackId,
  trackTitle,
  onChangeName,
  questions,
  currentQuestionIndex,
  onSelectQuestion,
  submissions,
  startedAt,
  isRunningTests,
  onRunTests,
  onSubmitQuestion,
  onEndInterview,
  isCompleted,
  onViewReport,
  onChangeTrack,
  onLogout,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isProblemListOpen, setIsProblemListOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt, isCompleted]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentQ = questions[currentQuestionIndex];
  const passedQuestionsCount = questions.filter((q) => submissions[q.id]?.allPassed).length;

  // Gamification: Calculate total test cases and total passed test cases
  const totalTestCases = questions.reduce((sum, q) => sum + (q.testCases?.length || 0), 0);
  const passedTestCases = questions.reduce((sum, q) => {
    const sub = submissions[q.id];
    if (sub && sub.testResults) {
      return sum + sub.testResults.filter((tr: any) => tr.passed).length;
    }
    return sum;
  }, 0);
  const progressPercentage = totalTestCases > 0 ? Math.round((passedTestCases / totalTestCases) * 100) : 0;

  return (
    <header
      id="app-header"
      className="bg-[#121212] border-b border-[#262626] text-[#eff1f6] px-3.5 py-2 select-none shrink-0 z-30 relative"
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-3">
        {/* Left: AI Interviewer Brand Icon + Track Badge + Problem Switcher */}
        <div className="flex items-center gap-3">
          {/* AI Interviewer Logo Mark */}
          <button
            onClick={onChangeTrack}
            title="Return to Interview Tracks Hub"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#282828] border border-[#333333] flex items-center justify-center text-[#ffa116] shadow-sm font-black text-sm group-hover:border-[#ffa116]">
              <ChevronLeft className="w-4 h-4" strokeWidth={3} />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                AI Interviewer <span className="text-[#ffa116] text-[10px] font-semibold bg-[#ffa116]/10 px-1.5 py-0.2 rounded border border-[#ffa116]/20">Proctor</span>
              </span>
            </div>
          </button>

          {/* Current Track Pill */}
          {trackTitle && (
            <div className="hidden md:flex items-center gap-1.5 bg-[#222222] border border-[#333333] px-2.5 py-1 rounded-md text-[11px] text-[#9e9e9e]">
              <span className="text-[#ffa116] font-medium">{trackTitle.split('&')[0]}</span>
              <span className="text-[#555]">Round</span>
            </div>
          )}

          <div className="h-4 w-px bg-[#333333] hidden md:block" />

          {/* Problem List Dropdown Button */}
          <div className="relative">
            <button
              id="btn-problem-list-dropdown"
              onClick={() => setIsProblemListOpen(!isProblemListOpen)}
              className="flex items-center gap-1.5 text-xs text-[#a0a0a0] hover:text-white bg-[#282828] hover:bg-[#323232] border border-[#333333] px-2.5 py-1.5 rounded-md transition-colors active:scale-[0.98] cursor-pointer"
            >
              <ListFilter className="w-3.5 h-3.5 text-[#ffa116]" />
              <span className="font-medium hidden sm:inline">Problems</span>
              <span className="text-[11px] text-[#8c8c8c] font-mono">
                ({passedQuestionsCount}/{questions.length})
              </span>
              <ChevronDown className="w-3 h-3 text-[#8c8c8c]" />
            </button>

            {/* Problem List Menu Popover */}
            {isProblemListOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProblemListOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 w-72 bg-[#262626] border border-[#3a3a3a] rounded-lg shadow-2xl py-1.5 z-50 overflow-hidden">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8a8a8a] border-b border-[#333333] flex justify-between items-center">
                    <span>Track Problem List</span>
                    <span className="text-[#2cbb5d] font-mono">{passedQuestionsCount}/{questions.length} Solved</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {questions.map((q, idx) => {
                      const isPassed = submissions[q.id]?.allPassed;
                      const isCurrent = idx === currentQuestionIndex;
                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            onSelectQuestion(idx);
                            setIsProblemListOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-2 hover:bg-[#333333] transition-colors active:scale-[0.98] cursor-pointer ${
                            isCurrent ? 'bg-[#333333] text-white font-medium' : 'text-[#d0d0d0]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isPassed ? (
                              <Check className="w-3.5 h-3.5 text-[#2cbb5d] shrink-0" />
                            ) : (
                              <span className="w-3.5 h-3.5 text-[11px] text-[#737373] text-center font-mono shrink-0">
                                {idx + 1}.
                              </span>
                            )}
                            <span className="truncate">{q.title.replace(/^\d+\.\s*/, '')}</span>
                          </div>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 font-medium ${
                              q.difficulty === 'Easy'
                                ? 'text-[#00b8a3] bg-[#00b8a3]/10'
                                : q.difficulty === 'Medium'
                                ? 'text-[#ffc01e] bg-[#ffc01e]/10'
                                : 'text-[#ff375f] bg-[#ff375f]/10'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Prev / Next Problem Stepper */}
          <div className="flex items-center bg-[#282828] border border-[#333333] rounded-md overflow-hidden">
            <button
              id="btn-prev-problem"
              onClick={() => onSelectQuestion(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              title="Previous Problem"
              className="p-1.5 text-[#a0a0a0] hover:text-white hover:bg-[#333333] disabled:opacity-30 disabled:hover:bg-transparent transition-colors active:scale-[0.98] cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-mono text-[#d0d0d0] border-x border-[#383838]">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
            <button
              id="btn-next-problem"
              onClick={() => onSelectQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
              title="Next Problem"
              className="p-1.5 text-[#a0a0a0] hover:text-white hover:bg-[#333333] disabled:opacity-30 disabled:hover:bg-transparent transition-colors active:scale-[0.98] cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Progress & Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Gamified Progress Bar */}
          <div 
            className="hidden lg:flex items-center gap-2.5 bg-[#161616] border border-[#262626] px-3 py-1.5 rounded-lg shadow-sm" 
            title={`${passedTestCases} of ${totalTestCases} Test Cases Passed`}
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className={`w-3.5 h-3.5 ${progressPercentage === 100 && totalTestCases > 0 ? 'text-[#2cbb5d]' : 'text-[#8a8a8a]'}`} />
              <div className="text-[10px] font-mono text-[#a0a0a0]">
                <span className={passedTestCases > 0 ? "text-[#2cbb5d] font-semibold" : "font-semibold"}>{passedTestCases}</span>
                <span className="text-[#555]"> / </span>
                <span>{totalTestCases} Tests</span>
              </div>
            </div>
            <div className="w-20 h-1.5 bg-[#222222] border border-[#333333] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2cbb5d] to-[#27a853] transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }} 
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Run Code Button */}
          <button
            id="btn-header-run-tests"
            onClick={onRunTests}
            disabled={isRunningTests}
            title="Run Code (Ctrl + Enter / ⌘ + Enter)"
            className="flex items-center gap-1.5 bg-[#2f2f2f] hover:bg-[#3d3d3d] disabled:opacity-50 text-[#eff1f6] border border-[#444444] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <Play
              className={`w-3.5 h-3.5 text-[#2cbb5d] fill-[#2cbb5d] ${
                isRunningTests ? 'animate-spin fill-transparent' : ''
              }`}
            />
            <span>{isRunningTests ? 'Running...' : 'Run'}</span>
            <span className="hidden lg:inline text-[10px] text-[#8a8a8a] bg-[#222222] px-1 py-0.2 rounded border border-[#3a3a3a]">
              ⌘↵
            </span>
          </button>

          {/* Submit Solution Button */}
          <button
            id="btn-header-submit-discuss"
            onClick={onSubmitQuestion}
            disabled={isRunningTests}
            title="Submit Solution to Interviewer"
            className="flex items-center gap-1.5 bg-[#2cbb5d] hover:bg-[#27a853] disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] shadow-sm shadow-[#2cbb5d]/20 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
        </div>

        {/* Right: Timer, Candidate Profile Dropdown, End & Evaluate */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Timer */}
          <div
            title="Interview Session Time"
            className="flex items-center gap-1.5 bg-[#282828] border border-[#333333] text-[#d4d4d4] px-2.5 py-1 rounded-md text-xs font-mono"
          >
            <Clock className="w-3.5 h-3.5 text-[#ffa116]" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* Candidate Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 bg-[#282828] hover:bg-[#323232] border border-[#333333] px-2 py-1 rounded-md text-xs text-white transition-colors active:scale-[0.98] cursor-pointer"
            >
              <div
                className="w-5 h-5 rounded-full bg-[#383838] text-[#ffa116] border border-[#484848] font-bold text-[10px] flex items-center justify-center shrink-0"
              >
                {candidateName.charAt(0)}
              </div>
              <span className="font-medium max-w-[90px] truncate hidden sm:inline">{candidateName}</span>
              <ChevronDown className="w-3 h-3 text-[#8c8c8c]" />
            </button>

            {isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-[#262626] border border-[#3a3a3a] rounded-lg shadow-2xl py-1.5 z-50 overflow-hidden text-xs">
                  <div className="px-3 py-2 border-b border-[#333333] space-y-0.5">
                    <div className="font-bold text-white truncate">{candidateName}</div>
                    <div className="text-[10px] text-[#8c8c8c] truncate">
                      {candidateProfile?.targetRole || 'Software Candidate'}
                    </div>
                    {candidateProfile?.targetCompany && (
                      <div className="text-[10px] text-[#2cbb5d] font-semibold">
                        Targeting: {candidateProfile.targetCompany}
                      </div>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onChangeTrack();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#d0d0d0] hover:bg-[#333333] hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#ffa116]" />
                      <span>Change Interview Track</span>
                    </button>

                    {isCompleted && (
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onViewReport();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-[#d0d0d0] hover:bg-[#333333] hover:text-white flex items-center gap-2 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5 text-[#2cbb5d]" />
                        <span>View Evaluation Report</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleCopyLink();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#d0d0d0] hover:bg-[#333333] hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#888]" />
                      <span>{copied ? 'Link Copied!' : 'Copy Session Link'}</span>
                    </button>

                    <div className="h-px bg-[#333333] my-1" />

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-[#333333] flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out / Switch Candidate</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* End & Evaluate or View Report */}
          {isCompleted ? (
            <button
              id="btn-header-view-report"
              onClick={onViewReport}
              className="flex items-center gap-1.5 bg-[#2cbb5d] hover:bg-[#27a853] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] shadow-sm cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
          ) : (
            <button
              id="btn-header-end-interview"
              onClick={onEndInterview}
              className="flex items-center gap-1.5 text-[#d0d0d0] hover:text-white bg-[#282828] hover:bg-[#383838] border border-[#333333] hover:border-[#ffa116]/40 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffa116]" />
              <span className="hidden sm:inline">End &amp; Evaluate</span>
              <span className="sm:hidden">End</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
