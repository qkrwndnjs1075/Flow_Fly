import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1); // 필요 시 앱 종료
  }
})();

export default redisClient;
