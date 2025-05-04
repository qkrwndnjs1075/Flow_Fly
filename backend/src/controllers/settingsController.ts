import type { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import UserSettings from "../models/userSettingsModel"

// 사용자 설정 조회
export const getUserSettings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id

  // 사용자 설정 조회 또는 기본값 생성
  let settings = await UserSettings.findOne({ user: userId })

  if (!settings) {
    settings = await UserSettings.create({
      user: userId,
      darkMode: false,
      notifications: true,
      timeFormat: "12h",
      startOfWeek: "sunday",
    })
  }

  res.json({
    success: true,
    settings,
  })
})

// 사용자 설정 업데이트
export const updateUserSettings = asyncHandler(async (req: Request, res: Response) => {
  const { darkMode, notifications, timeFormat, startOfWeek } = req.body
  const userId = req.user._id

  // 설정 업데이트 또는 생성
  const settings = await UserSettings.findOneAndUpdate(
    { user: userId },
    {
      darkMode,
      notifications,
      timeFormat,
      startOfWeek,
    },
    { new: true, upsert: true },
  )

  res.json({
    success: true,
    settings,
  })
})
