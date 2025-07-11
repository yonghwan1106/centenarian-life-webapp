import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types';

export const userService = {
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .limit(1);
    
    // Return the first item if data exists, null if no profile
    return { data: data && data.length > 0 ? data[0] : null, error };
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    // upsert를 사용하여 프로필이 없으면 생성하고, 있으면 업데이트
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        ...updates
      })
      .select()
      .single();
    
    return { data, error };
  },

  async createUserProfile(userId: string, profileData: Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        ...profileData
      })
      .select()
      .single();
    
    return { data, error };
  },

  async deleteUserProfile(userId: string) {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);
    
    return { error };
  },

  async getUserSettings(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return { data, error };
  },

  async updateUserSettings(userId: string, settings: Record<string, any>) {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    return { data, error };
  }
}; 