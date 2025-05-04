"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"

export interface Calendar {
  _id: string
  name: string
  color: string
  user: string
  isDefault?: boolean
  createdAt: string
  updatedAt: string
}

// 로컬 스토리지 키
const LOCAL_CALENDARS_KEY = "flow_fly_calendars"

// 기본 캘린더 데이터
const DEFAULT_CALENDARS = [
  {
    _id: "cal-1",
    name: "내 캘린더",
    color: "bg-blue-500",
    user: "default-user",
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "cal-2",
    name: "업무",
    color: "bg-green-500",
    user: "default-user",
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "cal-3",
    name: "개인",
    color: "bg-purple-500",
    user: "default-user",
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function useCalendars() {
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { status } = useSession()

  // 로컬 스토리지에서 캘린더 데이터 로드
  const loadCalendarsFromLocalStorage = useCallback(() => {
    try {
      const storedCalendars = localStorage.getItem(LOCAL_CALENDARS_KEY)
      if (storedCalendars) {
        return JSON.parse(storedCalendars)
      }
      // 저장된 데이터가 없으면 기본 캘린더 사용
      return DEFAULT_CALENDARS
    } catch (err) {
      console.error("로컬 스토리지에서 캘린더 로드 오류:", err)
      return DEFAULT_CALENDARS
    }
  }, [])

  // 로컬 스토리지에 캘린더 데이터 저장
  const saveCalendarsToLocalStorage = useCallback((calendarsData: Calendar[]) => {
    try {
      localStorage.setItem(LOCAL_CALENDARS_KEY, JSON.stringify(calendarsData))
    } catch (err) {
      console.error("로컬 스토리지에 캘린더 저장 오류:", err)
    }
  }, [])

  // 캘린더 데이터 로드
  const fetchCalendars = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const loadedCalendars = loadCalendarsFromLocalStorage()
      setCalendars(loadedCalendars)
    } catch (err: any) {
      console.error("캘린더 로드 오류:", err)
      setError("캘린더를 불러오는 중 오류가 발생했습니다.")
      setCalendars(DEFAULT_CALENDARS)
    } finally {
      setIsLoading(false)
    }
  }, [loadCalendarsFromLocalStorage])

  // 컴포넌트 마운트 시 캘린더 로드
  useEffect(() => {
    fetchCalendars()
  }, [fetchCalendars])

  // 캘린더 추가
  const addCalendar = async (name: string, color: string) => {
    try {
      const newCalendar: Calendar = {
        _id: `cal-${Date.now()}`,
        name,
        color,
        user: "local-user",
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const updatedCalendars = [...calendars, newCalendar]
      setCalendars(updatedCalendars)
      saveCalendarsToLocalStorage(updatedCalendars)
      return true
    } catch (err) {
      console.error("캘린더 추가 오류:", err)
      return false
    }
  }

  // 캘린더 업데이트
  const updateCalendar = async (id: string, name: string, color: string) => {
    try {
      const updatedCalendars = calendars.map((cal) =>
        cal._id === id
          ? {
              ...cal,
              name,
              color,
              updatedAt: new Date().toISOString(),
            }
          : cal,
      )
      setCalendars(updatedCalendars)
      saveCalendarsToLocalStorage(updatedCalendars)
      return true
    } catch (err) {
      console.error("캘린더 업데이트 오류:", err)
      return false
    }
  }

  // 캘린더 삭제
  const deleteCalendar = async (id: string) => {
    try {
      // 기본 캘린더는 삭제 불가
      const calendarToDelete = calendars.find((cal) => cal._id === id)
      if (calendarToDelete?.isDefault) {
        setError("기본 캘린더는 삭제할 수 없습니다.")
        return false
      }

      const updatedCalendars = calendars.filter((cal) => cal._id !== id)
      setCalendars(updatedCalendars)
      saveCalendarsToLocalStorage(updatedCalendars)
      return true
    } catch (err) {
      console.error("캘린더 삭제 오류:", err)
      return false
    }
  }

  return {
    calendars,
    isLoading,
    error,
    addCalendar,
    updateCalendar,
    deleteCalendar,
    refreshCalendars: fetchCalendars,
  }
}
