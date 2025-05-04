"use client"

import { useState, useEffect, useCallback } from "react"
import { useLocalStorage } from "./use-local-storage"

// 오프라인 상태에서도 데이터를 저장하고 동기화하는 훅
export function useOfflineStorage<T>(key: string, initialValue: T, syncFn?: (data: T) => Promise<void>) {
  // 로컬 스토리지에 데이터 저장
  const [storedData, setStoredData] = useLocalStorage<T>(key, initialValue)

  // 동기화 상태 관리
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true)

  // 오프라인 변경사항 추적
  const [pendingChanges, setPendingChanges] = useLocalStorage<boolean>(`${key}_pending`, false)

  // 온라인 상태 감지
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // 데이터 업데이트 함수
  const updateData = useCallback(
    (newData: T) => {
      setStoredData(newData)

      // 오프라인 상태면 변경사항 표시
      if (!isOnline && syncFn) {
        setPendingChanges(true)
      } else if (syncFn) {
        // 온라인 상태면 즉시 동기화 시도
        setIsSyncing(true)
        setSyncError(null)

        syncFn(newData)
          .then(() => {
            setIsSyncing(false)
            setPendingChanges(false)
          })
          .catch((err) => {
            console.error(`동기화 오류 (${key}):`, err)
            setIsSyncing(false)
            setSyncError(err.message || "동기화 실패")
            setPendingChanges(true)
          })
      }
    },
    [isOnline, key, setStoredData, setPendingChanges, syncFn],
  )

  // 온라인 상태가 되면 보류 중인 변경사항 동기화
  useEffect(() => {
    if (isOnline && pendingChanges && syncFn) {
      setIsSyncing(true)
      setSyncError(null)

      syncFn(storedData)
        .then(() => {
          setIsSyncing(false)
          setPendingChanges(false)
        })
        .catch((err) => {
          console.error(`동기화 오류 (${key}):`, err)
          setIsSyncing(false)
          setSyncError(err.message || "동기화 실패")
        })
    }
  }, [isOnline, pendingChanges, storedData, syncFn, key, setPendingChanges])

  return {
    data: storedData,
    updateData,
    isSyncing,
    syncError,
    isOnline,
    hasPendingChanges: pendingChanges,
  }
}
