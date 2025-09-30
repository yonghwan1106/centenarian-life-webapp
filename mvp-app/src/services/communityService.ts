import { supabase } from '@/lib/supabase';
import { DEFAULTS } from '@/constants';

export const communityService = {
  async getCommunityPosts(category?: string, limit?: number) {
    console.log('Fetching community posts for category:', category);
    
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
      .limit(limit ?? DEFAULTS.communityPostsLimit);
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    console.log('Community posts result:', { data, error, count: data?.length });
    return { data, error };
  },

  async createCommunityPost(post: {
    user_id: string;
    title: string;
    content: string;
    category: string;
  }) {
    console.log('Creating community post:', post);
    
    const { data, error } = await supabase
      .from('community_posts')
      .insert(post)
      .select()
      .single();
    
    console.log('Community post creation result:', { data, error });
    return { data, error };
  },

  async getCommunityPost(postId: string) {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        users!community_posts_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .eq('id', postId)
      .single();
    
    return { data, error };
  },

  async updateCommunityPost(postId: string, updates: { title?: string; content?: string; category?: string }) {
    const { data, error } = await supabase
      .from('community_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single();
    
    return { data, error };
  },

  async deleteCommunityPost(postId: string) {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);
    
    return { error };
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
      .order('created_at', { ascending: true });
    
    return { data, error };
  },

  async createComment(comment: {
    post_id: string;
    user_id: string;
    content: string;
  }) {
    const { data, error } = await supabase
      .from('community_comments')
      .insert(comment)
      .select()
      .single();
    
    return { data, error };
  },

  async updateComment(commentId: string, content: string) {
    const { data, error } = await supabase
      .from('community_comments')
      .update({ 
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select()
      .single();
    
    return { data, error };
  },

  async deleteComment(commentId: string) {
    const { error } = await supabase
      .from('community_comments')
      .delete()
      .eq('id', commentId);
    
    return { error };
  },

  async toggleLike(postId: string, userId: string) {
    // Check if like exists
    const { data: existingLike } = await supabase
      .from('community_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
    
    if (existingLike) {
      // Remove like
      const { error } = await supabase
        .from('community_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      return { liked: false, error };
    } else {
      // Add like
      const { error } = await supabase
        .from('community_likes')
        .insert({ post_id: postId, user_id: userId });
      
      return { liked: true, error };
    }
  },

  async getPostLikes(postId: string) {
    const { data, error } = await supabase
      .from('community_likes')
      .select('*')
      .eq('post_id', postId);
    
    return { data, error };
  },

  async getUserLikedPosts(userId: string) {
    const { data, error } = await supabase
      .from('community_likes')
      .select('post_id')
      .eq('user_id', userId);
    
    return { data, error };
  },

  async getUserPosts(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  }
}; 