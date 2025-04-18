"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { apiClient } from "@/lib/api-client"

export interface UserSettings {
  _id: string
  user: string
  darkMode: boolean
  notifications: boolean
  timeFormat: "12h" | "24h"
  startOfWeek: "sunday" | "monday"
  createdAt: string
  updatedAt: string
}

interface SettingsResponse {
  success: boolean
  settings: UserSettings
}

export function useSettings() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    if (!session?.accessToken) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await apiClient<SettingsResponse>("settings", {
        token: session.accessToken as string,
      })

      if (data.success && data.settings) {
        setSettings(data.settings)

        // 설정에 따라 테마 적용
        if (data.settings.darkMode) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    } catch (err: any) {
      setError(err.message || "설정을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!session?.accessToken) return false

    try {
      setIsLoading(true)

      const data = await apiClient<SettingsResponse>("settings", {
        token: session.accessToken as string,
        method: "PUT",
        body: newSettings,
      })

      if (data.success && data.settings) {
        setSettings(data.settings)

        // 다크 모드 설정 업데이트 시 테마 변경
        if (newSettings.darkMode !== undefined) {
          if (newSettings.darkMode) {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        }

        return true
      }
      return false
    } catch (err) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refreshSettings: fetchSettings,
  }
}
