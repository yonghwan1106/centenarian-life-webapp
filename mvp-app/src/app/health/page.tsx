'use client'

import { useAuth } from '@/components/AuthProvider'
import HealthDataForm from '@/components/HealthDataForm'
import HealthDataList from '@/components/HealthDataList'
import LoginForm from '@/components/LoginForm'
import { PageLayout } from '@/components/AppNavigation'

export default function HealthPage() {
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
      title="건강 데이터" 
      description="오늘의 건강 정보를 기록하고 과거 데이터를 확인하세요"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Health Data Form */}
        <div>
          <HealthDataForm />
        </div>
        
        {/* Health Data List */}
        <div>
          <HealthDataList />
        </div>
      </div>
    </PageLayout>
  )
}