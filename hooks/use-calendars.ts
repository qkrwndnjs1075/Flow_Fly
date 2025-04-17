"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "./use-api"
import type { Calendar } from "@/lib/api-services"

export function useCalendars() {
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchApi, isLoading: apiLoading } = useApi()

  const fetchCalendars = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchApi<{ success: boolean; calendars: Calendar[] }>("calendars")

      if (response.success && response.data?.calendars) {
        setCalendars(response.data.calendars)
      } else {
        setError("캘린더를 불러오는데 실패했습니다.")
      }
    } catch (err: any) {
      setError(err.message || "캘린더를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }, [fetchApi])

  useEffect(() => {
    fetchCalendars()
  }, [fetchCalendars])

  const addCalendar = async (name: string, color: string) => {
    try {
      const response = await fetchApi<{ success: boolean; calendar: Calendar }>("calendars", {
        method: "POST",
        body: { name, color },
      })

      if (response.success && response.data?.calendar) {
        setCalendars([...calendars, response.data.calendar])
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const updateCalendar = async (id: string, name: string, color: string) => {
    try {
      const response = await fetchApi<{ success: boolean; calendar: Calendar }>(`calendars/${id}`, {
        method: "PUT",
        body: { name, color },
      })

      if (response.success && response.data?.calendar) {
        setCalendars(calendars.map((cal) => (cal._id === id ? response.data.calendar : cal)))
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const deleteCalendar = async (id: string) => {
    try {
      const response = await fetchApi<{ success: boolean; message: string }>(`calendars/${id}`, {
        method: "DELETE",
      })

      if (response.success) {
        setCalendars(calendars.filter((cal) => cal._id !== id))
        return true
      }
      return false
    } catch (err) {
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
