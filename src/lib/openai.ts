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
      model: "gpt-3.5-turbo", // 더 빠른 모델 사용
      messages: [
        {
          role: "system",
          content: `건강 추천을 JSON 배열로 제공하세요:
          [{"title":"제목","description":"설명","category":"exercise|nutrition|sleep|mental_health","priority":"low|medium|high","confidence":0.8}]
          
          - 2-3개 추천만
          - 안전한 일반 조언만
          - 의학적 진단 금지`
        },
        {
          role: "user",
          content: `데이터: ${JSON.stringify(healthData?.slice(0, 3) || [])}
          
          JSON 배열로 2-3개 건강 추천해주세요.`
        }
      ],
      temperature: 0.5,
      max_tokens: 800, // 토큰 수 줄임
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
      model: "gpt-3.5-turbo", // 더 빠른 모델 사용
      messages: [
        {
          role: "system",
          content: `당신은 친근한 한국 AI 건강 도우미입니다. 간단하고 격려적인 인사이트를 제공하세요.
          
          조건: 30-50자, 친근한 톤, 이모지 1개, 의학적 진단 금지`
        },
        {
          role: "user",
          content: `건강 데이터: 심박수=${healthData.heart_rate}, 체중=${healthData.weight}, 수면=${healthData.sleep_hours}시간, 걸음수=${healthData.steps}
          
          간단한 격려 메시지를 주세요.`
        }
      ],
      temperature: 0.7,
      max_tokens: 100, // 토큰 수 줄임
    })

    const insight = completion.choices[0]?.message?.content
    return insight || '오늘도 건강 관리에 신경써주셔서 감사합니다! 💪'
  } catch (error) {
    console.error('Error generating health insight:', error)
    return '오늘도 건강한 하루 보내세요! 🌟'
  }
}

export default openai