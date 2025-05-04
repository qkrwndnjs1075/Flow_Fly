import mongoose from "mongoose"

export const connectDB = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/flow_fly"

    // 연결 옵션 설정
    const options = {
      serverSelectionTimeoutMS: 10000, // 서버 선택 타임아웃 증가
      socketTimeoutMS: 45000, // 소켓 타임아웃
      connectTimeoutMS: 10000, // 연결 타임아웃
      keepAlive: true, // 연결 유지
      keepAliveInitialDelay: 300000, // 5분마다 keepAlive
      maxPoolSize: 10, // 최대 연결 풀 크기
      minPoolSize: 2, // 최소 연결 풀 크기
      retryWrites: true, // 쓰기 작업 재시도
      retryReads: true, // 읽기 작업 재시도
    }

    console.log("MongoDB 연결 시도:", MONGODB_URI)
    const conn = await mongoose.connect(MONGODB_URI, options)

    console.log(`MongoDB 연결 성공: ${conn.connection.host}`)

    // 연결 이벤트 리스너 추가
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB 연결 오류:", err)
    })

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB 연결 끊김. 재연결 시도 중...")
      setTimeout(() => {
        connectDB()
      }, 5000)
    })
  } catch (error) {
    console.error(`MongoDB 연결 오류: ${error instanceof Error ? error.message : "Unknown error"}`)
    console.error("스택 트레이스:", error instanceof Error ? error.stack : "No stack trace")

    // 재시도 로직 추가
    console.log("5초 후 재연결 시도...")
    setTimeout(() => {
      connectDB()
    }, 5000)
  }
}
