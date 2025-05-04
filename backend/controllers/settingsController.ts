import type { Request, Response } from "express"
import UserSettings from "../models/UserSettings"

// 사용자 설정 조회
export const getUserSettings = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 사용자 설정 업데이트
export const updateUserSettings = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}
