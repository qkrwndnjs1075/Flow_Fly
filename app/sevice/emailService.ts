import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// 이메일 서비스 클래스
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // SMTP 트랜스포터 생성
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // 이메일 인증 코드 발송 메서드
  async sendVerificationEmail(to: string, code: string): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Flow_Fly" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Flow_Fly 이메일 인증",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #3B82F6;">Flow_Fly 이메일 인증</h1>
            </div>
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin-bottom: 10px;">안녕하세요!</p>
              <p style="margin-bottom: 20px;">아래 인증 코드를 입력하여 이메일 인증을 완료해주세요:</p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background-color: #f2f7ff; border: 1px solid #d1e0ff; border-radius: 5px; padding: 15px 30px;">
                  <span style="font-size: 24px; font-weight: bold; color: #3B82F6; letter-spacing: 5px;">${code}</span>
                </div>
              </div>
              <p style="margin-bottom: 5px;">인증 코드는 3분간 유효합니다.</p>
              <p>Flow_Fly를 이용해 주셔서 감사합니다!</p>
            </div>
            <div style="text-align: center; color: #666; font-size: 12px;">
              <p>본 이메일은 발신 전용이며, 회신하실 수 없습니다.</p>
              <p>&copy; ${new Date().getFullYear()} Flow_Fly. All rights reserved.</p>
            </div>
          </div>
        `,
      });

      console.log("Message sent: %s", info.messageId);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }
}

export default new EmailService();
