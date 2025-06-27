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
    console.log('Fetching health data for user:', userId)
    
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(10) // 더 많은 레코드를 가져와서 유효한 데이터 찾기
    
    console.log('Health data query result:', { data, error, count: data?.length })
    
    // 유효한 건강 데이터를 찾기 (모든 필드가 null이 아닌 것)
    let result = null
    if (data && data.length > 0) {
      result = data.find(item => 
        item.heart_rate || item.blood_pressure_systolic || item.weight || 
        item.steps || item.sleep_hours || item.mood_score
      ) || data[0] // 유효한 데이터가 없으면 첫 번째 항목 반환
    }
    
    console.log('Returning health data:', result)
    
    return { data: result, error }
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
      .limit(1)
    
    // Return the first item if data exists, null if no profile
    return { data: data && data.length > 0 ? data[0] : null, error }
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
    console.log('Fetching community posts for category:', category)
    
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        users!community_posts_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    console.log('Community posts result:', { data, error, count: data?.length })
    return { data, error }
  },

  async createCommunityPost(post: {
    user_id: string
    title: string
    content: string
    category: string
  }) {
    console.log('Creating community post:', post)
    
    const { data, error } = await supabase
      .from('community_posts')
      .insert(post)
      .select()
      .single()
    
    console.log('Community post creation result:', { data, error })
    return { data, error }
  },

  async getPostComments(postId: string) {
    const { data, error } = await supabase
      .from('community_comments')
      .select(`
        *,
        users!community_comments_user_id_fkey (
          id,
          name,
          email
        )
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