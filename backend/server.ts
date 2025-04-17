import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/user"
import calendarRoutes from "./routes/calendar"
import eventRoutes from "./routes/event"
import notificationRoutes from "./routes/notification"
import settingsRoutes from "./routes/settings"
import searchRoutes from "./routes/search"
import kakaoMapRoutes from "./routes/kakaoMap"
import { errorHandler } from "./middleware/errorHandler"

// 환경 변수 로드
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/flow_fly"

// 미들웨어
app.use(cors())
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
app.use("/api/search", searchRoutes)
app.use("/api/kakao-map", kakaoMapRoutes)

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Flow_Fly API Server")
})

// 에러 핸들러
app.use(errorHandler)

// MongoDB 연결
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

export default app
