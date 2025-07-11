import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { healthService } from '@/services';
import { errorHandler } from '@/utils';
import type { HealthData } from '@/types';

interface HealthStats {
  totalRecords: number;
  averageWeight: number;
  averageHeartRate: number;
  averageSleep: number;
  lastMoodRating: number;
  weeklyData: any[];
}

export const useHealthData = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [stats, setStats] = useState<HealthStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await healthService.getHealthStats(user.id, 30);
      
      if (fetchError) {
        const appError = errorHandler.handleError(fetchError);
        setError(appError.message);
        return;
      }

      if (data && data.length > 0) {
        setHealthData(data);
        calculateStats(data);
      } else {
        setHealthData([]);
        setStats(null);
      }
    } catch (err) {
      const appError = errorHandler.handleError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: HealthData[]) => {
    const validWeights = data.filter(d => d.weight).map(d => d.weight!);
    const validHeartRates = data.filter(d => d.heart_rate).map(d => d.heart_rate!);
    const validSleep = data.filter(d => d.sleep_hours).map(d => d.sleep_hours!);
    const lastMood = data.find(d => d.mood_rating)?.mood_rating || 0;

    // 주간 데이터 생성 (최근 7일)
    const last7Days = data.slice(0, 7).reverse();
    const weeklyData = last7Days.map(d => ({
      date: new Date(d.recorded_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      weight: d.weight || 0,
      heartRate: d.heart_rate || 0,
      sleep: d.sleep_hours || 0,
      mood: d.mood_rating || 0,
      steps: d.steps || 0
    }));

    setStats({
      totalRecords: data.length,
      averageWeight: validWeights.length > 0 ? Number((validWeights.reduce((a, b) => a + b, 0) / validWeights.length).toFixed(1)) : 0,
      averageHeartRate: validHeartRates.length > 0 ? Math.round(validHeartRates.reduce((a, b) => a + b, 0) / validHeartRates.length) : 0,
      averageSleep: validSleep.length > 0 ? Number((validSleep.reduce((a, b) => a + b, 0) / validSleep.length).toFixed(1)) : 0,
      lastMoodRating: lastMood,
      weeklyData
    });
  };

  const addHealthData = async (data: Omit<HealthData, 'id' | 'created_at'>) => {
    try {
      setError(null);
      
      const { data: newData, error: addError } = await healthService.createHealthData(data);
      
      if (addError) {
        const appError = errorHandler.handleError(addError);
        setError(appError.message);
        return false;
      }

      // Refresh data after adding
      await fetchHealthData();
      return true;
    } catch (err) {
      const appError = errorHandler.handleError(err);
      setError(appError.message);
      return false;
    }
  };

  const updateHealthData = async (id: string, updates: Partial<HealthData>) => {
    try {
      setError(null);
      
      const { data: updatedData, error: updateError } = await healthService.updateHealthData(id, updates);
      
      if (updateError) {
        const appError = errorHandler.handleError(updateError);
        setError(appError.message);
        return false;
      }

      // Refresh data after updating
      await fetchHealthData();
      return true;
    } catch (err) {
      const appError = errorHandler.handleError(err);
      setError(appError.message);
      return false;
    }
  };

  const deleteHealthData = async (id: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await healthService.deleteHealthData(id);
      
      if (deleteError) {
        const appError = errorHandler.handleError(deleteError);
        setError(appError.message);
        return false;
      }

      // Refresh data after deleting
      await fetchHealthData();
      return true;
    } catch (err) {
      const appError = errorHandler.handleError(err);
      setError(appError.message);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchHealthData();
    }
  }, [user]);

  return {
    healthData,
    stats,
    loading,
    error,
    fetchHealthData,
    addHealthData,
    updateHealthData,
    deleteHealthData,
    refetch: fetchHealthData,
  };
}; 