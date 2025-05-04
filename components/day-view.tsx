"use client"

import { Clock } from "lucide-react"

type DayViewProps = {
  events: any[]
  currentDate: string
  selectedDay: number
  currentYear?: number
  currentMonthIndex?: number
  handleEventClick: (event: any) => void
}

export default function DayView({
  events,
  currentDate,
  selectedDay,
  currentYear = new Date().getFullYear(),
  currentMonthIndex = new Date().getMonth(),
  handleEventClick,
}: DayViewProps) {
  // 시간 슬롯 (8 AM to 8 PM)
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8)

  // 이벤트 위치 및 높이 계산
  const calculateEventStyle = (startTime: string, endTime: string) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = (start - 8) * 80 // 80px per hour
    const height = (end - start) * 80
    return { top: `${top}px`, height: `${height}px` }
  }

  // 선택된 날짜의 이벤트만 필터링 (개선된 로직)
  const dayEvents = events.filter((event) => {
    try {
      // 이벤트 날짜를 Date 객체로 변환
      const eventDate = new Date(event.date)

      // 선택된 날짜 생성
      const selectedDate = new Date(currentYear, currentMonthIndex, selectedDay)

      // 날짜 비교를 위해 시간 정보 제거
      const eventDateString = eventDate.toISOString().split("T")[0]
      const selectedDateString = selectedDate.toISOString().split("T")[0]

      // 디버깅 로그
      console.log("일 뷰 이벤트 필터링:", {
        eventId: event._id,
        eventDate: eventDateString,
        selectedDate: selectedDateString,
        match: eventDateString === selectedDateString,
      })

      // 날짜 문자열 비교
      return eventDateString === selectedDateString
    } catch (error) {
      console.error("이벤트 날짜 처리 오류:", error, event)
      return false
    }
  })

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full overflow-y-auto">
      {/* 날짜 헤더 */}
      <div className="border-b border-white/20 p-4">
        <h2 className="text-xl font-semibold text-white">{currentDate}</h2>
        <p className="text-sm text-white/70">일정 {dayEvents.length}개</p>
      </div>

      {/* 시간 그리드 */}
      <div className="relative">
        {/* 시간 레이블 */}
        <div className="absolute top-0 left-0 w-16 h-full border-r border-white/20">
          {timeSlots.map((time, i) => (
            <div key={i} className="h-20 border-b border-white/10 pr-2 text-right text-xs text-white/70 pt-2">
              {time > 12 ? `${time - 12} PM` : time === 12 ? "12 PM" : `${time} AM`}
            </div>
          ))}
        </div>

        {/* 이벤트 영역 */}
        <div className="ml-16 relative">
          {/* 시간 그리드 라인 */}
          {timeSlots.map((_, i) => (
            <div key={i} className="h-20 border-b border-white/10"></div>
          ))}

          {/* 이벤트 */}
          {dayEvents.length > 0 ? (
            dayEvents.map((event, i) => {
              const eventStyle = calculateEventStyle(event.startTime, event.endTime)
              return (
                <div
                  key={i}
                  className={`absolute ${event.color} rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg left-4 right-4`}
                  style={eventStyle}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="flex items-center opacity-80 text-[10px] mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {`${event.startTime} - ${event.endTime}`}
                  </div>
                  {event.location && <div className="opacity-80 text-[10px] mt-1 truncate">{event.location}</div>}
                </div>
              )
            })
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/50 text-sm">이 날짜에 일정이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
