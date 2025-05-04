import type { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import Event from "../models/eventModel"
import Calendar from "../models/calendarModel"
import Notification from "../models/notificationModel"

// 사용자의 모든 이벤트 조회
export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id
  const { year, month, day } = req.query

  // 사용자의 캘린더 ID 목록 조회
  const calendars = await Calendar.find({ user: userId })
  const calendarIds = calendars.map((calendar) => calendar._id)

  // 쿼리 조건 구성
  const query: any = { calendar: { $in: calendarIds } }

  // 날짜 필터링 (선택적)
  if (year && month) {
    const startDate = new Date(Number(year), Number(month) - 1, 1)
    const endDate = new Date(Number(year), Number(month), 0)

    query.date = { $gte: startDate, $lte: endDate }

    if (day) {
      query.day = Number(day)
    }
  }

  const events = await Event.find(query).populate("calendar", "name color")

  res.json({
    success: true,
    events,
  })
})

// 이벤트 생성
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const { title, startTime, endTime, description, location, color, day, date, calendarId, attendees, organizer } =
    req.body

  const userId = req.user._id

  // 필수 필드 검증
  if (!title || !startTime || !endTime || !day || !date || !calendarId) {
    res.status(400)
    throw new Error("필수 필드를 모두 입력해주세요")
  }

  // 캘린더 소유권 확인
  const calendar = await Calendar.findOne({ _id: calendarId, user: userId })
  if (!calendar) {
    res.status(404)
    throw new Error("캘린더를 찾을 수 없거나 접근 권한이 없습니다")
  }

  // 이벤트 생성
  const event = await Event.create({
    title,
    startTime,
    endTime,
    description: description || "",
    location: location || "",
    color: color || calendar.color,
    day,
    date: new Date(date),
    calendar: calendarId,
    user: userId,
    attendees: attendees || [],
    organizer: organizer || req.user.name,
  })

  // 알림 생성 (선택적)
  await Notification.create({
    title: "새 일정 생성됨",
    message: `새 일정 "${title}"이(가) 생성되었습니다.`,
    time: "방금 전",
    read: false,
    type: "update",
    user: userId,
    relatedEvent: event._id,
  })

  // 생성된 이벤트 반환 (캘린더 정보 포함)
  const populatedEvent = await Event.findById(event._id).populate("calendar", "name color")

  res.status(201).json({
    success: true,
    event: populatedEvent,
  })
})

// 이벤트 수정
export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const { title, startTime, endTime, description, location, color, day, date, calendarId, attendees, organizer } =
    req.body

  const { id } = req.params
  const userId = req.user._id

  // 이벤트 소유권 확인
  const event = await Event.findById(id)
  if (!event) {
    res.status(404)
    throw new Error("이벤트를 찾을 수 없습니다")
  }

  // 캘린더 소유권 확인
  const calendar = await Calendar.findOne({ _id: calendarId || event.calendar, user: userId })
  if (!calendar) {
    res.status(404)
    throw new Error("캘린더를 찾을 수 없거나 접근 권한이 없습니다")
  }

  // 이벤트 업데이트
  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    {
      title: title || event.title,
      startTime: startTime || event.startTime,
      endTime: endTime || event.endTime,
      description: description !== undefined ? description : event.description,
      location: location !== undefined ? location : event.location,
      color: color || event.color,
      day: day || event.day,
      date: date ? new Date(date) : event.date,
      calendar: calendarId || event.calendar,
      attendees: attendees || event.attendees,
      organizer: organizer || event.organizer,
    },
    { new: true },
  ).populate("calendar", "name color")

  // 알림 생성 (선택적)
  await Notification.create({
    title: "일정 업데이트",
    message: `일정 "${updatedEvent?.title}"이(가) 업데이트되었습니다.`,
    time: "방금 전",
    read: false,
    type: "update",
    user: userId,
    relatedEvent: event._id,
  })

  res.json({
    success: true,
    event: updatedEvent,
  })
})

// 이벤트 삭제
export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = req.user._id

  // 이벤트 소유권 확인
  const event = await Event.findById(id)
  if (!event) {
    res.status(404)
    throw new Error("이벤트를 찾을 수 없습니다")
  }

  // 캘린더 소유권 확인
  const calendar = await Calendar.findOne({ _id: event.calendar, user: userId })
  if (!calendar) {
    res.status(403)
    throw new Error("이 이벤트를 삭제할 권한이 없습니다")
  }

  // 이벤트 삭제
  await Event.findByIdAndDelete(id)

  // 관련 알림 삭제
  await Notification.deleteMany({ relatedEvent: id })

  res.json({
    success: true,
    message: "이벤트가 성공적으로 삭제되었습니다",
  })
})
