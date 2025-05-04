import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"
import Calendar from "../models/Calendar"
import { sendVerificationEmail, verifyEmailConnection } from "../utils/email"

// JWT 토큰 생성 함수
const generateToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET || "your-secret-key"
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "30d",
  })
}

// 회원가입
export const signup = async (req: Request, res: Response) => {
  try {
    console.log("회원가입 요청:", req.body)
    const { name, email, password, verificationCode } = req.body

    // 필수 필드 검증
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "모든 필드를 입력해주세요" })
    }

    // 이메일 형식 검증
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "유효한 이메일 주소를 입력해주세요" })
    }

    // 비밀번호 강도 검증
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "비밀번호는 최소 8자 이상이어야 합니다" })
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: "이미 사용 중인 이메일입니다" })
    }

    // 사용자 생성
    const user = await User.create({
      name,
      email,
      password,
      provider: "email",
    })

    console.log("사용자 생성 성공:", user._id)

    // 기본 캘린더 생성
    const calendar = await Calendar.create({
      name: "내 캘린더",
      color: "bg-blue-500",
      user: user._id,
    })

    console.log("기본 캘린더 생성 성공:", calendar._id)

    // 토큰 생성
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        provider: user.provider,
      },
    })
  } catch (error: any) {
    console.error("회원가입 오류:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// 로그인
export const login = async (req: Request, res: Response) => {
  try {
    console.log("로그인 요청:", req.body)
    const { email, password } = req.body

    // 필수 필드 검증
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "이메일과 비밀번호를 입력해주세요" })
    }

    // 사용자 확인
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다" })
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다" })
    }

    // 토큰 생성
    const token = generateToken(user._id)

    console.log("로그인 성공:", user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        provider: user.provider,
      },
    })
  } catch (error: any) {
    console.error("로그인 오류:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Google 로그인/회원가입
export const googleAuth = async (req: Request, res: Response) => {
  try {
    console.log("구글 인증 요청:", req.body)
    const { name, email, photoUrl } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "이메일이 제공되지 않았습니다",
      })
    }

    // 사용자 확인 또는 생성
    let user = await User.findOne({ email })

    if (!user) {
      console.log("새 구글 사용자 생성:", email)
      // 새 사용자 생성
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        photoUrl: photoUrl || "/placeholder.svg?height=100&width=100",
        provider: "google",
      })

      // 기본 캘린더 생성
      const calendar = await Calendar.create({
        name: "내 캘린더",
        color: "bg-blue-500",
        user: user._id,
      })

      console.log("기본 캘린더 생성 성공:", calendar._id)
    } else {
      console.log("기존 구글 사용자:", user._id)
    }

    // 토큰 생성
    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        provider: user.provider,
      },
    })
  } catch (error: any) {
    console.error("구글 인증 오류:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// 이메일 인증 코드 발송
export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    console.log("이메일 인증 코드 요청:", req.body)
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: "이메일을 입력해주세요" })
    }

    // 이메일 형식 검증
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "유효한 이메일 주소를 입력해주세요" })
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: "이미 사용 중인 이메일입니다" })
    }

    // 6자리 인증 코드 생성
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    console.log("생성된 인증 코드:", verificationCode)

    // 개발 환경에서는 이메일 전송 없이 코드 반환
    if (process.env.NODE_ENV === "development" && process.env.SKIP_EMAIL_SENDING === "true") {
      console.log("개발 모드: 이메일 전송 생략")
      return res.json({
        success: true,
        message: "개발 모드: 이메일 전송 생략",
        verificationCode,
      })
    }

    // 이메일 서버 연결 확인
    const isConnected = await verifyEmailConnection()
    if (!isConnected) {
      console.error("이메일 서버 연결 실패")

      // 개발 환경에서는 연결 실패해도 코드 반환
      if (process.env.NODE_ENV === "development") {
        return res.json({
          success: true,
          message: "개발 모드: 이메일 서버 연결 실패했지만 코드 제공",
          verificationCode,
        })
      }

      return res.status(500).json({ success: false, message: "이메일 서버에 연결할 수 없습니다" })
    }

    // 실제 이메일 발송
    const emailSent = await sendVerificationEmail(email, verificationCode)

    if (emailSent) {
      console.log("인증 코드 발송 성공:", email, verificationCode)
      res.json({
        success: true,
        message: "인증 코드가 이메일로 발송되었습니다",
        verificationCode: process.env.NODE_ENV === "development" ? verificationCode : undefined,
      })
    } else {
      console.error("인증 코드 발송 실패:", email)

      // 개발 환경에서는 이메일 전송 실패해도 코드 반환
      if (process.env.NODE_ENV === "development") {
        return res.json({
          success: true,
          message: "개발 모드: 이메일 전송 실패했지만 코드 제공",
          verificationCode,
        })
      }

      res.status(500).json({ success: false, message: "이메일 발송에 실패했습니다. 나중에 다시 시도해주세요." })
    }
  } catch (error: any) {
    console.error("이메일 인증 코드 오류:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// 현재 사용자 정보 조회
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = req.user

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        provider: user.provider,
      },
    })
  } catch (error: any) {
    console.error("사용자 정보 조회 오류:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}
