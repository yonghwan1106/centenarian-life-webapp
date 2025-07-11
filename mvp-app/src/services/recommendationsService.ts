import { supabase } from '@/lib/supabase';
import type { HealthRecommendation } from '@/types';
import { DEFAULTS } from '@/constants';

export const recommendationsService = {
  async createHealthRecommendation(recommendation: Omit<HealthRecommendation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('health_recommendations')
      .insert(recommendation)
      .select()
      .single();
    
    return { data, error };
  },

  async getHealthRecommendations(userId: string, limit = DEFAULTS.recommendationsLimit) {
    const { data, error } = await supabase
      .from('health_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async getRecommendationsByCategory(userId: string, category: string, limit = DEFAULTS.recommendationsLimit) {
    const { data, error } = await supabase
      .from('health_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async getRecommendationsByPriority(userId: string, priority: string, limit = DEFAULTS.recommendationsLimit) {
    const { data, error } = await supabase
      .from('health_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('priority', priority)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async getUnreadRecommendations(userId: string, limit = DEFAULTS.recommendationsLimit) {
    const { data, error } = await supabase
      .from('health_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async markRecommendationAsRead(id: string) {
    const { data, error } = await supabase
      .from('health_recommendations')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async markAllRecommendationsAsRead(userId: string) {
    const { data, error } = await supabase
      .from('health_recommendations')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .select();
    
    return { data, error };
  },

  async deleteRecommendation(id: string) {
    const { error } = await supabase
      .from('health_recommendations')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  async updateRecommendation(id: string, updates: Partial<HealthRecommendation>) {
    const { data, error } = await supabase
      .from('health_recommendations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }
}; 