import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

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

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ success: false, message: "인증이 필요합니다" })
    }

    try {
      // JWT 시크릿 키 확인
      const jwtSecret = process.env.JWT_SECRET
      if (!jwtSecret) {
        console.error("JWT_SECRET 환경 변수가 설정되지 않았습니다")
        return res.status(500).json({ success: false, message: "서버 설정 오류" })
      }

      const decoded = jwt.verify(token, jwtSecret) as JwtPayload

      // 토큰 만료 시간 확인
      const now = Math.floor(Date.now() / 1000)
      if (decoded.exp && decoded.exp < now) {
        return res.status(401).json({ success: false, message: "토큰이 만료되었습니다" })
      }

      const user = await User.findById(decoded.id)

      if (!user) {
        return res.status(401).json({ success: false, message: "유효하지 않은 인증입니다" })
      }

      req.user = user
      next()
    } catch (jwtError) {
      console.error("JWT 검증 오류:", jwtError)
      return res.status(401).json({ success: false, message: "인증 토큰이 유효하지 않습니다" })
    }
  } catch (error) {
    console.error("인증 미들웨어 오류:", error)
    res.status(401).json({ success: false, message: "인증에 실패했습니다" })
  }
}
