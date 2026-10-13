import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  Share2,
  Sparkles,
  Tag,
  ThumbsUp,
  Timer,
} from 'lucide-react';
import { Question } from '../types/interview';

interface ProblemStatementProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onRequestHint: () => void;
  onOpenChatTab?: () => void;
  isPassed?: boolean;
}

export const ProblemStatement: React.FC<ProblemStatementProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onRequestHint,
  onOpenChatTab,
  isPassed,
}) => {
  const [showTopics, setShowTopics] = useState(false);
  const [selectedTopicTag, setSelectedTopicTag] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [liked, setLiked] = useState(false);
  const [starred, setStarred] = useState(false);

  const getDifficultyBadge = (diff: Question['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return 'text-[#00b8a3] bg-[#00b8a3]/10 border-[#00b8a3]/20';
      case 'Medium':
        return 'text-[#ffc01e] bg-[#ffc01e]/10 border-[#ffc01e]/20';
      case 'Hard':
        return 'text-[#ff375f] bg-[#ff375f]/10 border-[#ff375f]/20';
      default:
        return 'text-[#a0a0a0] bg-[#333333] border-[#444444]';
    }
  };

  return (
    <div
      id="panel-problem-statement"
      className="h-full flex flex-col bg-[#121212] text-[#eff1f6] overflow-y-auto"
    >
      {/* Title & Metadata */}
      <div className="p-4 sm:p-5 border-b border-[#262626] bg-[#121212]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </span>

            {isPassed && (
              <span className="flex items-center gap-1 text-xs font-medium text-[#2cbb5d] bg-[#2cbb5d]/10 border border-[#2cbb5d]/20 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Solved
              </span>
            )}
          </div>

          {/* Action icon pills */}
          <div className="flex items-center gap-1.5 text-[#8a8a8a]">
            <button
              onClick={() => setLiked(!liked)}
              title="Like"
              className={`p-1.5 rounded-md hover:bg-[#282828] hover:text-white transition-colors active:scale-[0.98] cursor-pointer ${
                liked ? 'text-[#ffa116]' : ''
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setStarred(!starred)}
              title="Add to Favorites"
              className={`p-1.5 rounded-md hover:bg-[#282828] hover:text-white transition-colors active:scale-[0.98] cursor-pointer ${
                starred ? 'text-[#ffc01e] fill-[#ffc01e]' : ''
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 text-[11px] bg-[#262626] border border-[#383838] px-2 py-0.5 rounded text-[#a0a0a0]">
              <Timer className="w-3 h-3 text-[#ffa116]" />
              <span>~{question.timeEstimateMinutes}m</span>
            </div>
          </div>
        </div>

        <h1 className="text-xl font-bold text-white tracking-tight">
          {question.title}
        </h1>

        {/* Topics and Tags Collapsible */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            id="btn-toggle-topics"
            onClick={() => setShowTopics(!showTopics)}
            className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md transition-all active:scale-[0.98] cursor-pointer border ${
              showTopics
                ? 'text-[#ffa116] bg-[#ffa116]/10 border-[#ffa116] ring-1 ring-[#ffa116]/30 font-medium'
                : 'text-[#9c9c9c] hover:text-white bg-[#262626] hover:bg-[#303030] border-[#383838] hover:border-[#ffa116]/60'
            }`}
          >
            <Tag className="w-3 h-3 text-[#ffa116]" />
            <span>Topics</span>
            {showTopics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showTopics && (
            <div className="flex flex-wrap items-center gap-1.5 animate-fadeIn">
              {[question.category, 'Algorithms', 'Data Structures'].map((topicTag) => {
                const isSelected = selectedTopicTag === topicTag;
                return (
                  <button
                    key={topicTag}
                    id={`btn-topic-tag-${topicTag.toLowerCase().replace(/\s+/g, '-')}`}
                    type="button"
                    onClick={() => setSelectedTopicTag(isSelected ? null : topicTag)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-md border transition-all active:scale-95 cursor-pointer font-medium ${
                      isSelected
                        ? 'text-[#ffa116] bg-[#ffa116]/15 border-[#ffa116] ring-1 ring-[#ffa116]/40 shadow-sm shadow-[#ffa116]/20'
                        : 'text-[#e0e0e0] bg-[#2a2a2a] border-[#383838] hover:border-[#ffa116]/60 hover:text-white hover:bg-[#303030]'
                    }`}
                  >
                    {topicTag}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Problem Body Content */}
      <div className="p-4 sm:p-5 space-y-6 flex-1 text-sm leading-relaxed">
        {/* Description Text */}
        <div className="text-[#d8d8d8] space-y-3 font-normal">
          {question.description.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Examples Section */}
        <div className="space-y-4">
          {question.examples.map((example, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-xs font-semibold text-white tracking-wide">
                Example {idx + 1}:
              </div>
              <div className="bg-[#262626] border border-[#333333] rounded-lg p-3.5 text-xs font-mono space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                  <span className="text-[#8c8c8c] select-none min-w-[65px] font-sans">Input:</span>
                  <span className="text-[#e2e2e2] font-semibold">{example.input}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                  <span className="text-[#8c8c8c] select-none min-w-[65px] font-sans">Output:</span>
                  <span className="text-[#2cbb5d] font-semibold">{example.output}</span>
                </div>
                {example.explanation && (
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 pt-1.5 border-t border-[#333333] font-sans text-[#a8a8a8] text-xs">
                    <span className="text-[#8c8c8c] select-none min-w-[65px]">Explanation:</span>
                    <span>{example.explanation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-white tracking-wide flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#ffc01e]" />
            <span>Constraints:</span>
          </div>
          <ul className="bg-[#242424] border border-[#333333] rounded-lg p-3.5 space-y-2 text-xs text-[#cfcfcf]">
            {question.constraints.map((constraint, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffa116]" />
                <code className="text-[#eff1f6] bg-[#1e1e1e] px-1.5 py-0.5 rounded border border-[#383838] font-mono text-[11px]">
                  {constraint}
                </code>
              </li>
            ))}
          </ul>
        </div>

        {/* Hints / Interview Assistance Card */}
        <div className="bg-[#262626] border border-[#3a3a3a] rounded-lg p-4 flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/20 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Need a strategic hint?</div>
              <div className="text-[11px] text-[#9c9c9c] mt-0.5">
                Ask Alex the Interviewer for guided algorithmic nudges.
              </div>
            </div>
          </div>
          <button
            id="btn-request-hint-from-problem"
            onClick={onRequestHint}
            className="shrink-0 flex items-center gap-1 text-xs font-semibold bg-[#ffa116] hover:bg-[#f89e1b] text-black px-3 py-1.5 rounded-md transition-colors active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>Ask Alex</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
