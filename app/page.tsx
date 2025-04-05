"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Settings,
  Menu,
  Clock,
  MapPin,
  Users,
  Calendar,
  Bell,
} from "lucide-react"
import { useRouter } from "next/navigation"
import CreateEventModal from "@/components/create-event-modal"
import AddCalendarModal from "@/components/add-calendar-modal"
import DayView from "@/components/day-view"
import MonthView from "@/components/month-view"
import ThemeToggle from "@/components/theme-toggle"
import NotificationsPanel from "@/components/notifications-panel"
import { useAuth } from "@/components/auth-context"

export default function Home() {
  // AI 추천 관련 상태 및 함수 수정
  const [showAIPopup, setShowAIPopup] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const router = useRouter()
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddCalendarModal, setShowAddCalendarModal] = useState(false)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(2) // 3월 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [selectedDay, setSelectedDay] = useState(5) // 기본 선택일
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [activeCalendars, setActiveCalendars] = useState<string[]>([])

  // 샘플 알림 데이터
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "팀 미팅",
      message: "알림: 30분 후 팀 미팅이 있습니다",
      time: "30분 전",
      read: false,
      type: "reminder" as const,
    },
    {
      id: "2",
      title: "새 캘린더 초대",
      message: "이사라님이 '프로젝트 알파'에 초대했습니다",
      time: "2시간 전",
      read: false,
      type: "invitation" as const,
    },
    {
      id: "3",
      title: "일정 업데이트",
      message: "고객 통화가 내일 오후 2시로 일정 변경되었습니다",
      time: "어제",
      read: false,
      type: "update" as const,
    },
  ])

  // 월 이름 배열
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

  // 로그인 체크
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      router.push("/login")
    }
  }, [user, router])

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

  // 캘린더 데이터
  const [myCalendars, setMyCalendars] = useState([
    { id: "cal-1", name: "내 캘린더", color: "bg-blue-500" },
    { id: "cal-2", name: "업무", color: "bg-green-500" },
    { id: "cal-3", name: "개인", color: "bg-purple-500" },
    { id: "cal-4", name: "가족", color: "bg-orange-500" },
  ])

  // 초기 활성 캘린더 설정
  useEffect(() => {
    setActiveCalendars(myCalendars.map((cal) => cal.id))
  }, [])

  // 이벤트 추가 함수
  const handleAddEvent = (newEvent) => {
    // MVP에서는 간단히 콘솔에 로그만 출력
    console.log("새 일정:", newEvent)
    // 실제 앱에서는 events 배열에 추가하고 저장
  }

  // 캘린더 추가 함수
  const handleAddCalendar = (newCalendar) => {
    const newCalendarWithId = {
      ...newCalendar,
      id: `cal-${myCalendars.length + 1}-${Date.now()}`,
    }
    setMyCalendars((prev) => [...prev, newCalendarWithId])
    setActiveCalendars((prev) => [...prev, newCalendarWithId.id])
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

  // 알림 관련 함수
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    setNotificationCount((prev) => Math.max(0, prev - 1))
  }

  const handleClearAllNotifications = () => {
    setNotifications([])
    setNotificationCount(0)
  }

  // 검색 기능
  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setShowSearchResults(false)
      return
    }

    // 간단한 검색 구현 (제목, 설명, 위치에서 검색)
    const results = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setSearchResults(results)
    setShowSearchResults(true)
  }

  // 샘플 추천 일정 데이터 추가
  const upcomingEvents = [
    {
      title: "부처님 미팅",
      startTime: "10:30",
      endTime: "12:00",
      color: "bg-pink-500/90",
    },
    {
      title: "제품 데모",
      startTime: "11:00",
      endTime: "12:00",
      color: "bg-purple-500/90",
    },
    {
      title: "고객 프레젠테이션",
      startTime: "11:00",
      endTime: "12:30",
      color: "bg-amber-600/90",
    },
  ]

  // AI 팝업 관련 코드 수정
  useEffect(() => {
    setIsLoaded(true)

    // AI 팝업 표시 코드 제거
    // const popupTimer = setTimeout(() => {
    //   setShowAIPopup(true)
    // }, 3000)

    // return () => clearTimeout(popupTimer)
  }, [])

  const [currentView, setCurrentView] = useState("week")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedCalendarId, setSelectedCalendarId] = useState("cal-1") // 기본 캘린더

  const handleEventClick = (event) => {
    setSelectedEvent(event)
  }

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Updated sample calendar events with all events before 4 PM
  const events = [
    {
      id: 1,
      title: "팀 미팅",
      startTime: "09:00",
      endTime: "10:00",
      color: "bg-blue-500",
      day: 1,
      description: "주간 팀 동기화 미팅",
      location: "회의실 A",
      attendees: ["홍길동", "김철수", "이영희"],
      organizer: "박지민",
      calendarId: "cal-1",
    },
    {
      id: 2,
      title: "사라와 점심",
      startTime: "12:30",
      endTime: "13:30",
      color: "bg-green-500",
      day: 1,
      description: "프로젝트 일정 논의",
      location: "카페 네로",
      attendees: ["이사라"],
      organizer: "나",
      calendarId: "cal-2",
    },
    {
      id: 3,
      title: "프로젝트 검토",
      startTime: "14:00",
      endTime: "15:30",
      color: "bg-purple-500",
      day: 3,
      description: "Q2 프로젝트 진행 상황 검토",
      location: "회의실 3",
      attendees: ["팀 알파", "이해관계자"],
      organizer: "프로젝트 매니저",
      calendarId: "cal-2",
    },
    {
      id: 4,
      title: "고객 통화",
      startTime: "10:00",
      endTime: "11:00",
      color: "bg-yellow-500",
      day: 2,
      description: "주요 고객과의 분기별 검토",
      location: "줌 미팅",
      attendees: ["고객팀", "영업팀"],
      organizer: "계정 매니저",
      calendarId: "cal-2",
    },
    {
      id: 5,
      title: "팀 브레인스토밍",
      startTime: "13:00",
      endTime: "14:30",
      color: "bg-indigo-500",
      day: 4,
      description: "새 제품 기능에 대한 아이디어 회의",
      location: "크리에이티브 스페이스",
      attendees: ["제품팀", "디자인팀"],
      organizer: "제품 책임자",
      calendarId: "cal-1",
    },
    {
      id: 6,
      title: "제품 데모",
      startTime: "11:00",
      endTime: "12:00",
      color: "bg-pink-500",
      day: 5,
      description: "이해관계자에게 새 기능 시연",
      location: "데모룸",
      attendees: ["이해관계자", "개발팀"],
      organizer: "기술 리더",
      calendarId: "cal-3",
    },
    {
      id: 7,
      title: "마케팅 회의",
      startTime: "13:00",
      endTime: "14:00",
      color: "bg-teal-500",
      day: 6,
      description: "Q3 마케팅 전략 논의",
      location: "마케팅 사무실",
      attendees: ["마케팅팀"],
      organizer: "마케팅 디렉터",
      calendarId: "cal-2",
    },
    {
      id: 8,
      title: "코드 리뷰",
      startTime: "15:00",
      endTime: "16:00",
      color: "bg-cyan-500",
      day: 7,
      description: "새 기능에 대한 풀 리퀘스트 검토",
      location: "개발 구역",
      attendees: ["개발팀"],
      organizer: "시니어 개발자",
      calendarId: "cal-2",
    },
    {
      id: 9,
      title: "아침 스탠드업",
      startTime: "08:30",
      endTime: "09:30",
      color: "bg-blue-400",
      day: 2,
      description: "일일 팀 스탠드업",
      location: "슬랙 허들",
      attendees: ["개발팀"],
      organizer: "스크럼 마스터",
      calendarId: "cal-2",
    },
    {
      id: 10,
      title: "디자인 검토",
      startTime: "14:30",
      endTime: "15:45",
      color: "bg-purple-400",
      day: 5,
      description: "새 UI 디자인 검토",
      location: "디자인 랩",
      attendees: ["UX팀", "제품 매니저"],
      organizer: "수석 디자이너",
      calendarId: "cal-1",
    },
    {
      id: 11,
      title: "투자자 미팅",
      startTime: "10:30",
      endTime: "12:00",
      color: "bg-red-400",
      day: 7,
      description: "분기별 투자자 업데이트",
      location: "이사회실",
      attendees: ["경영진", "투자자"],
      organizer: "CEO",
      calendarId: "cal-1",
    },
    {
      id: 12,
      title: "팀 교육",
      startTime: "09:30",
      endTime: "11:30",
      color: "bg-green-400",
      day: 4,
      description: "새 도구 온보딩 세션",
      location: "교육실",
      attendees: ["전 부서"],
      organizer: "인사팀",
      calendarId: "cal-4",
    },
    {
      id: 13,
      title: "예산 검토",
      startTime: "13:30",
      endTime: "15:00",
      color: "bg-yellow-400",
      day: 3,
      description: "분기별 예산 분석",
      location: "재무 사무실",
      attendees: ["재무팀", "부서장"],
      organizer: "CFO",
      calendarId: "cal-2",
    },
    {
      id: 14,
      title: "고객 프레젠테이션",
      startTime: "11:00",
      endTime: "12:30",
      color: "bg-orange-400",
      day: 6,
      description: "새 프로젝트 제안 발표",
      location: "고객 사무실",
      attendees: ["영업팀", "고객 대표"],
      organizer: "계정 책임자",
      calendarId: "cal-2",
    },
    {
      id: 15,
      title: "제품 계획",
      startTime: "14:00",
      endTime: "15:30",
      color: "bg-pink-400",
      day: 1,
      description: "Q3 로드맵 논의",
      location: "전략실",
      attendees: ["제품팀", "엔지니어링 리더"],
      organizer: "제품 매니저",
      calendarId: "cal-3",
    },
  ]

  // 활성화된 캘린더의 이벤트만 필터링
  const filteredEvents = events.filter((event) => activeCalendars.includes(event.calendarId))

  // Sample calendar days for the week view
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"]
  const weekDates = [3, 4, 5, 6, 7, 8, 9]
  const timeSlots = Array.from({ length: 9 }, (_, i) => i + 8) // 8 AM to 4 PM

  // Helper function to calculate event position and height
  const calculateEventStyle = (startTime, endTime) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = (start - 8) * 80 // 80px per hour
    const height = (end - start) * 80
    return { top: `${top}px`, height: `${height}px` }
  }

  // Sample calendar for mini calendar
  const daysInMonth = 31
  const firstDayOffset = 5 // Friday is the first day of the month in this example
  const miniCalendarDays = Array.from({ length: daysInMonth + firstDayOffset }, (_, i) =>
    i < firstDayOffset ? null : i - firstDayOffset + 1,
  )

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // Here you would typically also control the actual audio playback
  }

  // 미니 캘린더 날짜 클릭 핸들러
  const handleDateClick = (day) => {
    if (day) {
      setSelectedDay(day)
    }
  }

  // 검색 결과 닫기 기능 추가
  // useEffect 추가 - 외부 클릭 감지
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
                    <div className="text-white/70 text-xs">{result.location}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 알림 버튼 */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 hover:shadow-md"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center notification-badge">
                  {notificationCount}
                </span>
              )}
            </button>

            <NotificationsPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearAllNotifications}
            />
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
                <Image src={user.photoUrl || "/placeholder.svg"} alt="User avatar" fill className="object-cover" />
              </div>
            ) : (
              "U"
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
                    {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
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
                    {myCalendars.map((cal, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 cursor-pointer hover:bg-white/10 dark:hover:bg-gray-700/30 p-1 rounded-md"
                        onClick={() => toggleCalendar(cal.id)}
                      >
                        <input
                          type="checkbox"
                          checked={activeCalendars.includes(cal.id)}
                          onChange={() => toggleCalendar(cal.id)}
                          className="sr-only"
                          id={`cal-${cal.id}`}
                        />
                        <div
                          className={`w-3 h-3 rounded-sm ${cal.color} ${
                            !activeCalendars.includes(cal.id) ? "opacity-40" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCalendarId(cal.id)
                          }}
                        ></div>
                        <label
                          htmlFor={`cal-${cal.id}`}
                          className={`text-white text-sm flex-grow ${
                            !activeCalendars.includes(cal.id) ? "opacity-40" : ""
                          }`}
                        >
                          {cal.name}
                        </label>
                      </div>
                    ))}
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
              <button className="px-4 py-2 text-white bg-blue-500 rounded-md">오늘</button>
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
                      onClick={() => setSelectedDay(weekDates[i])}
                    >
                      <div className="text-xs text-white/70 font-medium">{day}</div>
                      <div
                        className={`text-lg font-medium mt-1 text-white ${weekDates[i] === selectedDay ? "bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""}`}
                      >
                        {weekDates[i]}
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
                  {Array.from({ length: 7 }).map((_, dayIndex) => (
                    <div key={dayIndex} className="border-l border-white/20 dark:border-gray-700/30 relative">
                      {timeSlots.map((_, timeIndex) => (
                        <div key={timeIndex} className="h-20 border-b border-white/10 dark:border-gray-700/20"></div>
                      ))}

                      {/* Events */}
                      {filteredEvents
                        .filter((event) => event.day === dayIndex + 1)
                        .map((event, i) => {
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

        {/* AI Popup */}
        {/* AI 추천 팝업 컴포넌트 제거 */}

        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${selectedEvent.color} p-6 rounded-lg shadow-xl max-w-md w-full mx-4 modal-animation`}>
              <h3 className="text-2xl font-bold mb-4 text-white">{selectedEvent.title}</h3>
              <div className="space-y-3 text-white">
                <p className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  {`${selectedEvent.startTime} - ${selectedEvent.endTime}`}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {selectedEvent.location}
                </p>
                <p className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  {`${weekDays[selectedEvent.day - 1]}, ${weekDates[selectedEvent.day - 1]} ${currentMonth}`}
                </p>
                <p className="flex items-start">
                  <Users className="mr-2 h-5 w-5 mt-1" />
                  <span>
                    <strong>참석자:</strong>
                    <br />
                    {selectedEvent.attendees.join(", ") || "참석자 없음"}
                  </span>
                </p>
                <p>
                  <strong>주최자:</strong> {selectedEvent.organizer}
                </p>
                <p>
                  <strong>설명:</strong> {selectedEvent.description}
                </p>
                <p>
                  <strong>캘린더:</strong>{" "}
                  {myCalendars.find((cal) => cal.id === selectedEvent.calendarId)?.name || "알 수 없음"}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
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
      </main>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleAddEvent}
        currentDate={selectedDay}
        calendars={myCalendars}
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

