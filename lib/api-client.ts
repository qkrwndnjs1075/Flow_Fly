const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface ApiOptions {
  token?: string
  method?: string
  body?: any
  formData?: FormData
  timeout?: number
}

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, method = "GET", body, formData, timeout = 30000 } = options

  const headers: Record<string, string> = {}

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
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
      throw new Error(`유효하지 않은 API 응답: ${text.substring(0, 100)}...`)
    }

    console.log(`API 응답: ${endpoint}`, data)

    if (!response.ok) {
      throw new Error(data.message || `API 요청 실패: ${response.status}`)
    }

    return data
  } catch (error: any) {
    clearTimeout(timeoutId)

    if (error.name === "AbortError") {
      console.error(`API 요청 타임아웃: ${endpoint}`)
      throw new Error("요청 시간이 초과되었습니다")
    }

    console.error(`API 오류 (${endpoint}):`, error)
    throw error
  }
}
