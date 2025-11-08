/**
 * 커스텀 애플리케이션 에러 클래스
 * HTTP 상태 코드와 에러 코드를 함께 관리
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
    
    // TypeScript에서 instanceof 체크를 위해 필요
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

/**
 * 에러 코드 상수
 */
export const ERROR_CODES = {
  // 인증 관련
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  
  // 검증 관련
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // 데이터베이스 관련
  DB_CONNECTION_ERROR: 'DB_CONNECTION_ERROR',
  DB_QUERY_ERROR: 'DB_QUERY_ERROR',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  
  // 네트워크 관련
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  API_ERROR: 'API_ERROR',
  
  // 권한 관련
  FORBIDDEN: 'FORBIDDEN',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // 기타
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const

/**
 * 사용자 친화적 에러 메시지 매핑
 */
const ERROR_MESSAGES: Record<string, string> = {
  // 인증
  [ERROR_CODES.AUTH_REQUIRED]: '로그인이 필요합니다',
  [ERROR_CODES.AUTH_INVALID_TOKEN]: '인증 정보가 올바르지 않습니다',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: '로그인이 만료되었습니다. 다시 로그인해주세요',
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: '이메일 또는 비밀번호가 올바르지 않습니다',
  
  // 검증
  [ERROR_CODES.VALIDATION_ERROR]: '입력 정보를 확인해주세요',
  [ERROR_CODES.INVALID_INPUT]: '올바르지 않은 입력입니다',
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: '필수 항목을 입력해주세요',
  
  // 데이터베이스
  [ERROR_CODES.DB_CONNECTION_ERROR]: '데이터베이스 연결에 실패했습니다',
  [ERROR_CODES.DB_QUERY_ERROR]: '데이터 처리 중 오류가 발생했습니다',
  [ERROR_CODES.RECORD_NOT_FOUND]: '요청한 데이터를 찾을 수 없습니다',
  [ERROR_CODES.DUPLICATE_ENTRY]: '이미 존재하는 데이터입니다',
  
  // 네트워크
  [ERROR_CODES.NETWORK_ERROR]: '인터넷 연결을 확인해주세요',
  [ERROR_CODES.TIMEOUT_ERROR]: '요청 시간이 초과되었습니다. 다시 시도해주세요',
  [ERROR_CODES.API_ERROR]: '서버와의 통신에 실패했습니다',
  
  // 권한
  [ERROR_CODES.FORBIDDEN]: '접근 권한이 없습니다',
  [ERROR_CODES.UNAUTHORIZED]: '인증이 필요합니다',
  
  // 기타
  [ERROR_CODES.INTERNAL_ERROR]: '서버 오류가 발생했습니다',
  [ERROR_CODES.NOT_FOUND]: '페이지를 찾을 수 없습니다',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요',
}

/**
 * API 응답용 에러 핸들러
 * Next.js API 라우트에서 사용
 */
export const apiErrorHandler = {
  /**
   * 에러를 API 응답 형식으로 변환
   */
  toResponse(error: unknown): {
    error: string
    code: string
    statusCode: number
    details?: any
  } {
    // AppError인 경우
    if (error instanceof AppError) {
      return {
        error: ERROR_MESSAGES[error.code] || error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: process.env.NODE_ENV === 'development' ? error.details : undefined,
      }
    }

    // 일반 Error인 경우
    if (error instanceof Error) {
      return {
        error: process.env.NODE_ENV === 'development' 
          ? error.message 
          : ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR],
        code: ERROR_CODES.INTERNAL_ERROR,
        statusCode: 500,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }
    }

    // 알 수 없는 에러
    return {
      error: ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR],
      code: ERROR_CODES.INTERNAL_ERROR,
      statusCode: 500,
    }
  },

  /**
   * HTTP 상태 코드에서 에러 생성
   */
  fromStatusCode(statusCode: number, message?: string): AppError {
    switch (statusCode) {
      case 400:
        return new AppError(
          message || ERROR_MESSAGES[ERROR_CODES.INVALID_INPUT],
          ERROR_CODES.INVALID_INPUT,
          400
        )
      case 401:
        return new AppError(
          message || ERROR_MESSAGES[ERROR_CODES.AUTH_REQUIRED],
          ERROR_CODES.AUTH_REQUIRED,
          401
        )
      case 403:
        return new AppError(
          message || ERROR_MESSAGES[ERROR_CODES.FORBIDDEN],
          ERROR_CODES.FORBIDDEN,
          403
        )
      case 404:
        return new AppError(
          message || ERROR_MESSAGES[ERROR_CODES.RECORD_NOT_FOUND],
          ERROR_CODES.RECORD_NOT_FOUND,
          404
        )
      case 429:
        return new AppError(
          message || ERROR_MESSAGES[ERROR_CODES.RATE_LIMIT_EXCEEDED],
          ERROR_CODES.RATE_LIMIT_EXCEEDED,
          429
        )
      default:
        return new AppError(
          message || ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR],
          ERROR_CODES.INTERNAL_ERROR,
          statusCode
        )
    }
  },
}

/**
 * UI 컴포넌트용 에러 핸들러
 * React 컴포넌트에서 사용
 */
export const uiErrorHandler = {
  /**
   * 에러를 사용자 친화적 메시지로 변환
   */
  getMessage(error: unknown): string {
    if (error instanceof AppError) {
      return ERROR_MESSAGES[error.code] || error.message
    }

    if (error instanceof Error) {
      // 네트워크 에러 감지
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR]
      }
      
      // 타임아웃 에러 감지
      if (error.message.includes('timeout')) {
        return ERROR_MESSAGES[ERROR_CODES.TIMEOUT_ERROR]
      }

      return process.env.NODE_ENV === 'development'
        ? error.message
        : ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR]
    }

    return ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR]
  },

  /**
   * Fetch API 응답에서 에러 추출
   */
  async fromResponse(response: Response): Promise<AppError> {
    try {
      const data = await response.json()
      return new AppError(
        data.error || ERROR_MESSAGES[ERROR_CODES.API_ERROR],
        data.code || ERROR_CODES.API_ERROR,
        response.status,
        data.details
      )
    } catch {
      return apiErrorHandler.fromStatusCode(response.status)
    }
  },
}

/**
 * 에러 로깅 유틸리티
 */
export const errorLogger = {
  /**
   * 에러를 콘솔에 로깅 (개발 환경)
   * 프로덕션에서는 에러 트래킹 서비스로 전송
   */
  log(error: unknown, context?: Record<string, any>) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorInfo)
    } else {
      // TODO: 프로덕션에서는 Sentry 등의 서비스로 전송
      // Sentry.captureException(error, { extra: context })
    }
  },

  /**
   * 경고 로깅
   */
  warn(message: string, context?: Record<string, any>) {
    const warnInfo = {
      timestamp: new Date().toISOString(),
      message,
      context,
    }

    if (process.env.NODE_ENV === 'development') {
      console.warn('Warning:', warnInfo)
    }
  },
}

/**
 * try-catch 래퍼 유틸리티
 * async 함수를 안전하게 실행
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: unknown) => void
): Promise<[Error | null, T | null]> {
  try {
    const result = await fn()
    return [null, result]
  } catch (error) {
    if (errorHandler) {
      errorHandler(error)
    } else {
      errorLogger.log(error)
    }
    return [error instanceof Error ? error : new Error(String(error)), null]
  }
}
