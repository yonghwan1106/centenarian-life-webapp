'use client'

import { useAuth } from '@/components/AuthProvider'
import LandingPage from '@/components/LandingPage'
import HealthDashboard from '@/components/HealthDashboard'
import { PageLayout } from '@/components/AppNavigation'
import Link from 'next/link'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return (
    <PageLayout 
      title="건강 대시보드" 
      description="최근 30일간의 건강 데이터를 한눈에 확인하세요"
    >
      {/* 대시보드 컴포넌트 */}
      <HealthDashboard />

      {/* 빠른 액션 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/health" 
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-wellness-blue"
        >
          <div className="flex items-center">
            <div className="text-3xl mr-4">📊</div>
            <div>
              <h3 className="font-semibold text-gray-800">건강 데이터 입력</h3>
              <p className="text-sm text-gray-600">오늘의 건강 정보를 기록하세요</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/ai" 
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-wellness-green"
        >
          <div className="flex items-center">
            <div className="text-3xl mr-4">🤖</div>
            <div>
              <h3 className="font-semibold text-gray-800">AI 건강 조언</h3>
              <p className="text-sm text-gray-600">맞춤형 추천을 받아보세요</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/community" 
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-wellness-purple"
        >
          <div className="flex items-center">
            <div className="text-3xl mr-4">👥</div>
            <div>
              <h3 className="font-semibold text-gray-800">커뮤니티</h3>
              <p className="text-sm text-gray-600">다른 사용자들과 소통하세요</p>
            </div>
          </div>
        </Link>
      </div>
    </PageLayout>
  )
}