import type { Request, Response } from "express"
import Calendar from "../models/Calendar"
import Event from "../models/Event"

// 사용자의 모든 캘린더 조회
export const getCalendars = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id

    const calendars = await Calendar.find({ user: userId })

    res.json({
      success: true,
      calendars,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// 캘린더 생성
export const createCalendar = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body
    const userId = req.user._id

    const calendar = await Calendar.create({
      name,
      color,
      user: userId,
    })

    res.status(201).json({
      success: true,
      calendar,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// 캘린더 수정
export const updateCalendar = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body
    const { id } = req.params
    const userId = req.user._id

    // 캘린더 소유권 확인
    const calendar = await Calendar.findOne({ _id: id, user: userId })
    if (!calendar) {
      return res.status(404).json({ message: "캘린더를 찾을 수 없거나 접근 권한이 없습니다" })
    }

    // 캘린더 업데이트
    const updatedCalendar = await Calendar.findByIdAndUpdate(id, { name, color }, { new: true })

    res.json({
      success: true,
      calendar: updatedCalendar,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// 캘린더 삭제
export const deleteCalendar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user._id

    // 캘린더 소유권 확인
    const calendar = await Calendar.findOne({ _id: id, user: userId })
    if (!calendar) {
      return res.status(404).json({ message: "캘린더를 찾을 수 없거나 접근 권한이 없습니다" })
    }

    // 캘린더에 속한 이벤트 삭제
    await Event.deleteMany({ calendar: id })

    // 캘린더 삭제
    await Calendar.findByIdAndDelete(id)

    res.json({
      success: true,
      message: "캘린더가 성공적으로 삭제되었습니다",
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
