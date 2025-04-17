import type { Request, Response, NextFunction } from "express"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)

  const statusCode = err.statusCode || 500
  const message = err.message || "서버 오류가 발생했습니다"

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  })
}
