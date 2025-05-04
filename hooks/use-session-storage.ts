"use client"

import { useState, useEffect } from "react"

// 세션 스토리지에 데이터를 저장하고 불러오는 훅
export function useSessionStorage<T>(key: string, initialValue: T) {
  // 상태 초기화 함수
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`세션 스토리지 데이터 로드 오류 (${key}):`, error)
      return initialValue
    }
  })

  // 값이 변경될 때마다 세션 스토리지 업데이트
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      window.sessionStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`세션 스토리지 데이터 저장 오류 (${key}):`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}
