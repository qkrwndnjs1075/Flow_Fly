"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

type ApiOptions = {
  requiresAuth?: boolean
  method?: string
  body?: any
  formData?: FormData
}

export function useApi() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // useApi 훅의 fetchApi 함수를 수정합니다
  const fetchApi = async <T,>(
    endpoint: string,
    { requiresAuth = true, method = "GET", body = undefined, formData = undefined }: ApiOptions = {},
  ): Promise<{ success: boolean; data?: T; message?: string }> => {
    setIsLoading(true)
    setError(null)

    try {
      const headers: Record<string, string> = {}

      // 인증이 필요한 경우 토큰 추가
      if (requiresAuth) {
        if (!session?.accessToken) {
          console.error("인증 토큰이 없습니다. 세션:", session)
          router.push("/login")
          throw new Error("인증이 필요합니다. 로그인해주세요.")
        }
        headers["Authorization"] = `Bearer ${session.accessToken}`
      }

      // JSON 본문 또는 FormData 설정
      if (body && !formData) {
        headers["Content-Type"] = "application/json"
      }

      const requestOptions: RequestInit = {
        method,
        headers,
        body: formData || (body ? JSON.stringify(body) : undefined),
        credentials: "include", // 중요: credentials 추가
      }

      console.log(`API 요청: ${API_URL}/${endpoint}`, { method, headers, body: body || formData })

      const response = await fetch(`${API_URL}/${endpoint}`, requestOptions)

      // 인증 오류 처리
      if (response.status === 401) {
        console.error("인증 오류 (401):", await response.text())
        router.push("/login")
        throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.")
      }

      // 응답이 JSON이 아닌 경우 처리
      const contentType = response.headers.get("content-type")
      let data

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        console.error(`API 응답이 유효한 JSON이 아닙니다: ${endpoint}`, text)
        throw new Error(`유효하지 않은 API 응답: ${text.substring(0, 100)}...`)
      }

      console.log(`API 응답: ${endpoint}`, data)

      if (!response.ok) {
        throw new Error(data.message || `API 요청 실패: ${response.status}`)
      }

      return data
    } catch (err: any) {
      console.error(`API 오류 (${endpoint}):`, err)
      setError(err.message || "알 수 없는 오류가 발생했습니다")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { fetchApi, isLoading, error }
}
