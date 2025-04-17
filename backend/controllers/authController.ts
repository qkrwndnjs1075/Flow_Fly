import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"
import Calendar from "../models/Calendar"

// JWT 토큰 생성 함수
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  })
}

// 회원가입
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "이미 사용 중인 이메일입니다" })
    }

    // 사용자 생성
    const user = await User.create({
      name,
      email,
      password,
      provider: "email",
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
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// 로그인
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // 사용자 확인
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다" })
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다" })
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
    res.status(500).json({ message: error.message })
  }
}

// Google 로그인/회원가입
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { name, email, photoUrl } = req.body

    // 사용자 확인 또는 생성
    let user = await User.findOne({ email })

    if (!user) {
      // 새 사용자 생성
      user = await User.create({
        name,
        email,
        photoUrl,
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
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// 이메일 인증 코드 발송 (실제로는 이메일을 보내지 않고 모의 코드 반환)
export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    // 이메일 형식 검증
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "유효한 이메일 주소를 입력해주세요" })
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "이미 사용 중인 이메일입니다" })
    }

    // 6자리 인증 코드 생성
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // 실제 앱에서는 이메일 발송 로직 구현
    // 여기서는 모의 코드만 반환

    res.json({
      success: true,
      message: "인증 코드가 발송되었습니다",
      verificationCode, // 실제 앱에서는 이 코드를 클라이언트에 노출하지 않고 서버에 저장
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
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
    res.status(500).json({ message: error.message })
  }
}
