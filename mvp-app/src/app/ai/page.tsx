'use client'

import { useAuth } from '@/components/AuthProvider'
import AIRecommendations from '@/components/AIRecommendations'
import AIInsights from '@/components/AIInsights'
import LoginForm from '@/components/LoginForm'
import { PageLayout } from '@/components/AppNavigation'

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
    <PageLayout
      title="AI 건강 조언"
      description="인공지능이 분석한 맞춤형 건강 추천을 받아보세요"
    >
      <div className="mb-4 text-right">
        <span className="text-xs text-gray-400">ChatGPT로 분석합니다.</span>
      </div>
      <div className="space-y-8">
        {/* AI Insights */}
        <div>
          <AIInsights />
        </div>

        {/* AI Recommendations */}
        <div>
          <AIRecommendations />
        </div>
      </div>
    </PageLayout>
  )
}