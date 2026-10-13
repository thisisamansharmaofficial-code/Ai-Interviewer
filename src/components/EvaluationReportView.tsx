import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Code2,
  Copy,
  ExternalLink,
  HelpCircle,
  Layers,
  MessageSquare,
  Printer,
  RefreshCw,
  Sliders,
  Sparkles,
  Timer,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import { EvaluationReport, InterviewSession, Question } from '../types/interview';
import { ThemeToggle } from './ThemeToggle';

interface EvaluationReportViewProps {
  report: EvaluationReport;
  session: InterviewSession;
  questions: Question[];
  onStartNewSession: () => void;
  onReturnToInterview: () => void;
  onChangeTrack: () => void;
}

export const EvaluationReportView: React.FC<EvaluationReportViewProps> = ({
  report,
  session,
  questions,
  onStartNewSession,
  onReturnToInterview,
  onChangeTrack,
}) => {
  const [copiedSummary, setCopiedSummary] = React.useState(false);

  useEffect(() => {
    // Fire celebratory confetti if score is >= 70
    if (report.overallScore >= 70) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  }, [report]);

  const getRecommendationBadge = (rec: EvaluationReport['recommendation']) => {
    switch (rec) {
      case 'Strong Hire':
        return 'bg-[#2cbb5d]/15 text-[#2cbb5d] border-[#2cbb5d]/40';
      case 'Hire':
        return 'bg-[#00b8a3]/15 text-[#00b8a3] border-[#00b8a3]/40';
      case 'Lean Hire':
        return 'bg-[#ffc01e]/15 text-[#ffc01e] border-[#ffc01e]/40';
      case 'Needs Improvement':
        return 'bg-[#ff375f]/15 text-[#ff375f] border-[#ff375f]/40';
      default:
        return 'bg-[#333333] text-[#d0d0d0] border-[#444444]';
    }
  };

  const handleCopySummary = () => {
    const text = `AI Interviewer Technical Assessment\nCandidate: ${session.candidateName}\nTrack: ${session.trackTitle || 'Technical Coding'}\nScore: ${report.overallScore}/100 (${report.recommendation})\nSummary: ${report.summary}\nKey Strengths:\n${report.strengths.map(s => `- ${s}`).join('\n')}\nImprovement Areas:\n${report.improvementAreas.map(a => `- ${a}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const sessionDurationMinutes = Math.max(
    1,
    Math.round(((session.completedAt || Date.now()) - session.startedAt) / 60000)
  );

  return (
    <div id="view-evaluation-report" className="min-h-screen bg-[#0A0A0A] text-[#eff1f6] pb-16">
      {/* Top action bar */}
      <div className="bg-[#1c1c1c] border-b border-[#262626] sticky top-0 z-20 px-4 py-2.5 print:hidden select-none">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            id="btn-report-back-to-ide"
            onClick={onReturnToInterview}
            className="flex items-center gap-1.5 text-xs text-[#a0a0a0] hover:text-white bg-[#282828] hover:bg-[#323232] px-3 py-1.5 rounded-md border border-[#333333] transition-colors active:scale-[0.98] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Editor &amp; Chat</span>
          </button>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              id="btn-report-change-track"
              onClick={onChangeTrack}
              className="flex items-center gap-1.5 text-xs text-[#d0d0d0] hover:text-white bg-[#282828] hover:bg-[#323232] px-3 py-1.5 rounded-md border border-[#333333] transition-colors active:scale-[0.98] cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#ffa116]" />
              <span>Choose Another Track</span>
            </button>

            <button
              id="btn-report-copy-summary"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 text-xs text-[#a0a0a0] hover:text-white bg-[#282828] hover:bg-[#323232] px-3 py-1.5 rounded-md border border-[#333333] transition-colors active:scale-[0.98] cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              id="btn-report-print"
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs text-[#a0a0a0] hover:text-white bg-[#282828] hover:bg-[#323232] px-3 py-1.5 rounded-md border border-[#333333] transition-colors active:scale-[0.98] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              id="btn-report-new-session"
              onClick={onStartNewSession}
              className="flex items-center gap-1.5 text-xs font-semibold text-black bg-[#ffa116] hover:bg-[#f89e1b] px-3.5 py-1.5 rounded-md shadow-sm transition-colors active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry This Round</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        {/* Header Hero Card */}
        <div className="bg-[#1A1A1A] border border-[#2e2e2e] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#282828] border border-[#3a3a3a] flex items-center justify-center text-[#ffa116] font-bold text-xs">
                  <ChevronLeft className="w-4 h-4" strokeWidth={3} />
                </div>
                <span className="text-xs font-semibold text-[#ffa116] uppercase tracking-wider">
                  AI Interviewer Assessment Report
                </span>
                {session.trackTitle && (
                  <span className="text-xs bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/30 px-2 py-0.5 rounded-md font-mono">
                    {session.trackTitle}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {session.candidateName}&apos;s Evaluation
              </h1>

              {session.candidateProfile && (
                <div className="flex items-center gap-2 text-xs text-[#a0a0a0]">
                  <span className="text-[#2cbb5d] font-semibold">{session.candidateProfile.targetRole}</span>
                  <span>•</span>
                  <span>Targeting {session.candidateProfile.targetCompany}</span>
                  <span>•</span>
                  <span className="text-[#ffa116]">{session.candidateProfile.experienceLevel}</span>
                </div>
              )}

              <p className="text-sm text-[#c8c8c8] max-w-2xl leading-relaxed">
                {report.summary}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#8c8c8c] pt-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#ffa116]" />
                  <span>Duration: {sessionDurationMinutes} min</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-[#2cbb5d]" />
                  <span>{questions.length} Technical Problems</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#00b8a3]" />
                  <span>{session.chatHistory.length} Interview Dialogues</span>
                </div>
              </div>
            </div>

            {/* Overall Score Badge */}
            <div className="flex flex-col items-center justify-center p-6 bg-[#161616] border border-[#303030] rounded-2xl min-w-[200px] text-center shrink-0 shadow-lg">
              <div className="text-[11px] font-medium uppercase tracking-wider text-[#888888] mb-1">
                Interview Score
              </div>
              <div className="text-5xl font-black tracking-tight text-white mb-2 font-mono">
                {report.overallScore}
                <span className="text-xl font-normal text-[#666666]">/100</span>
              </div>
              <div
                className={`text-xs font-bold px-3 py-1 rounded-full border ${getRecommendationBadge(
                  report.recommendation
                )}`}
              >
                {report.recommendation}
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Improvement Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Strengths */}
          <div className="bg-[#1A1A1A] border border-[#2e2e2e] rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-bold text-[#2cbb5d] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2cbb5d]" />
              <span>Key Strengths Demonstrated</span>
            </h2>
            <div className="space-y-2.5">
              {report.strengths.map((strength, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 bg-[#161616] border border-[#2e2e2e] rounded-xl p-3 text-xs leading-relaxed text-[#d0d0d0]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#2cbb5d] shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Improvement Areas */}
          <div className="bg-[#1A1A1A] border border-[#2e2e2e] rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-bold text-[#ffa116] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#ffa116]" />
              <span>High-Impact Growth Areas</span>
            </h2>
            <div className="space-y-2.5">
              {report.improvementAreas.map((area, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 bg-[#161616] border border-[#2e2e2e] rounded-xl p-3 text-xs leading-relaxed text-[#d0d0d0]"
                >
                  <HelpCircle className="w-4 h-4 text-[#ffa116] shrink-0 mt-0.5" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Per-Question Detailed Breakdown */}
        <div className="bg-[#1A1A1A] border border-[#2e2e2e] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#ffa116]" />
            <span>Problem-by-Problem Technical Breakdown</span>
          </h2>

          <div className="space-y-4">
            {report.questionEvaluations.map((qEval) => {
              const matchedQ = questions.find((q) => q.id === qEval.questionId);
              const sub = session.submissions[qEval.questionId];

              return (
                <div
                  key={qEval.questionId}
                  className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#282828] pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{qEval.questionTitle}</span>
                        {matchedQ && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              matchedQ.difficulty === 'Easy'
                                ? 'text-[#00b8a3] bg-[#00b8a3]/10'
                                : matchedQ.difficulty === 'Medium'
                                ? 'text-[#ffc01e] bg-[#ffc01e]/10'
                                : 'text-[#ff375f] bg-[#ff375f]/10'
                            }`}
                          >
                            {matchedQ.difficulty}
                          </span>
                        )}
                      </h3>
                      {matchedQ && (
                        <div className="text-[11px] text-[#737373] mt-0.5">
                          {matchedQ.category}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-[#8c8c8c]">Test Cases</div>
                        <div className="text-xs font-mono font-bold text-[#2cbb5d]">
                          {qEval.testCasesPassed}
                        </div>
                      </div>

                      <div className="h-6 w-px bg-[#333333]" />

                      <div className="text-right">
                        <div className="text-xs text-[#8c8c8c]">Problem Score</div>
                        <div className="text-base font-bold font-mono text-white">
                          {qEval.score}
                          <span className="text-xs font-normal text-[#666]">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-3 rounded-lg space-y-1">
                      <span className="text-[11px] text-[#8c8c8c] font-medium block">
                        Time Complexity:
                      </span>
                      <p className="text-[#d4d4d4]">{qEval.timeComplexityAnalysis}</p>
                    </div>

                    <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-3 rounded-lg space-y-1">
                      <span className="text-[11px] text-[#8c8c8c] font-medium block">
                        Space Complexity:
                      </span>
                      <p className="text-[#d4d4d4]">{qEval.spaceComplexityAnalysis}</p>
                    </div>
                  </div>

                  <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-3.5 rounded-lg text-xs space-y-1.5">
                    <div className="font-semibold text-white">Feedback:</div>
                    <p className="text-[#c8c8c8] leading-relaxed">{qEval.feedback}</p>
                    {qEval.suggestedOptimization && (
                      <div className="pt-1 text-[#ffa116] flex items-start gap-1.5">
                        <span className="font-semibold shrink-0">💡 Optimization tip:</span>
                        <span>{qEval.suggestedOptimization}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Communication & Technical Proficiency Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A1A] border border-[#2e2e2e] rounded-2xl p-5 space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#ffa116]" />
              <span>Communication &amp; Clarification</span>
            </h3>
            <p className="text-xs text-[#c8c8c8] leading-relaxed">
              {report.communicationFeedback}
            </p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2e2e2e] rounded-2xl p-5 space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#2cbb5d]" />
              <span>Technical &amp; Code Quality</span>
            </h3>
            <p className="text-xs text-[#c8c8c8] leading-relaxed">
              {report.technicalProficiencyFeedback}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
