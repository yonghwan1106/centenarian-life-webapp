# 🚀 센테니얼 라이프 MVP 배포 가이드

## Vercel 배포 방법

### 1. GitHub 저장소 연결
- [Vercel 대시보드](https://vercel.com/dashboard)에 접속
- "New Project" 클릭
- "Import Git Repository" 선택
- `yonghwan1106/centenarian-life-webapp` 저장소 선택

### 2. 환경 변수 설정
Vercel 프로젝트 설정에서 다음 환경 변수들을 추가하세요:

#### 필수 환경 변수
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

⚠️ **보안 주의**: 실제 키는 개인적으로 공유하거나 `.env.local` 파일을 참조하세요.

#### 선택 환경 변수 (기능 확장용)
```
GEMINI_API_KEY=your_gemini_api_key
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
KAKAO_JAVASCRIPT_KEY=your_kakao_javascript_key
```

### 3. 배포 설정
- Framework Preset: **Next.js**
- Build Command: `npm run build` (기본값)
- Output Directory: `.next` (기본값)
- Install Command: `npm install` (기본값)

### 4. 도메인 설정
배포 완료 후:
- Vercel에서 자동 생성된 도메인 확인
- 필요시 커스텀 도메인 연결
- Supabase 설정에서 허용된 도메인에 추가

## 🎯 배포 후 확인 사항

### ✅ 기능 테스트 체크리스트
- [ ] 회원가입/로그인 작동
- [ ] 건강 데이터 입력/저장
- [ ] AI 인사이트 생성
- [ ] 프로필 저장 기능
- [ ] 커뮤니티 게시글 작성
- [ ] 댓글 및 좋아요 기능
- [ ] 대시보드 차트 표시

### 🔧 문제 해결
- **500 에러**: 환경 변수 확인
- **인증 실패**: Supabase URL/키 확인
- **AI 기능 실패**: OpenAI API 키 확인
- **빌드 실패**: TypeScript 에러 확인

## 📱 MVP 기능 현황

### ✅ 완성된 기능
- 완전한 인증 시스템 (Supabase Auth)
- 건강 데이터 추적 및 시각화
- AI 기반 건강 인사이트 (OpenAI GPT-4)  
- 커뮤니티 플랫폼 (게시글/댓글/좋아요)
- 사용자 프로필 관리
- 반응형 대시보드
- 통합 네비게이션

### 🔄 향후 개선 예정
- 웨어러블 디바이스 연동
- 고급 데이터 분석
- 소셜 기능 확장
- 다국어 지원
- 모바일 앱