export interface User {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export interface HealthData {
  id: string
  user_id: string
  heart_rate?: number
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  weight?: number
  height?: number
  steps?: number
  sleep_hours?: number
  mood_rating?: number
  recorded_at: string
  created_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  age?: number
  gender?: 'male' | 'female' | 'other'
  height?: number
  weight?: number
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  health_goals?: string[]
  medical_conditions?: string[]
  created_at: string
  updated_at: string
}

export interface HealthRecommendation {
  id: string
  user_id: string
  title: string
  description: string
  category: 'exercise' | 'nutrition' | 'sleep' | 'mental_health'
  priority: 'low' | 'medium' | 'high'
  confidence: number
  is_read: boolean
  created_at: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface HealthMetrics {
  heart_rate?: number
  blood_pressure?: {
    systolic: number
    diastolic: number
  }
  weight?: number
  steps?: number
  sleep_hours?: number
  mood_rating?: number
}