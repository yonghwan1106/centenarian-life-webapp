# 센테니얼 라이프 MVP

1인 스타트업이 만드는 AI 기반 웰니스 앱

## 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API (GPT-4)
- **Authentication**: Supabase Auth
- **Hosting**: Vercel

## 개발 환경 설정

### 1. 의존성 설치
```bash
# 공용 node_modules 사용을 위한 심볼릭 링크 생성 (Windows)
./symlink-node-modules.bat

# 또는 Linux/Mac에서는 이미 심볼릭 링크가 생성되어 있음
```

### 2. 환경 변수 설정
```bash
cp .env.local.example .env.local
```

다음 환경 변수를 설정하세요:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 서비스 역할 키
- `OPENAI_API_KEY`: OpenAI API 키

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 데이터베이스 스키마 설정
Supabase 대시보드에서 다음 테이블을 생성하세요:
- `users`: 사용자 정보
- `health_data`: 건강 데이터
- `user_profiles`: 사용자 프로필
- `health_recommendations`: AI 추천

## 주요 기능

### MVP Phase 1
- [x] 기본 프로젝트 구조 설정
- [ ] 사용자 인증 (Supabase Auth)
- [ ] 건강 데이터 입력 및 저장
- [ ] AI 기반 건강 추천
- [ ] 기본 대시보드

### MVP Phase 2
- [ ] 커뮤니티 기능
- [ ] 데이터 시각화
- [ ] 푸시 알림
- [ ] 모바일 최적화

## 개발 가이드

### 컴포넌트 구조
```
src/
├── app/                 # Next.js 13+ App Router
├── components/          # 재사용 가능한 컴포넌트
├── lib/                 # 유틸리티 함수
└── types/               # TypeScript 타입 정의
```

### API 라우트
- `/api/health`: 건강 데이터 CRUD
- `/api/recommendations`: AI 추천 생성
- `/api/auth`: 인증 관련 API

## 배포

### Vercel 배포
```bash
npm run build
vercel --prod
```

### 환경 변수
프로덕션 환경에서 다음 환경 변수를 설정하세요:
- Supabase 설정
- OpenAI API 키
- 기타 보안 키

## 라이센스

MIT