'use client'

import { useAuth } from '@/components/AuthProvider'
import UserProfileForm from '@/components/UserProfileForm'
import { PageLayout } from '@/components/AppNavigation'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다</p>
          <Link href="/" className="text-wellness-blue hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <PageLayout 
      title="프로필 관리" 
      description="개인 정보와 건강 목표를 설정하세요"
    >
      <div className="max-w-4xl mx-auto">
        {/* 사용자 정보 카드 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-wellness-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {(user.user_metadata?.name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user.user_metadata?.name || '사용자'}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                가입일: {new Date(user.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </div>

        {/* 프로필 폼 */}
        <UserProfileForm />
      </div>
    </PageLayout>
  )
}