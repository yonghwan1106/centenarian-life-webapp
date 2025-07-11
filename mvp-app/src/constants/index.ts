// App Configuration
export const APP_CONFIG = {
  name: '센테니얼 라이프',
  description: 'AI 웰니스 동반자',
  version: '1.0.0',
} as const;

// Colors
export const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#8B5CF6',
  warning: '#F59E0B',
  error: '#EF4444',
  success: '#10B981',
} as const;

// Default Values
export const DEFAULTS = {
  healthDataLimit: 50,
  statsDefaultDays: 30,
  recommendationsLimit: 10,
  communityPostsLimit: 20,
  chartHeight: 250,
  sleepIdealHours: 8,
  moodScaleMax: 10,
} as const;

// Health Categories
export const HEALTH_CATEGORIES = {
  exercise: '운동',
  nutrition: '영양',
  sleep: '수면',
  mental_health: '정신건강',
} as const;

// Priority Levels
export const PRIORITY_LEVELS = {
  high: '높음',
  medium: '보통',
  low: '낮음',
} as const;

// Activity Levels
export const ACTIVITY_LEVELS = {
  sedentary: '활동 부족',
  light: '가벼운 활동',
  moderate: '보통 활동',
  active: '활발한 활동',
  very_active: '매우 활발한 활동',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  health: '/api/health',
  recommendations: '/api/recommendations',
  profile: '/api/profile',
  community: '/api/community',
  ai: '/api/ai',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: '네트워크 오류가 발생했습니다.',
  auth: '인증이 필요합니다.',
  generic: '오류가 발생했습니다.',
  loading: '데이터를 불러오는 중...',
  noData: '데이터가 없습니다.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  dataSaved: '데이터가 성공적으로 저장되었습니다.',
  profileUpdated: '프로필이 업데이트되었습니다.',
  recommendationRead: '추천이 읽음으로 표시되었습니다.',
} as const; 