"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Plus, Search, Settings, Menu, Clock, MapPin, Calendar, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import CreateEventModal from "@/components/create-event-modal"
import AddCalendarModal from "@/components/add-calendar-modal"
import DayView from "@/components/day-view"
import MonthView from "@/components/month-view"
import ThemeToggle from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-context"
import { useSession } from "next-auth/react"
import { useCalendars } from "@/hooks/use-calendars"
import { useEvents } from "@/hooks/use-events"

// 기본 프로필 이미지 URL
const DEFAULT_PROFILE_IMAGE = "/images/default-profile.png"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { data: session, status: sessionStatus } = useSession()

  console.log("홈 페이지 세션 상태:", sessionStatus, session)
  console.log("홈 페이지 사용자 정보:", user)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddCalendarModal, setShowAddCalendarModal] = useState(false)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState(new Date().getDate())
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [activeCalendars, setActiveCalendars] = useState<string[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // 캘린더와 이벤트 데이터 로드
  const { calendars, isLoading: isLoadingCalendars, error: calendarsError, addCalendar } = useCalendars()
  const { events, isLoading: isLoadingEvents, error: eventsError, addEvent, deleteEvent } = useEvents()

  // 월 이름 배열
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

  // 로그인 체크
  useEffect(() => {
    // 세션 로딩 중이면 기다림
    if (sessionStatus === "loading" || authLoading) {
      return
    }

    // 인증되지 않은 경우 로그인 페이지로 리디렉션
    if (sessionStatus === "unauthenticated" && !user) {
      console.log("인증되지 않음, 로그인 페이지로 리디렉션")
      router.push("/login")
    } else {
      console.log("인증됨, 홈 페이지 표시")
    }
  }, [sessionStatus, authLoading, user, router])

  // 초기 활성 캘린더 설정
  useEffect(() => {
    if (calendars.length > 0 && activeCalendars.length === 0) {
      setActiveCalendars(calendars.map((cal) => cal._id))
    }
  }, [calendars, activeCalendars])

  // 캘린더 이동 함수
  const goToPreviousMonth = useCallback(() => {
    setCurrentMonthIndex((prev) => {
      if (prev === 0) {
        setCurrentYear((prev) => prev - 1)
        return 11
      }
      return prev - 1
    })
  }, [])

  const goToNextMonth = useCallback(() => {
    setCurrentMonthIndex((prev) => {
      if (prev === 11) {
        setCurrentYear((prev) => prev + 1)
        return 0
      }
      return prev + 1
    })
  }, [])

  // 현재 월과 날짜 업데이트
  const [currentMonth, setCurrentMonth] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    setCurrentMonth(`${currentYear}년 ${monthNames[currentMonthIndex]}`)
    setCurrentDate(`${currentYear}년 ${monthNames[currentMonthIndex]} ${selectedDay}일`)
  }, [currentMonthIndex, currentYear, selectedDay, monthNames])

  // 이벤트 추가 함수
  const handleAddEvent = async (newEvent) => {
    console.log("새 일정 추가:", newEvent)

    try {
      // 필수 필드 확인
      if (!newEvent.title || !newEvent.startTime || !newEvent.endTime || !newEvent.calendarId) {
        console.error("필수 필드 누락:", newEvent)
        alert("모든 필수 정보를 입력해주세요.")
        return
      }

      // 날짜 형식 확인 및 처리
      if (!newEvent.date) {
        console.log("날짜 정보 누락, 현재 날짜 사용")
        const today = new Date(currentYear, currentMonthIndex, selectedDay)
        newEvent.date = today.toISOString()
      }

      // 요일 정보 추가
      const eventDate = new Date(newEvent.date)
      newEvent.day = eventDate.getDay() // 0: 일요일, 1: 월요일, ...

      // 선택된 캘린더의 색상 가져오기
      const selectedCalendar = calendars.find((cal) => cal._id === newEvent.calendarId)
      if (selectedCalendar) {
        newEvent.color = selectedCalendar.color
      }

      console.log("최종 이벤트 데이터:", newEvent)

      // 이벤트 추가
      const success = await addEvent(newEvent)
      if (success) {
        alert("일정이 성공적으로 저장되었습니다.")
      } else {
        alert("일정 저장에 실패했습니다.")
      }
    } catch (error) {
      console.error("이벤트 저장 오류:", error)
      alert(`일정 저장 실패: ${error.message}`)
    }
  }

  // 이벤트 삭제 함수
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    try {
      const success = await deleteEvent(selectedEvent._id)
      if (success) {
        alert("일정이 성공적으로 삭제되었습니다.")
        setSelectedEvent(null)
        setShowDeleteConfirm(false)
      } else {
        alert("일정 삭제에 실패했습니다.")
      }
    } catch (error) {
      console.error("이벤트 삭제 오류:", error)
      alert(`일정 삭제 실패: ${error.message}`)
    }
  }

  // 캘린더 추가 함수
  const handleAddCalendar = async (newCalendar) => {
    console.log("새 캘린더 추가:", newCalendar)

    try {
      const success = await addCalendar(newCalendar.name, newCalendar.color)
      if (success) {
        alert("캘린더가 성공적으로 저장되었습니다.")
      } else {
        alert("캘린더 저장에 실패했습니다.")
      }
    } catch (error) {
      console.error("캘린더 저장 오류:", error)
      alert(`캘린더 저장 실패: ${error.message}`)
    }
  }

  // 캘린더 토글 함수
  const toggleCalendar = (calendarId: string) => {
    setActiveCalendars((prev) => {
      if (prev.includes(calendarId)) {
        return prev.filter((id) => id !== calendarId)
      } else {
        return [...prev, calendarId]
      }
    })
  }

  // 설정 페이지로 이동
  const goToSettings = () => {
    router.push("/settings")
  }

  // 검색 기능
  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setShowSearchResults(false)
      return
    }

    // 이벤트 검색 (제목, 설명에서 검색)
    const results = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    setSearchResults(results)
    setShowSearchResults(true)
  }

  // 컴포넌트 로드 완료 설정
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const [currentView, setCurrentView] = useState("week")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedCalendarId, setSelectedCalendarId] = useState("")

  // 기본 선택 캘린더 설정
  useEffect(() => {
    if (calendars.length > 0 && !selectedCalendarId) {
      const defaultCalendar = calendars.find((cal) => cal.isDefault) || calendars[0]
      setSelectedCalendarId(defaultCalendar._id)
    }
  }, [calendars, selectedCalendarId])

  const handleEventClick = (event) => {
    setSelectedEvent(event)
  }

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // 활성화된 캘린더의 이벤트만 필터링
  const filteredEvents = events.filter((event) => activeCalendars.includes(event.calendar || event.calendarId))

  // 미니 캘린더 날짜 클릭 핸들러
  const handleDateClick = (day) => {
    if (day) {
      setSelectedDay(day)
    }
  }

  // 검색 결과 닫기 기능 추가
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 검색 결과 외부 클릭 시 닫기
      if (showSearchResults && !event.target.closest(".search-container")) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSearchResults])

  // 미니 캘린더 계산
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex)
  const firstDayOffset = getFirstDayOfMonth(currentYear, currentMonthIndex)
  const miniCalendarDays = Array.from({ length: daysInMonth + firstDayOffset }, (_, i) =>
    i < firstDayOffset ? null : i - firstDayOffset + 1,
  )

  // 시간 슬롯 (8 AM to 8 PM)
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8)

  // 주간 뷰 계산
  const getWeekDays = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const dayOfWeek = date.getDay() // 0: 일요일, 1: 월요일, ...

    // 현재 날짜가 속한 주의 일요일 계산
    const sunday = new Date(year, month, day - dayOfWeek)

    // 일주일 날짜 배열 생성
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(sunday)
      date.setDate(sunday.getDate() + i)
      return date
    })
  }

  const today = new Date(currentYear, currentMonthIndex, selectedDay)
  const weekDays = getWeekDays(today)
  const weekDayLabels = ["일", "월", "화", "수", "목", "금", "토"]

  // 이벤트 위치 및 높이 계산
  const calculateEventStyle = (startTime, endTime) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = (start - 8) * 80 // 80px per hour
    const height = (end - start) * 80
    return { top: `${top}px`, height: `${height}px` }
  }

  // 날짜별 이벤트 필터링
  const getEventsForDate = (date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      )
    })
  }

  // 오늘 날짜로 이동하는 함수
  const goToToday = useCallback(() => {
    const now = new Date()
    setCurrentYear(now.getFullYear())
    setCurrentMonthIndex(now.getMonth())
    setSelectedDay(now.getDate())

    // 주간 뷰 업데이트를 위해 today 상태 갱신
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // 현재 날짜 문자열 업데이트
    setCurrentMonth(`${now.getFullYear()}년 ${monthNames[now.getMonth()]}`)
    setCurrentDate(`${now.getFullYear()}년 ${monthNames[now.getMonth()]} ${now.getDate()}일`)

    // 필요한 경우 현재 뷰를 day로 변경
    // setCurrentView("day")
  }, [monthNames])

  // 로딩 중이거나 인증되지 않은 경우 로딩 화면 표시
  if (sessionStatus === "loading" || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    )
  }

  // 인증되지 않은 경우 빈 화면 표시 (리디렉션 처리 중)
  if (sessionStatus === "unauthenticated" && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-white text-xl">로그인이 필요합니다. 리디렉션 중...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
        alt="Beautiful mountain landscape"
        fill
        className="object-cover"
        priority
      />

      {/* Navigation */}
      <header
        className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6 opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6 text-white cursor-pointer" onClick={toggleSidebar} />
          <span className="text-2xl font-semibold text-white drop-shadow-lg">Flow_Fly</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative search-container">
            <form onSubmit={handleSearch} className="search-container">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input
                type="text"
                placeholder="검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full bg-white/10 backdrop-blur-sm pl-10 pr-4 py-2 text-white placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </form>

            {/* 검색 결과 */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-lg rounded-md border border-white/20 shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.map((result, i) => (
                  <div
                    key={i}
                    className="p-2 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0"
                    onClick={() => {
                      handleEventClick(result)
                      setShowSearchResults(false)
                    }}
                  >
                    <div className="text-white font-medium">{result.title}</div>
                    <div className="text-white/70 text-xs">{result.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 테마 토글 */}
          <ThemeToggle />

          <Settings
            className="h-6 w-6 text-white drop-shadow-md cursor-pointer transition-transform hover:scale-110"
            onClick={goToSettings}
          />
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
            {user?.photoUrl ? (
              <div className="relative w-full h-full overflow-hidden rounded-full">
                <Image
                  src={user.photoUrl || DEFAULT_PROFILE_IMAGE}
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-full">
                <Image
                  src={DEFAULT_PROFILE_IMAGE || "/placeholder.svg"}
                  alt="Default avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative h-screen w-full pt-20 flex">
        {/* Sidebar */}
        <div
          className={`h-full bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg p-4 shadow-xl border-r border-white/20 dark:border-gray-700/30 rounded-tr-3xl opacity-0 ${
            isLoaded ? "animate-fade-in" : ""
          } flex flex-col justify-between transition-all duration-300 ease-in-out ${
            sidebarCollapsed
              ? "w-0 p-0 opacity-0 transform -translate-x-16"
              : "w-64 opacity-100 transform translate-x-0"
          }`}
          style={{ animationDelay: "0.4s" }}
        >
          {!sidebarCollapsed && (
            <>
              <div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mb-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-3 text-white w-full transition-all hover:bg-blue-600 hover:shadow-lg hover:translate-y-[-2px]"
                >
                  <Plus className="h-5 w-5" />
                  <span>생성</span>
                </button>

                {/* Mini Calendar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">{currentMonth}</h3>
                    <div className="flex gap-1">
                      <button className="p-1 rounded-full hover:bg-white/20" onClick={goToPreviousMonth}>
                        <ChevronLeft className="h-4 w-4 text-white" />
                      </button>
                      <button className="p-1 rounded-full hover:bg-white/20" onClick={goToNextMonth}>
                        <ChevronRight className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {weekDayLabels.map((day, i) => (
                      <div key={i} className="text-xs text-white/70 font-medium py-1">
                        {day}
                      </div>
                    ))}

                    {miniCalendarDays.map((day, i) => (
                      <div
                        key={i}
                        className={`text-xs rounded-full w-7 h-7 flex items-center justify-center transition-all ${
                          day === selectedDay
                            ? "bg-blue-500 text-white transform scale-110"
                            : "text-white hover:bg-white/20"
                        } ${!day ? "invisible" : ""} cursor-pointer`}
                        onClick={() => handleDateClick(day)}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                {/* My Calendars */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">내 캘린더</h3>
                    <button onClick={() => setShowAddCalendarModal(true)} className="text-white/70 hover:text-white">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {isLoadingCalendars ? (
                      <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                      </div>
                    ) : calendarsError ? (
                      <div className="text-red-300 text-sm p-2">{calendarsError}</div>
                    ) : (
                      <div className="space-y-2">
                        {calendars.map((cal, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 cursor-pointer hover:bg-white/10 dark:hover:bg-gray-700/30 p-1 rounded-md"
                            onClick={() => toggleCalendar(cal._id)}
                          >
                            <input
                              type="checkbox"
                              checked={activeCalendars.includes(cal._id)}
                              onChange={() => toggleCalendar(cal._id)}
                              className="sr-only"
                              id={`cal-${cal._id}`}
                            />
                            <div
                              className={`w-3 h-3 rounded-sm ${cal.color} ${
                                !activeCalendars.includes(cal._id) ? "opacity-40" : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedCalendarId(cal._id)
                              }}
                            ></div>
                            <label
                              htmlFor={`cal-${cal._id}`}
                              className={`text-white text-sm flex-grow ${
                                !activeCalendars.includes(cal._id) ? "opacity-40" : ""
                              }`}
                            >
                              {cal.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* New position for the big plus button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 p-4 text-white w-14 h-14 self-start"
              >
                <Plus className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Calendar View */}
        <div
          className={`flex-1 flex flex-col opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.6s" }}
        >
          {/* Calendar Controls */}
          <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-gray-700/30">
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-white bg-blue-500 rounded-md" onClick={goToToday}>
                오늘
              </button>
              <div className="flex">
                <button className="p-2 text-white hover:bg-white/10 rounded-l-md" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="p-2 text-white hover:bg-white/10 rounded-r-md" onClick={goToNextMonth}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-white">{currentDate}</h2>
            </div>

            <div className="flex items-center gap-2 rounded-md p-1">
              <button
                onClick={() => setCurrentView("day")}
                className={`px-3 py-1 rounded ${currentView === "day" ? "bg-white/20 dark:bg-gray-700/50" : ""} text-white text-sm`}
              >
                일
              </button>
              <button
                onClick={() => setCurrentView("week")}
                className={`px-3 py-1 rounded ${currentView === "week" ? "bg-white/20 dark:bg-gray-700/50" : ""} text-white text-sm`}
              >
                주
              </button>
              <button
                onClick={() => setCurrentView("month")}
                className={`px-3 py-1 rounded ${currentView === "month" ? "bg-white/20 dark:bg-gray-700/50" : ""} text-white text-sm`}
              >
                월
              </button>
            </div>
          </div>

          {/* Calendar Content - Conditional Rendering based on View */}
          <div className="flex-1 overflow-auto p-4">
            {currentView === "day" && (
              <DayView
                events={filteredEvents}
                currentDate={currentDate}
                selectedDay={selectedDay}
                currentYear={currentYear}
                currentMonthIndex={currentMonthIndex}
                handleEventClick={handleEventClick}
              />
            )}

            {currentView === "week" && (
              <div className="bg-white/20 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl h-full">
                {/* Week Header */}
                <div className="grid grid-cols-8 border-b border-white/20 dark:border-gray-700/30">
                  <div className="p-2 text-center text-white/50 text-xs"></div>
                  {weekDays.map((day, i) => (
                    <div
                      key={i}
                      className="p-2 text-center border-l border-white/20 dark:border-gray-700/30 cursor-pointer"
                      onClick={() => setSelectedDay(day.getDate())}
                    >
                      <div className="text-xs text-white/70 font-medium">{weekDayLabels[i]}</div>
                      <div
                        className={`text-lg font-medium mt-1 text-white ${
                          day.getDate() === selectedDay &&
                          day.getMonth() === currentMonthIndex &&
                          day.getFullYear() === currentYear
                            ? "bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                            : ""
                        }`}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Grid */}
                <div className="grid grid-cols-8">
                  {/* Time Labels */}
                  <div className="text-white/70">
                    {timeSlots.map((time, i) => (
                      <div
                        key={i}
                        className="h-20 border-b border-white/10 dark:border-gray-700/20 pr-2 text-right text-xs"
                      >
                        {time > 12 ? `${time - 12} PM` : `${time} AM`}
                      </div>
                    ))}
                  </div>

                  {/* Days Columns */}
                  {weekDays.map((day, dayIndex) => (
                    <div key={dayIndex} className="border-l border-white/20 dark:border-gray-700/30 relative">
                      {timeSlots.map((_, timeIndex) => (
                        <div key={timeIndex} className="h-20 border-b border-white/10 dark:border-gray-700/20"></div>
                      ))}

                      {/* Events */}
                      {getEventsForDate(day).map((event, i) => {
                        const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                        return (
                          <div
                            key={i}
                            className={`absolute ${event.color} rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-300 ease-in-out hover:translate-y-[-3px] hover:shadow-lg event-appear`}
                            style={{
                              ...eventStyle,
                              left: "4px",
                              right: "4px",
                              animationDelay: `${i * 0.05}s`,
                            }}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === "month" && (
              <MonthView
                events={filteredEvents}
                currentMonth={currentMonth}
                currentYear={currentYear}
                currentMonthIndex={currentMonthIndex}
                onDateClick={(day) => {
                  setSelectedDay(day)
                  // 선택적으로 Day 뷰로 전환할 수도 있음
                  // setCurrentView("day");
                }}
              />
            )}
          </div>
        </div>

        {/* 이벤트 상세 모달 */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${selectedEvent.color} p-6 rounded-lg shadow-xl max-w-md w-full mx-4 modal-animation`}>
              <h3 className="text-2xl font-bold mb-4 text-white">{selectedEvent.title}</h3>
              <div className="space-y-3 text-white">
                <p className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  {`${selectedEvent.startTime} - ${selectedEvent.endTime}`}
                </p>
                {selectedEvent.location && (
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    {selectedEvent.location}
                  </p>
                )}
                <p className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  {new Date(selectedEvent.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
                </p>
                {selectedEvent.description && (
                  <p>
                    <strong>설명:</strong> {selectedEvent.description}
                  </p>
                )}
                <p>
                  <strong>캘린더:</strong>{" "}
                  {calendars.find((cal) => cal._id === (selectedEvent.calendarId || selectedEvent.calendar))?.name ||
                    "알 수 없음"}
                </p>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  삭제
                </button>
                <button
                  className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedEvent(null)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 삭제 확인 모달 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-white">일정 삭제 확인</h3>
              <p className="text-white mb-6">정말로 이 일정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
              <div className="flex justify-end space-x-3">
                <button
                  className="bg-white/10 text-white px-4 py-2 rounded hover:bg-white/20 transition-colors"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  취소
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  onClick={handleDeleteEvent}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleAddEvent}
        currentDate={selectedDay}
        currentYear={currentYear}
        currentMonthIndex={currentMonthIndex}
        calendars={calendars.map((cal) => ({ id: cal._id, name: cal.name, color: cal.color }))}
        selectedCalendarId={selectedCalendarId}
      />

      {/* Add Calendar Modal */}
      <AddCalendarModal
        isOpen={showAddCalendarModal}
        onClose={() => setShowAddCalendarModal(false)}
        onSave={handleAddCalendar}
      />
    </div>
  )
}
