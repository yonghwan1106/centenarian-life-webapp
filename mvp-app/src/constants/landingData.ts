// Hero Slides Data
export const HERO_SLIDES = [
  {
    id: 1,
    title: "건강한 100세를 위한",
    subtitle: "AI 웰니스 동반자",
    description: "인공지능이 분석한 맞춤형 건강 조언과 체계적인 데이터 관리로 여러분의 건강한 100세 인생을 함께 만들어갑니다.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    gradient: "from-blue-900/70 to-green-900/70"
  },
  {
    id: 2,
    title: "스마트한 건강 관리",
    subtitle: "데이터로 보는 나의 건강",
    description: "심박수, 혈압, 수면 패턴까지 모든 건강 지표를 체계적으로 추적하고 인사이트를 얻으세요.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    gradient: "from-purple-900/70 to-blue-900/70"
  },
  {
    id: 3,
    title: "AI가 제안하는",
    subtitle: "맞춤형 건강 솔루션",
    description: "OpenAI GPT-4가 분석한 개인화된 운동, 영양, 수면 가이드로 더 나은 라이프스타일을 만들어보세요.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2099&q=80",
    gradient: "from-green-900/70 to-teal-900/70"
  },
  {
    id: 4,
    title: "함께하는 건강 여정",
    subtitle: "커뮤니티와 소통하며",
    description: "같은 목표를 가진 사람들과 경험을 나누고 서로 동기부여하며 함께 성장하는 건강한 라이프스타일.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2120&q=80",
    gradient: "from-orange-900/70 to-red-900/70"
  }
] as const;

// Features Data
export const FEATURES = [
  {
    icon: "📊",
    title: "종합 건강 추적",
    description: "심박수, 혈압, 체중, 걸음수, 수면, 기분까지 모든 건강 지표를 체계적으로 관리하세요.",
    gradient: "from-blue-50 to-blue-100",
    benefits: [
      "실시간 데이터 입력",
      "인터랙티브 차트",
      "추세 분석"
    ]
  },
  {
    icon: "🤖",
    title: "AI 맞춤 조언",
    description: "OpenAI GPT-4가 분석한 개인화된 건강 추천으로 더 나은 라이프스타일을 만들어보세요.",
    gradient: "from-green-50 to-green-100",
    benefits: [
      "운동 추천",
      "영양 가이드",
      "수면 개선 팁"
    ]
  },
  {
    icon: "👥",
    title: "커뮤니티",
    description: "같은 목표를 가진 사람들과 경험을 나누고 서로 동기부여하며 함께 성장하세요.",
    gradient: "from-purple-50 to-purple-100",
    benefits: [
      "경험 공유",
      "실시간 댓글",
      "좋아요 시스템"
    ]
  }
] as const;

// Dashboard Preview Data
export const DASHBOARD_STATS = [
  { label: "총 기록", value: "156", unit: "개" },
  { label: "평균 심박수", value: "72", unit: "bpm" },
  { label: "평균 수면", value: "7.2", unit: "시간" },
  { label: "활동 점수", value: "8.5", unit: "/10" }
] as const;

// CTA (Call to Action) Data
export const CTA_BUTTONS = {
  primary: {
    text: "무료로 시작하기 🚀",
    variant: "primary" as const
  },
  secondary: {
    text: "기능 살펴보기",
    variant: "secondary" as const
  }
} as const; 