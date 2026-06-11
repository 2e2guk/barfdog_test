# 2026-1-CECD1-3-CHEDODAE-09

2026-1 종합설계1 3분반 체도대 팀 레포지토리

## 프로젝트 구조

```text
.
├── backend/    # Express + Gemini API + PHR/NGS RAG 백엔드
├── frontend/   # Next.js 프론트엔드 앱
└── README.md
```

## 프론트엔드 실행 방법

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 아래 주소 열기

```text
http://localhost:3000
```

프로덕션 빌드 확인:

```bash
cd frontend
npm run build
npm run start
```

린트 확인:

```bash
cd frontend
npm run lint
```

## API 연동 실행 방법

Gemini API 및 PHR/NGS RAG 연동은 `backend/` 폴더에 존재

```bash
cd backend
npm install
npm run dev
```

`backend/.env`에 Gemini API 키 설정 필요. 실제 키는 GitHub에 올리지 않습니다.

```text
GEMINI_API_KEY=your_api_key_here
CORS_ORIGIN=http://localhost:3000
```

프론트엔드 채팅 화면은 기본적으로 아래 API 호출

```text
http://localhost:5000/api/chat
```

다른 백엔드 주소 사용 시 `frontend/.env.local`에 아래 값 설정

```text
NEXT_PUBLIC_AI_CHAT_API_URL=http://localhost:5000/api/chat
```

이미 3000/5000 포트를 다른 서버가 쓰고 있다면 아래처럼 3001/5001 조합으로 실행할 수 있습니다.

```bash
cd backend
PORT=5001 CORS_ORIGIN=http://localhost:3001 npm run dev
```

```bash
cd frontend
NEXT_PUBLIC_AI_CHAT_API_URL=http://localhost:5001/api/chat npm run dev -- -p 3001
```

### RAG 동작 방식

파인튜닝 대신 `backend/data/rag-documents.json`의 PHR, NGS, 식단 근거를 검색해 Gemini 프롬프트에 주입합니다.
이 파일은 GitHub 공개를 위해 원본 NGS 100마리 데이터를 전부 익명화한 코퍼스입니다. 반려견 이름, 정확한 생년월일, 알러지원 원문, 자유서술 치료 내용, 원본 row 번호는 포함하지 않습니다.

- 사용자 질문을 증상, 의도, 타겟 질환 후보로 구조화
- PHR/NGS 기반 위험도 예측 결과를 생성
- 구조화 입력과 위험도 결과로 RAG query 구성
- 관련 PHR/NGS/영양 문서를 검색해 답변 근거로 사용
- 식단 질문에는 바프독 캥거루 단일 단백질 추천 근거 연결

Gemini API 키 없이 RAG 검색 결과만 먼저 확인하려면:

```bash
cd backend
npm run rag:preview
```

원하는 질문 하나만 지정해서 확인하려면:

```bash
cd backend
npm run rag:preview -- "알러지랑 묽은 변이 같이 있으면 NGS에서 뭘 봐야 해?"
```

백엔드 서버 실행 후 RAG만 API로 확인하려면:

```bash
curl -X POST http://localhost:5000/api/rag/preview \
  -H "Content-Type: application/json" \
  -d '{"message":"맥스가 배를 긁고 변이 묽은데 NGS랑 관련이 있을까?","topK":5}'
```

## 주요 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run start`: 빌드 결과 실행
- `npm run lint`: ESLint 검사
- `cd backend && npm test`: RAG 검색기 테스트
- `cd backend && npm run rag:preview`: Gemini 키 없이 RAG 검색 결과 미리보기

## 주요 라이브러리

- `next`: Next.js App Router
- `react`, `react-dom`: UI 렌더링
- `tailwindcss`, `@tailwindcss/postcss`: 스타일링
- `lucide-react`: 아이콘
- `recharts`: 리포트/건강 추이 차트

## 프론트엔드 폴더 구조

- `frontend/app/page.tsx`: 앱 진입 페이지
- `frontend/app/App.tsx`: 앱 상태, 채팅 기록, 최근 리포트 관리
- `frontend/app/components/screens`: AI 채팅, 리포트, 데이터 허브, 건강 추이 화면
- `frontend/app/globals.css`: 전역 스타일
- `frontend/styles`: Tailwind 및 테마 CSS
