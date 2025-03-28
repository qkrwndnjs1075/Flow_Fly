import { NextResponse } from "next/server";
import redisClient from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json({ message: "Refresh token is required" }, { status: 400 });
    }

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const storedUserId = await redisClient.get(refreshToken);
    if (storedUserId) {
      await redisClient.del(refreshToken);
    }

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error during logout", error }, { status: 500 });
  }
}
