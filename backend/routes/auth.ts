import express from "express"
import { signup, login, googleAuth, sendVerificationCode, getCurrentUser } from "../controllers/authController"
import { auth } from "../middleware/auth"

const router = express.Router()

// 회원가입
router.post("/signup", signup)

// 로그인
router.post("/login", login)

// Google 로그인/회원가입
router.post("/google", googleAuth)

// 이메일 인증 코드 발송
router.post("/verify-email", sendVerificationCode)

// 현재 사용자 정보 조회
router.get("/me", auth, getCurrentUser)

export default router
