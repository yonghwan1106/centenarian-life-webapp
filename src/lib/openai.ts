import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface HealthRecommendation {
  title: string
  description: string
  category: 'exercise' | 'nutrition' | 'sleep' | 'mental_health'
  priority: 'low' | 'medium' | 'high'
  confidence: number
}

export async function generateHealthRecommendations(
  healthData: any,
  userProfile: any
): Promise<HealthRecommendation[]> {
  try {
    // 건강 데이터가 없으면 기본 추천 제공
    if (!healthData || healthData.length === 0) {
      return [
        {
          title: "건강 데이터 기록 시작하기",
          description: "정확한 AI 추천을 받으려면 심박수, 혈압, 체중 등의 건강 데이터를 주기적으로 기록해주세요. 데이터가 많을수록 더 정확한 맞춤형 조언을 제공할 수 있습니다.",
          category: "mental_health" as const,
          priority: "high" as const,
          confidence: 0.9
        },
        {
          title: "규칙적인 운동 습관 만들기",
          description: "주 3회 이상, 30분씩 중강도 운동을 시작해보세요. 걷기, 계단 오르기, 가벼운 조깅이 좋은 시작점입니다.",
          category: "exercise" as const,
          priority: "medium" as const,
          confidence: 0.8
        },
        {
          title: "충분한 수면 시간 확보",
          description: "성인은 하루 7-8시간의 수면이 필요합니다. 규칙적인 수면 패턴을 만들어보세요.",
          category: "sleep" as const,
          priority: "medium" as const,
          confidence: 0.8
        }
      ]
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `당신은 한국의 웰니스 전문가입니다. 사용자의 건강 데이터를 분석하고 개인화된 건강 추천을 제공해주세요. 
          
          응답은 반드시 JSON 배열 형식으로 다음 구조를 정확히 따라주세요:
          [
            {
              "title": "추천 제목 (한국어, 20자 이내)",
              "description": "상세 설명 (한국어, 100자 이내, 구체적이고 실행 가능한 조언)",
              "category": "exercise|nutrition|sleep|mental_health",
              "priority": "low|medium|high",
              "confidence": 0.7
            }
          ]
          
          주의사항:
          - 의학적 진단이나 치료는 절대 제공하지 마세요
          - 일반적이고 안전한 건강 조언만 제공하세요
          - 3-4개의 추천을 제공하세요
          - JSON 형식을 정확히 지켜주세요`
        },
        {
          role: "user",
          content: `건강 데이터: ${JSON.stringify(healthData?.slice(0, 5) || [])}
          사용자 프로필: ${JSON.stringify(userProfile || {})}
          
          이 정보를 바탕으로 3-4개의 개인화된 건강 추천을 JSON 배열로 제공해주세요.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No recommendations generated')
    }

    // JSON 파싱 시도
    try {
      const recommendations = JSON.parse(content) as HealthRecommendation[]
      return recommendations.slice(0, 4) // 최대 4개로 제한
    } catch (parseError) {
      console.error('Failed to parse AI recommendations:', parseError)
      return []
    }
  } catch (error) {
    console.error('Error generating health recommendations:', error)
    return []
  }
}

export async function generateHealthInsight(
  healthData: any
): Promise<string> {
  try {
    if (!healthData) {
      return '건강 데이터를 입력하시면 AI가 맞춤형 인사이트를 제공해드릴게요! 🌟'
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `당신은 친근하고 전문적인 한국의 AI 건강 도우미입니다. 
          사용자의 건강 데이터를 분석하고 격려와 함께 간단한 인사이트를 제공해주세요.
          
          응답 조건:
          - 50-80자 이내로 간결하게
          - 친근하고 격려적인 톤
          - 구체적인 수치나 개선점 언급
          - 이모지 1-2개 포함
          - 의학적 진단은 절대 하지 마세요`
        },
        {
          role: "user",
          content: `최근 건강 데이터: ${JSON.stringify(healthData)}
          
          이 데이터를 바탕으로 친근하고 격려적인 건강 인사이트를 제공해주세요.`
        }
      ],
      temperature: 0.8,
      max_tokens: 150,
    })

    const insight = completion.choices[0]?.message?.content
    return insight || '오늘도 건강 관리에 신경써주셔서 감사합니다! 💪'
  } catch (error) {
    console.error('Error generating health insight:', error)
    return '오늘도 건강한 하루 보내세요! 🌟'
  }
}

export default openai