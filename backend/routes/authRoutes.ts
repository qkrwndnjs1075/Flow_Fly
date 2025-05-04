import express from "express"
import { googleAuth, getCurrentUser } from "../controllers/authController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

// Google 로그인/회원가입
router.post("/google", googleAuth)

// 현재 사용자 정보 조회
router.get("/me", protect, getCurrentUser)

export default router
