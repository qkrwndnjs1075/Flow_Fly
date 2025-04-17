import express from "express"
import { searchEvents } from "../controllers/searchController"
import { auth } from "../middleware/auth"

const router = express.Router()

// 모든 라우트에 인증 미들웨어 적용
router.use(auth)

// 이벤트 검색
router.get("/events", searchEvents)

export default router
