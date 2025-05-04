import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // 초기 로그인 시 user 객체가 있음
      if (user) {
        token.id = user.id || "temp-id"
        token.accessToken = user.token
        token.provider = user.provider || account?.provider || "google"
      }

      // Google 로그인 시 백엔드에 사용자 정보 전달 (백엔드 연결 없이 프론트엔드만 사용)
      if (account?.provider === "google" && profile?.email) {
        console.log("Google 로그인 성공:", profile.email)

        // 백엔드 연결 없이 토큰에 사용자 정보 저장
        token.id = profile.sub || "google-user"
        token.name = profile.name
        token.email = profile.email
        token.picture = profile.picture
        token.provider = "google"
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.provider = token.provider
        session.accessToken = token.accessToken

        // 프로필 이미지 설정
        if (token.picture && !session.user.image) {
          session.user.image = token.picture
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // 로그인 성공 후 리디렉션 처리
      console.log("리디렉션:", { url, baseUrl })

      // 항상 홈페이지로 리디렉션
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
