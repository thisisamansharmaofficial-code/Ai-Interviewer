import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  CheckCircle2,
  ChevronRight,
  CornerDownLeft,
  Lightbulb,
  MessageSquare,
  Send,
  Sparkles,
  User,
  XCircle,
} from 'lucide-react';
import { ChatMessage } from '../types/interview';

interface ChatPanelProps {
  messages: ChatMessage[];
  isAiResponding: boolean;
  onSendMessage: (text: string) => void;
  onRequestHint: () => void;
  onExplainComplexity: (explanation: string) => void;
  onNextQuestion: () => void;
  candidateName: string;
  hasSubmissionsPassed: boolean;
  interviewer?: {
    name: string;
    role: string;
    company: string;
    style: string;
    avatar: string;
  };
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isAiResponding,
  onSendMessage,
  onRequestHint,
  onExplainComplexity,
  onNextQuestion,
  candidateName,
  hasSubmissionsPassed,
  interviewer,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const interviewerName = interviewer?.name || 'Alex';
  const interviewerRole = interviewer?.role || 'Interviewer';
  const interviewerCompany = interviewer?.company || 'Google';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiResponding]);

  const handleSend = () => {
    if (!inputText.trim() || isAiResponding) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      id="panel-interviewer-chat"
      className="h-full flex flex-col bg-[#121212] text-[#eff1f6]"
    >
      {/* Assistant Header */}
      <div className="p-3 border-b border-[#262626] bg-[#222222] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-[#2f2f2f] border border-[#333333] flex items-center justify-center text-base shadow-sm">
              {interviewer?.avatar ? <span>{interviewer.avatar}</span> : <Bot className="w-4 h-4 text-[#ffa116]" />}
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#2cbb5d] border border-[#1a1a1a]" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{interviewerName}</span>
              <span className="text-[10px] font-normal text-[#ffa116] bg-[#ffa116]/10 border border-[#ffa116]/20 px-1.5 py-0.2 rounded">
                {interviewerCompany}
              </span>
            </div>
            <div className="text-[10px] text-[#8c8c8c] truncate max-w-[170px]">{interviewerRole}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#8c8c8c] bg-[#282828] px-2 py-0.5 rounded border border-[#383838]">
          <MessageSquare className="w-3 h-3 text-[#ffa116]" />
          <span>{messages.length}</span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-[#737373] text-xs space-y-2">
            <Bot className="w-8 h-8 mx-auto text-[#555555] animate-pulse" />
            <p>{interviewerName} is reviewing your problem context...</p>
          </div>
        )}

        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="bg-[#242424] border border-[#333333] rounded-full px-3 py-1 text-[11px] text-[#8c8c8c] flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#ffa116]" />
                  <span>{msg.content}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[92%] ${
                isAi ? 'self-start' : 'self-end ml-auto flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-semibold ${
                  isAi
                    ? 'bg-[#282828] border border-[#333333] text-[#ffa116]'
                    : 'bg-[#383838] text-[#eff1f6]'
                }`}
              >
                {isAi ? (
                  interviewer?.avatar ? (
                    <span className="text-xs">{interviewer.avatar}</span>
                  ) : (
                    <Bot className="w-4 h-4" />
                  )
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[10px] font-medium text-[#8c8c8c]">
                    {isAi ? `${interviewerName} (${interviewerCompany})` : candidateName || 'You'}
                  </span>
                  <span className="text-[9px] text-[#666666]">
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-xl text-xs leading-relaxed break-words shadow-sm ${
                    isAi
                      ? 'bg-[#262626] border border-[#333333] text-[#eff1f6] rounded-tl-none'
                      : 'bg-[#2f2f2f] border border-[#444444] text-white rounded-tr-none'
                  }`}
                >
                  {/* Submission summary badge if applicable */}
                  {msg.isSubmissionEvent && msg.submissionSummary && (
                    <div
                      className={`mb-2 p-2 rounded-lg border text-[11px] flex items-center gap-2 ${
                        msg.submissionSummary.passed
                          ? 'bg-[#2cbb5d]/10 border-[#2cbb5d]/30 text-[#2cbb5d]'
                          : 'bg-[#ff375f]/10 border-[#ff375f]/30 text-[#ff8080]'
                      }`}
                    >
                      {msg.submissionSummary.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#2cbb5d] shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#ff375f] shrink-0" />
                      )}
                      <span className="font-semibold">
                        Test Results: {msg.submissionSummary.passCount} /{' '}
                        {msg.submissionSummary.totalCount} passed
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Formulating Feedback Indicator */}
        {isAiResponding && (
          <div className="flex gap-2.5 max-w-[85%] self-start">
            <div className="w-7 h-7 rounded-lg bg-[#282828] border border-[#333333] text-[#ffa116] shrink-0 flex items-center justify-center">
              {interviewer?.avatar ? <span className="text-xs">{interviewer.avatar}</span> : <Bot className="w-4 h-4" />}
            </div>
            <div className="bg-[#262626] border border-[#333333] text-[#d0d0d0] p-3 rounded-xl rounded-tl-none text-xs flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffa116] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffa116] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffa116] animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] text-[#8c8c8c]">{interviewerName} is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      <div className="px-3 pt-2 pb-1 border-t border-[#262626] bg-[#222222] overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
        <button
          id="btn-chip-hint"
          onClick={onRequestHint}
          disabled={isAiResponding}
          className="flex items-center gap-1 text-[11px] font-medium bg-[#282828] hover:bg-[#333333] text-[#ffa116] border border-[#333333] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          <Lightbulb className="w-3 h-3 text-[#ffa116]" />
          <span>Need a hint?</span>
        </button>

        <button
          id="btn-chip-complexity"
          onClick={() =>
            onExplainComplexity(
              'My solution operates in optimal time and space complexity with respect to the input constraints.'
            )
          }
          disabled={isAiResponding}
          className="flex items-center gap-1 text-[11px] font-medium bg-[#282828] hover:bg-[#333333] text-[#d0d0d0] border border-[#333333] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          <span>⏱️ Discuss Complexity</span>
        </button>

        {hasSubmissionsPassed && (
          <button
            id="btn-chip-next-question"
            onClick={onNextQuestion}
            disabled={isAiResponding}
            className="flex items-center gap-1 text-[11px] font-semibold bg-[#2cbb5d]/20 hover:bg-[#2cbb5d]/30 text-[#2cbb5d] border border-[#2cbb5d]/30 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <span>Next Problem</span>
            <ChevronRight className="w-3 h-3 text-[#2cbb5d]" />
          </button>
        )}
      </div>

      {/* Chat Input Box */}
      <div className="p-3 border-t border-[#262626] bg-[#121212] shrink-0">
        <div className="relative flex items-end bg-[#262626] border border-[#3a3a3a] rounded-xl focus-within:border-[#ffa116] transition-colors active:scale-[0.98] p-2.5">
          <textarea
            id="input-chat-message"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Explain your approach or ask clarifying questions... (Enter to send)"
            rows={2}
            disabled={isAiResponding}
            className="w-full bg-transparent text-xs text-white placeholder-[#737373] resize-none outline-none pr-10 min-h-[44px] max-h-32 font-sans"
          />

          <button
            id="btn-send-chat"
            onClick={handleSend}
            disabled={!inputText.trim() || isAiResponding}
            title="Send Message (Enter)"
            className="absolute right-2.5 bottom-2.5 p-1.5 rounded-lg bg-[#ffa116] hover:bg-[#f89e1b] disabled:opacity-20 text-black font-bold transition-colors active:scale-[0.98] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-1.5 text-[10px] text-[#666666] px-1">
          <span>AI Interview Proctor ({interviewerName})</span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-2.5 h-2.5" /> Enter to send
          </span>
        </div>
      </div>
    </div>
  );
};
