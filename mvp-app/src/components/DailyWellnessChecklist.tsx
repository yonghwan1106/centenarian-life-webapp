'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'

interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string
  icon: string
  completed: boolean
  points: number
}

interface WellnessCategory {
  name: string
  icon: string
  color: string
  items: ChecklistItem[]
}

const checklistData: WellnessCategory[] = [
  {
    name: '건강 관리',
    icon: '💪',
    color: 'bg-red-500',
    items: [
      { id: '1-1', category: 'health', title: '아침 체조 또는 스트레칭', description: '10-15분', icon: '🧘‍♀️', completed: false, points: 10 },
      { id: '1-2', category: 'health', title: '30분 이상 중강도 운동', description: '걷기, 수영, 자전거 등', icon: '🏃‍♂️', completed: false, points: 20 },
      { id: '1-3', category: 'health', title: '8잔 이상의 물 섭취', description: '하루 권장량', icon: '💧', completed: false, points: 10 },
      { id: '1-4', category: 'health', title: '균형 잡힌 식사 3회', description: '채소, 단백질, 전곡류 포함', icon: '🥗', completed: false, points: 15 },
      { id: '1-5', category: 'health', title: '충분한 수면', description: '7-8시간 목표', icon: '😴', completed: false, points: 15 }
    ]
  },
  {
    name: '재정 관리',
    icon: '💰',
    color: 'bg-green-500',
    items: [
      { id: '2-1', category: 'finance', title: '일일 지출 기록', description: '가계부 작성', icon: '📝', completed: false, points: 5 },
      { id: '2-2', category: 'finance', title: '예산 대비 지출 확인', description: '목표 대비 실제 지출', icon: '📊', completed: false, points: 10 }
    ]
  },
  {
    name: '관계 유지',
    icon: '👥',
    color: 'bg-blue-500',
    items: [
      { id: '3-1', category: 'relationship', title: '가족/친구와 연락', description: '전화, 문자, 이메일 등', icon: '📞', completed: false, points: 10 },
      { id: '3-2', category: 'relationship', title: '대면 만남 계획 또는 실행', description: '주 1-2회 권장', icon: '🤝', completed: false, points: 15 }
    ]
  },
  {
    name: '지속적 학습과 성장',
    icon: '📚',
    color: 'bg-purple-500',
    items: [
      { id: '4-1', category: 'learning', title: '새로운 기술/지식 학습', description: '30분-1시간', icon: '🧠', completed: false, points: 15 },
      { id: '4-2', category: 'learning', title: '독서', description: '30분 이상', icon: '📖', completed: false, points: 10 }
    ]
  },
  {
    name: '취미 및 여가 활동',
    icon: '🎨',
    color: 'bg-pink-500',
    items: [
      { id: '5-1', category: 'hobby', title: '즐거운 취미 활동', description: '1시간 이상', icon: '🎭', completed: false, points: 15 },
      { id: '5-2', category: 'hobby', title: '문화 활동 참여', description: '영화, 전시회 등', icon: '🎪', completed: false, points: 10 }
    ]
  },
  {
    name: '사회적 참여와 기여',
    icon: '🤲',
    color: 'bg-yellow-500',
    items: [
      { id: '6-1', category: 'social', title: '지역 사회 활동 또는 봉사', description: '주 1회 이상 권장', icon: '🌍', completed: false, points: 20 },
      { id: '6-2', category: 'social', title: '멘토링 또는 지식 공유', description: '경험과 지식 나누기', icon: '👨‍🏫', completed: false, points: 15 }
    ]
  },
  {
    name: '정신적 웰빙',
    icon: '🧘',
    color: 'bg-indigo-500',
    items: [
      { id: '7-1', category: 'mental', title: '명상 또는 마음 챙김 실천', description: '15-20분', icon: '🕉️', completed: false, points: 15 },
      { id: '7-2', category: 'mental', title: '감사일기 작성', description: '하루 3가지 감사한 일', icon: '📔', completed: false, points: 10 },
      { id: '7-3', category: 'mental', title: '스트레스 관리 기법 실천', description: '심호흡, 근육 이완 등', icon: '😌', completed: false, points: 10 }
    ]
  },
  {
    name: '긍정적 마인드셋',
    icon: '✨',
    color: 'bg-orange-500',
    items: [
      { id: '8-1', category: 'mindset', title: '하루 3가지 긍정적인 일 찾기', description: '일상 속 좋은 일들', icon: '🌟', completed: false, points: 10 },
      { id: '8-2', category: 'mindset', title: '자기 긍정 확언 실천', description: '나에게 격려 메시지', icon: '💫', completed: false, points: 10 }
    ]
  },
  {
    name: '일과 삶의 균형',
    icon: '⚖️',
    color: 'bg-teal-500',
    items: [
      { id: '9-1', category: 'balance', title: '업무 시간과 개인 시간 구분', description: '명확한 경계 설정', icon: '⏰', completed: false, points: 10 },
      { id: '9-2', category: 'balance', title: '휴식과 회복 시간 확보', description: '충분한 재충전', icon: '🛋️', completed: false, points: 10 }
    ]
  },
  {
    name: '주거 환경 관리',
    icon: '🏠',
    color: 'bg-gray-500',
    items: [
      { id: '10-1', category: 'environment', title: '간단한 집안 정리정돈', description: '15-20분', icon: '🧹', completed: false, points: 5 },
      { id: '10-2', category: 'environment', title: '환기 및 실내 공기질 관리', description: '신선한 공기', icon: '🌬️', completed: false, points: 5 }
    ]
  }
]

