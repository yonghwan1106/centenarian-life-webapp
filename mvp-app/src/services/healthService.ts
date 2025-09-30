import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { HealthData } from '@/types';
import { DEFAULTS } from '@/constants';

// Helper to determine which client to use
const getClient = () => {
  // Use admin client if available (server-side), otherwise use regular client
  return supabaseAdmin || supabase;
};

export const healthService = {
  async createHealthData(data: Omit<HealthData, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
      .from('health_data')
      .insert(data)
      .select()
      .single();
    
    return { data: result, error };
  },

  async getHealthData(userId: string, limit = DEFAULTS.healthDataLimit) {
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  async getLatestHealthData(userId: string) {
    console.log('Fetching health data for user:', userId);

    const client = getClient();
    const { data, error } = await client
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(10); // 더 많은 레코드를 가져와서 유효한 데이터 찾기

    console.log('Health data query result:', { data, error, count: data?.length });

    // 유효한 건강 데이터를 찾기 (모든 필드가 null이 아닌 것)
    let result = null;
    if (data && data.length > 0) {
      result = data.find(item =>
        item.heart_rate || item.blood_pressure_systolic || item.weight ||
        item.steps || item.sleep_hours || item.mood_rating
      ) || data[0]; // 유효한 데이터가 없으면 첫 번째 항목 반환
    }

    console.log('Returning health data:', result);

    return { data: result, error };
  },

  async updateHealthData(id: string, updates: Partial<HealthData>) {
    const { data, error } = await supabase
      .from('health_data')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async deleteHealthData(id: string) {
    const { error } = await supabase
      .from('health_data')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  async getHealthStats(userId: string, days = DEFAULTS.statsDefaultDays) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .gte('recorded_at', fromDate.toISOString())
      .order('recorded_at', { ascending: true });
    
    return { data, error };
  },

  async getHealthTrends(userId: string, days = 7) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .gte('recorded_at', fromDate.toISOString())
      .order('recorded_at', { ascending: true });
    
    return { data, error };
  }
}; 