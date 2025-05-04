import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

// JWT 토큰 검증 및 사용자 정보 추가 미들웨어
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token

    // Authorization 헤더에서 토큰 추출
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }
    // 쿠키에서 토큰 추출 (대체 방법)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    // 토큰이 없는 경우
    if (!token) {
      console.log("인증 토큰이 없습니다")
      return res.status(401).json({ success: false, message: "인증되지 않았습니다. 로그인이 필요합니다." })
    }

    // 토큰 검증
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key"
    const decoded = jwt.verify(token, jwtSecret) as { id: string }

    console.log("토큰 검증 성공:", decoded)

    // 사용자 조회
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      console.log("토큰의 사용자를 찾을 수 없습니다:", decoded.id)
      return res.status(401).json({ success: false, message: "유효하지 않은 토큰입니다." })
    }

    // 요청 객체에 사용자 정보 추가
    req.user = user
    next()
  } catch (error: any) {
    console.error("인증 미들웨어 오류:", error)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "유효하지 않은 토큰입니다." })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "토큰이 만료되었습니다. 다시 로그인해주세요." })
    }

    res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." })
  }
}