export default function DailyWellnessChecklist() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<WellnessCategory[]>(checklistData)
  const [totalPoints, setTotalPoints] = useState(0)
  const [completedItems, setCompletedItems] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [wellnessScore, setWellnessScore] = useState(0)

  useEffect(() => {
    calculateStats()
  }, [categories])

  const calculateStats = () => {
    let completed = 0
    let total = 0
    let points = 0

    categories.forEach(category => {
      category.items.forEach(item => {
        total++
        if (item.completed) {
          completed++
          points += item.points
        }
      })
    })

    setCompletedItems(completed)
    setTotalItems(total)
    setTotalPoints(points)
    setWellnessScore(total > 0 ? Math.round((completed / total) * 100) : 0)
  }

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].items[itemIndex].completed = 
      !newCategories[categoryIndex].items[itemIndex].completed
    setCategories(newCategories)
  }

  const getCategoryProgress = (category: WellnessCategory) => {
    const completed = category.items.filter(item => item.completed).length
    const total = category.items.length
    return total > 0 ? (completed / total) * 100 : 0
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 전체 진행률 요약 */}
      <div className="bg-gradient-to-r from-wellness-blue to-wellness-green rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{wellnessScore}%</div>
            <div className="text-sm opacity-90">오늘의 웰니스 점수</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{completedItems}/{totalItems}</div>
            <div className="text-sm opacity-90">완료된 항목</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{totalPoints}</div>
            <div className="text-sm opacity-90">획득 포인트</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">🏆</div>
            <div className="text-sm opacity-90">
              {wellnessScore >= 80 ? '훌륭해요!' : 
               wellnessScore >= 60 ? '잘하고 있어요!' :
               wellnessScore >= 40 ? '조금 더 화이팅!' : '시작이 반이에요!'}
            </div>
          </div>
        </div>
        
        {/* 전체 진행률 바 */}
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${wellnessScore}%` }}
          />
        </div>
      </div>

      {/* 카테고리별 체크리스트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category, categoryIndex) => (
          <div key={category.name} className="bg-white rounded-lg shadow-lg border">
            {/* 카테고리 헤더 */}
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                </div>
                <div className="text-sm text-gray-600">
                  {category.items.filter(item => item.completed).length}/{category.items.length}
                </div>
              </div>
              
              {/* 카테고리 진행률 바 */}
              <div className="mt-2 bg-gray-200 rounded-full h-1">
                <div 
                  className={`${category.color} rounded-full h-1 transition-all duration-300`}
                  style={{ width: `${getCategoryProgress(category)}%` }}
                />
              </div>
            </div>

            {/* 체크리스트 항목들 */}
            <div className="p-4 space-y-3">
              {category.items.map((item, itemIndex) => (
                <div key={item.id} className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleItem(categoryIndex, itemIndex)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      item.completed 
                        ? 'bg-wellness-green border-wellness-green text-white' 
                        : 'border-gray-300 hover:border-wellness-green'
                    }`}
                  >
                    {item.completed && <span className="text-xs">✓</span>}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{item.icon}</span>
                      <h4 className={`font-medium ${
                        item.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                      }`}>
                        {item.title}
                      </h4>
                      <span className="text-xs bg-wellness-blue text-white px-2 py-1 rounded-full">
                        +{item.points}pt
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 일일 성찰 섹션 */}
      <div className="bg-white rounded-lg shadow-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📝</span>
          일일 성찰
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              오늘의 성취:
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
              rows={2}
              placeholder="오늘 잘한 일이나 성취한 것을 기록해보세요..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              개선이 필요한 부분:
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
              rows={2}
              placeholder="내일 더 잘하고 싶은 부분을 적어보세요..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내일의 주요 목표:
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wellness-blue focus:border-transparent"
              rows={2}
              placeholder="내일 중점적으로 할 일들을 계획해보세요..."
            />
          </div>
          
          <button className="w-full bg-wellness-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            성찰 내용 저장
          </button>
        </div>
      </div>
    </div>
  )
}