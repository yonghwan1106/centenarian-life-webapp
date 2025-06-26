'use client'

import { useAuth } from '@/components/AuthProvider'
import AIRecommendations from '@/components/AIRecommendations'
import AIInsights from '@/components/AIInsights'
import LoginForm from '@/components/LoginForm'
import Link from 'next/link'

export default function AIPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-wellness-blue">
                센테니얼 라이프
              </Link>
              <span className="text-gray-500">|</span>
              <h1 className="text-xl font-semibold text-gray-900">AI 추천</h1>
            </div>
            <div className="text-sm text-gray-600">
              {user.user_metadata?.name || user.email}님
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <Link 
              href="/" 
              className="py-4 text-gray-600 hover:text-wellness-blue border-b-2 border-transparent hover:border-wellness-blue transition-colors"
            >
              대시보드
            </Link>
            <Link 
              href="/health" 
              className="py-4 text-gray-600 hover:text-wellness-blue border-b-2 border-transparent hover:border-wellness-blue transition-colors"
            >
              건강 데이터
            </Link>
            <Link 
              href="/ai" 
              className="py-4 text-wellness-blue border-b-2 border-wellness-blue font-medium"
            >
              AI 추천
            </Link>
            <Link 
              href="#" 
              className="py-4 text-gray-600 hover:text-wellness-blue border-b-2 border-transparent hover:border-wellness-blue transition-colors"
            >
              커뮤니티
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* AI Insights Section */}
          <AIInsights />
          
          {/* AI Recommendations Section */}
          <AIRecommendations />
          
          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 text-xl">ℹ️</div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">AI 추천 시스템 안내</h3>
                <div className="text-blue-800 text-sm space-y-1">
                  <p>• AI는 당신의 최근 건강 데이터를 분석하여 개인화된 추천을 제공합니다.</p>
                  <p>• 더 많은 건강 데이터를 입력할수록 더 정확한 추천을 받을 수 있습니다.</p>
                  <p>• 추천은 운동, 영양, 수면, 정신건강 카테고리로 분류됩니다.</p>
                  <p>• 중요도가 높은 추천부터 우선적으로 실행해보세요!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}