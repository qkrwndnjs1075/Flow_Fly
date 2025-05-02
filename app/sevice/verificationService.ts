import redisClient from "@/lib/redis";

class VerificationService {
  // 인증 코드 저장
  async storeVerificationCode(email: string, code: string, expiresInSeconds = 180): Promise<boolean> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }

      // Redis에 인증 코드 저장 (3분 동안 유효)
      const key = `verification:${email}`;
      await redisClient.set(key, code, { EX: expiresInSeconds });

      return true;
    } catch (error) {
      console.error("Error storing verification code:", error);
      return false;
    }
  }

  // 인증 코드 검증
  async verifyCode(email: string, code: string): Promise<boolean> {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }

      const key = `verification:${email}`;
      const storedCode = await redisClient.get(key);

      // 코드가 일치하는지 확인
      if (storedCode && storedCode === code) {
        // 검증 후 코드 삭제
        await redisClient.del(key);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error verifying code:", error);
      return false;
    }
  }
}

export default new VerificationService();
