import { supabase } from '@/lib/supabase';
import { ERROR_MESSAGES } from '@/constants';

export const authUtils = {
  /**
   * Get current session token
   */
  async getSessionToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  },

  /**
   * Get headers with authentication token
   */
  async getAuthHeaders() {
    const token = await this.getSessionToken();
    if (!token) {
      throw new Error(ERROR_MESSAGES.auth);
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  },

  /**
   * Make authenticated API request
   */
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('Authenticated request failed:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Validate user session
   */
  async validateSession() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error(ERROR_MESSAGES.auth);
    }
    
    return session;
  }
}; 