"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "./use-api"
import type { Event } from "@/lib/api-services"

interface UseEventsProps {
  year?: number
  month?: number
  day?: number
}

export function useEvents({ year, month, day }: UseEventsProps = {}) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchApi, isLoading: apiLoading } = useApi()

  const buildQueryParams = useCallback(() => {
    const params: string[] = []
    if (year !== undefined) params.push(`year=${year}`)
    if (month !== undefined) params.push(`month=${month}`)
    if (day !== undefined) params.push(`day=${day}`)
    return params.length > 0 ? `?${params.join("&")}` : ""
  }, [year, month, day])

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const queryParams = buildQueryParams()
      const response = await fetchApi<{ success: boolean; events: Event[] }>(`events${queryParams}`)

      if (response.success && response.data?.events) {
        setEvents(response.data.events)
      } else {
        setError("일정을 불러오는데 실패했습니다.")
      }
    } catch (err: any) {
      setError(err.message || "일정을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }, [fetchApi, buildQueryParams])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const addEvent = async (eventData: Omit<Event, "_id" | "user" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetchApi<{ success: boolean; event: Event }>("events", {
        method: "POST",
        body: eventData,
      })

      if (response.success && response.data?.event) {
        setEvents([...events, response.data.event])
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      const response = await fetchApi<{ success: boolean; event: Event }>(`events/${id}`, {
        method: "PUT",
        body: eventData,
      })

      if (response.success && response.data?.event) {
        setEvents(events.map((event) => (event._id === id ? response.data.event : event)))
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetchApi<{ success: boolean; message: string }>(`events/${id}`, {
        method: "DELETE",
      })

      if (response.success) {
        setEvents(events.filter((event) => event._id !== id))
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const searchEvents = async (query: string) => {
    try {
      const response = await fetchApi<{ success: boolean; results: Event[] }>(
        `search/events?query=${encodeURIComponent(query)}`,
      )

      if (response.success) {
        return response.data?.results || []
      }
      return []
    } catch (err) {
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
