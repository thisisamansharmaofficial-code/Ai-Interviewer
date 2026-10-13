import React, { useState } from 'react';
import {
  ArrowRight,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronLeft,
  Code2,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Terminal,
  User,
  Zap,
} from 'lucide-react';
import { CandidateProfile } from '../types/interview';
import { ThemeToggle } from './ThemeToggle';

interface LoginPageProps {
  onLogin: (profile: CandidateProfile) => void;
}

const TARGET_COMPANIES = [
  'Google',
  'Meta',
  'Amazon',
  'Microsoft',
  'Apple',
  'Stripe',
  'Netflix',
  'Uber',
  'Airbnb',
  'ByteDance',
  'OpenAI',
  'General Top Tech',
];

const TARGET_ROLES = [
  'Software Engineer (Algorithms & DSA)',
  'Frontend Engineer',
  'Backend & Systems Engineer',
  'Full Stack Engineer',
  'Distributed Systems Engineer',
  'Machine Learning / AI Engineer',
];

const EXPERIENCE_LEVELS: CandidateProfile['experienceLevel'][] = [
  'Entry / Intern',
  'Junior (L3)',
  'Mid-Level (L4)',
  'Senior (L5)',
  'Staff+ (L6+)',
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');

  // Sign in form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Registration form state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [targetRole, setTargetRole] = useState('Software Engineer (Algorithms & DSA)');
  const [experienceLevel, setExperienceLevel] = useState<CandidateProfile['experienceLevel']>('Mid-Level (L4)');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    setErrorMsg('');

    const generatedName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
    const formattedName = generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
    const newProfile: CandidateProfile = {
      id: `user-${Date.now()}`,
      name: formattedName || 'Candidate',
      email: email.trim(),
      targetCompany: 'Google',
      targetRole: 'Software Engineer',
      experienceLevel: 'Mid-Level (L4)',
      createdAt: Date.now(),
    };
    onLogin(newProfile);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    setErrorMsg('');

    const newProfile: CandidateProfile = {
      id: `user-${Date.now()}`,
      name: fullName.trim(),
      email: regEmail.trim(),
      targetCompany,
      targetRole,
      experienceLevel,
      createdAt: Date.now(),
    };
    onLogin(newProfile);
  };

  const handleGuestLogin = () => {
    const guestProfile: CandidateProfile = {
      id: `guest-${Date.now()}`,
      name: 'Guest Candidate',
      email: 'guest@ai-interviewer.app',
      targetCompany: 'Top Tech Candidate',
      targetRole: 'Software Engineer',
      experienceLevel: 'Mid-Level (L4)',
      createdAt: Date.now(),
    };
    onLogin(guestProfile);
  };

  return (
    <div className="min-h-screen w-screen bg-[#0A0A0A] text-[#eff1f6] flex flex-col justify-between overflow-y-auto">
      {/* Top Simple Brand Bar */}
      <header className="border-b border-[#262626] bg-[#121212]/90 backdrop-blur px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#282828] border border-[#333333] flex items-center justify-center text-[#ffa116] font-black text-base shadow-sm">
            <ChevronLeft className="w-5 h-5" strokeWidth={3} />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              AI Interviewer <span className="text-[#ffa116] font-semibold text-xs bg-[#ffa116]/10 px-1.5 py-0.5 rounded border border-[#ffa116]/20">Proctor</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={handleGuestLogin}
            className="text-xs text-[#a0a0a0] hover:text-white bg-[#222222] hover:bg-[#2e2e2e] border border-[#383838] px-3 py-1.5 rounded-lg transition-colors active:scale-[0.98] cursor-pointer"
          >
            Quick Guest Mode →
          </button>
        </div>
      </header>

      {/* Main Form Center Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Platform Highlight & Feature Badges */}
          <div className="lg:col-span-5 space-y-6 hidden lg:block pr-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ffa116]/10 border border-[#ffa116]/30 text-[#ffa116] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Technical Interview Platform</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
                Master Top Tech Technical Rounds
              </h1>
              <p className="text-xs text-[#8c8c8c] leading-relaxed">
                Experience realistic live coding interviews with our AI interviewer. Select your interview track, write code in a real Monaco editor, run test cases, and receive comprehensive hiring feedback.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 bg-[#1e1e1e] border border-[#2b2b2b] p-3 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#2cbb5d]/10 border border-[#2cbb5d]/30 flex items-center justify-center text-[#2cbb5d] shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Adaptive AI Interviewer</h4>
                  <p className="text-[11px] text-[#8c8c8c]">Provides Socratic hints, evaluates edge cases, and probes time &amp; space Big-O complexity.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#1e1e1e] border border-[#2b2b2b] p-3 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-[#ffa116]/10 border border-[#ffa116]/30 flex items-center justify-center text-[#ffa116] shrink-0 mt-0.5">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Full Coding IDE &amp; Console</h4>
                  <p className="text-[11px] text-[#8c8c8c]">Syntax highlighting, instant testcase execution, custom inputs, and runtime diagnostics.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#1e1e1e] border border-[#2b2b2b] p-3 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Hiring Committee Report</h4>
                  <p className="text-[11px] text-[#8c8c8c]">Get detailed ratings on problem-solving, code quality, speed, and communication score.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication & Candidate Form Card */}
          <div className="lg:col-span-7 bg-[#1A1A1A] border border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Card Header & Tabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Candidate Portal</h2>
                  <p className="text-xs text-[#8c8c8c]">Sign in or create a candidate profile to configure your interview</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#282828] border border-[#333333] flex items-center justify-center text-[#ffa116]">
                  <Code2 className="w-5 h-5" />
                </div>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 gap-1 bg-[#161616] p-1 rounded-xl border border-[#2b2b2b]">
                <button
                  type="button"
                  id="tab-sign-in"
                  onClick={() => { setAuthTab('signin'); setErrorMsg(''); }}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all active:scale-[0.98] cursor-pointer ${
                    authTab === 'signin'
                      ? 'bg-[#2a2a2a] text-white shadow-sm border border-[#3a3a3a]'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="tab-register"
                  onClick={() => { setAuthTab('register'); setErrorMsg(''); }}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all active:scale-[0.98] cursor-pointer ${
                    authTab === 'register'
                      ? 'bg-[#2a2a2a] text-white shadow-sm border border-[#3a3a3a]'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  Create Profile
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-[#ff375f]/10 border border-[#ff375f]/30 text-[#ff375f] text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: STANDARD SIGN IN */}
            {authTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#d0d0d0] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#8c8c8c]" />
                    <span>Candidate Email</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. candidate@example.com"
                    required
                    className="w-full bg-[#161616] border border-[#333333] focus:border-[#ffa116] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555] outline-none transition-colors active:scale-[0.98]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#d0d0d0] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#8c8c8c]" />
                    <span>Password / Access Code</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#161616] border border-[#333333] focus:border-[#ffa116] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555] outline-none transition-colors active:scale-[0.98]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#8c8c8c]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-[#161616] border-[#333] text-[#ffa116] focus:ring-0"
                    />
                    <span>Remember candidate session</span>
                  </label>
                  <span className="text-[11px] text-[#ffa116] hover:underline cursor-pointer">Instant Access</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#ffa116] hover:bg-[#e08f12] text-black font-bold text-xs transition-all active:scale-[0.98] shadow-md shadow-[#ffa116]/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Sign In &amp; Choose Track</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 3: REGISTER NEW CANDIDATE PROFILE */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#d0d0d0] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#8c8c8c]" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      required
                      className="w-full bg-[#161616] border border-[#333333] focus:border-[#ffa116] rounded-xl px-3 py-2 text-xs text-white placeholder-[#555] outline-none transition-colors active:scale-[0.98]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#d0d0d0] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#8c8c8c]" />
                      <span>Email</span>
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="s.connor@example.com"
                      required
                      className="w-full bg-[#161616] border border-[#333333] focus:border-[#ffa116] rounded-xl px-3 py-2 text-xs text-white placeholder-[#555] outline-none transition-colors active:scale-[0.98]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#d0d0d0] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#8c8c8c]" />
                      <span>Target Company</span>
                    </label>
                    <select
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      className="w-full bg-[#161616] border border-[#333333] focus:border-[#ffa116] rounded-xl px-3 py-2 text-xs text-white outline-none transition-colors active:scale-[0.98] cursor-pointer"
                    >
                      {TARGET_COMPANIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#d0d0d0] flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#8c8c8c]" />
                      <span>Experience Level</span>
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value as any)}
                      className="w-full bg-[#161616] border border-[#333333] focus:border-[#ffa116] rounded-xl px-3 py-2 text-xs text-white outline-none transition-colors active:scale-[0.98] cursor-pointer"
                    >
                      {EXPERIENCE_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#d0d0d0] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#8c8c8c]" />
                    <span>Target Role</span>
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-[#161616] border border-[#333333] focus:border-[#ffa116] rounded-xl px-3 py-2 text-xs text-white outline-none transition-colors active:scale-[0.98] cursor-pointer"
                  >
                    {TARGET_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2cbb5d] hover:bg-[#27a853] text-white font-bold text-xs transition-all active:scale-[0.98] shadow-md shadow-[#2cbb5d]/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Create Candidate Profile &amp; Start</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222222] py-3 text-center text-[11px] text-[#666666]">
        AI Interviewer Technical Assessment Suite • 6 Language Engine • AI Socratic Interview Proctor
      </footer>
    </div>
  );
};
