"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "./use-api"
import type { Notification } from "@/lib/api-services"

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchApi, isLoading: apiLoading } = useApi()

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchApi<{ success: boolean; notifications: Notification[] }>("notifications")

      if (response.success && response.data?.notifications) {
        setNotifications(response.data.notifications)
        setUnreadCount(response.data.notifications.filter((notification) => !notification.read).length)
      } else {
        setError("알림을 불러오는데 실패했습니다.")
      }
    } catch (err: any) {
      setError(err.message || "알림을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }, [fetchApi])

  useEffect(() => {
    fetchNotifications()

    // 주기적으로 알림 업데이트 (선택적)
    const intervalId = setInterval(fetchNotifications, 60000) // 1분마다 업데이트
    return () => clearInterval(intervalId)
  }, [fetchNotifications])

  const markAsRead = async (id: string) => {
    try {
      const response = await fetchApi<{ success: boolean; notification: Notification }>(`notifications/${id}/read`, {
        method: "PUT",
      })

      if (response.success) {
        setNotifications(notifications.map((notif) => (notif._id === id ? { ...notif, read: true } : notif)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetchApi<{ success: boolean; message: string }>("notifications/read-all", {
        method: "PUT",
      })

      if (response.success) {
        setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
        setUnreadCount(0)
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetchApi<{ success: boolean; message: string }>(`notifications/${id}`, {
        method: "DELETE",
      })

      if (response.success) {
        const notif = notifications.find((n) => n._id === id)
        setNotifications(notifications.filter((notif) => notif._id !== id))
        if (notif && !notif.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1))
        }
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const deleteAllNotifications = async () => {
    try {
      const response = await fetchApi<{ success: boolean; message: string }>("notifications", {
        method: "DELETE",
      })

      if (response.success) {
        setNotifications([])
        setUnreadCount(0)
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading: isLoading || apiLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    refreshNotifications: fetchNotifications,
  }
}
