'use client'

import React, { useState, useEffect } from 'react'
import { PageLayout } from './AppNavigation'
import { useAuth } from './AuthProvider'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

// 체크리스트 아이템 타입 정의
interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

// 카테고리별 체크리스트 데이터
interface ChecklistCategory {
  id: string
  name: string
  icon: string
  color: string
  items: Omit<ChecklistItem, 'completed'>[]
}

const checklistCategories: ChecklistCategory[] = [
  {
    id: 'physical-health',
    name: '신체 건강',
    icon: '💪',
    color: 'bg-red-50 border-red-200',
    items: [
      { id: 'morning-exercise', text: '아침 체조 또는 스트레칭 (10-15분)', priority: 'high' },
      { id: 'cardio-exercise', text: '30분 이상 중강도 운동 (걷기, 수영, 자전거 등)', priority: 'high' },
      { id: 'water-intake', text: '8잔 이상의 물 섭취', priority: 'medium' },
      { id: 'balanced-meals', text: '균형 잡힌 식사 3회 (채소, 단백질, 전곡류 포함)', priority: 'high' },
      { id: 'medication', text: '복용 약물 체크 및 섭취', priority: 'high' },
      { id: 'health-monitoring', text: '혈압/혈당 측정 (해당 시)', priority: 'medium' },
      { id: 'quality-sleep', text: '충분한 수면 (7-8시간 목표)', priority: 'high' }
    ]
  },
  {
    id: 'mental-health',
    name: '정신 건강',
    icon: '🧠',
    color: 'bg-blue-50 border-blue-200',
    items: [
      { id: 'meditation', text: '명상 또는 마음 챙김 실천 (15-20분)', priority: 'high' },
      { id: 'gratitude-journal', text: '감사일기 작성', priority: 'medium' },
      { id: 'stress-management', text: '스트레스 관리 기법 실천 (심호흡, 점진적 근육 이완 등)', priority: 'high' },
      { id: 'positive-thoughts', text: '하루 3가지 긍정적인 일 찾기', priority: 'medium' },
      { id: 'self-affirmation', text: '자기 긍정 확언 실천', priority: 'low' }
    ]
  },
  {
    id: 'nutrition',
    name: '영양',
    icon: '🥗',
    color: 'bg-green-50 border-green-200',
    items: [
      { id: 'vegetable-intake', text: '다양한 색깔의 채소 5가지 이상 섭취', priority: 'high' },
      { id: 'protein-intake', text: '양질의 단백질 섭취 (생선, 닭고기, 콩류 등)', priority: 'high' },
      { id: 'whole-grains', text: '전곡류 섭취 (현미, 통밀 등)', priority: 'medium' },
      { id: 'healthy-fats', text: '건강한 지방 섭취 (견과류, 올리브오일 등)', priority: 'medium' },
      { id: 'limit-processed', text: '가공식품 및 설탕 섭취 제한', priority: 'high' }
    ]
  },
  {
    id: 'exercise',
    name: '운동',
    icon: '🏃',
    color: 'bg-orange-50 border-orange-200',
    items: [
      { id: 'strength-training', text: '근력 운동 (30분 이상)', priority: 'high' },
      { id: 'flexibility', text: '유연성 운동 (요가, 스트레칭)', priority: 'medium' },
      { id: 'balance-training', text: '균형감각 훈련', priority: 'medium' },
      { id: 'outdoor-activity', text: '야외 활동 참여', priority: 'low' },
      { id: 'active-lifestyle', text: '일상 생활에서 활동량 늘리기 (계단 이용 등)', priority: 'medium' }
    ]
  },
  {
    id: 'sleep',
    name: '수면',
    icon: '😴',
    color: 'bg-purple-50 border-purple-200',
    items: [
      { id: 'regular-bedtime', text: '규칙적인 취침 시간 유지', priority: 'high' },
      { id: 'sleep-environment', text: '수면 환경 최적화 (어둡고 시원하게)', priority: 'medium' },
      { id: 'no-screens', text: '취침 1시간 전 전자기기 사용 금지', priority: 'high' },
      { id: 'relaxation', text: '잠들기 전 이완 활동 (독서, 음악 등)', priority: 'medium' },
      { id: 'sleep-quality', text: '수면의 질 자가 평가', priority: 'low' }
    ]
  },
  {
    id: 'social-connection',
    name: '사회적 연결',
    icon: '👥',
    color: 'bg-pink-50 border-pink-200',
    items: [
      { id: 'family-contact', text: '가족/친구와 연락 (전화, 문자, 이메일 등)', priority: 'high' },
      { id: 'face-to-face', text: '대면 만남 계획 또는 실행 (주 1-2회)', priority: 'medium' },
      { id: 'new-connections', text: '새로운 사회적 연결 모색 (동호회, 봉사활동 등)', priority: 'low' },
      { id: 'community-participate', text: '지역 사회 활동 참여', priority: 'low' },
      { id: 'helping-others', text: '타인을 도울 수 있는 기회 찾기', priority: 'medium' }
    ]
  },
  {
    id: 'cognitive-function',
    name: '인지 기능',
    icon: '🧩',
    color: 'bg-indigo-50 border-indigo-200',
    items: [
      { id: 'learning', text: '새로운 기술/지식 학습 (30분-1시간)', priority: 'high' },
      { id: 'reading', text: '독서 (30분 이상)', priority: 'high' },
      { id: 'brain-games', text: '두뇌 훈련 게임 또는 퍼즐', priority: 'medium' },
      { id: 'creative-activity', text: '창의적 활동 (그림, 음악, 글쓰기 등)', priority: 'low' },
      { id: 'memory-exercise', text: '기억력 훈련 (일기 쓰기, 암송 등)', priority: 'medium' }
    ]
  },
  {
    id: 'financial-stability',
    name: '재정 안정',
    icon: '💰',
    color: 'bg-yellow-50 border-yellow-200',
    items: [
      { id: 'expense-tracking', text: '일일 지출 기록', priority: 'high' },
      { id: 'budget-check', text: '예산 대비 지출 확인', priority: 'high' },
      { id: 'investment-review', text: '투자 포트폴리오 점검 (주 1회)', priority: 'medium' },
      { id: 'financial-goal', text: '재정 목표 진행 상황 검토 (월 1회)', priority: 'low' },
      { id: 'financial-education', text: '재정 관리 교육 콘텐츠 학습', priority: 'low' }
    ]
  },
  {
    id: 'purpose',
    name: '목적 의식',
    icon: '🎯',
    color: 'bg-teal-50 border-teal-200',
    items: [
      { id: 'goal-review', text: '개인 성장 목표 점검 및 조정', priority: 'medium' },
      { id: 'volunteer-plan', text: '자원봉사 또는 사회 공헌 활동 계획', priority: 'low' },
      { id: 'hobby-engage', text: '즐거운 취미 활동 (1시간 이상)', priority: 'medium' },
      { id: 'new-experience', text: '새로운 경험 계획 (월 1회 이상)', priority: 'low' },
      { id: 'meaningful-activity', text: '의미 있는 활동 참여', priority: 'medium' }
    ]
  },
  {
    id: 'stress-management',
    name: '스트레스 관리',
    icon: '🧘',
    color: 'bg-gray-50 border-gray-200',
    items: [
      { id: 'work-life-balance', text: '업무 시간과 개인 시간 구분 짓기', priority: 'high' },
      { id: 'rest-time', text: '휴식과 회복 시간 확보', priority: 'high' },
      { id: 'schedule-review', text: '주간 일정 검토 및 조정', priority: 'medium' },
      { id: 'breathing-exercise', text: '긴장 완화를 위한 호흡 운동', priority: 'medium' },
      { id: 'stress-level', text: '스트레스 레벨 자가 체크', priority: 'low' }
    ]
  }
]

