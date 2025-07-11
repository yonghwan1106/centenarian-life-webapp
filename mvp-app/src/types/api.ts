// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  error?: string;
}

// API Request Types
export interface CreateHealthDataRequest {
  heart_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  weight?: number;
  height?: number;
  steps?: number;
  sleep_hours?: number;
  mood_rating?: number;
  recorded_at: string;
}

export interface UpdateHealthDataRequest extends Partial<CreateHealthDataRequest> {
  id: string;
}

export interface CreateRecommendationRequest {
  title: string;
  description: string;
  category: 'exercise' | 'nutrition' | 'sleep' | 'mental_health';
  priority: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface CreateCommunityPostRequest {
  title: string;
  content: string;
  category: string;
}

export interface CreateCommentRequest {
  content: string;
  post_id: string;
}

export interface UpdateUserProfileRequest {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  health_goals?: string[];
  medical_conditions?: string[];
}

// API Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiValidationError extends ApiError {
  errors: ValidationError[];
}

// HTTP Status Codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
} 