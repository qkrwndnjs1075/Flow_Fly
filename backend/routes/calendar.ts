import express from "express"
import { getCalendars, createCalendar, updateCalendar, deleteCalendar } from "../controllers/calendarController"
import { auth } from "../middleware/auth"

const router = express.Router()

// 모든 라우트에 인증 미들웨어 적용
router.use(auth)

// 사용자의 모든 캘린더 조회
router.get("/", getCalendars)

// 캘린더 생성
router.post("/", createCalendar)

// 캘린더 수정
router.put("/:id", updateCalendar)

// 캘린더 삭제
router.delete("/:id", deleteCalendar)

export default router
