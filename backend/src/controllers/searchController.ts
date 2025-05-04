import type { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import Event from "../models/eventModel"
import Calendar from "../models/calendarModel"

// 이벤트 검색
export const searchEvents = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query
  const userId = req.user._id

  if (!query || typeof query !== "string") {
    res.status(400)
    throw new Error("검색어를 입력해주세요")
  }

  // 사용자의 캘린더 ID 목록 조회
  const calendars = await Calendar.find({ user: userId })
  const calendarIds = calendars.map((calendar) => calendar._id)

  // 검색 쿼리 구성 (제목, 설명, 위치에서 검색)
  const searchResults = await Event.find({
    calendar: { $in: calendarIds },
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
    ],
  }).populate("calendar", "name color")

  res.json({
    success: true,
    results: searchResults,
  })
})
