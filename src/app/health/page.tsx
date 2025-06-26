'use client'

import { useAuth } from '@/components/AuthProvider'
import HealthDataForm from '@/components/HealthDataForm'
import HealthDataList from '@/components/HealthDataList'
import LoginForm from '@/components/LoginForm'
import Link from 'next/link'

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
              <h1 className="text-xl font-semibold text-gray-900">건강 데이터</h1>
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
              className="py-4 text-wellness-blue border-b-2 border-wellness-blue font-medium"
            >
              건강 데이터
            </Link>
            <Link 
              href="/ai" 
              className="py-4 text-gray-600 hover:text-wellness-blue border-b-2 border-transparent hover:border-wellness-blue transition-colors"
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
      </main>
    </div>
  )
}