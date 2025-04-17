import express from "express"
import { updateProfile, uploadProfilePhoto, changePassword } from "../controllers/userController"
import { auth } from "../middleware/auth"
import { upload } from "../middleware/upload"

const router = express.Router()

// 모든 라우트에 인증 미들웨어 적용
router.use(auth)

// 사용자 프로필 업데이트
router.put("/profile", updateProfile)

// 프로필 사진 업로드
router.post("/profile-photo", upload.single("photo"), uploadProfilePhoto)

// 비밀번호 변경
router.put("/change-password", changePassword)

export default router
