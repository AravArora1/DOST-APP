
export enum AppTab {
  DASHBOARD = 'dashboard',
  COMMUNITY = 'community',
  ACTIVITIES = 'activities',
  COUNSELORS = 'counselors',
  LIVE = 'live',
  RESULTS = 'results'
}

export enum AppState {
  LOGIN = 'login',
  ONBOARDING = 'onboarding',
  MAIN = 'main',
  COUNSELLOR_LOGIN = 'counsellor_login',
  COUNSELLOR_MAIN = 'counsellor_main'
}

export interface UserStats {
  streak: number;
  points: number;
  level: number;
  xpToNextLevel: number;
  mood: number; // 1-10
  waterLevel: number; // 0-100
  isScreened: boolean;
  lastTestResult?: 'low' | 'moderate' | 'high';
}

export interface Message {
  id: string;
  sender: 'user' | 'bot' | 'system' | 'community';
  text: string;
  timestamp: Date;
  username?: string;
  avatar?: string;
}

export interface Counselor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  price: number;
  distance: string;
  image: string;
  url?: string;
}

export interface AIRecommendation {
  shouldSeeTherapist: boolean;
  predictionReasoning: string;
  severityLabel: string;
  breathingExercises: Array<{
    title: string;
    description: string;
    duration: string;
  }>;
  microHabits: Array<{
    title: string;
    description: string;
    category: string;
  }>;
}
