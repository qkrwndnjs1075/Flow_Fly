# Flow_Fly 백엔드 API

Flow_Fly 캘린더 애플리케이션의 백엔드 API 서버입니다.

## 기술 스택

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT 인증
- Multer (파일 업로드)
- Nodemailer (이메일 전송)

## 시작하기

### 환경 설정

1. 저장소를 클론합니다.
2. 의존성을 설치합니다:
   \`\`\`bash
   npm install
   \`\`\`
3. `.env.example` 파일을 `.env`로 복사하고 필요한 환경 변수를 설정합니다:
   \`\`\`
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/flow_fly
   JWT_SECRET=your_jwt_secret_key_here
   KAKAO_API_KEY=your_kakao_api_key_here
   NODE_ENV=development
   
   # 이메일 설정
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   \`\`\`

### 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

### 프로덕션 빌드

\`\`\`bash
npm run build
npm start
\`\`\`

## API 엔드포인트

### 인증

- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/google` - Google 로그인/회원가입
- `POST /api/auth/verify-email` - 이메일 인증 코드 발송
- `GET /api/auth/me` - 현재 사용자 정보 조회

### 사용자

- `PUT /api/users/profile` - 사용자 프로필 업데이트
- `POST /api/users/profile-photo` - 프로필 사진 업로드
- `PUT /api/users/change-password` - 비밀번호 변경

### 캘린더

- `GET /api/calendars` - 사용자의 모든 캘린더 조회
- `POST /api/calendars` - 캘린더 생성
- `PUT /api/calendars/:id` - 캘린더 수정
- `DELETE /api/calendars/:id` - 캘린더 삭제

### 이벤트

- `GET /api/events` - 사용자의 모든 이벤트 조회
- `POST /api/events` - 이벤트 생성
- `PUT /api/events/:id` - 이벤트 수정
- `DELETE /api/events/:id` - 이벤트 삭제

### 알림

- `GET /api/notifications` - 사용자의 모든 알림 조회
- `PUT /api/notifications/:id/read` - 알림 읽음 표시
- `PUT /api/notifications/read-all` - 모든 알림 읽음 표시
- `DELETE /api/notifications/:id` - 알림 삭제
- `DELETE /api/notifications` - 모든 알림 삭제
- `POST /api/notifications` - 새 알림 생성 (시스템 또는 관리자용)

### 설정

- `GET /api/settings` - 사용자 설정 조회
- `PUT /api/settings` - 사용자 설정 업데이트

### 검색

- `GET /api/search/events` - 이벤트 검색

### 카카오맵

- `GET /api/kakao-map/places` - 카카오맵 장소 검색
- `GET /api/kakao-map/address` - 카카오맵 주소 검색

## 폴더 구조

\`\`\`
backend/
├── src/
│   ├── controllers/     # 컨트롤러 함수
│   ├── middleware/      # 미들웨어 (인증, 에러 처리 등)
│   ├── models/          # Mongoose 모델
│   ├── routes/          # API 라우트
│   ├── utils/           # 유틸리티 함수
│   ├── types/           # 타입 정의
│   ├── config/          # 설정 파일
│   └── server.ts        # 애플리케이션 진입점
├── uploads/             # 업로드된 파일 저장 디렉토리
├── .env                 # 환경 변수
├── .env.example         # 환경 변수 예시
├── package.json         # 프로젝트 메타데이터 및 의존성
└── tsconfig.json        # TypeScript 설정
