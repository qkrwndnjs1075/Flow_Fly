import express from "express"
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
  updateUserSettings,
  changePassword,
  deleteAccount,
} from "../controllers/userController"
import { protect } from "../middleware/authMiddleware"
import { uploadMiddleware } from "../middleware/uploadMiddleware"

const router = express.Router()

// 사용자 프로필 관련 라우트
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile)
router.post("/profile-photo", protect, uploadMiddleware.single("photo"), uploadProfilePhoto)

// 사용자 설정 관련 라우트
router.put("/settings", protect, updateUserSettings)

// 비밀번호 변경 라우트
router.put("/change-password", protect, changePassword)

// 계정 삭제 라우트
router.delete("/delete-account", protect, deleteAccount)

export default router
