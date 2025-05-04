import type { Request, Response } from "express"
import User from "../models/User"
import fs from "fs"
import path from "path"

// 사용자 프로필 업데이트
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name } = req.body
    const userId = req.user._id

    // 사용자 정보 업데이트
    const updatedUser = await User.findByIdAndUpdate(userId, { name }, { new: true })

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다" })
    }

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        photoUrl: updatedUser.photoUrl,
        provider: updatedUser.provider,
      },
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 프로필 사진 업로드
export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "파일이 업로드되지 않았습니다" })
    }

    const userId = req.user._id
    const photoUrl = `/uploads/${req.file.filename}`

    // 기존 프로필 사진 삭제 (기본 이미지가 아닌 경우)
    const user = await User.findById(userId)
    if (user && user.photoUrl && !user.photoUrl.includes("placeholder.svg")) {
      try {
        const oldPhotoPath = path.join(__dirname, "../", user.photoUrl.replace(/^\//, "")) // 앞의 슬래시 제거
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath)
        }
      } catch (fileError) {
        console.error("기존 프로필 사진 삭제 오류:", fileError)
        // 파일 삭제 실패해도 계속 진행
      }
    }

    // 사용자 정보 업데이트
    const updatedUser = await User.findByIdAndUpdate(userId, { photoUrl }, { new: true })

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다" })
    }

    res.json({
      success: true,
      photoUrl,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        photoUrl: updatedUser.photoUrl,
        provider: updatedUser.provider,
      },
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 비밀번호 변경
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user._id

    // 사용자 조회
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다" })
    }

    // Google 로그인 사용자는 비밀번호 변경 불가
    if (user.provider === "google") {
      return res.status(400).json({ success: false, message: "Google 계정은 비밀번호를 변경할 수 없습니다" })
    }

    // 현재 비밀번호 확인
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "현재 비밀번호가 올바르지 않습니다" })
    }

    // 비밀번호 강도 검증
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "비밀번호는 최소 8자 이상이어야 합니다" })
    }

    // 비밀번호 업데이트
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다",
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}
