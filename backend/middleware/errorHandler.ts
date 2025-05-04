import type { Request, Response, NextFunction } from "express"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // 상태 코드 설정 (기본값 500)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  // 오류 로깅 강화
  console.error(`[${new Date().toISOString()}] 오류 발생:`)
  console.error(`- 경로: ${req.method} ${req.originalUrl}`)
  console.error(`- 상태 코드: ${statusCode}`)
  console.error(`- 메시지: ${err.message}`)
  console.error(`- 사용자 ID: ${req.user?._id || "인증되지 않음"}`)

  if (req.body && Object.keys(req.body).length > 0) {
    // 민감한 정보 필터링 (비밀번호 등)
    const filteredBody = { ...req.body }
    if (filteredBody.password) filteredBody.password = "[FILTERED]"
    console.error(`- 요청 본문:`, filteredBody)
  }

  console.error(`- 스택 트레이스:`, err.stack)

  // 개발 환경에서는 스택 트레이스 포함, 프로덕션에서는 제외
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    // 추가 디버깅 정보 (개발 환경에서만)
    debug:
      process.env.NODE_ENV !== "production"
        ? {
            path: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString(),
          }
        : undefined,
  })
}
