# 센테니얼 라이프 MVP - Claude 개발 가이드

## 프로젝트 개요
- **프로젝트명**: 센테니얼 라이프 (Centenarian Life) MVP
- **목적**: 1인 스타트업 AI 기반 웰니스 앱
- **기술 스택**: Next.js 14, TypeScript, Tailwind CSS, Supabase, OpenAI API, Recharts
- **현재 상태**: ✅ MVP 95% 완성 (거의 완료!)

## 개발 환경 설정

### 필수 명령어
```bash
# 개발 서버 실행
npm run dev

# 타입 체크
npm run type-check

# 빌드
npm run build

# 린트
npm run lint
```

### 환경 변수 (필수)
`.env.local` 파일에서 다음 키들이 완벽하게 설정됨:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

## 현재 구현 완료된 기능

### ✅ 인증 시스템 (완성)
- 회원가입/로그인 (Supabase Auth)
- 비밀번호 재설정
- 보호된 라우트
- 사용자 세션 관리

### ✅ 건강 데이터 관리 (완성)
- 종합 건강 데이터 입력 폼 (심박수, 혈압, 체중, 걸음수, 수면, 기분)
- 실시간 데이터 목록 표시
- Supabase 실시간 저장
- 데이터 검증 및 에러 핸들링

### ✅ AI 기능 (완성)
- OpenAI GPT-4 기반 건강 추천 시스템
- 개인화된 건강 인사이트 생성
- 카테고리별 추천 (운동, 영양, 수면, 정신건강)
- 우선순위 및 신뢰도 스코어링

### ✅ 커뮤니티 기능 (완성)
- 게시글 작성/조회/수정/삭제
- 댓글 시스템 (실시간)
- 좋아요 기능
- 카테고리 필터링
- 사용자 프로필 연동

### ✅ 대시보드 & 데이터 시각화 (NEW!)
- **건강 통계 요약**: 총 기록수, 평균 체중/심박수/수면시간
- **인터랙티브 차트**: 
  - 체중 & 심박수 추세 (Line Chart)
  - 수면 시간 (Bar Chart) 
  - 걸음수 추적 (Bar Chart)
- **기분 상태 표시**: 이모지와 점수로 시각화
- **반응형 디자인**: 모바일/데스크톱 완벽 대응
- **빈 상태 처리**: 데이터 없을 때 친근한 안내

### ✅ 사용자 프로필 관리 (NEW!)
- **기본 정보**: 나이, 성별, 키, 체중 설정
- **활동 수준**: 5단계 활동 레벨 선택
- **건강 목표**: 동적 목표 추가/제거 (태그 형태)
- **기존 질환**: 의료 조건 관리 시스템
- **실시간 저장**: Toast 알림과 함께 즉시 DB 업데이트
- **전용 API**: `/api/profile` (GET, PUT) 보안 인증

### ✅ 통합 네비게이션 시스템 (NEW!)
- **공통 컴포넌트**: `AppNavigation` + `PageLayout`
- **일관된 디자인**: 모든 페이지 동일한 헤더/네비게이션
- **활성 페이지 표시**: 현재 페이지 하이라이트
- **반응형**: 모바일에서 스크롤 가능한 탭
- **아이콘 포함**: 각 메뉴에 의미있는 이모지

### ✅ 데이터베이스 스키마 (완성)
- 완전한 테이블 구조 (10개 테이블)
- RLS 보안 정책 완비
- 자동 트리거 및 통계 업데이트
- 성능 최적화 인덱스

## 🎉 MVP 완성도 95% - 거의 완료!

### ✅ 최근 완성된 주요 기능들
1. **대시보드 데이터 시각화** ✅
   - Recharts 기반 인터랙티브 차트
   - 건강 통계 요약 카드
   - 반응형 디자인

2. **사용자 프로필 관리** ✅
   - 완전한 프로필 설정 UI
   - 동적 목표/질환 관리
   - 전용 API 엔드포인트

3. **통합 네비게이션** ✅
   - 일관된 네비게이션 시스템
   - 모든 링크 정상 작동
   - 활성 페이지 하이라이트

### 🔧 남은 작업 (5%)
1. **환경 설정 문서화**
   - `.env.local.example` 파일 생성
   - 새 개발자를 위한 설정 가이드

2. **최종 테스트 및 최적화**
   - 성능 최적화
   - 모바일 UX 개선
   - 에러 핸들링 보완

