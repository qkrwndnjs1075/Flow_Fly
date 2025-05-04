import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { connectDB } from "./config/db"
import { errorHandler, notFound } from "./middleware/errorMiddleware"
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import calendarRoutes from "./routes/calendarRoutes"
import eventRoutes from "./routes/eventRoutes"
import notificationRoutes from "./routes/notificationRoutes"
import settingsRoutes from "./routes/settingsRoutes"

// 환경 변수 로드
dotenv.config()

// 데이터베이스 연결
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// 미들웨어
app.use(helmet()) // 보안 헤더 설정
app.use(morgan("dev")) // 로깅
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 정적 파일 제공
app.use("/uploads", express.static("uploads"))

// 라우트
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/calendars", calendarRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/settings", settingsRoutes)

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ message: "Flow_Fly API Server" })
})

// 404 처리
app.use(notFound)

// 에러 핸들러
app.use(errorHandler)

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
