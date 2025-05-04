import type { Request, Response } from "express"
import Notification from "../models/Notification"

// 사용자의 모든 알림 조회
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("relatedEvent", "title startTime endTime")

    res.json({
      success: true,
      notifications,
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 알림 읽음 표시
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user._id

    // 알림 소유권 확인
    const notification = await Notification.findOne({ _id: id, user: userId })
    if (!notification) {
      return res.status(404).json({ success: false, message: "알림을 찾을 수 없거나 접근 권한이 없습니다" })
    }

    // 알림 업데이트
    const updatedNotification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true })

    res.json({
      success: true,
      notification: updatedNotification,
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 모든 알림 읽음 표시
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id

    await Notification.updateMany({ user: userId, read: false }, { read: true })

    res.json({
      success: true,
      message: "모든 알림이 읽음 표시되었습니다",
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 알림 삭제
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user._id

    // 알림 소유권 확인
    const notification = await Notification.findOne({ _id: id, user: userId })
    if (!notification) {
      return res.status(404).json({ success: false, message: "알림을 찾을 수 없거나 접근 권한이 없습니다" })
    }

    // 알림 삭제
    await Notification.findByIdAndDelete(id)

    res.json({
      success: true,
      message: "알림이 성공적으로 삭제되었습니다",
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 모든 알림 삭제
export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id

    await Notification.deleteMany({ user: userId })

    res.json({
      success: true,
      message: "모든 알림이 삭제되었습니다",
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 새 알림 생성 (시스템 또는 다른 사용자로부터)
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { title, message, type, userId, relatedEventId } = req.body

    // 필수 필드 검증
    if (!title || !message || !type || !userId) {
      return res.status(400).json({ success: false, message: "필수 필드를 모두 입력해주세요" })
    }

    const notification = await Notification.create({
      title,
      message,
      time: "방금 전",
      read: false,
      type,
      user: userId,
      relatedEvent: relatedEventId,
    })

    res.status(201).json({
      success: true,
      notification,
    })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message })
  }
}
