"use client"

// 이 파일이 존재하지 않는 경우 새로 생성합니다
import { useState, useCallback } from "react"
import { useSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface ApiOptions {
  method?: string
  body?: any
  formData?: FormData
  timeout?: number
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  const fetchApi = useCallback(\
    async <T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> => {
  const { method = "GET", body, formData, timeout = 30000 } = options
  setIsLoading(true)
  setError(null)

  const headers: Record<string, string> = {}

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`
  }

  if (body && !formData) {
    headers["Content-Type"] = "application/json"
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  const config: RequestInit = {
    method,
    headers,
    body: formData || (body ? JSON.stringify(body) : undefined),
    credentials: "include",
    signal: controller.signal,
  }

  try {
    console.log(`API 요청: ${API_URL}/${endpoint}`, { method, body: body || formData })

    const response = await fetch(`${API_URL}/${endpoint}`, config)
    clearTimeout(timeoutId)

    // 응답이 JSON이 아닌 경우 처리
    let data: any
    const contentType = response.headers.get("content-type")

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error(`API 응답이 JSON이 아닙니다: ${endpoint}`, text)
      return {
        success: false,
        error: `유효하지 않은 API 응답: ${text.substring(0, 100)}...`,
      }
    }

    console.log(`API 응답: ${endpoint}`, data)

    if (!response.ok) {
      throw new Error(data.message || `API 요청 실패: ${response.status}`)
    }

    return { success: true, data }
  } catch (error: any) {
    clearTimeout(timeoutId)

    if (error.name === "AbortError") {
      console.error(`API 요청 타임아웃: ${endpoint}`)
      setError("요청 시간이 초과되었습니다")
      return { success: false, error: "요청 시간이 초과되었습니다" }
    }

    console.error(`API 오류 (${endpoint}):`, error)
    setError(error.message || "API 요청 중 오류가 발생했습니다")
    return { success: false, error: error.message || "API 요청 중 오류가 발생했습니다" }
  } finally {
    setIsLoading(false)
  }
}
,
    [session]
  )

return { fetchApi, isLoading, error }
}
