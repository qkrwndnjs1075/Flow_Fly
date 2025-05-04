"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "./use-api"
import type { Calendar } from "@/lib/api-services"
import { useSession } from "next-auth/react"

export function useCalendars() {
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchApi, isLoading: apiLoading, error: apiError } = useApi()
  const { status } = useSession()

  const fetchCalendars = useCallback(async () => {
    // 인증되지 않은 경우 건너뛰기
    if (status !== "authenticated") {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchApi<{ success: boolean; calendars: Calendar[] }>("calendars")

      if (response.success && response.data?.calendars) {
        setCalendars(response.data.calendars)
      } else {
        console.error("캘린더 데이터 형식 오류:", response)
        setError("캘린더 데이터를 불러오는데 실패했습니다.")
      }
    } catch (err: any) {
      setError(err.message || "캘린더를 불러오는 중 오류가 발생했습니다.")
      console.error("캘린더 로드 오류:", err)
    } finally {
      setIsLoading(false)
    }
  }, [fetchApi, status])

  useEffect(() => {
    if (status === "authenticated") {
      fetchCalendars()
    }
  }, [fetchCalendars, status])

  // API 에러 동기화
  useEffect(() => {
    if (apiError) {
      setError(apiError)
    }
  }, [apiError])

  const addCalendar = async (name: string, color: string) => {
    try {
      const response = await fetchApi<{ success: boolean; calendar: Calendar }>("calendars", {
        method: "POST",
        body: { name, color },
      })

      if (response.success) {
        // 새 캘린더 추가 후 전체 목록 다시 불러오기
        await fetchCalendars()
        return true
      }
      return false
    } catch (err) {
      console.error("캘린더 추가 오류:", err)
      return false
    }
  }

  const updateCalendar = async (id: string, name: string, color: string) => {
    try {
      const response = await fetchApi<{ success: boolean; calendar: Calendar }>(`calendars/${id}`, {
        method: "PUT",
        body: { name, color },
      })

      if (response.success) {
        // 캘린더 업데이트 후 전체 목록 다시 불러오기
        await fetchCalendars()
        return true
      }
      return false
    } catch (err) {
      console.error("캘린더 업데이트 오류:", err)
      return false
    }
  }

  const deleteCalendar = async (id: string) => {
    try {
      const response = await fetchApi<{ success: boolean }>(`calendars/${id}`, {
        method: "DELETE",
      })

      if (response.success) {
        // 캘린더 삭제 후 전체 목록 다시 불러오기
        await fetchCalendars()
        return true
      }
      return false
    } catch (err) {
      console.error("캘린더 삭제 오류:", err)
      return false
    }
  }

  return {
    calendars,
    isLoading: isLoading || apiLoading,
    error,
    addCalendar,
    updateCalendar,
    deleteCalendar,
    refreshCalendars: fetchCalendars,
  }
}
