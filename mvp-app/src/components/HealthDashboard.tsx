'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useHealthData } from '@/hooks'
import { formatters } from '@/utils'

export default function HealthDashboard() {
  const { healthData, stats, loading, error } = useHealthData()

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">건강 대시보드</h3>
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    )
  }

  if (!stats || healthData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">건강 대시보드</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-600 mb-4">아직 건강 데이터가 없습니다</p>
          <p className="text-sm text-gray-500">
            건강 데이터를 입력하시면 여기에 차트와 통계가 표시됩니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 통계 카드들 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-wellness-blue">{stats.totalRecords}</div>
          <div className="text-sm text-gray-600">총 기록</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-wellness-green">
            {stats.averageWeight > 0 ? `${stats.averageWeight}kg` : '-'}
          </div>
          <div className="text-sm text-gray-600">평균 체중</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-wellness-purple">
            {stats.averageHeartRate > 0 ? `${stats.averageHeartRate}bpm` : '-'}
          </div>
          <div className="text-sm text-gray-600">평균 심박수</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-wellness-teal">
            {stats.averageSleep > 0 ? `${stats.averageSleep}h` : '-'}
          </div>
          <div className="text-sm text-gray-600">평균 수면</div>
        </div>
      </div>

      {/* 차트 섹션 */}
      {stats.weeklyData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* 체중 & 심박수 차트 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">체중 & 심박수 추세</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'weight') return [`${value}kg`, '체중']
                    if (name === 'heartRate') return [`${value}bpm`, '심박수']
                    return [value, name]
                  }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                  connectNulls={false}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 수면 차트 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">수면 시간</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}시간`, '수면']}
                />
                <Bar 
                  dataKey="sleep" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 걸음수 차트 */}
      {stats.weeklyData.some(d => d.steps > 0) && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">일일 걸음수</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()}보`, '걸음수']}
              />
              <Bar 
                dataKey="steps" 
                fill="#06B6D4" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 최근 기분 상태 */}
      {stats.lastMoodRating > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">최근 기분 상태</h3>
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {stats.lastMoodRating >= 8 ? '😊' : 
                 stats.lastMoodRating >= 6 ? '🙂' : 
                 stats.lastMoodRating >= 4 ? '😐' : '😔'}
              </div>
              <div className="text-2xl font-bold text-wellness-purple">
                {stats.lastMoodRating}/10
              </div>
              <div className="text-sm text-gray-600">
                {stats.lastMoodRating >= 8 ? '훌륭해요!' : 
                 stats.lastMoodRating >= 6 ? '좋아요!' : 
                 stats.lastMoodRating >= 4 ? '보통이에요' : '힘내세요!'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}