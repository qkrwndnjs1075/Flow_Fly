import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

// 이메일 전송을 위한 트랜스포터 설정
const createTransporter = () => {
  // 개발 환경에서는 테스트 계정 사용
  if (process.env.NODE_ENV === "development" && process.env.SKIP_EMAIL_SENDING === "true") {
    console.log("개발 모드: 테스트 이메일 설정 사용")
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "ethereal.user@ethereal.email",
        pass: "ethereal_pass",
      },
    })
  }

  // 프로덕션 환경에서는 실제 SMTP 서버 사용
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // SSL 인증서 검증 건너뛰기 (보안상 좋지 않지만 일부 환경에서 필요)
    },
  })
}

// 인증 코드 이메일 전송 함수
export const sendVerificationEmail = async (to: string, code: string): Promise<boolean> => {
  try {
    console.log("이메일 전송 시도:", to, "코드:", code)

    // 개발 환경에서는 이메일 전송 생략 가능
    if (process.env.NODE_ENV === "development" && process.env.SKIP_EMAIL_SENDING === "true") {
      console.log("개발 모드: 이메일 전송 생략, 코드:", code)
      return true
    }

    const transporter = createTransporter()

    const mailOptions = {
      from: `"Flow_Fly" <${process.env.EMAIL_USER || "noreply@flowfly.com"}>`,
      to,
      subject: "Flow_Fly 이메일 인증 코드",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3b82f6; text-align: center;">Flow_Fly 이메일 인증</h2>
          <p>안녕하세요,</p>
          <p>Flow_Fly 계정 등록을 위한 인증 코드입니다:</p>
          <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0; color: #1e40af; font-size: 24px;">${code}</h3>
          </div>
          <p>이 코드는 3분 동안 유효합니다.</p>
          <p>본인이 요청하지 않았다면 이 이메일을 무시하셔도 됩니다.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
            &copy; ${new Date().getFullYear()} Flow_Fly. All rights reserved.
          </p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("이메일 전송 성공:", info.messageId)
    return true
  } catch (error) {
    console.error("이메일 전송 오류:", error)
    return false
  }
}

// 트랜스포터 연결 테스트 함수
export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    // 개발 환경에서는 검증 생략 가능
    if (process.env.NODE_ENV === "development" && process.env.SKIP_EMAIL_VERIFICATION === "true") {
      console.log("개발 모드: 이메일 서버 연결 검증 생략")
      return true
    }

    const transporter = createTransporter()
    await transporter.verify()
    console.log("이메일 서버 연결 성공")
    return true
  } catch (error) {
    console.error("이메일 서버 연결 오류:", error)
    return false
  }
}
