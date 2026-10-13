import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  Code2,
  Cpu,
  Database,
  GraduationCap,
  Layers,
  Layout,
  LogOut,
  Network,
  Play,
  Server,
  ShieldCheck,
  Sliders,
  Sparkles,
  Terminal,
  Trophy,
  User,
  Zap,
} from 'lucide-react';
import { QUESTIONS_BANK } from '../data/questions';
import { INTERVIEW_TRACKS } from '../data/tracks';
import {
  CandidateProfile,
  InterviewTrack,
  InterviewTrackId,
  Question,
  SupportedLanguage,
} from '../types/interview';
import { ThemeToggle } from './ThemeToggle';

interface InterviewTypeSelectorProps {
  candidateProfile: CandidateProfile;
  onSelectTrack: (trackId: InterviewTrackId, customQuestionIds?: string[]) => void;
  onLogout: () => void;
  onViewReport?: () => void;
  hasActiveReport?: boolean;
}

const MOCK_LEADERBOARD = [
  { name: 'Alex H.', track: 'Classic DSA', runs: 1, time: '22m', lang: 'Python' },
  { name: 'Sarah K.', track: 'Full Stack', runs: 2, time: '31m', lang: 'TypeScript' },
  { name: 'Michael C.', track: 'Backend', runs: 2, time: '38m', lang: 'Go' },
  { name: 'Emily R.', track: 'Classic DSA', runs: 3, time: '41m', lang: 'C++' },
  { name: 'David W.', track: 'System Design', runs: 4, time: '45m', lang: 'Java' }
];

