"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"

export interface Event {
  _id: string
  title: string
  description?: string
  location?: string
  date: string
  startTime: string
  endTime: string
  day: number
  calendar: string
  calendarId?: string
  user: string
  color?: string
  isAllDay?: boolean
  isRecurring?: boolean
  recurrencePattern?: string
  createdAt: string
  updatedAt: string
}

export type EventFormData = Omit<Event, "_id" | "user" | "createdAt" | "updatedAt">

// 로컬 스토리지 키
const LOCAL_EVENTS_KEY = "flow_fly_events"

// 샘플 이벤트 데이터
const SAMPLE_EVENTS = [
  {
    _id: "event-1",
    title: "팀 미팅",
    description: "주간 팀 동기화 미팅",
    location: "회의실 A",
    date: new Date().toISOString(),
    startTime: "09:00",
    endTime: "10:00",
    day: 1,
    calendar: "cal-1",
    user: "default-user",
    color: "bg-blue-500",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "event-2",
    title: "고객 통화",
    description: "주요 고객과의 분기별 검토",
    location: "줌 미팅",
    date: new Date().toISOString(),
    startTime: "10:00",
    endTime: "11:00",
    day: 2,
    calendar: "cal-2",
    user: "default-user",
    color: "bg-green-500",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function useEvents(year?: number, month?: number, day?: number) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { status } = useSession()

  // 로컬 스토리지에서 이벤트 데이터 로드
  const loadEventsFromLocalStorage = useCallback(() => {
    try {
      const storedEvents = localStorage.getItem(LOCAL_EVENTS_KEY)
      if (storedEvents) {
        return JSON.parse(storedEvents)
      }
      // 저장된 데이터가 없으면 샘플 이벤트 사용
      return SAMPLE_EVENTS
    } catch (err) {
      console.error("로컬 스토리지에서 이벤트 로드 오류:", err)
      return SAMPLE_EVENTS
    }
  }, [])

  // 로컬 스토리지에 이벤트 데이터 저장
  const saveEventsToLocalStorage = useCallback((eventsData: Event[]) => {
    try {
      localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(eventsData))
    } catch (err) {
      console.error("로컬 스토리지에 이벤트 저장 오류:", err)
    }
  }, [])

  // 이벤트 필터링 (연도, 월, 일 기준)
  const filterEvents = useCallback(
    (allEvents: Event[]) => {
      if (!year && !month && !day) return allEvents

      return allEvents.filter((event) => {
        try {
          const eventDate = new Date(event.date)

          // 날짜가 유효하지 않은 경우 처리
          if (isNaN(eventDate.getTime())) {
            console.warn("유효하지 않은 이벤트 날짜:", event)
            return false
          }

          // 연도, 월, 일 기준으로 필터링
          const matchesYear = !year || eventDate.getFullYear() === year
          const matchesMonth = !month || eventDate.getMonth() === month - 1
          const matchesDay = !day || eventDate.getDate() === day

          // 날짜 디버깅
          console.log("이벤트 날짜 비교:", {
            eventId: event._id,
            eventDate: eventDate.toISOString(),
            eventYear: eventDate.getFullYear(),
            eventMonth: eventDate.getMonth() + 1,
            eventDay: eventDate.getDate(),
            filterYear: year,
            filterMonth: month,
            filterDay: day,
            matches: matchesYear && matchesMonth && matchesDay,
          })

          return matchesYear && matchesMonth && matchesDay
        } catch (error) {
          console.error("이벤트 날짜 처리 오류:", error, event)
          return false
        }
      })
    },
    [year, month, day],
  )

  // 이벤트 데이터 로드
  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const allEvents = loadEventsFromLocalStorage()
      const filteredEvents = filterEvents(allEvents)
      setEvents(filteredEvents)
    } catch (err: any) {
      console.error("이벤트 로드 오류:", err)
      setError("일정을 불러오는 중 오류가 발생했습니다.")
      setEvents(filterEvents(SAMPLE_EVENTS))
    } finally {
      setIsLoading(false)
    }
  }, [loadEventsFromLocalStorage, filterEvents])

  // 컴포넌트 마운트 시 이벤트 로드
  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // 이벤트 추가
  const addEvent = async (eventData: EventFormData) => {
    try {
      // 모든 이벤트 로드 (필터링 없이)
      const allEvents = loadEventsFromLocalStorage()

      // 날짜 처리 개선
      let eventDate = new Date()
      if (eventData.date) {
        if (typeof eventData.date === "string") {
          eventDate = new Date(eventData.date)
        } else if (eventData.date instanceof Date) {
          eventDate = eventData.date
        }
      }

      // 날짜가 유효하지 않은 경우 현재 날짜 사용
      if (isNaN(eventDate.getTime())) {
        console.warn("유효하지 않은 이벤트 날짜, 현재 날짜로 대체:", eventData.date)
        eventDate = new Date()
      }

      // 새 이벤트 생성
      const newEvent: Event = {
        _id: `event-${Date.now()}`,
        ...eventData,
        date: eventDate.toISOString(), // ISO 문자열로 변환하여 저장
        calendar: eventData.calendarId || eventData.calendar,
        user: "local-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log("새 이벤트 생성:", newEvent)

      // 이벤트 추가 및 저장
      const updatedEvents = [...allEvents, newEvent]
      saveEventsToLocalStorage(updatedEvents)

      // 현재 필터링된 이벤트 목록 업데이트
      setEvents((prevEvents) => {
        if (filterEvents([newEvent]).length > 0) {
          return [...prevEvents, newEvent]
        }
        return prevEvents
      })

      return true
    } catch (err) {
      console.error("이벤트 추가 오류:", err)
      return false
    }
  }

  // 이벤트 업데이트
  const updateEvent = async (id: string, eventData: Partial<EventFormData>) => {
    try {
      // 모든 이벤트 로드
      const allEvents = loadEventsFromLocalStorage()

      // 이벤트 업데이트
      const updatedAllEvents = allEvents.map((event) =>
        event._id === id
          ? {
              ...event,
              ...eventData,
              updatedAt: new Date().toISOString(),
            }
          : event,
      )

      // 저장
      saveEventsToLocalStorage(updatedAllEvents)

      // 현재 필터링된 이벤트 목록 업데이트
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === id
            ? {
                ...event,
                ...eventData,
                updatedAt: new Date().toISOString(),
              }
            : event,
        ),
      )

      return true
    } catch (err) {
      console.error("이벤트 업데이트 오류:", err)
      return false
    }
  }

  // 이벤트 삭제
  const deleteEvent = async (id: string) => {
    try {
      // 모든 이벤트 로드
      const allEvents = loadEventsFromLocalStorage()

      // 이벤트 삭제
      const updatedAllEvents = allEvents.filter((event) => event._id !== id)

      // 저장
      saveEventsToLocalStorage(updatedAllEvents)

      // 현재 필터링된 이벤트 목록 업데이트
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id))

      return true
    } catch (err) {
      console.error("이벤트 삭제 오류:", err)
      return false
    }
  }

  return {
    events,
    isLoading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: fetchEvents,
  }
}
