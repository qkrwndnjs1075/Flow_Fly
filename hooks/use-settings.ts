"use client"

import { useState, useEffect, useCallback } from "react"
import { useApi } from "./use-api"
import { useSession } from "next-auth/react"

export interface UserSettings {
  darkMode: boolean
  timeFormat: "12h" | "24h"
  startOfWeek: "sunday" | "monday"
}

// 전역 설정 객체 - 앱 전체에서 접근 가능
export const globalSettings = {
  darkMode: false,
  timeFormat: "12h",
  startOfWeek: "sunday",
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    timeFormat: "12h",
    startOfWeek: "sunday",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchApi, isLoading: apiLoading, error: apiError } = useApi()
  const { status } = useSession()

  // 로컬 스토리지 키 추가
  const LOCAL_SETTINGS_KEY = "flow_fly_user_settings"

  // 로컬 스토리지에서 설정 로드 함수 추가
  const loadSettingsFromLocalStorage = useCallback(() => {
    if (typeof window === "undefined") return null

    try {
      const storedSettings = localStorage.getItem(LOCAL_SETTINGS_KEY)
      if (storedSettings) {
        return JSON.parse(storedSettings)
      }
      return null
    } catch (err) {
      console.error("로컬 스토리지에서 설정 로드 오류:", err)
      return null
    }
  }, [])

  // 로컬 스토리지에 설정 저장 함수 추가
  const saveSettingsToLocalStorage = useCallback((settingsData: UserSettings) => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settingsData))
      console.log("설정이 로컬 스토리지에 저장됨:", settingsData)

      // 전역 설정 객체 업데이트
      Object.assign(globalSettings, settingsData)
      console.log("전역 설정 객체 업데이트됨:", globalSettings)
    } catch (err) {
      console.error("로컬 스토리지에 설정 저장 오류:", err)
    }
  }, [])

  // fetchSettings 함수 수정
  const fetchSettings = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 먼저 로컬 스토리지에서 설정 로드 시도
      const localSettings = loadSettingsFromLocalStorage()

      if (localSettings) {
        console.log("로컬 스토리지에서 설정 로드됨:", localSettings)
        const loadedSettings = {
          darkMode: localSettings.darkMode ?? false,
          timeFormat: localSettings.timeFormat ?? "12h",
          startOfWeek: localSettings.startOfWeek ?? "sunday",
        }
        setSettings(loadedSettings)

        // 전역 설정 객체 업데이트
        Object.assign(globalSettings, loadedSettings)
        console.log("전역 설정 객체 업데이트됨:", globalSettings)
      } else {
        console.log("로컬 스토리지에 설정이 없어 기본값 사용")
        // 설정이 없는 경우 기본값 사용
        const defaultSettings = {
          darkMode: false,
          timeFormat: "12h",
          startOfWeek: "sunday",
        }
        setSettings(defaultSettings)

        // 전역 설정 객체 업데이트
        Object.assign(globalSettings, defaultSettings)
      }
    } catch (err: any) {
      console.error("설정 로드 오류:", err)
      setError(err.message || "설정을 불러오는 중 오류가 발생했습니다.")
      // 오류 발생 시 기본값 사용
      const defaultSettings = {
        darkMode: false,
        timeFormat: "12h",
        startOfWeek: "sunday",
      }
      setSettings(defaultSettings)

      // 전역 설정 객체 업데이트
      Object.assign(globalSettings, defaultSettings)
    } finally {
      setIsLoading(false)
    }
  }, [loadSettingsFromLocalStorage])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  // API 에러 동기화
  useEffect(() => {
    if (apiError) {
      setError(apiError)
    }
  }, [apiError])

  // updateSettings 함수 수정
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }
      console.log("설정 업데이트 요청:", updatedSettings)

      // 로컬 상태 업데이트
      setSettings(updatedSettings)

      // 로컬 스토리지에 저장
      saveSettingsToLocalStorage(updatedSettings)

      // 전역 설정 객체 업데이트
      Object.assign(globalSettings, updatedSettings)
      console.log("전역 설정 객체 업데이트됨:", globalSettings)

      return true
    } catch (err) {
      console.error("설정 업데이트 오류:", err)
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
