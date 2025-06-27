# 🌟 센테니얼 라이프 (Centenarian Life) MVP

> AI 기반 웰니스 동반자 - 건강한 100세를 위한 스마트 헬스케어 플랫폼

## 🚀 Live Demo
- **Production**: [배포 URL 여기에 추가 예정]
- **GitHub**: [yonghwan1106/centenarian-life-webapp](https://github.com/yonghwan1106/centenarian-life-webapp)

## ✨ 주요 기능

### 🔐 완전한 인증 시스템
- Supabase Auth 기반 회원가입/로그인
- 이메일 인증 및 보안 관리
- 사용자 세션 및 권한 관리

### 📊 건강 데이터 추적
- **종합 건강 지표**: 심박수, 혈압, 체중, 걸음수, 수면, 기분
- **실시간 데이터 시각화**: Recharts 기반 인터랙티브 차트
- **대시보드**: 건강 통계 요약 및 추세 분석

### 🤖 AI 기반 인사이트
- **OpenAI GPT-4** 기반 개인화된 건강 조언
- 건강 데이터 분석을 통한 맞춤형 추천
- 운동, 영양, 수면, 정신건강 카테고리별 인사이트

### 👥 커뮤니티 플랫폼
- 게시글 작성/조회/수정/삭제
- 실시간 댓글 시스템
- 좋아요 및 카테고리 필터링
- 사용자 프로필 연동

### 👤 프로필 관리
- 개인 정보 설정 (나이, 성별, 키, 체중)
- 활동 수준 및 건강 목표 관리
- 기존 질환 추적
- 실시간 저장 및 성공 알림

## 🛠 기술 스택

### Frontend
- **Next.js 14** - App Router, TypeScript
- **React 18** - 컴포넌트 기반 UI
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Recharts** - 데이터 시각화
- **Framer Motion** - 애니메이션

### Backend & Database
- **Supabase** - 인증, 데이터베이스, 실시간 기능
- **PostgreSQL** - 관계형 데이터베이스
- **Row Level Security** - 데이터 보안

### AI & APIs
- **OpenAI GPT-4** - AI 건강 인사이트
- **Next.js API Routes** - 서버리스 API

### Development
- **TypeScript** - 타입 안정성
- **ESLint** - 코드 품질
- **Git** - 버전 관리

## 🎯 MVP 완성도: 95%

### ✅ 완성된 핵심 기능
1. **대시보드 & 시각화** - Recharts 기반 인터랙티브 차트
2. **프로필 관리** - 완전한 사용자 설정 시스템  
3. **통합 네비게이션** - 일관된 UX/UI
4. **AI 추천 시스템** - GPT-4 기반 맞춤 조언
5. **커뮤니티 플랫폼** - 소셜 기능 완비
6. **건강 데이터 관리** - 종합 추적 시스템

### 🔧 최근 수정사항
- ✅ 프로필 저장 기능 수정 (upsert 로직)
- ✅ AI 인사이트 에러 해결 (getLatestHealthData 수정)
- ✅ React hydration 문제 해결
- ✅ 메시지 알림 시스템 추가

## 🚀 배포 및 실행

### 로컬 개발 환경
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 타입 체크
npm run type-check

# 프로덕션 빌드
npm run build
```

### 환경 변수 설정
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (필수)
OPENAI_API_KEY=your_openai_api_key
```

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

## 📱 화면 구성

### 🏠 대시보드
- 건강 통계 요약 카드
- 체중/심박수 추세 차트
- 수면 시간 및 걸음수 그래프
- 빠른 액션 링크

### 📊 건강 데이터
- 종합 건강 정보 입력 폼
- 실시간 데이터 목록
- 카테고리별 필터링

### 🤖 AI 인사이트
- 건강 데이터 기반 AI 분석
- 개인화된 건강 조언
- 카테고리별 추천사항

### 👥 커뮤니티
- 게시글 목록 및 작성
- 실시간 댓글 시스템
- 좋아요 및 카테고리 필터

### 👤 프로필
- 개인 정보 관리
- 건강 목표 설정
- 의료 정보 추적

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary Blue**: `#3B82F6` (wellness-blue)
- **Secondary Green**: `#10B981` (wellness-green)
- **Accent Purple**: `#8B5CF6` (wellness-purple)

### 반응형 디자인
- **Mobile First**: 모바일 우선 설계
- **Breakpoints**: Tailwind CSS 기본 브레이크포인트
- **Flexible Layout**: 다양한 화면 크기 대응

## 🔐 보안 및 성능

### 보안
- **Row Level Security**: Supabase RLS 정책
- **인증 기반 접근 제어**: 사용자별 데이터 격리
- **API 보안**: Bearer 토큰 인증

### 성능
- **Server Side Rendering**: Next.js SSR
- **Static Generation**: 정적 페이지 생성
- **Code Splitting**: 자동 코드 분할
- **Image Optimization**: Next.js 이미지 최적화

## 🚧 향후 로드맵

### Phase 1 (현재 - MVP)
- ✅ 핵심 기능 구현 완료
- ✅ 배포 준비 완료

### Phase 2 (단기)
- 📱 모바일 앱 개발
- 🔔 푸시 알림 시스템
- 📈 고급 분석 대시보드

### Phase 3 (중기)  
- ⌚ 웨어러블 연동 (Apple Health, Samsung Health)
- 🤝 소셜 기능 확장 (친구, 그룹 챌린지)
- 🌐 다국어 지원

### Phase 4 (장기)
- 🤖 고급 AI 기능 (머신러닝 예측)
- 🏥 의료진 연동
- 📊 빅데이터 분석

## 👨‍💻 개발자 정보

- **개발**: Claude Code AI Assistant
- **기획**: 1인 스타트업 프로젝트
- **목표**: 건강한 100세를 위한 AI 웰니스 플랫폼

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](./LICENSE) 파일을 확인하세요.

---

<div align="center">

**🌟 건강한 100세, 센테니얼 라이프와 함께하세요! 🌟**

[🚀 Live Demo](#) | [📖 API Docs](#) | [🎨 Design System](#) | [🤝 Contributing](#)

</div>