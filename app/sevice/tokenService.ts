import redisClient from "@/lib/redis";

export const storeRefreshToken = async (refreshToken: string, userId: string) => {
  await redisClient.set(refreshToken, userId.toString(), { EX: 60 * 60 * 24 * 7 });
};
