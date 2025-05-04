import express from "express"
import { searchEvents } from "../controllers/searchController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

// 모든 라우트에 인증 미들웨어 적용
router.use(protect)

// 이벤트 검색
router.get("/events", searchEvents)

export default router