export const InterviewTypeSelector: React.FC<InterviewTypeSelectorProps> = ({
  candidateProfile,
  onSelectTrack,
  onLogout,
  onViewReport,
  hasActiveReport,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<InterviewTrackId>('dsa');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [expandedTrackId, setExpandedTrackId] = useState<InterviewTrackId | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Custom track configuration state
  const [customSelectedIds, setCustomSelectedIds] = useState<string[]>([]);
  const [customDuration, setCustomDuration] = useState<number>(45);

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-5 h-5 text-[#ffa116]" />;
      case 'Network':
        return <Network className="w-5 h-5 text-cyan-400" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-pink-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-amber-400" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-sky-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Layout':
        return <Layout className="w-5 h-5 text-teal-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-purple-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-rose-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-blue-400" />;
      case 'Sliders':
      default:
        return <Sliders className="w-5 h-5 text-amber-400" />;
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'text-[#00b8a3] bg-[#00b8a3]/10 border-[#00b8a3]/30';
      case 'Medium':
        return 'text-[#ffc01e] bg-[#ffc01e]/10 border-[#ffc01e]/30';
      case 'Hard':
        return 'text-[#ff375f] bg-[#ff375f]/10 border-[#ff375f]/30';
      default:
        return 'text-[#a0a0a0] bg-[#2a2a2a] border-[#333333]';
    }
  };

  const handleStartInterview = (track: InterviewTrack) => {
    if (track.id === 'custom') {
      onSelectTrack('custom', customSelectedIds);
    } else {
      onSelectTrack(track.id);
    }
  };

  const toggleCustomQuestion = (qId: string) => {
    if (customSelectedIds.includes(qId)) {
      setCustomSelectedIds(customSelectedIds.filter((id) => id !== qId));
    } else {
      if (customSelectedIds.length < 5) {
        setCustomSelectedIds([...customSelectedIds, qId]);
      }
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0A0A0A] text-[#eff1f6] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-[#262626] bg-[#121212]/95 backdrop-blur px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <button 
          onClick={onLogout}
          title="Return to Login"
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#282828] border border-[#333333] flex items-center justify-center text-[#ffa116] font-black text-sm shadow-sm group-hover:border-[#ffa116] transition-colors">
            <ChevronLeft className="w-4 h-4" strokeWidth={3} />
          </div>
          <div className="text-left">
            <span className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              AI Interviewer <span className="text-[#ffa116] font-semibold text-xs bg-[#ffa116]/10 px-1.5 py-0.5 rounded border border-[#ffa116]/20">Assessment Suite</span>
            </span>
          </div>
        </button>

        {/* Candidate Profile Pill & Logout */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {hasActiveReport && onViewReport && (
            <button
              onClick={onViewReport}
              className="text-xs bg-[#ffa116]/10 hover:bg-[#ffa116]/20 text-[#ffa116] border border-[#ffa116]/30 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors active:scale-[0.98] cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>View Latest Report</span>
            </button>
          )}

          <div className="flex items-center gap-2.5 bg-[#202020] border border-[#303030] py-1 px-2.5 rounded-xl">
            <div
              className="w-7 h-7 rounded-full bg-[#2e2e2e] text-[#ffa116] border border-[#333333] font-bold text-xs flex items-center justify-center"
            >
              {candidateProfile.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">
                {candidateProfile.name}
              </div>
              <div className="text-[10px] text-[#8a8a8a] flex items-center gap-1">
                <span>{candidateProfile.targetCompany}</span>
                <span>•</span>
                <span className="text-[#2cbb5d]">{candidateProfile.experienceLevel.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out / Switch Candidate"
            className="p-2 rounded-lg bg-[#202020] hover:bg-[#2c2c2c] border border-[#303030] text-[#8c8c8c] hover:text-white transition-colors active:scale-[0.98] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-8">
          {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1c1c1c] via-[#222222] to-[#1c1c1c] border border-[#2e2e2e] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ffa116]/10 border border-[#ffa116]/30 text-[#ffa116] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Role: {candidateProfile.targetRole}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Select Your Interview Assessment Track
            </h1>
            <p className="text-xs sm:text-sm text-[#9e9e9e] leading-relaxed">
              Choose the technical track you want to be evaluated on. Each track configures targeted problem sets, language environments, and an adaptive AI interviewer persona.
            </p>
          </div>

          {/* Background Decorative Accent */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#ffa116]/5 to-transparent pointer-events-none" />
        </div>

        {/* Tracks Grid & Domain Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Technical Interview Domains</span>
              <span className="text-xs text-[#ffa116] bg-[#ffa116]/10 border border-[#ffa116]/20 px-2 py-0.5 rounded-full font-medium">
                {INTERVIEW_TRACKS.length} Specialized Tracks
              </span>
            </h2>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Tracks' },
                { id: 'algorithms', label: 'Algorithms & DSA' },
                { id: 'system_design', label: 'System Design & Dist.' },
                { id: 'ai_ml', label: 'AI & Machine Learning' },
                { id: 'data_sql', label: 'Database & SQL' },
                { id: 'cloud_infra', label: 'DevOps & SRE' },
                { id: 'security', label: 'Cybersecurity' },
                { id: 'frontend', label: 'Frontend & UI' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  id={`btn-filter-${filter.id}`}
                  onClick={() => setCategoryFilter(filter.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-all active:scale-[0.98] font-medium cursor-pointer border ${
                    categoryFilter === filter.id
                      ? 'bg-[#ffa116] text-black font-semibold shadow-md shadow-[#ffa116]/20 border-[#ffa116] ring-1 ring-[#ffa116]/30'
                      : 'bg-[#222222] text-[#8c8c8c] hover:text-white hover:bg-[#2c2c2c] border-[#333333] hover:border-[#ffa116]/60'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTERVIEW_TRACKS.filter((track) => {
              if (categoryFilter === 'all') return true;
              if (categoryFilter === 'algorithms') return track.id === 'dsa' || track.id === 'faang_mock';
              if (categoryFilter === 'system_design') return track.id === 'system_design' || track.id === 'backend';
              if (categoryFilter === 'ai_ml') return track.id === 'ml_ai';
              if (categoryFilter === 'data_sql') return track.id === 'data_sql';
              if (categoryFilter === 'cloud_infra') return track.id === 'devops_cloud';
              if (categoryFilter === 'security') return track.id === 'cybersecurity';
              if (categoryFilter === 'frontend') return track.id === 'frontend' || track.id === 'fullstack';
              return true;
            }).map((track) => {
              const isSelected = selectedTrackId === track.id;
              const isExpanded = expandedTrackId === track.id;
              const trackQuestions = QUESTIONS_BANK.filter((q) => track.questionIds.includes(q.id));

              return (
                <div
                  key={track.id}
                  id={`card-track-${track.id}`}
                  onClick={() => setSelectedTrackId(track.id)}
                  className={`bg-[#1c1c1c] rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden relative group ${
                    isSelected
                      ? 'border-[#ffa116] ring-2 ring-[#ffa116]/50 shadow-xl shadow-[#ffa116]/10 bg-gradient-to-b from-[#222222] to-[#1c1c1c]'
                      : 'border-[#2c2c2c] hover:border-[#ffa116]/60 hover:-translate-y-0.5 hover:shadow-2xl'
                  }`}
                >
                  {/* Card Content Top */}
                  <div className="p-5 space-y-4">
                    {/* Header with Icon, Badge & Difficulty */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-[#242424] border-[#ffa116]/50 text-[#ffa116]'
                            : 'bg-[#242424] border-[#363636] text-white'
                        }`}>
                          {getTrackIcon(track.iconName)}
                        </div>
                        <div>
                          <h3 className={`text-sm font-bold leading-tight transition-colors ${
                            isSelected ? 'text-[#ffa116]' : 'text-white group-hover:text-[#f3f3f3]'
                          }`}>
                            {track.title}
                          </h3>
                          <p className="text-[11px] text-[#8a8a8a]">{track.subtitle}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#ffa116]/15 border border-[#ffa116]/40 text-[#ffa116] shrink-0">
                          Selected
                        </span>
                      )}
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-md border font-semibold ${getDifficultyBadge(track.difficulty)}`}>
                        {track.difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#242424] border border-[#333] text-[#aaa] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#ffa116]" />
                        <span>{track.durationMinutes} mins</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#242424] border border-[#333] text-[#aaa] flex items-center gap-1">
                        <Code2 className="w-3 h-3 text-emerald-400" />
                        <span>{track.questionCount} Questions</span>
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#8c8c8c] leading-relaxed line-clamp-3">
                      {track.description}
                    </p>

                    {/* Topic Tags */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] uppercase tracking-wider text-[#666] font-semibold">Core Focus Areas</div>
                      <div className="flex flex-wrap gap-1.5">
                        {track.topics.map((tp) => {
                          const isTopicActive = selectedTopic === tp;
                          return (
                            <button
                              key={tp}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTopic(selectedTopic === tp ? null : tp);
                                setSelectedTrackId(track.id);
                              }}
                              className={`text-[10px] px-2 py-0.5 rounded-md border transition-all active:scale-95 cursor-pointer font-medium ${
                                isTopicActive
                                  ? 'bg-[#ffa116]/20 border-[#ffa116] text-[#ffa116] ring-1 ring-[#ffa116]/30 shadow-sm shadow-[#ffa116]/20'
                                  : 'bg-[#222222] text-[#999999] border-[#2f2f2f] hover:border-[#ffa116]/60 hover:text-white'
                              }`}
                            >
                              {tp}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interviewer Persona Box */}
                    <div className="bg-[#171717] border border-[#292929] rounded-xl p-3 flex items-start gap-2.5">
                      <div className="text-xl shrink-0">{track.interviewer.avatar}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white flex items-center justify-between">
                          <span className="truncate">{track.interviewer.name}</span>
                          <span className="text-[10px] text-[#ffa116] font-normal">{track.interviewer.company}</span>
                        </div>
                        <div className="text-[10px] text-[#8c8c8c] truncate">{track.interviewer.role}</div>
                        <div className="text-[10px] text-[#707070] italic mt-0.5 line-clamp-1">
                          "{track.interviewer.style}"
                        </div>
                      </div>
                    </div>

                    {/* Expandable Syllabus Preview */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-[#292929] space-y-2">
                        <div className="text-[11px] font-semibold text-[#ffa116] flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Question Syllabus:</span>
                        </div>
                        <div className="space-y-1.5">
                          {trackQuestions.map((q, idx) => (
                            <div
                              key={q.id}
                              className="text-xs bg-[#191919] p-2 rounded-lg border border-[#2c2c2c] flex items-center justify-between"
                            >
                              <span className="text-[#d0d0d0] font-mono text-[11px] truncate">
                                {idx + 1}. {q.title}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                                  q.difficulty === 'Easy'
                                    ? 'text-[#00b8a3]'
                                    : q.difficulty === 'Medium'
                                    ? 'text-[#ffc01e]'
                                    : 'text-[#ff375f]'
                                }`}
                              >
                                {q.difficulty}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom CTA Actions */}
                  <div className="p-4 bg-[#181818] border-t border-[#292929] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedTrackId(isExpanded ? null : track.id);
                      }}
                      className="text-xs text-[#8c8c8c] hover:text-white transition-colors active:scale-[0.98] cursor-pointer py-1 px-2"
                    >
                      {isExpanded ? 'Hide Syllabus' : 'View Syllabus'}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartInterview(track);
                      }}
                      className="py-2 px-4 rounded-xl bg-[#ffa116] hover:bg-[#e08f12] text-black font-bold text-xs transition-all active:scale-[0.98] shadow-md shadow-[#ffa116]/10 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Start Round</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CUSTOM ROUND SELECTION MODAL / EXPANDABLE DRAWER */}
        <div className="bg-[#121212] border border-[#2e2e2e] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#ffa116]/10 border border-[#ffa116]/30 flex items-center justify-center text-[#ffa116]">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Custom Question Set Configurator</h3>
                <p className="text-xs text-[#8c8c8c]">Assemble your own custom interview by picking 1 to 5 questions from the full bank</p>
              </div>
            </div>
            <span className="text-xs text-[#ffa116] font-mono">
              Selected: {customSelectedIds.length} / 5 {customSelectedIds.length === 0 ? '(Click to mark questions)' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
            {QUESTIONS_BANK.map((q) => {
              const isChecked = customSelectedIds.includes(q.id);
              return (
                <button
                  key={q.id}
                  id={`btn-custom-question-${q.id}`}
                  type="button"
                  onClick={() => toggleCustomQuestion(q.id)}
                  className={`text-left p-3 rounded-xl border transition-all active:scale-[0.98] cursor-pointer flex items-start justify-between gap-2 ${
                    isChecked
                      ? 'bg-[#252525] border-[#ffa116] ring-1 ring-[#ffa116]/40 text-white shadow-sm shadow-[#ffa116]/10'
                      : 'bg-[#181818] border-[#292929] text-[#888888] hover:border-[#ffa116]/60 hover:text-white'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate text-white">{q.title}</div>
                    <div className="text-[10px] text-[#777]">{q.category}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        q.difficulty === 'Easy'
                          ? 'text-[#00b8a3]'
                          : q.difficulty === 'Medium'
                          ? 'text-[#ffc01e]'
                          : 'text-[#ff375f]'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-[#ffa116] border-[#ffa116] text-black font-bold' : 'border-[#444] bg-[#121212]'
                      }`}
                    >
                      {isChecked ? '✓' : ''}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#292929]">
            <div className="text-xs text-[#8c8c8c]">
              Target Duration: <span className="text-white font-mono">{customSelectedIds.length > 0 ? `${customSelectedIds.length * 15} mins` : '0 mins'}</span> (Est. 15 min / problem)
            </div>

            <button
              onClick={() => onSelectTrack('custom', customSelectedIds)}
              disabled={customSelectedIds.length === 0}
              className="py-2 px-5 rounded-xl bg-[#2cbb5d] hover:bg-[#27a853] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-all active:scale-[0.98] shadow-md shadow-[#2cbb5d]/20 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {customSelectedIds.length === 0
                  ? 'Select at least 1 question'
                  : `Start Custom Round (${customSelectedIds.length} Questions)`}
              </span>
            </button>
          </div>
        </div>
        </div>

        {/* Right Sidebar: Leaderboard */}
        <div className="hidden xl:flex flex-col space-y-4">
          <div className="bg-[#121212] border border-[#2e2e2e] rounded-2xl p-5 shadow-xl flex-1 max-h-[800px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-[#2e2e2e] pb-3">
              <div className="w-8 h-8 rounded-lg bg-[#2cbb5d]/10 border border-[#2cbb5d]/30 flex items-center justify-center text-[#2cbb5d]">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Top Performers</h3>
                <p className="text-[10px] text-[#8c8c8c]">Fewest test runs to pass</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2.5 no-scrollbar pr-1">
              {MOCK_LEADERBOARD.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-[#262626] hover:border-[#383838] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? 'bg-[#ffa116] text-black shadow-[0_0_8px_rgba(255,161,22,0.4)]' :
                      idx === 1 ? 'bg-[#c0c0c0] text-black' :
                      idx === 2 ? 'bg-[#cd7f32] text-black' :
                      'bg-[#282828] text-[#888]'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#ffa116] transition-colors">{user.name}</div>
                      <div className="text-[10px] text-[#666]">{user.track} • {user.lang}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-semibold text-[#2cbb5d]">{user.runs} run{user.runs > 1 ? 's' : ''}</div>
                    <div className="text-[10px] text-[#888]">{user.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222222] py-4 text-center text-xs text-[#666666]">
        AI Interviewer Technical Assessment Suite • 6 Language Engine • Real-time AI Evaluation
      </footer>
    </div>
  );
};
