import type { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import Calendar from "../models/calendarModel"
import Event from "../models/eventModel"

// 사용자의 모든 캘린더 조회
export const getCalendars = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id

  const calendars = await Calendar.find({ user: userId })

  res.json({
    success: true,
    calendars,
  })
})

// 캘린더 생성
export const createCalendar = asyncHandler(async (req: Request, res: Response) => {
  const { name, color } = req.body
  const userId = req.user._id

  if (!name) {
    res.status(400)
    throw new Error("캘린더 이름은 필수입니다")
  }

  const calendar = await Calendar.create({
    name,
    color: color || "bg-blue-500",
    user: userId,
  })

  res.status(201).json({
    success: true,
    calendar,
  })
})

// 캘린더 수정
export const updateCalendar = asyncHandler(async (req: Request, res: Response) => {
  const { name, color } = req.body
  const { id } = req.params
  const userId = req.user._id

  // 캘린더 소유권 확인
  const calendar = await Calendar.findOne({ _id: id, user: userId })
  if (!calendar) {
    res.status(404)
    throw new Error("캘린더를 찾을 수 없거나 접근 권한이 없습니다")
  }

  // 캘린더 업데이트
  const updatedCalendar = await Calendar.findByIdAndUpdate(id, { name, color }, { new: true })

  res.json({
    success: true,
    calendar: updatedCalendar,
  })
})

// 캘린더 삭제
export const deleteCalendar = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = req.user._id

  // 캘린더 소유권 확인
  const calendar = await Calendar.findOne({ _id: id, user: userId })
  if (!calendar) {
    res.status(404)
    throw new Error("캘린더를 찾을 수 없거나 접근 권한이 없습니다")
  }

  // 캘린더에 속한 이벤트 삭제
  await Event.deleteMany({ calendar: id })

  // 캘린더 삭제
  await Calendar.findByIdAndDelete(id)

  res.json({
    success: true,
    message: "캘린더가 성공적으로 삭제되었습니다",
  })
})
