'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { supabase } from '@/lib/supabase'
import type { HealthRecommendation } from '@/types'

export default function AIRecommendations() {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<HealthRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      loadRecommendations()
    }
  }, [user])

  const loadRecommendations = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Supabase 세션에서 토큰 가져오기
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError('인증이 필요합니다.')
        return
      }

      const response = await fetch('/api/recommendations', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      const data = await response.json()
      
      if (response.ok) {
        setRecommendations(data.recommendations || [])
      } else {
        setError(data.error || '추천을 불러오는 중 오류가 발생했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const generateNewRecommendations = async () => {
    if (!user) return

    setGenerating(true)
    setError('')
    try {
      // Supabase 세션에서 토큰 가져오기
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError('인증이 필요합니다.')
        return
      }

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setRecommendations(prev => [...data.recommendations, ...prev])
      } else {
        setError(data.error || '추천 생성 중 오류가 발생했습니다.')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setGenerating(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/recommendations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'mark_read' }),
      })

      if (response.ok) {
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === id ? { ...rec, is_read: true } : rec
          )
        )
      }
    } catch (err) {
      console.error('Error marking recommendation as read:', err)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exercise': return '🏃‍♂️'
      case 'nutrition': return '🥗'
      case 'sleep': return '😴'
      case 'mental_health': return '🧠'
      default: return '💡'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'exercise': return '운동'
      case 'nutrition': return '영양'
      case 'sleep': return '수면'
      case 'mental_health': return '정신건강'
      default: return '일반'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityName = (priority: string) => {
    switch (priority) {
      case 'high': return '높음'
      case 'medium': return '보통'
      case 'low': return '낮음'
      default: return '보통'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">AI 추천을 불러오는 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI 건강 추천</h2>
        <button
          onClick={generateNewRecommendations}
          disabled={generating}
          className="bg-wellness-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
        >
          {generating ? '생성 중...' : '새 추천 생성'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-700 text-sm">{error}</div>
        </div>
      )}

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">아직 AI 추천이 없습니다.</div>
          <div className="text-sm text-gray-400 mb-4">
            건강 데이터를 입력하신 후 위의 '새 추천 생성' 버튼을 눌러보세요!
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div 
              key={recommendation.id} 
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                recommendation.is_read ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCategoryIcon(recommendation.category)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">
                        {getCategoryName(recommendation.category)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                        {getPriorityName(recommendation.priority)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-400">
                    신뢰도: {Math.round((recommendation.confidence || 0) * 100)}%
                  </div>
                  {!recommendation.is_read && (
                    <button
                      onClick={() => markAsRead(recommendation.id)}
                      className="text-xs text-wellness-blue hover:text-blue-700 font-medium"
                    >
                      읽음 표시
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {recommendation.description}
              </p>
              
              <div className="mt-3 text-xs text-gray-400">
                {new Date(recommendation.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}