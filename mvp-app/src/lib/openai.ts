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

    // 최근 데이터 분석
    const recentData = Array.isArray(healthData) ? healthData[0] : healthData
    const dataContext = []

    if (recentData.heart_rate) dataContext.push(`심박수: ${recentData.heart_rate}bpm`)
    if (recentData.weight) dataContext.push(`체중: ${recentData.weight}kg`)
    if (recentData.blood_pressure_systolic) dataContext.push(`혈압: ${recentData.blood_pressure_systolic}/${recentData.blood_pressure_diastolic}mmHg`)
    if (recentData.steps) dataContext.push(`걸음수: ${recentData.steps}걸음`)
    if (recentData.sleep_hours) dataContext.push(`수면: ${recentData.sleep_hours}시간`)
    if (recentData.mood_rating) dataContext.push(`기분: ${recentData.mood_rating}/10`)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `당신은 전문적인 한국 AI 건강 코치입니다. 사용자의 건강 데이터를 분석하여 구체적이고 실용적인 건강 추천을 제공하세요.

응답 형식 (반드시 유효한 JSON 배열):
[
  {
    "title": "구체적인 행동 제목",
    "description": "왜 필요한지, 어떻게 실천할지 구체적으로 설명 (50-80자)",
    "category": "exercise|nutrition|sleep|mental_health",
    "priority": "low|medium|high",
    "confidence": 0.7-0.95
  }
]

조건:
- 3-4개의 추천 제공
- 입력된 수치를 바탕으로 구체적인 개선 제안
- 실천 가능한 구체적인 행동 지침
- 한국 문화와 생활 습관 고려
- 의학적 진단이나 처방 절대 금지`
        },
        {
          role: "user",
          content: `사용자의 최근 건강 데이터:
${dataContext.join('\n')}

이 데이터를 분석하여 구체적이고 개인화된 건강 추천을 JSON 배열로 제공해주세요.`
        }
      ],
      temperature: 0.6,
      max_tokens: 1000,
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

    // 데이터 요약
    const dataPoints = []
    if (healthData.heart_rate) dataPoints.push(`심박수 ${healthData.heart_rate}bpm`)
    if (healthData.weight) dataPoints.push(`체중 ${healthData.weight}kg`)
    if (healthData.blood_pressure_systolic && healthData.blood_pressure_diastolic) {
      dataPoints.push(`혈압 ${healthData.blood_pressure_systolic}/${healthData.blood_pressure_diastolic}mmHg`)
    }
    if (healthData.steps) dataPoints.push(`걸음수 ${healthData.steps}걸음`)
    if (healthData.sleep_hours) dataPoints.push(`수면 ${healthData.sleep_hours}시간`)
    if (healthData.mood_rating) dataPoints.push(`기분 ${healthData.mood_rating}/10`)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `당신은 전문적이면서도 친근한 한국 AI 건강 코치입니다.

          입력된 건강 데이터를 분석하여 구체적이고 개인화된 인사이트를 제공하세요.

          조건:
          - 입력된 실제 수치를 언급하며 구체적으로 분석
          - 2-3문장으로 구성 (60-100자)
          - 건강 상태에 대한 피드백과 격려를 포함
          - 친근하고 긍정적인 톤
          - 이모지 1-2개 사용
          - 의학적 진단이나 처방은 절대 금지
          - "정상", "비정상" 같은 진단적 표현 금지`
        },
        {
          role: "user",
          content: `오늘의 건강 데이터:
${dataPoints.join('\n')}

이 데이터를 바탕으로 구체적이고 개인화된 건강 인사이트를 제공해주세요.`
        }
      ],
      temperature: 0.7,
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