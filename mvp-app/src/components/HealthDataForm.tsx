'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { database } from '@/lib/database'

interface HealthFormData {
  heart_rate?: number
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  weight?: number
  steps?: number
  sleep_hours?: number
  mood_rating?: number
}

export default function HealthDataForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState<HealthFormData>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: keyof HealthFormData, value: string) => {
    const numValue = value === '' ? undefined : Number(value)
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }))
  }

  const fieldLimits = {
    heart_rate: { min: 40, max: 200 },
    blood_pressure_systolic: { min: 70, max: 250 },
    blood_pressure_diastolic: { min: 40, max: 150 },
    weight: { min: 30, max: 300 },
    steps: { min: 0, max: 50000 },
    sleep_hours: { min: 0, max: 24 },
    mood_rating: { min: 1, max: 10 }
  }

  const handleIncrement = (field: keyof HealthFormData, step: number = 1) => {
    setFormData(prev => {
      const currentValue = prev[field] || 0
      const limits = fieldLimits[field as keyof typeof fieldLimits]
      let newValue = Math.round((currentValue + step) * 10) / 10
      
      if (limits && newValue > limits.max) {
        newValue = limits.max
      }
      
      return {
        ...prev,
        [field]: newValue
      }
    })
  }

  const handleDecrement = (field: keyof HealthFormData, step: number = 1) => {
    setFormData(prev => {
      const currentValue = prev[field] || 0
      const limits = fieldLimits[field as keyof typeof fieldLimits]
      let newValue = Math.round((currentValue - step) * 10) / 10
      
      if (limits && newValue < limits.min) {
        newValue = limits.min
      }
      
      return {
        ...prev,
        [field]: newValue
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const healthData = {
        user_id: user.id,
        ...formData,
        recorded_at: new Date().toISOString()
      }

      const { error: dbError } = await database.createHealthData(healthData)
      
      if (dbError) {
        setError('데이터 저장 중 오류가 발생했습니다.')
      } else {
        setSuccess(true)
        setFormData({}) // Reset form
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      setError('예상치 못한 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">건강 데이터 입력</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Heart Rate */}
        <div>
          <label htmlFor="heart_rate" className="block text-sm font-medium text-gray-700">
            심박수 (BPM)
          </label>
          <div className="mt-1 relative">
            <input
              id="heart_rate"
              type="number"
              value={formData.heart_rate || ''}
              onChange={(e) => handleInputChange('heart_rate', e.target.value)}
              className="block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wellness-blue focus:border-wellness-blue"
              placeholder="70"
              min="40"
              max="200"
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
              <button
                type="button"
                onClick={() => handleIncrement('heart_rate')}
                className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-tr-md"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleDecrement('heart_rate')}
                className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-br-md border-t border-gray-300"
              >
                ▼
              </button>
            </div>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="blood_pressure_systolic" className="block text-sm font-medium text-gray-700">
              수축기 혈압 (mmHg)
            </label>
            <div className="mt-1 relative">
              <input
                id="blood_pressure_systolic"
                type="number"
                value={formData.blood_pressure_systolic || ''}
                onChange={(e) => handleInputChange('blood_pressure_systolic', e.target.value)}
                className="block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wellness-blue focus:border-wellness-blue"
                placeholder="120"
                min="70"
                max="250"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
                <button
                  type="button"
                  onClick={() => handleIncrement('blood_pressure_systolic')}
                  className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-tr-md"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => handleDecrement('blood_pressure_systolic')}
                  className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-br-md border-t border-gray-300"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="blood_pressure_diastolic" className="block text-sm font-medium text-gray-700">
              이완기 혈압 (mmHg)
            </label>
            <div className="mt-1 relative">
              <input
                id="blood_pressure_diastolic"
                type="number"
                value={formData.blood_pressure_diastolic || ''}
                onChange={(e) => handleInputChange('blood_pressure_diastolic', e.target.value)}
                className="block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wellness-blue focus:border-wellness-blue"
                placeholder="80"
                min="40"
                max="150"
                autoComplete="off"
              />
              <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
                <button
                  type="button"
                  onClick={() => handleIncrement('blood_pressure_diastolic')}
                  className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-tr-md"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => handleDecrement('blood_pressure_diastolic')}
                  className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-br-md border-t border-gray-300"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Weight */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            체중 (kg)
          </label>
          <div className="mt-1 relative">
            <input
              id="weight"
              type="number"
              step="0.1"
              value={formData.weight || ''}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wellness-blue focus:border-wellness-blue"
              placeholder="70.0"
              min="30"
              max="300"
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
              <button
                type="button"
                onClick={() => handleIncrement('weight', 0.1)}
                className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-tr-md"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleDecrement('weight', 0.1)}
                className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-br-md border-t border-gray-300"
              >
                ▼
              </button>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div>
          <label htmlFor="steps" className="block text-sm font-medium text-gray-700">
            걸음 수
          </label>
          <div className="mt-1 relative">
            <input
              id="steps"
              type="number"
              value={formData.steps || ''}
              onChange={(e) => handleInputChange('steps', e.target.value)}
              className="block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wellness-blue focus:border-wellness-blue"
              placeholder="8000"
              min="0"
              max="50000"
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
              <button
                type="button"
                onClick={() => handleIncrement('steps', 100)}
                className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-tr-md"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleDecrement('steps', 100)}
                className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-br-md border-t border-gray-300"
              >
                ▼
              </button>
            </div>
          </div>
        </div>

        {/* Sleep Hours */}
        <div>
          <label htmlFor="sleep_hours" className="block text-sm font-medium text-gray-700">
            수면 시간 (시간)
          </label>
          <div className="mt-1 relative">
            <input
              id="sleep_hours"
              type="number"
              step="0.5"
              value={formData.sleep_hours || ''}
              onChange={(e) => handleInputChange('sleep_hours', e.target.value)}
              className="block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wellness-blue focus:border-wellness-blue"
              placeholder="7.5"
              min="0"
              max="24"
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
              <button
                type="button"
                onClick={() => handleIncrement('sleep_hours', 0.5)}
                className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-tr-md"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleDecrement('sleep_hours', 0.5)}
                className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-br-md border-t border-gray-300"
              >
                ▼
              </button>
            </div>
          </div>
        </div>

        {/* Mood Rating */}
        <div>
          <label htmlFor="mood_rating" className="block text-sm font-medium text-gray-700">
            기분 점수 (1-10)
          </label>
          <div className="mt-1 relative">
            <input
              id="mood_rating"
              type="number"
              value={formData.mood_rating || ''}
              onChange={(e) => handleInputChange('mood_rating', e.target.value)}
              className="block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wellness-blue focus:border-wellness-blue"
              placeholder="7"
              min="1"
              max="10"
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
              <button
                type="button"
                onClick={() => handleIncrement('mood_rating')}
                className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-tr-md"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleDecrement('mood_rating')}
                className="flex items-center justify-center px-2 h-1/2 text-gray-600 hover:bg-gray-100 rounded-br-md border-t border-gray-300"
              >
                ▼
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            1점: 매우 나쁨, 10점: 매우 좋음
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700 text-sm">{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="text-green-700 text-sm">건강 데이터가 성공적으로 저장되었습니다!</div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wellness-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wellness-blue disabled:opacity-50"
        >
          {loading ? '저장 중...' : '데이터 저장'}
        </button>
      </form>
    </div>
  )
}