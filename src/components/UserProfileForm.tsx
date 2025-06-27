'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { database } from '@/lib/database'
import type { UserProfile } from '@/types'

export default function UserProfileForm() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    age: undefined,
    gender: undefined,
    height: undefined,
    weight: undefined,
    activity_level: undefined,
    health_goals: [],
    medical_conditions: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newGoal, setNewGoal] = useState('')
  const [newCondition, setNewCondition] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await database.getUserProfile(user!.id)
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching profile:', error)
        setMessage('프로필을 불러오는데 실패했습니다')
        setMessageType('error')
        return
      }
      
      if (data) {
        setProfile({
          age: data.age || undefined,
          gender: data.gender || undefined,
          height: data.height || undefined,
          weight: data.weight || undefined,
          activity_level: data.activity_level || undefined,
          health_goals: data.health_goals || [],
          medical_conditions: data.medical_conditions || []
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('프로필을 불러오는데 실패했습니다')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setMessageType('')

    try {
      const { error } = await database.updateUserProfile(user!.id, profile)
      if (error) {
        console.error('Error updating profile:', error)
        setMessage('프로필 저장에 실패했습니다')
        setMessageType('error')
        return
      }
      
      setMessage('프로필이 성공적으로 저장되었습니다! 🎉')
      setMessageType('success')
    } catch (error) {
      console.error('Error:', error)
      setMessage('프로필 저장에 실패했습니다')
      setMessageType('error')
    } finally {
      setSaving(false)
    }
  }

  const addHealthGoal = () => {
    if (newGoal.trim() && !profile.health_goals?.includes(newGoal.trim())) {
      setProfile(prev => ({
        ...prev,
        health_goals: [...(prev.health_goals || []), newGoal.trim()]
      }))
      setNewGoal('')
    }
  }

  const removeHealthGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      health_goals: prev.health_goals?.filter(g => g !== goal) || []
    }))
  }

  const addMedicalCondition = () => {
    if (newCondition.trim() && !profile.medical_conditions?.includes(newCondition.trim())) {
      setProfile(prev => ({
        ...prev,
        medical_conditions: [...(prev.medical_conditions || []), newCondition.trim()]
      }))
      setNewCondition('')
    }
  }

  const removeMedicalCondition = (condition: string) => {
    setProfile(prev => ({
      ...prev,
      medical_conditions: prev.medical_conditions?.filter(c => c !== condition) || []
    }))
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">개인 정보 및 건강 목표</h3>
      
      {/* 메시지 표시 */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          messageType === 'success' 
            ? 'bg-green-100 border border-green-300 text-green-700' 
            : 'bg-red-100 border border-red-300 text-red-700'
        }`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              나이
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={profile.age || ''}
              onChange={(e) => setProfile(prev => ({ 
                ...prev, 
                age: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
              placeholder="예: 65"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성별
            </label>
            <select
              value={profile.gender || ''}
              onChange={(e) => setProfile(prev => ({ 
                ...prev, 
                gender: e.target.value === '' ? undefined : e.target.value as 'male' | 'female' | 'other'
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
            >
              <option value="">선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              키 (cm)
            </label>
            <input
              type="number"
              min="100"
              max="250"
              step="0.1"
              value={profile.height || ''}
              onChange={(e) => setProfile(prev => ({ 
                ...prev, 
                height: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
              placeholder="예: 170.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              체중 (kg)
            </label>
            <input
              type="number"
              min="30"
              max="200"
              step="0.1"
              value={profile.weight || ''}
              onChange={(e) => setProfile(prev => ({ 
                ...prev, 
                weight: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
              placeholder="예: 65.5"
            />
          </div>
        </div>

        {/* 활동 수준 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            활동 수준
          </label>
          <select
            value={profile.activity_level || ''}
            onChange={(e) => setProfile(prev => ({ 
              ...prev, 
              activity_level: e.target.value === '' ? undefined : e.target.value as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
          >
            <option value="">선택하세요</option>
            <option value="sedentary">비활동적 (주로 앉아서 생활)</option>
            <option value="light">가벼운 활동 (가벼운 운동 1-3일/주)</option>
            <option value="moderate">보통 활동 (보통 운동 3-5일/주)</option>
            <option value="active">활발한 활동 (강한 운동 6-7일/주)</option>
            <option value="very_active">매우 활발함 (매일 강한 운동)</option>
          </select>
        </div>

        {/* 건강 목표 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            건강 목표
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHealthGoal())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
                placeholder="예: 체중 5kg 감량, 혈압 정상화 등"
              />
              <button
                type="button"
                onClick={addHealthGoal}
                className="px-4 py-2 bg-wellness-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                추가
              </button>
            </div>
            {profile.health_goals && profile.health_goals.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.health_goals.map((goal, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-wellness-blue/10 text-wellness-blue rounded-full text-sm"
                  >
                    {goal}
                    <button
                      type="button"
                      onClick={() => removeHealthGoal(goal)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 기존 질환 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            기존 질환 또는 주의사항
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicalCondition())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
                placeholder="예: 고혈압, 당뇨병, 관절염 등"
              />
              <button
                type="button"
                onClick={addMedicalCondition}
                className="px-4 py-2 bg-wellness-green text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                추가
              </button>
            </div>
            {profile.medical_conditions && profile.medical_conditions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.medical_conditions.map((condition, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                  >
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeMedicalCondition(condition)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-wellness-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? '저장 중...' : '프로필 저장'}
          </button>
        </div>
      </form>
    </div>
  )
}