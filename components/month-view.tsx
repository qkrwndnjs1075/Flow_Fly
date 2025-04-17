"use client"

type MonthViewProps = {
  events: any[]
  currentMonth: string
  currentYear: number
  currentMonthIndex: number
  onDateClick: (day: number) => void
}

export default function MonthView({
  events,
  currentMonth,
  currentYear,
  currentMonthIndex,
  onDateClick,
}: MonthViewProps) {
  // 해당 월의 일수 계산
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // 해당 월의 첫 날의 요일 계산 (0: 일요일, 1: 월요일, ...)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonthIndex)

  // 캘린더 그리드 생성
  const calendarDays = []

  // 이전 달의 날짜 채우기
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: null, isCurrentMonth: false })
  }

  // 현재 달의 날짜 채우기
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true })
  }

  // 다음 달의 날짜로 나머지 채우기 (6주 그리드 완성)
  const remainingDays = 42 - calendarDays.length
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false })
  }

  // 날짜별 이벤트 그룹화
  const getEventsForDay = (day: number) => {
    if (!day) return []

    // 실제 앱에서는 날짜 비교 로직이 필요하지만, MVP에서는 간단히 구현
    return events.filter((event) => event.day === day % 7 || event.day === (day % 7 || 7))
  }

  // 날짜 클릭 핸들러 추가
  const handleDateClick = (day: number | null) => {
    if (day && onDateClick) {
      onDateClick(day)
    }
  }

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full overflow-y-auto">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-white/20">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, i) => (
          <div key={i} className="p-2 text-center">
            <div className="text-xs text-white/70 font-medium">{day}</div>
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7">
        {calendarDays.map((dayObj, i) => (
          <div
            key={i}
            className={`min-h-[100px] border border-white/10 p-1 ${!dayObj.isCurrentMonth ? "opacity-40" : ""} ${dayObj.day ? "cursor-pointer hover:bg-white/10" : ""}`}
            onClick={() => dayObj.isCurrentMonth && handleDateClick(dayObj.day)}
          >
            {dayObj.day && (
              <>
                <div className="text-right text-sm text-white mb-1">{dayObj.day}</div>
                <div className="space-y-1">
                  {getEventsForDay(dayObj.day)
                    .slice(0, 3)
                    .map((event, j) => (
                      <div key={j} className={`${event.color} rounded-sm p-1 text-white text-xs truncate`}>
                        {event.title}
                      </div>
                    ))}
                  {getEventsForDay(dayObj.day).length > 3 && (
                    <div className="text-xs text-white/70 text-center">
                      +{getEventsForDay(dayObj.day).length - 3} more
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
