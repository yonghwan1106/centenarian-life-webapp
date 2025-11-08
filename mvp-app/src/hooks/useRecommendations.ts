import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { recommendationsService } from '@/services';
import { authUtils, uiErrorHandler } from '@/utils';
import { API_ENDPOINTS } from '@/constants';
import type { HealthRecommendation } from '@/types';

export const useRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<HealthRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await authUtils.makeAuthenticatedRequest(API_ENDPOINTS.recommendations);
      const data = await response.json();
      
      if (response.ok) {
        setRecommendations(data.recommendations || []);
      } else {
        const appError = uiErrorHandler.getMessage(data);
        setError(appError);
      }
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
    } finally {
      setLoading(false);
    }
  };

  const generateNewRecommendations = async () => {
    if (!user) return false;

    try {
      console.log('🚀 generateNewRecommendations called');
      setGenerating(true);
      setError(null);

      const response = await authUtils.makeAuthenticatedRequest(API_ENDPOINTS.recommendations, {
        method: 'POST',
      });

      console.log('📡 API Response status:', response.status);
      const data = await response.json();
      console.log('📦 API Response data:', data);

      if (response.ok) {
        console.log('✅ Response OK, recommendations:', data.recommendations);
        console.log('📊 Current recommendations count:', recommendations.length);
        setRecommendations(prev => {
          const newRecs = [...data.recommendations, ...prev];
          console.log('🔄 Updated recommendations count:', newRecs.length);
          return newRecs;
        });
        return true;
      } else {
        const appError = uiErrorHandler.getMessage(data);
        console.error("❌ API Error:", appError);
        setError(appError);
        return false;
      }
    } catch (err) {
      console.error('💥 Exception:', err);
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
      return false;
    } finally {
      console.log('🏁 generateNewRecommendations finished');
      setGenerating(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_ENDPOINTS.recommendations}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'mark_read' }),
      });

      if (response.ok) {
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === id ? { ...rec, is_read: true } : rec
          )
        );
        return true;
      } else {
        const data = await response.json();
        const appError = uiErrorHandler.getMessage(data);
        setError(appError);
        return false;
      }
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
      return false;
    }
  };

  const markAllAsRead = async () => {
    if (!user) return false;

    try {
      setError(null);
      
      const { data: updatedData, error: updateError } = await recommendationsService.markAllRecommendationsAsRead(user.id);
      
      if (updateError) {
        const appError = uiErrorHandler.getMessage(updateError);
        setError(appError);
        return false;
      }

      setRecommendations(prev => 
        prev.map(rec => ({ ...rec, is_read: true }))
      );
      return true;
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
      return false;
    }
  };

  const deleteRecommendation = async (id: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await recommendationsService.deleteRecommendation(id);
      
      if (deleteError) {
        const appError = uiErrorHandler.getMessage(deleteError);
        setError(appError);
        return false;
      }

      setRecommendations(prev => prev.filter(rec => rec.id !== id));
      return true;
    } catch (err) {
      const appError = uiErrorHandler.getMessage(err);
      setError(appError);
      return false;
    }
  };

  const getRecommendationsByCategory = async (category: string) => {
    if (!user) return [];

    try {
      setError(null);
      
      const { data, error: fetchError } = await recommendationsService.getRecommendationsByCategory(user.id, category);
      
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

  const getUnreadRecommendations = async () => {
    if (!user) return [];

    try {
      setError(null);
      
      const { data, error: fetchError } = await recommendationsService.getUnreadRecommendations(user.id);
      
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
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  return {
    recommendations,
    loading,
    generating,
    error,
    loadRecommendations,
    generateNewRecommendations,
    markAsRead,
    markAllAsRead,
    deleteRecommendation,
    getRecommendationsByCategory,
    getUnreadRecommendations,
    refetch: loadRecommendations,
  };
}; 