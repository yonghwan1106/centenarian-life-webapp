import { ERROR_MESSAGES } from '@/constants';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export const errorHandler = {
  /**
   * Create standardized error object
   */
  createError(message: string, code?: string, details?: any): AppError {
    return {
      message,
      code,
      details,
    };
  },

  /**
   * Handle database errors
   */
  handleDatabaseError(error: any): AppError {
    console.error('Database error:', error);
    
    if (error?.message?.includes('duplicate key')) {
      return this.createError('이미 존재하는 데이터입니다.', 'DUPLICATE_ERROR', error);
    }
    
    if (error?.message?.includes('foreign key')) {
      return this.createError('연관된 데이터가 없습니다.', 'FOREIGN_KEY_ERROR', error);
    }
    
    if (error?.message?.includes('not null')) {
      return this.createError('필수 정보가 누락되었습니다.', 'VALIDATION_ERROR', error);
    }
    
    return this.createError(ERROR_MESSAGES.generic, 'DATABASE_ERROR', error);
  },

  /**
   * Handle authentication errors
   */
  handleAuthError(error: any): AppError {
    console.error('Auth error:', error);
    
    if (error?.message?.includes('Invalid login')) {
      return this.createError('잘못된 이메일 또는 비밀번호입니다.', 'INVALID_CREDENTIALS', error);
    }
    
    if (error?.message?.includes('Email not confirmed')) {
      return this.createError('이메일 인증이 필요합니다.', 'EMAIL_NOT_CONFIRMED', error);
    }
    
    if (error?.message?.includes('User not found')) {
      return this.createError('사용자를 찾을 수 없습니다.', 'USER_NOT_FOUND', error);
    }
    
    return this.createError(ERROR_MESSAGES.auth, 'AUTH_ERROR', error);
  },

  /**
   * Handle network errors
   */
  handleNetworkError(error: any): AppError {
    console.error('Network error:', error);
    
    if (error?.message?.includes('fetch')) {
      return this.createError(ERROR_MESSAGES.network, 'NETWORK_ERROR', error);
    }
    
    return this.createError(ERROR_MESSAGES.generic, 'UNKNOWN_ERROR', error);
  },

  /**
   * Handle API errors
   */
  handleApiError(error: any): AppError {
    console.error('API error:', error);
    
    if (error?.status === 401) {
      return this.createError(ERROR_MESSAGES.auth, 'UNAUTHORIZED', error);
    }
    
    if (error?.status === 403) {
      return this.createError('권한이 없습니다.', 'FORBIDDEN', error);
    }
    
    if (error?.status === 404) {
      return this.createError('요청한 리소스를 찾을 수 없습니다.', 'NOT_FOUND', error);
    }
    
    if (error?.status === 500) {
      return this.createError('서버 오류가 발생했습니다.', 'SERVER_ERROR', error);
    }
    
    return this.createError(ERROR_MESSAGES.generic, 'API_ERROR', error);
  },

  /**
   * Handle general errors
   */
  handleError(error: any): AppError {
    if (error?.code === 'PGRST') {
      return this.handleDatabaseError(error);
    }
    
    if (error?.message?.includes('auth')) {
      return this.handleAuthError(error);
    }
    
    if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
      return this.handleNetworkError(error);
    }
    
    if (error?.status) {
      return this.handleApiError(error);
    }
    
    return this.createError(error?.message || ERROR_MESSAGES.generic, 'UNKNOWN_ERROR', error);
  }
}; 