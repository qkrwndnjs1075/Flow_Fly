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
  const router = useRouter()

  const fetchApi = async <T,>(
    endpoint: string,
    { requiresAuth = true, method = "GET", body = undefined, formData = undefined }: ApiOptions = {},
  ) => {
    setIsLoading(true)

    try {
      const headers: Record<string, string> = {}

      // 인증이 필요한 경우 토큰 추가
      if (requiresAuth) {
        if (!session?.accessToken) {
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
      }

      const response = await fetch(`${API_URL}/${endpoint}`, requestOptions)

      // 인증 오류 처리
      if (response.status === 401) {
        router.push("/login")
        throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.")
      }

      const data = (await response.json()) as T

      return { data, status: response.status, success: response.ok }
    } catch (error: any) {
      console.error(`API 오류 (${endpoint}):`, error)
      return { error: error.message, status: 500, success: false }
    } finally {
      setIsLoading(false)
    }
  }

  return { fetchApi, isLoading }
}