## 파일 구조 및 컨벤션

### 주요 디렉토리
```
src/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API 라우트
│   │   ├── ai/           # AI 관련 API
│   │   ├── community/    # 커뮤니티 API
│   │   ├── profile/      # 프로필 API (NEW!)
│   │   └── recommendations/ # 추천 API
│   ├── health/           # 건강 데이터 페이지
│   ├── community/        # 커뮤니티 페이지
│   ├── ai/              # AI 인사이트 페이지
│   ├── profile/         # 프로필 관리 페이지 (NEW!)
│   └── page.tsx         # 대시보드 홈페이지
├── components/           # 재사용 컴포넌트
│   ├── AppNavigation.tsx    # 통합 네비게이션 (NEW!)
│   ├── HealthDashboard.tsx  # 대시보드 차트 (NEW!)
│   ├── UserProfileForm.tsx  # 프로필 폼 (NEW!)
│   ├── AuthProvider.tsx     # 인증 컨텍스트
│   ├── HealthDataForm.tsx   # 건강 데이터 입력
│   ├── AIRecommendations.tsx # AI 추천
│   └── CommunityPosts.tsx   # 커뮤니티 게시글
├── lib/                  # 유틸리티 함수
│   ├── auth.ts          # 인증 로직
│   ├── database.ts      # DB 함수 (확장됨)
│   ├── openai.ts        # AI 통합
│   └── supabase.ts      # Supabase 클라이언트
└── types/               # TypeScript 타입 정의
```

### API 라우트
- `/api/ai/insights` - AI 건강 인사이트 생성
- `/api/recommendations` - 건강 추천 CRUD
- `/api/recommendations/[id]` - 개별 추천 관리
- `/api/profile` - 사용자 프로필 CRUD (NEW!)
- `/api/community/posts` - 커뮤니티 게시글 CRUD
- `/api/community/posts/[id]/comments` - 댓글 CRUD
- `/api/community/posts/[id]/like` - 좋아요 토글

## 개발 시 주의사항

### 코딩 컨벤션
- TypeScript 엄격 모드 사용
- 한국어 UI 텍스트
- Tailwind CSS 유틸리티 클래스 사용
- 에러 핸들링 필수

### 보안 고려사항
- Supabase RLS 정책 준수
- 인증된 사용자만 데이터 접근
- 민감한 정보 로깅 금지

### 성능 최적화
- 컴포넌트 lazy loading
- API 응답 캐싱 고려
- 이미지 최적화

## 테스트 및 배포

### 로컬 테스트
```bash
# 타입 체크 (에러 없어야 함)
npm run type-check

# 빌드 테스트
npm run build

# 린트 체크
npm run lint
```

### 배포 (Vercel)
```bash
# 프로덕션 빌드
npm run build

# Vercel 배포
vercel --prod
```

## 🎯 MVP 완성 현황

### ✅ 완료된 핵심 기능들
1. **대시보드 & 시각화** ✅ - Recharts 기반 인터랙티브 차트
2. **프로필 관리** ✅ - 완전한 사용자 설정 시스템  
3. **통합 네비게이션** ✅ - 일관된 UX/UI
4. **AI 추천 시스템** ✅ - GPT-4 기반 맞춤 조언
5. **커뮤니티 플랫폼** ✅ - 소셜 기능 완비
6. **건강 데이터 관리** ✅ - 종합 추적 시스템

### 🔧 남은 작업 (5%)
1. **최종 최적화** - 성능 및 모바일 UX 개선
2. **프로덕션 준비** - 배포 최적화

### 🚀 향후 확장 계획  
1. **고급 분석**: 머신러닝 기반 예측
2. **소셜 기능**: 친구 추가, 그룹 챌린지
3. **웨어러블 연동**: Apple Health, Samsung Health
4. **다국어**: 영어, 일본어 지원

## 문제 해결

### 자주 발생하는 이슈
- **타입 에러**: `npm run type-check`로 확인
- **빌드 실패**: 환경 변수 확인
- **Supabase 연결**: 키 및 URL 검증
- **AI API**: OpenAI 키 및 사용량 확인

### 유용한 명령어
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json && npm install

# 캐시 정리
npm run build -- --debug

# 로그 확인
tail -f server.log
```

## 연락처 및 문서
- **README**: 프로젝트 전체 개요
- **데이터베이스**: `/database/schema.sql` 참조
- **API 문서**: 각 라우트 파일 내 주석 참조