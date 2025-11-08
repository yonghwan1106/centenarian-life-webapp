import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { communityService } from '@/services';
import { uiErrorHandler } from '@/utils';
import { DEFAULTS } from '@/constants';

export const useCommunity = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async (category?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await communityService.getCommunityPosts(category, DEFAULTS.communityPostsLimit);
      
      if (fetchError) {
        const appError = uiErrorHandler.getMessage(fetchError);
        setError(appError);
        return;
      }

      setPosts(data || []);
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: {
    title: string;
    content: string;
    category: string;
  }) => {
    if (!user) return false;

    try {
      setError(null);
      
      const { data, error: createError } = await communityService.createCommunityPost({
        user_id: user.id,
        ...postData,
      });
      
      if (createError) {
        const appError = uiErrorHandler.getMessage(createError);
        setError(appError);
        return false;
      }

      // Add the new post to the beginning of the list
      setPosts(prev => [data, ...prev]);
      return true;
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
      return false;
    }
  };

  const updatePost = async (postId: string, updates: {
    title?: string;
    content?: string;
    category?: string;
  }) => {
    try {
      setError(null);
      
      const { data, error: updateError } = await communityService.updateCommunityPost(postId, updates);
      
      if (updateError) {
        const appError = uiErrorHandler.getMessage(updateError);
        setError(appError);
        return false;
      }

      // Update the post in the list
      setPosts(prev => 
        prev.map(post => 
          post.id === postId ? { ...post, ...data } : post
        )
      );
      return true;
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
      return false;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await communityService.deleteCommunityPost(postId);
      
      if (deleteError) {
        const appError = uiErrorHandler.getMessage(deleteError);
        setError(appError);
        return false;
      }

      // Remove the post from the list
      setPosts(prev => prev.filter(post => post.id !== postId));
      return true;
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
      return false;
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return false;

    try {
      setError(null);
      
      const { liked, error: likeError } = await communityService.toggleLike(postId, user.id);
      
      if (likeError) {
        const appError = uiErrorHandler.getMessage(likeError);
        setError(appError);
        return false;
      }

      // Update the post's like status in the list
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes: liked 
                  ? [...(post.likes || []), { user_id: user.id }]
                  : (post.likes || []).filter((like: any) => like.user_id !== user.id)
              }
            : post
        )
      );
      return liked;
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
      return false;
    }
  };

  const getUserPosts = async (userId: string, limit = 10) => {
    try {
      setError(null);
      
      const { data, error: fetchError } = await communityService.getUserPosts(userId, limit);
      
      if (fetchError) {
        const appError = uiErrorHandler.getMessage(fetchError);
        setError(appError);
        return [];
      }

      return data || [];
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
      return [];
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    loadPosts,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    getUserPosts,
    refetch: loadPosts,
  };
};

export const usePostComments = (postId: string) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await communityService.getPostComments(postId);
      
      if (fetchError) {
        const appError = uiErrorHandler.getMessage(fetchError);
        setError(appError);
        return;
      }

      setComments(data || []);
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!user) return false;

    try {
      setError(null);
      
      const { data, error: createError } = await communityService.createComment({
        post_id: postId,
        user_id: user.id,
        content,
      });
      
      if (createError) {
        const appError = uiErrorHandler.getMessage(createError);
        setError(appError);
        return false;
      }

      // Add the new comment to the list
      setComments(prev => [...prev, data]);
      return true;
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
      return false;
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    try {
      setError(null);
      
      const { data, error: updateError } = await communityService.updateComment(commentId, content);
      
      if (updateError) {
        const appError = uiErrorHandler.getMessage(updateError);
        setError(appError);
        return false;
      }

      // Update the comment in the list
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? { ...comment, ...data } : comment
        )
      );
      return true;
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
      return false;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await communityService.deleteComment(commentId);
      
      if (deleteError) {
        const appError = uiErrorHandler.getMessage(deleteError);
        setError(appError);
        return false;
      }

      // Remove the comment from the list
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      return true;
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
      return false;
    }
  };

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  return {
    comments,
    loading,
    error,
    loadComments,
    addComment,
    updateComment,
    deleteComment,
    refetch: loadComments,
  };
}; 