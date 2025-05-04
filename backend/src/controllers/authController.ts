import type { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import User from "../models/userModel"
import Calendar from "../models/calendarModel"
import { sendVerificationEmail, verifyEmailConnection } from "../utils/emailService"
import { generateToken } from "../utils/jwtUtils"

// 회원가입
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, verificationCode } = req.body

  // 필수 필드 검증
  if (!name || !email || !password) {
    res.status(400)
    throw new Error("모든 필드를 입력해주세요")
  }

  // 이메일 중복 확인
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    res.status(400)
    throw new Error("이미 사용 중인 이메일입니다")
  }

  // 사용자 생성
  const user = await User.create({
    name,
    email,
    password,
    provider: "email",
    photoUrl: "/images/default-profile.png",
  })

  // 기본 캘린더 생성
  await Calendar.create({
    name: "내 캘린더",
    color: "bg-blue-500",
    user: user._id,
  })

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
})

// 로그인
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  // 필수 필드 검증
  if (!email || !password) {
    res.status(400)
    throw new Error("이메일과 비밀번호를 입력해주세요")
  }

  // 사용자 확인
  const user = await User.findOne({ email })
  if (!user) {
    res.status(401)
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다")
  }

  // 비밀번호 확인
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    res.status(401)
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다")
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
})

// Google 로그인/회원가입
export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, photoUrl } = req.body

  if (!email) {
    res.status(400)
    throw new Error("이메일이 제공되지 않았습니다")
  }

  // 사용자 확인 또는 생성
  let user = await User.findOne({ email })

  if (!user) {
    // 새 사용자 생성
    user = await User.create({
      name: name || email.split("@")[0],
      email,
      photoUrl: photoUrl || "/images/default-profile.png",
      provider: "google",
    })

    // 기본 캘린더 생성
    await Calendar.create({
      name: "내 캘린더",
      color: "bg-blue-500",
      user: user._id,
    })
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
})

// 이메일 인증 코드 발송
export const sendVerificationCode = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    res.status(400)
    throw new Error("이메일을 입력해주세요")
  }

  // 이메일 형식 검증
  const emailRegex = /\S+@\S+\.\S+/
  if (!emailRegex.test(email)) {
    res.status(400)
    throw new Error("유효한 이메일 주소를 입력해주세요")
  }

  // 이메일 중복 확인
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    res.status(400)
    throw new Error("이미 사용 중인 이메일입니다")
  }

  // 6자리 인증 코드 생성
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

  // 개발 환경에서는 이메일 전송 생략 가능
  if (process.env.NODE_ENV === "development" && process.env.SKIP_EMAIL_SENDING === "true") {
    return res.json({
      success: true,
      message: "개발 모드: 이메일 전송 생략",
      verificationCode,
    })
  }

  // 이메일 서버 연결 확인
  const isConnected = await verifyEmailConnection()
  if (!isConnected) {
    // 개발 환경에서는 연결 실패해도 코드 반환
    if (process.env.NODE_ENV === "development") {
      return res.json({
        success: true,
        message: "개발 모드: 이메일 서버 연결 실패했지만 코드 제공",
        verificationCode,
      })
    }

    res.status(500)
    throw new Error("이메일 서버에 연결할 수 없습니다")
  }

  // 실제 이메일 발송
  const emailSent = await sendVerificationEmail(email, verificationCode)

  if (emailSent) {
    res.json({
      success: true,
      message: "인증 코드가 이메일로 발송되었습니다",
      verificationCode: process.env.NODE_ENV === "development" ? verificationCode : undefined,
    })
  } else {
    // 개발 환경에서는 전송 실패해도 코드 반환
    if (process.env.NODE_ENV === "development") {
      return res.json({
        success: true,
        message: "개발 모드: 이메일 전송 실패했지만 코드 제공",
        verificationCode,
      })
    }

    res.status(500)
    throw new Error("이메일 발송에 실패했습니다. 나중에 다시 시도해주세요.")
  }
})

// 현재 사용자 정보 조회
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      photoUrl: req.user.photoUrl,
      provider: req.user.provider,
    },
  })
})
