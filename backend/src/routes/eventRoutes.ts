import express from "express"
import { getEvents, createEvent, updateEvent, deleteEvent } from "../controllers/eventController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

// 모든 라우트에 인증 미들웨어 적용
router.use(protect)

// 사용자의 모든 이벤트 조회
router.get("/", getEvents)

// 이벤트 생성
router.post("/", createEvent)

// 이벤트 수정
router.put("/:id", updateEvent)

// 이벤트 삭제
router.delete("/:id", deleteEvent)

export default router
