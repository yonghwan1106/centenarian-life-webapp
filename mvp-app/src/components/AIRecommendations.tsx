'use client'

import { useRecommendations } from '@/hooks'
import { formatters } from '@/utils'

export default function AIRecommendations() {
  const { 
    recommendations, 
    loading, 
    generating, 
    error, 
    generateNewRecommendations, 
    markAsRead 
  } = useRecommendations()



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
                  <span className="text-2xl">{formatters.getCategoryIcon(recommendation.category)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">
                        {formatters.formatHealthCategory(recommendation.category)}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${formatters.getPriorityColor(recommendation.priority)}`}>
                        {formatters.formatPriorityLevel(recommendation.priority)}
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
                {formatters.formatRelativeTime(recommendation.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}