import type { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import User from "../models/userModel"
import fs from "fs"
import path from "path"

// 사용자 프로필 조회
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id).select("-password")
  if (!user) {
    res.status(404)
    throw new Error("사용자를 찾을 수 없습니다")
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      provider: user.provider,
    },
  })
})

// 사용자 프로필 업데이트
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error("사용자를 찾을 수 없습니다")
  }

  // 이메일 변경 시 중복 확인
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email })
    if (emailExists) {
      res.status(400)
      throw new Error("이미 사용 중인 이메일입니다")
    }
    user.email = email
  }

  // 이름 업데이트
  if (name) {
    user.name = name
  }

  // 비밀번호 업데이트 (이메일 로그인 사용자만)
  if (password && user.provider === "email") {
    user.password = password
  }

  const updatedUser = await user.save()

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
})

// 프로필 사진 업로드
export const uploadProfilePhoto = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400)
    throw new Error("업로드된 파일이 없습니다")
  }

  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error("사용자를 찾을 수 없습니다")
  }

  // 이전 프로필 사진 삭제 (기본 이미지가 아닌 경우)
  if (
    user.photoUrl &&
    !user.photoUrl.includes("placeholder.svg") &&
    !user.photoUrl.startsWith("http") &&
    fs.existsSync(path.join(__dirname, "../../../public", user.photoUrl))
  ) {
    fs.unlinkSync(path.join(__dirname, "../../../public", user.photoUrl))
  }

  // 새 프로필 사진 경로 설정
  const photoUrl = `/uploads/profile/${req.file.filename}`
  user.photoUrl = photoUrl

  await user.save()

  res.json({
    success: true,
    photoUrl,
    message: "프로필 사진이 업데이트되었습니다",
  })
})

// 사용자 설정 업데이트
export const updateUserSettings = asyncHandler(async (req: Request, res: Response) => {
  const { timeFormat, weekStartDay, language, notificationsEnabled, emailNotificationsEnabled, darkMode } = req.body

  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error("사용자를 찾을 수 없습니다")
  }

  // 사용자 설정 업데이트 로직 구현
  // 예: UserSettings 모델을 사용하여 설정 저장

  res.json({
    success: true,
    message: "사용자 설정이 업데이트되었습니다",
    settings: {
      timeFormat,
      weekStartDay,
      language,
      notificationsEnabled,
      emailNotificationsEnabled,
      darkMode,
    },
  })
})

// 비밀번호 변경
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    res.status(400)
    throw new Error("현재 비밀번호와 새 비밀번호를 모두 입력해주세요")
  }

  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error("사용자를 찾을 수 없습니다")
  }

  // 소셜 로그인 사용자는 비밀번호 변경 불가
  if (user.provider !== "email") {
    res.status(400)
    throw new Error("소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다")
  }

  // 현재 비밀번호 확인
  const isMatch = await user.comparePassword(currentPassword)
  if (!isMatch) {
    res.status(400)
    throw new Error("현재 비밀번호가 일치하지 않습니다")
  }

  // 새 비밀번호 설정
  user.password = newPassword
  await user.save()

  res.json({
    success: true,
    message: "비밀번호가 성공적으로 변경되었습니다",
  })
})

// 계정 삭제
export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body

  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error("사용자를 찾을 수 없습니다")
  }

  // 이메일 로그인 사용자는 비밀번호 확인
  if (user.provider === "email") {
    if (!password) {
      res.status(400)
      throw new Error("계정 삭제를 위해 비밀번호를 입력해주세요")
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      res.status(400)
      throw new Error("비밀번호가 일치하지 않습니다")
    }
  }

  // 사용자 관련 데이터 삭제 로직 구현
  // 예: 캘린더, 이벤트, 알림 등 관련 데이터 삭제

  // 사용자 계정 삭제
  await User.findByIdAndDelete(req.user._id)

  res.json({
    success: true,
    message: "계정이 성공적으로 삭제되었습니다",
  })
})
