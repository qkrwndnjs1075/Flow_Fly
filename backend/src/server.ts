import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import fs from "fs"

// 라우트 임포트
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import calendarRoutes from "./routes/calendarRoutes"
import eventRoutes from "./routes/eventRoutes"
import notificationRoutes from "./routes/notificationRoutes"
import settingsRoutes from "./routes/settingsRoutes"
import searchRoutes from "./routes/searchRoutes"
import kakaoMapRoutes from "./routes/kakaoMapRoutes"

// 미들웨어 임포트
import { errorHandler, notFound } from "./middleware/errorMiddleware"
import { verifyEmailConnection } from "./utils/emailService"

// 환경 변수 로드
dotenv.config()

// 앱 초기화
const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/flow_fly"

// 업로드 디렉토리 생성
const uploadDir = path.join(__dirname, "../uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 미들웨어
app.use(helmet()) // 보안 헤더 설정
app.use(morgan("dev")) // 로깅
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 정적 파일 제공
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// 라우트
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/calendars", calendarRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/settings", settingsRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/kakao-map", kakaoMapRoutes)

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ message: "Flow_Fly API Server" })
})

// 404 처리
app.use(notFound)

// 에러 핸들러
app.use(errorHandler)

// MongoDB 연결 및 서버 시작
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB")

    // 이메일 서버 연결 테스트
    try {
      await verifyEmailConnection()
    } catch (error) {
      console.error("이메일 서버 연결 테스트 실패:", error)
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

export default app
