import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client factory function
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          updated_at?: string
        }
      }
      health_data: {
        Row: {
          id: string
          user_id: string
          heart_rate: number | null
          blood_pressure_systolic: number | null
          blood_pressure_diastolic: number | null
          weight: number | null
          height: number | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          heart_rate?: number | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          weight?: number | null
          height?: number | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          heart_rate?: number | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          weight?: number | null
          height?: number | null
          recorded_at?: string
        }
      }
      daily_wellness_checklists: {
        Row: {
          id: string
          user_id: string
          checklist_date: string
          checklist_data: Record<string, boolean>
          reflection_data: {
            achievements: string
            improvements: string
            tomorrowGoals: string
          } | null
          completion_percentage: number
          total_items: number
          completed_items: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          checklist_date: string
          checklist_data: Record<string, boolean>
          reflection_data?: {
            achievements: string
            improvements: string
            tomorrowGoals: string
          } | null
          completion_percentage?: number
          total_items?: number
          completed_items?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          checklist_data?: Record<string, boolean>
          reflection_data?: {
            achievements: string
            improvements: string
            tomorrowGoals: string
          } | null
          completion_percentage?: number
          total_items?: number
          completed_items?: number
          updated_at?: string
        }
      }
    }
  }
}