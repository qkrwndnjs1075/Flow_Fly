const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface ApiOptions {
  token?: string
  method?: string
  body?: any
  formData?: FormData
}

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, method = "GET", body, formData } = options

  const headers: Record<string, string> = {}

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (body && !formData) {
    headers["Content-Type"] = "application/json"
  }

  const config: RequestInit = {
    method,
    headers,
    body: formData || (body ? JSON.stringify(body) : undefined),
  }

  const response = await fetch(`${API_URL}/${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API 요청 실패: ${response.status}`)
  }

  return response.json()
}
