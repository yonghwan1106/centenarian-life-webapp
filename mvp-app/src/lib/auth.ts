import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  user_metadata: {
    name?: string
    avatar_url?: string
  } & Record<string, any>
}

export const auth = {
  async signUp(email: string, password: string, name?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
        // 개발 환경에서는 이메일 인증 우회 (프로덕션에서는 제거 필요)
        emailRedirectTo: undefined
      }
    })
    
    return { user: data.user, session: data.session, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    return { user: data.user, session: data.session, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user as AuthUser
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  },

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password: password
    })
    return { error }
  },

  async updateProfile(updates: { name?: string; avatar_url?: string }) {
    const { error } = await supabase.auth.updateUser({
      data: updates
    })
    return { error }
  }
}

export default auth