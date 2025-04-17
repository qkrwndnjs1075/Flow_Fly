import type { Request, Response } from "express"
import Event from "../models/Event"
import Calendar from "../models/Calendar"

// 이벤트 검색
export const searchEvents = async (req: Request, res: Response) => {
  try {
    const { query } = req.query
    const userId = req.user._id

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "검색어를 입력해주세요" })
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
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
