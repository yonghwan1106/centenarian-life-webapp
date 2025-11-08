'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: string
}

/**
 * Error Boundary 컴포넌트
 * 
 * React 컴포넌트 트리에서 발생하는 JavaScript 에러를 캐치하여
 * 전체 앱이 크래시되는 것을 방지합니다.
 * 
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // 다음 렌더링에서 폴백 UI를 표시하도록 상태 업데이트
    return { 
      hasError: true, 
      error,
      errorInfo: error.message 
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // 에러 로깅 서비스로 전송 (예: Sentry, LogRocket 등)
    console.error('Error Boundary caught an error:', {
      error: error.toString(),
      errorInfo: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    })

    // TODO: 프로덕션에서는 에러 트래킹 서비스로 전송
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    // }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // 커스텀 폴백 UI가 제공된 경우
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              문제가 발생했습니다
            </h2>
            
            <p className="text-gray-600 mb-6">
              예상치 못한 오류가 발생했습니다.<br />
              불편을 드려 죄송합니다.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-left">
                <p className="text-xs font-mono text-red-800 break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <p className="text-xs text-red-600 mt-2">
                    {this.state.errorInfo}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-wellness-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                다시 시도
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                홈으로 이동
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full text-gray-600 px-6 py-2 hover:text-gray-800 transition-colors text-sm"
              >
                페이지 새로고침
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              문제가 계속되면 브라우저를 새로고침하거나<br />
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * 특정 섹션을 위한 가벼운 Error Boundary
 * 전체 페이지가 아닌 컴포넌트 단위로 에러를 처리
 */
export function SectionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-red-800 font-medium mb-2">
            이 섹션을 불러오는 중 문제가 발생했습니다
          </p>
          <p className="text-sm text-red-600">
            페이지를 새로고침하면 해결될 수 있습니다.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
