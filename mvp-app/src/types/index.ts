// Database Entity Types
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthData {
  id: string;
  user_id: string;
  heart_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  weight?: number;
  height?: number;
  steps?: number;
  sleep_hours?: number;
  mood_rating?: number;
  recorded_at: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  health_goals?: string[];
  medical_conditions?: string[];
  created_at: string;
  updated_at: string;
}

export interface HealthRecommendation {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'exercise' | 'nutrition' | 'sleep' | 'mental_health';
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  is_read: boolean;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  likes_count?: number;
  comments_count?: number;
  created_at: string;
  updated_at: string;
  users?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  users?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CommunityLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

// Health Metrics Types
export interface HealthMetrics {
  heart_rate?: number;
  blood_pressure?: {
    systolic: number;
    diastolic: number;
  };
  weight?: number;
  steps?: number;
  sleep_hours?: number;
  mood_rating?: number;
}

export interface HealthStats {
  totalRecords: number;
  averageWeight: number;
  averageHeartRate: number;
  averageSleep: number;
  lastMoodRating: number;
  weeklyData: WeeklyHealthData[];
}

export interface WeeklyHealthData {
  date: string;
  weight: number;
  heartRate: number;
  sleep: number;
  mood: number;
  steps: number;
}

// Enum Types
export enum HealthCategory {
  EXERCISE = 'exercise',
  NUTRITION = 'nutrition',
  SLEEP = 'sleep',
  MENTAL_HEALTH = 'mental_health',
}

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHT = 'light',
  MODERATE = 'moderate',
  ACTIVE = 'active',
  VERY_ACTIVE = 'very_active',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// Export all types from other files
export * from './api';
export * from './ui';