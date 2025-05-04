export function logApiRequest(endpoint: string, method: string, headers: any, body: any) {
  console.group(`🚀 API 요청: ${method} ${endpoint}`)
  console.log("헤더:", headers)
  console.log("본문:", body)
  console.groupEnd()
}

// API 응답 로깅 함수
export function logApiResponse(endpoint: string, status: number, data: any) {
  const isSuccess = status >= 200 && status < 300

  console.group(`${isSuccess ? "✅" : "❌"} API 응답: ${status} ${endpoint}`)
  console.log("데이터:", data)
  console.groupEnd()

  return isSuccess
}

// API 오류 로깅 함수
export function logApiError(endpoint: string, error: any) {
  console.group(`❌ API 오류: ${endpoint}`)
  console.error("오류:", error)
  console.trace("스택 트레이스:")
  console.groupEnd()
}

// 네트워크 상태 확인 함수
export function checkNetworkStatus(): boolean {
  if (typeof navigator !== "undefined") {
    return navigator.onLine
  }
  return true
}

// API 요청 재시도 함수
export async function retryApiRequest<T>(requestFn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error
      console.warn(`API 요청 실패 (시도 ${attempt}/${maxRetries}):`, error)

      if (attempt < maxRetries) {
        // 지수 백오프 적용
        const backoffDelay = delay * Math.pow(2, attempt - 1)
        console.log(`${backoffDelay}ms 후 재시도...`)
        await new Promise((resolve) => setTimeout(resolve, backoffDelay))
      }
    }
  }

  throw lastError
}
