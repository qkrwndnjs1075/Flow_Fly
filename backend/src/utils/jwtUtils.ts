import jwt from "jsonwebtoken"

// JWT 토큰 생성 함수
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "30d" })
}
