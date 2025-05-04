import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/userModel"

// JWT 토큰에서 추출한 사용자 정보를 Request 객체에 추가하기 위한 인터페이스 확장
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

interface JwtPayload {
  id: string
  iat: number
  exp: number
}

// 인증 미들웨어
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token

  // Authorization 헤더에서 토큰 추출
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]

      // 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as JwtPayload

      // 사용자 정보 조회 (비밀번호 제외)
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        res.status(401)
        throw new Error("Not authorized, user not found")
      }

      next()
    } catch (error) {
      console.error("Token verification error:", error)
      res.status(401)
      throw new Error("Not authorized, token failed")
    }
  }

  if (!token) {
    res.status(401)
    throw new Error("Not authorized, no token")
  }
})
