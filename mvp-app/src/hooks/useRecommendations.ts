import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { recommendationsService } from '@/services';
import { authUtils, errorHandler } from '@/utils';
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
        const appError = errorHandler.handleError(data);
        setError(appError.message);
      }
    } catch (err) {
      const appError = errorHandler.handleError(err);
      setError(appError.message);
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
        const appError = errorHandler.handleError(data);
        console.error('❌ API Error:', appError.message);
        setError(appError.message);
        return false;
      }
    } catch (err) {
      console.error('💥 Exception:', err);
      const appError = errorHandler.handleError(err);
      setError(appError.message);
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
        const appError = errorHandler.handleError(data);
        setError(appError.message);
        return false;
      }
    } catch (err) {
      const appError = errorHandler.handleError(err);
      setError(appError.message);
      return false;
    }
  };

  const markAllAsRead = async () => {
    if (!user) return false;

    try {
      setError(null);
      
      const { data: updatedData, error: updateError } = await recommendationsService.markAllRecommendationsAsRead(user.id);
      
      if (updateError) {
        const appError = errorHandler.handleError(updateError);
        setError(appError.message);
        return false;
      }

      setRecommendations(prev => 
        prev.map(rec => ({ ...rec, is_read: true }))
      );
      return true;
    } catch (err) {
      const appError = errorHandler.handleError(err);
      setError(appError.message);
      return false;
    }
  };

  const deleteRecommendation = async (id: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await recommendationsService.deleteRecommendation(id);
      
      if (deleteError) {
        const appError = errorHandler.handleError(deleteError);
        setError(appError.message);
        return false;
      }

      setRecommendations(prev => prev.filter(rec => rec.id !== id));
      return true;
    } catch (err) {
      const appError = errorHandler.handleError(err);
      setError(appError.message);
      return false;
    }
  };

  const getRecommendationsByCategory = async (category: string) => {
    if (!user) return [];

    try {
      setError(null);
      
      const { data, error: fetchError } = await recommendationsService.getRecommendationsByCategory(user.id, category);
      
      if (fetchError) {
        const appError = errorHandler.handleError(fetchError);
        setError(appError.message);
        return [];
      }

      return data || [];
    } catch (err) {
      const appError = errorHandler.handleError(err);
      setError(appError.message);
      return [];
    }
  };

  const getUnreadRecommendations = async () => {
    if (!user) return [];

    try {
      setError(null);
      
      const { data, error: fetchError } = await recommendationsService.getUnreadRecommendations(user.id);
      
      if (fetchError) {
        const appError = errorHandler.handleError(fetchError);
        setError(appError.message);
        return [];
      }

      return data || [];
    } catch (err) {
      const appError = errorHandler.handleError(err);
      setError(appError.message);
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