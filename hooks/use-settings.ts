"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "./use-api"
import type { UserSettings } from "@/lib/api-services"

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchApi, isLoading: apiLoading } = useApi()

  const fetchSettings = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchApi<{ success: boolean; settings: UserSettings }>("settings")

      if (response.success && response.data?.settings) {
        setSettings(response.data.settings)
        // 설정에 따라 테마 적용
        if (response.data.settings.darkMode) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      } else {
        setError("설정을 불러오는데 실패했습니다.")
      }
    } catch (err: any) {
      setError(err.message || "설정을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }, [fetchApi])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const response = await fetchApi<{ success: boolean; settings: UserSettings }>("settings", {
        method: "PUT",
        body: newSettings,
      })

      if (response.success && response.data?.settings) {
        setSettings(response.data.settings)

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
    }
  }

  return {
    settings,
    isLoading: isLoading || apiLoading,
    error,
    updateSettings,
    refreshSettings: fetchSettings,
  }
}
