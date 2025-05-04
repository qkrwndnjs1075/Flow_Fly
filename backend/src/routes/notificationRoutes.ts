import express from "express"
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  createNotification,
} from "../controllers/notificationController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

// 모든 라우트에 인증 미들웨어 적용
router.use(protect)

// 사용자의 모든 알림 조회
router.get("/", getNotifications)

// 알림 읽음 표시
router.put("/:id/read", markAsRead)

// 모든 알림 읽음 표시
router.put("/read-all", markAllAsRead)

// 알림 삭제
router.delete("/:id", deleteNotification)

// 모든 알림 삭제
router.delete("/", deleteAllNotifications)

// 새 알림 생성 (시스템 또는 관리자용)
router.post("/", createNotification)

export default router
