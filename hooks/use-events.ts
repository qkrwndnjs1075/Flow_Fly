"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "./use-api"
import type { Event } from "@/lib/api-services"
import { useSession } from "next-auth/react"

interface UseEventsProps {
  year?: number
  month?: number
  day?: number
}

export function useEvents({ year, month, day }: UseEventsProps = {}) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchApi, isLoading: apiLoading, error: apiError } = useApi()
  const { status } = useSession()

  const buildQueryParams = useCallback(() => {
    const params: string[] = []
    if (year !== undefined) params.push(`year=${year}`)
    if (month !== undefined) params.push(`month=${month}`)
    if (day !== undefined) params.push(`day=${day}`)
    return params.length > 0 ? `?${params.join("&")}` : ""
  }, [year, month, day])

  const fetchEvents = useCallback(async () => {
    // 인증되지 않은 경우 건너뛰기
    if (status !== "authenticated") {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const queryParams = buildQueryParams()
      const response = await fetchApi<{ success: boolean; events: Event[] }>(`events${queryParams}`)

      if (response.success && response.data?.events) {
        setEvents(response.data.events)
      } else {
        console.error("이벤트 데이터 형식 오류:", response)
        setError("일정을 불러오는데 실패했습니다.")
      }
    } catch (err: any) {
      setError(err.message || "일정을 불러오는 중 오류가 발생했습니다.")
      console.error("이벤트 로드 오류:", err)
    } finally {
      setIsLoading(false)
    }
  }, [fetchApi, buildQueryParams, status])

  useEffect(() => {
    if (status === "authenticated") {
      fetchEvents()
    }
  }, [fetchEvents, status])

  // API 에러 동기화
  useEffect(() => {
    if (apiError) {
      setError(apiError)
    }
  }, [apiError])

  const addEvent = async (eventData: Omit<Event, "_id" | "user" | "createdAt" | "updatedAt">) => {
    try {
      console.log("이벤트 추가 요청 데이터:", eventData)
      const response = await fetchApi<{ success: boolean; event: Event }>("events", {
        method: "POST",
        body: eventData,
      })

      if (response.success) {
        // 이벤트 추가 후 전체 목록 다시 불러오기
        await fetchEvents()
        return true
      }
      return false
    } catch (err) {
      console.error("이벤트 추가 오류:", err)
      return false
    }
  }

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      const response = await fetchApi<{ success: boolean; event: Event }>(`events/${id}`, {
        method: "PUT",
        body: eventData,
      })

      if (response.success) {
        // 이벤트 업데이트 후 전체 목록 다시 불러오기
        await fetchEvents()
        return true
      }
      return false
    } catch (err) {
      console.error("이벤트 업데이트 오류:", err)
      return false
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetchApi<{ success: boolean }>(`events/${id}`, {
        method: "DELETE",
      })

      if (response.success) {
        // 이벤트 삭제 후 전체 목록 다시 불러오기
        await fetchEvents()
        return true
      }
      return false
    } catch (err) {
      console.error("이벤트 삭제 오류:", err)
      return false
    }
  }

  const searchEvents = async (query: string) => {
    try {
      const response = await fetchApi<{ success: boolean; results: Event[] }>(
        `search/events?query=${encodeURIComponent(query)}`,
      )
      return response.data?.results || []
    } catch (err) {
      console.error("이벤트 검색 오류:", err)
      return []
    }
  }

  return {
    events,
    isLoading: isLoading || apiLoading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    searchEvents,
    refreshEvents: fetchEvents,
  }
}
