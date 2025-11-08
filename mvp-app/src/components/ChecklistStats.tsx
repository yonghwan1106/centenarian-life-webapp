'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface ChecklistStat {
  date: string
  completedCount: number
  totalCount: number
  completionRate: number
}

export default function ChecklistStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<ChecklistStat[]>([])
  const [loading, setLoading] = useState(true)
  const [totalDays, setTotalDays] = useState(0)
  const [avgCompletionRate, setAvgCompletionRate] = useState(0)

  useEffect(() => {
    if (!user) return

    const fetchChecklistStats = async () => {
      try {
        setLoading(true)

        // Supabase 세션 토큰 가져오기
        const { supabase } = await import('@/lib/supabase')
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          console.error('No session found')
          setLoading(false)
          return
        }

        // 최근 7일간의 체크리스트 통계 가져오기
        const promises: Promise<any>[] = []
        const dates: string[] = []

        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          dates.push(dateStr)
          promises.push(
            fetch(`/api/checklist?date=${dateStr}`, {
              headers: {
                'Authorization': `Bearer ${session.access_token}`
              }
            }).then(res => res.json())
          )
        }

        const results = await Promise.all(promises)

        // Check for 401 errors - but only if all requests failed
        const allFailed = results.every((result: any) => result.error === 'Unauthorized')
        if (allFailed) {
          console.error('All requests failed with auth error - session may be invalid')
          // Set empty stats instead of logging out immediately
          // Let the AuthProvider handle session expiration
          setStats([])
          setLoading(false)
          return
        }

        const statsData: ChecklistStat[] = results.map((result, index) => {
          const entries = result.entries || []
          const completed = entries.length
          const total = 10 // 10 checklist items total

          return {
            date: new Date(dates[index]).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
            completedCount: completed,
            totalCount: total,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
          }
        })

        console.log('📊 Checklist stats:', statsData)

        setStats(statsData)

        // 평균 완료율 계산 (데이터가 있는 날만)
        const daysWithData = statsData.filter(s => s.totalCount > 0)
        setTotalDays(daysWithData.length)

        if (daysWithData.length > 0) {
          const avgRate = daysWithData.reduce((sum, s) => sum + s.completionRate, 0) / daysWithData.length
          setAvgCompletionRate(Math.round(avgRate))
          console.log('✅ Avg completion rate:', avgRate, '% over', daysWithData.length, 'days')
        } else {
          console.log('⚠️ No checklist data found')
        }

      } catch (error) {
        console.error('Failed to fetch checklist stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChecklistStats()
  }, [user])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (stats.length === 0 || stats.every(s => s.totalCount === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 일일 웰니스 체크리스트 현황</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-gray-600 mb-2">아직 체크리스트 기록이 없습니다</p>
          <p className="text-sm text-gray-500 mb-4">
            매일 10개 영역의 웰니스 체크리스트를 완료하고 건강한 습관을 만들어보세요!
          </p>
          <a
            href="/checklist"
            className="inline-block bg-wellness-green text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            지금 시작하기 →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">📋 일일 웰니스 체크리스트 현황</h3>
        <a
          href="/checklist"
          className="text-sm text-wellness-blue hover:text-blue-700 font-medium"
        >
          상세보기 →
        </a>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 text-center border border-green-100">
          <div className="text-3xl font-bold text-wellness-green">{avgCompletionRate}%</div>
          <div className="text-sm text-gray-600 mt-1">평균 완료율 (7일)</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center border border-blue-100">
          <div className="text-3xl font-bold text-wellness-blue">{totalDays}일</div>
          <div className="text-sm text-gray-600 mt-1">체크리스트 완료일</div>
        </div>
      </div>

      {/* 일별 완료율 차트 */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">최근 7일 완료율</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="#9CA3AF"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              stroke="#9CA3AF"
              label={{ value: '%', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, '완료율']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
            />
            <Bar
              dataKey="completionRate"
              radius={[4, 4, 0, 0]}
            >
              {stats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.completionRate >= 80 ? '#10B981' : // Green
                    entry.completionRate >= 50 ? '#F59E0B' : // Orange
                    '#EF4444' // Red
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* 범례 */}
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-gray-600">80% 이상</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500"></div>
            <span className="text-gray-600">50-79%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-gray-600">50% 미만</span>
          </div>
        </div>
      </div>

      {/* 오늘의 진행상황 */}
      {stats.length > 0 && stats[stats.length - 1].totalCount > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">오늘의 진행상황</span>
            <span className="text-sm font-semibold text-wellness-blue">
              {stats[stats.length - 1].completedCount} / {stats[stats.length - 1].totalCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-wellness-green to-wellness-blue h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${stats[stats.length - 1].completionRate}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}