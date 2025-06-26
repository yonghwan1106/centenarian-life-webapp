import { supabase } from './supabase'
import type { HealthData, UserProfile, HealthRecommendation } from '@/types'

export const database = {
  // Health Data operations
  async createHealthData(data: Omit<HealthData, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
      .from('health_data')
      .insert(data)
      .select()
      .single()
    
    return { data: result, error }
  },

  async getHealthData(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(limit)
    
    return { data, error }
  },

  async getLatestHealthData(userId: string) {
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single()
    
    return { data, error }
  },

  async updateHealthData(id: string, updates: Partial<HealthData>) {
    const { data, error } = await supabase
      .from('health_data')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  async deleteHealthData(id: string) {
    const { error } = await supabase
      .from('health_data')
      .delete()
      .eq('id', id)
    
    return { error }
  },

  // User Profile operations
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    return { data, error }
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    
    return { data, error }
  },

  // Health Recommendations operations
  async createHealthRecommendation(recommendation: Omit<HealthRecommendation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('health_recommendations')
      .insert(recommendation)
      .select()
      .single()
    
    return { data, error }
  },

  async getHealthRecommendations(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('health_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    return { data, error }
  },

  async markRecommendationAsRead(id: string) {
    const { data, error } = await supabase
      .from('health_recommendations')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Community operations
  async getCommunityPosts(category?: string, limit = 20) {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        users:user_id (name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  async createCommunityPost(post: {
    user_id: string
    title: string
    content: string
    category: string
  }) {
    const { data, error } = await supabase
      .from('community_posts')
      .insert(post)
      .select()
      .single()
    
    return { data, error }
  },

  async getPostComments(postId: string) {
    const { data, error } = await supabase
      .from('community_comments')
      .select(`
        *,
        users:user_id (name, email)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    
    return { data, error }
  },

  async createComment(comment: {
    post_id: string
    user_id: string
    content: string
  }) {
    const { data, error } = await supabase
      .from('community_comments')
      .insert(comment)
      .select()
      .single()
    
    return { data, error }
  },

  async toggleLike(postId: string, userId: string) {
    // Check if like exists
    const { data: existingLike } = await supabase
      .from('community_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()
    
    if (existingLike) {
      // Remove like
      const { error } = await supabase
        .from('community_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
      
      return { liked: false, error }
    } else {
      // Add like
      const { error } = await supabase
        .from('community_likes')
        .insert({ post_id: postId, user_id: userId })
      
      return { liked: true, error }
    }
  },

  // Analytics/Stats
  async getHealthStats(userId: string, days = 30) {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .gte('recorded_at', fromDate.toISOString())
      .order('recorded_at', { ascending: true })
    
    return { data, error }
  }
}

export default database