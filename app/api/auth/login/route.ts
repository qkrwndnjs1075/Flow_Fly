import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/app/models/User";
import { comparePasswords, generateAccessToken, generateRefreshToken } from "@/app/utils/auth";
import { storeRefreshToken } from "@/app/sevice/tokenService"; 

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    // 사용자 확인
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // 비밀번호 검증
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // 토큰 생성
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // 리프레시 토큰 저장
    await storeRefreshToken(refreshToken, user._id.toString());

    return NextResponse.json({ message: "Login successful", accessToken, refreshToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error during login", error }, { status: 500 });
  }
}
