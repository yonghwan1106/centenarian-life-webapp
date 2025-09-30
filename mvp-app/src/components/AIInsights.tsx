'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { supabase } from '@/lib/supabase'

export default function AIInsights() {
  const { user } = useAuth()
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateInsight = async () => {
    if (!user) return

    setLoading(true)
    setError('')
    try {
      // Supabase 세션에서 토큰 가져오기
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError('인증이 필요합니다.')
        return
      }

      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setInsight(data.insight)
      } else {
        setError(data.error || 'AI 인사이트 생성 중 오류가 발생했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-wellness-purple to-wellness-blue rounded-lg p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🤖 AI 건강 인사이트</h2>
        <button
          onClick={generateInsight}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
        >
          {loading ? '분석 중...' : '인사이트 생성'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-300/30 rounded-md p-3 mb-4">
          <div className="text-red-100 text-sm">{error}</div>
        </div>
      )}

      {insight ? (
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-lg leading-relaxed">{insight}</p>
        </div>
      ) : (
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center">
          <p className="text-white/90 mb-3">
            💡 AI가 당신의 건강 데이터를 분석해드립니다!
          </p>
          <p className="text-white/70 text-sm mb-4">
            먼저 <a href="/health" className="underline font-medium hover:text-white">건강 데이터</a>를 입력하신 후<br/>
            위의 <strong>'인사이트 생성'</strong> 버튼을 눌러보세요
          </p>
        </div>
      )}
    </div>
  )
}