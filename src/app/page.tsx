'use client'

import { useAuth } from '@/components/AuthProvider'
import LoginForm from '@/components/LoginForm'
import Link from 'next/link'

export default function HomePage() {
  const { user, loading, signOut } = useAuth()

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
    <main className="min-h-screen bg-gradient-to-br from-wellness-blue to-wellness-green">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl font-bold">
              센테니얼 라이프
            </h1>
            <button
              onClick={signOut}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              로그아웃
            </button>
          </div>
          <p className="text-xl mb-8">
            안녕하세요, {user.user_metadata?.name || user.email}님!
          </p>
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">환영합니다!</h2>
            <p className="text-lg opacity-90">
              AI와 함께하는 건강한 100세 시대를 시작해보세요.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/health" className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors">
                <h3 className="font-semibold mb-2">건강 데이터</h3>
                <p className="text-sm opacity-80">생체정보를 기록하고 관리하세요</p>
              </Link>
              <Link href="/ai" className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors">
                <h3 className="font-semibold mb-2">AI 추천</h3>
                <p className="text-sm opacity-80">개인화된 건강 조언을 받아보세요</p>
              </Link>
              <div className="bg-white/10 p-4 rounded-lg opacity-50">
                <h3 className="font-semibold mb-2">커뮤니티 (곧 출시)</h3>
                <p className="text-sm opacity-80">다른 사용자들과 소통하세요</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}