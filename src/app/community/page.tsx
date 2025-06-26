'use client'

import { useAuth } from '@/components/AuthProvider'
import CommunityPosts from '@/components/CommunityPosts'
import CreatePostForm from '@/components/CreatePostForm'
import LoginForm from '@/components/LoginForm'
import Link from 'next/link'
import { useState } from 'react'

export default function CommunityPage() {
  const { user, loading } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)

  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1)
  }

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
              <h1 className="text-xl font-semibold text-gray-900">커뮤니티</h1>
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
              className="py-4 text-gray-600 hover:text-wellness-blue border-b-2 border-transparent hover:border-wellness-blue transition-colors"
            >
              AI 추천
            </Link>
            <Link 
              href="/community" 
              className="py-4 text-wellness-blue border-b-2 border-wellness-blue font-medium"
            >
              커뮤니티
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-wellness-green to-wellness-blue rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">🌟 웰니스 커뮤니티에 오신 것을 환영합니다!</h2>
            <p className="text-lg opacity-90">
              건강한 삶을 함께 만들어가는 공간입니다. 경험을 공유하고 서로 격려해주세요.
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center border">
              <div className="text-2xl font-bold text-wellness-blue">💪</div>
              <div className="text-sm text-gray-600 mt-1">운동 이야기</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border">
              <div className="text-2xl font-bold text-wellness-green">🥗</div>
              <div className="text-sm text-gray-600 mt-1">영양 정보</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border">
              <div className="text-2xl font-bold text-wellness-purple">🧠</div>
              <div className="text-sm text-gray-600 mt-1">정신건강</div>
            </div>
          </div>

          {/* Create Post Form */}
          <CreatePostForm onPostCreated={handlePostCreated} />

          {/* Community Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💙 커뮤니티 가이드라인</h3>
            <div className="text-blue-800 text-sm space-y-1">
              <p>• 서로를 존중하고 배려하는 마음으로 소통해주세요</p>
              <p>• 개인적인 건강 정보는 신중하게 공유해주세요</p>
              <p>• 의학적 조언보다는 경험과 격려를 나눠주세요</p>
              <p>• 광고나 스팸성 글은 삭제될 수 있습니다</p>
            </div>
          </div>

          {/* Posts List */}
          <div key={refreshKey}>
            <CommunityPosts />
          </div>
        </div>
      </main>
    </div>
  )
}