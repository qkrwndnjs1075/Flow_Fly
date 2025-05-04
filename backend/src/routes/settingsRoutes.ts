import express from "express"
import { getUserSettings, updateUserSettings } from "../controllers/settingsController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

// 모든 라우트에 인증 미들웨어 적용
router.use(protect)

// 사용자 설정 조회
router.get("/", getUserSettings)

// 사용자 설정 업데이트
router.put("/", updateUserSettings)

export default router
