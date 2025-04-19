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

// RequestHandler 타입으로 명시적 정의
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "인증이 필요합니다" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as JwtPayload
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: "유효하지 않은 인증입니다" })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: "인증에 실패했습니다" })
  }
}
