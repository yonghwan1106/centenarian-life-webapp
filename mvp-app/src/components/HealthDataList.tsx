'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { database } from '@/lib/database'
import type { HealthData } from '@/types'

export default function HealthDataList() {
  const { user } = useAuth()
  const [healthData, setHealthData] = useState<HealthData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      loadHealthData()
    }
  }, [user])

  const loadHealthData = async () => {
    if (!user) return

    try {
      const { data, error: dbError } = await database.getHealthData(user.id, 10)
      
      if (dbError) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
      } else {
        setHealthData(data || [])
      }
    } catch (err) {
      setError('예상치 못한 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatBloodPressure = (systolic?: number, diastolic?: number) => {
    if (systolic && diastolic) {
      return `${systolic}/${diastolic} mmHg`
    }
    return '-'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">데이터를 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-700 text-sm">{error}</div>
      </div>
    )
  }

  if (healthData.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">아직 건강 데이터가 없습니다.</div>
        <div className="text-sm text-gray-400">위의 폼을 사용해서 첫 번째 데이터를 기록해보세요!</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">최근 건강 데이터</h2>
      
      <div className="space-y-4">
        {healthData.map((data) => (
          <div key={data.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm text-gray-500">
                {formatDate(data.recorded_at)}
              </div>
              <div className="flex space-x-2">
                {data.mood_rating && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    기분 {data.mood_rating}/10
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-500">심박수</div>
                <div className="font-medium">
                  {data.heart_rate ? `${data.heart_rate} BPM` : '-'}
                </div>
              </div>
              
              <div>
                <div className="text-gray-500">혈압</div>
                <div className="font-medium">
                  {formatBloodPressure(data.blood_pressure_systolic, data.blood_pressure_diastolic)}
                </div>
              </div>
              
              <div>
                <div className="text-gray-500">체중</div>
                <div className="font-medium">
                  {data.weight ? `${data.weight} kg` : '-'}
                </div>
              </div>
              
              <div>
                <div className="text-gray-500">걸음 수</div>
                <div className="font-medium">
                  {data.steps ? `${data.steps.toLocaleString()}` : '-'}
                </div>
              </div>
              
              <div>
                <div className="text-gray-500">수면 시간</div>
                <div className="font-medium">
                  {data.sleep_hours ? `${data.sleep_hours}시간` : '-'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={loadHealthData}
          className="text-wellness-blue hover:text-blue-700 text-sm font-medium"
        >
          새로고침
        </button>
      </div>
    </div>
  )
}