// 일일 성찰 타입
interface DailyReflection {
  achievements: string
  improvements: string
  tomorrowGoals: string
}

export default function DailyWellnessChecklist() {
  const { user } = useAuth()
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [reflection, setReflection] = useState<DailyReflection>({
    achievements: '',
    improvements: '',
    tomorrowGoals: ''
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (isHydrated) {
      loadTodayData()
    }
  }, [user, isHydrated])

  // 데이터 로드 함수
  const loadTodayData = async () => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      
      // API에서 오늘 데이터 가져오기 (userId 포함)
      const response = await fetch(`/api/checklist?date=${today}&user_id=${user.id}`)
      const data = await response.json()

      if (response.ok && data.checklist) {
        setCheckedItems(data.checklist.checklist_data || {})
        setReflection(data.checklist.reflection_data || {
          achievements: '',
          improvements: '',
          tomorrowGoals: ''
        })
      } else {
        // 로컬스토리지에서 fallback 데이터 로드
        const savedCheckedItems = localStorage.getItem(`checklist-${today}`)
        const savedReflection = localStorage.getItem(`reflection-${today}`)
        
        if (savedCheckedItems) {
          setCheckedItems(JSON.parse(savedCheckedItems))
        }
        
        if (savedReflection) {
          setReflection(JSON.parse(savedReflection))
        }
      }
    } catch (error) {
      console.error('Error loading checklist data:', error)
      // 에러 시 로컬스토리지에서 로드
      const today = new Date().toISOString().split('T')[0]
      const savedCheckedItems = localStorage.getItem(`checklist-${today}`)
      const savedReflection = localStorage.getItem(`reflection-${today}`)
      
      if (savedCheckedItems) {
        setCheckedItems(JSON.parse(savedCheckedItems))
      }
      
      if (savedReflection) {
        setReflection(JSON.parse(savedReflection))
      }
    }
    
    // 기본적으로 첫 번째 카테고리는 열어두기
    setExpandedCategories({ [checklistCategories[0].id]: true })
    setIsLoaded(true)
  }

  // 데이터베이스에 저장하는 함수
  const saveToDatabase = async (items: Record<string, boolean>, reflectionData: DailyReflection) => {
    if (!user || isSaving) return

    try {
      setIsSaving(true)
      
      // 통계 계산
      const totalItems = checklistCategories.reduce((sum, category) => sum + category.items.length, 0)
      const completedItems = Object.values(items).filter(Boolean).length
      const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

      const response = await fetch('/api/checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          checklistData: items,
          reflectionData: reflectionData,
          completionPercentage,
          totalItems,
          completedItems,
          date: new Date().toISOString().split('T')[0],
          userId: user.id
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save to database')
      }

      // 성공 시 로컬스토리지도 업데이트
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem(`checklist-${today}`, JSON.stringify(items))
      localStorage.setItem(`reflection-${today}`, JSON.stringify(reflectionData))
      
    } catch (error) {
      console.error('Error saving to database:', error)
      toast.error('데이터 저장 중 오류가 발생했습니다')
      
      // 실패 시 로컬스토리지에만 저장
      const today = new Date().toISOString().split('T')[0]
      localStorage.setItem(`checklist-${today}`, JSON.stringify(items))
      localStorage.setItem(`reflection-${today}`, JSON.stringify(reflectionData))
    } finally {
      setIsSaving(false)
    }
  }

  // 체크리스트 변경 시 데이터베이스에 저장 (디바운스 적용)
  useEffect(() => {
    if (!isLoaded) return

    const timeoutId = setTimeout(() => {
      saveToDatabase(checkedItems, reflection)
    }, 1000) // 1초 후 저장

    return () => clearTimeout(timeoutId)
  }, [checkedItems, isLoaded])

  // 성찰 변경 시 데이터베이스에 저장 (디바운스 적용)
  useEffect(() => {
    if (!isLoaded) return

    const timeoutId = setTimeout(() => {
      saveToDatabase(checkedItems, reflection)
    }, 2000) // 2초 후 저장 (타이핑 완료 기다림)

    return () => clearTimeout(timeoutId)
  }, [reflection, isLoaded])

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  // 통계 계산
  const totalItems = checklistCategories.reduce((sum, category) => sum + category.items.length, 0)
  const completedItems = Object.values(checkedItems).filter(Boolean).length
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  // 카테고리별 통계
  const getCategoryStats = (category: ChecklistCategory) => {
    const categoryItemIds = category.items.map(item => item.id)
    const completedInCategory = categoryItemIds.filter(id => checkedItems[id]).length
    const totalInCategory = categoryItemIds.length
    const percentage = totalInCategory > 0 ? Math.round((completedInCategory / totalInCategory) * 100) : 0
    
    return { completed: completedInCategory, total: totalInCategory, percentage }
  }

  if (!isHydrated || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    )
  }

  return (
    <PageLayout 
      title="일일 웰니스 체크리스트" 
      description="10개 핵심 영역으로 균형잡힌 하루를 만들어보세요"
    >
      {/* 전체 진행률 요약 */}
      <div className="bg-gradient-to-r from-wellness-green to-wellness-blue rounded-xl p-6 text-white mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">오늘의 웰니스 진행률</h2>
            <p className="text-blue-100">10개 영역의 균형잡힌 웰빙 관리</p>
            {isSaving && (
              <p className="text-xs text-blue-200 mt-1">💾 저장 중...</p>
            )}
            {!isSaving && user && (
              <p className="text-xs text-blue-200 mt-1">✅ 자동 저장됨</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{completionPercentage}%</div>
            <div className="text-sm text-blue-100">{completedItems}/{totalItems} 완료</div>
          </div>
        </div>
        
        {/* 진행률 바 */}
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 카테고리별 체크리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {checklistCategories.map((category) => {
          const stats = getCategoryStats(category)
          const isExpanded = expandedCategories[category.id]
          
          return (
            <div key={category.id} className={`rounded-lg border-2 ${category.color} overflow-hidden`}>
              {/* 카테고리 헤더 */}
              <div 
                className="p-4 cursor-pointer hover:bg-opacity-50 transition-colors"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-600">
                        {stats.completed}/{stats.total} 완료 ({stats.percentage}%)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-50 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">{stats.percentage}%</span>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-600 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* 카테고리 아이템들 */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-white bg-opacity-50">
                  <div className="p-4 space-y-3">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id={item.id}
                          checked={checkedItems[item.id] || false}
                          onChange={() => toggleItem(item.id)}
                          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={item.id}
                          className={`flex-1 text-sm cursor-pointer ${
                            checkedItems[item.id] 
                              ? 'line-through text-gray-500' 
                              : 'text-gray-700'
                          }`}
                        >
                          <span className="block">{item.text}</span>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                            item.priority === 'high' 
                              ? 'bg-red-100 text-red-700' 
                              : item.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {item.priority === 'high' ? '높음' : item.priority === 'medium' ? '보통' : '낮음'}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 일일 성찰 섹션 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💭 일일 성찰</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              오늘의 성취:
            </label>
            <textarea
              value={reflection.achievements}
              onChange={(e) => setReflection(prev => ({ ...prev, achievements: e.target.value }))}
              placeholder="오늘 이룬 성과나 기뻤던 일을 적어보세요..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              개선이 필요한 부분:
            </label>
            <textarea
              value={reflection.improvements}
              onChange={(e) => setReflection(prev => ({ ...prev, improvements: e.target.value }))}
              placeholder="내일 더 나아질 수 있는 부분을 생각해보세요..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내일의 주요 목표:
            </label>
            <textarea
              value={reflection.tomorrowGoals}
              onChange={(e) => setReflection(prev => ({ ...prev, tomorrowGoals: e.target.value }))}
              placeholder="내일 집중하고 싶은 목표를 설정해보세요..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}