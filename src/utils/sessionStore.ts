import { QUESTIONS_BANK } from '../data/questions';
import { INTERVIEW_TRACKS } from '../data/tracks';
import {
  CandidateProfile,
  InterviewSession,
  InterviewTrackId,
  SupportedLanguage,
} from '../types/interview';

const STORAGE_KEY_PREFIX = 'ai_interview_session_';
const USER_PROFILE_KEY = 'ai_interviewer_user_profile';

export function getSavedCandidateProfile(): CandidateProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load candidate profile', e);
  }
  return null;
}

export function saveCandidateProfile(profile: CandidateProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save candidate profile', e);
  }
}

export function clearCandidateProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(USER_PROFILE_KEY);
  } catch (e) {
    console.error('Failed to clear candidate profile', e);
  }
}

export function generateSessionId(): string {
  const rand = Math.random().toString(36).substring(2, 9);
  return `session-${rand}`;
}

export function getSessionIdFromUrl(): string {
  if (typeof window === 'undefined') return generateSessionId();
  const params = new URLSearchParams(window.location.search);
  const paramId = params.get('session');
  if (paramId) return paramId;

  const hash = window.location.hash.replace('#', '');
  if (hash.startsWith('session-')) return hash;

  const newId = generateSessionId();
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('session', newId);
  window.history.replaceState({}, '', newUrl.toString());
  return newId;
}

export function createInitialSession(
  sessionId: string,
  candidateName = 'Candidate',
  trackId: InterviewTrackId = 'dsa',
  customQuestionIds?: string[],
  profile?: CandidateProfile
): InterviewSession {
  const track = INTERVIEW_TRACKS.find((t) => t.id === trackId) || INTERVIEW_TRACKS[0];
  
  // Choose questions for the track
  const targetIds = customQuestionIds && customQuestionIds.length > 0
    ? customQuestionIds
    : track.questionIds;

  const selectedQuestions = QUESTIONS_BANK.filter((q) => targetIds.includes(q.id));
  const effectiveQuestions = selectedQuestions.length > 0 ? selectedQuestions : QUESTIONS_BANK.slice(0, 3);
  const selectedQuestionIds = effectiveQuestions.map((q) => q.id);

  const initialCode: Record<string, Record<SupportedLanguage, string>> = {};
  effectiveQuestions.forEach((q) => {
    initialCode[q.id] = { ...q.starterCode };
  });

  return {
    sessionId,
    candidateName: profile?.name || candidateName,
    candidateProfile: profile,
    trackId,
    trackTitle: track.title,
    currentQuestionIndex: 0,
    selectedQuestionIds,
    status: 'active',
    chatHistory: [],
    codeByQuestion: initialCode,
    activeLanguage: trackId === 'frontend' ? 'javascript' : 'java',
    submissions: {},
    report: null,
    startedAt: Date.now(),
    timeLimitMinutes: track.durationMinutes,
  };
}

export function loadSession(sessionId: string): InterviewSession {
  if (typeof window === 'undefined') {
    return createInitialSession(sessionId);
  }
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.codeByQuestion) {
        parsed.codeByQuestion = {};
      }
      QUESTIONS_BANK.forEach((q) => {
        if (!parsed.codeByQuestion[q.id]) {
          parsed.codeByQuestion[q.id] = { ...q.starterCode };
        } else {
          (Object.keys(q.starterCode) as SupportedLanguage[]).forEach((lang) => {
            if (!parsed.codeByQuestion[q.id][lang]) {
              parsed.codeByQuestion[q.id][lang] = q.starterCode[lang];
            }
          });
        }
      });
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load session from localStorage', e);
  }
  const fresh = createInitialSession(sessionId);
  saveSession(fresh);
  return fresh;
}

export function saveSession(session: InterviewSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${session.sessionId}`, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save session to localStorage', e);
  }
}

export function clearSession(sessionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${sessionId}`);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
}
