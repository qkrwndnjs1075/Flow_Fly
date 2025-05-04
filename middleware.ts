import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 로그인 페이지는 항상 접근 가능
  if (pathname.startsWith("/login")) {
    return NextResponse.next()
  }

  // 세션 토큰 확인
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  console.log("미들웨어 토큰:", token)

  // 인증되지 않은 경우 로그인 페이지로 리디렉션
  if (!token && !pathname.startsWith("/login")) {
    const url = new URL("/login", request.url)
    return NextResponse.redirect(url)
  }

  // 인증된 경우 요청 계속 진행
  return NextResponse.next()
}

// 미들웨어가 실행될 경로 지정
export const config = {
  matcher: ["/", "/settings", "/calendar/:path*"],
}
