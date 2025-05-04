import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await response.json()

          if (response.ok && data.success) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              image: data.user.photoUrl,
              token: data.token,
              provider: "credentials",
            }
          }
          return null
        } catch (error) {
          console.error("Login error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // 초기 로그인 시 user 객체가 있음
      if (user) {
        token.id = user.id
        token.accessToken = user.token
        token.provider = user.provider || account?.provider || "credentials"
      }

      // Google 로그인 시 백엔드에 사용자 정보 전달
      if (account?.provider === "google" && profile?.email) {
        try {
          console.log("Google 로그인 시도:", profile.email)

          const response = await fetch(`${API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: profile.name,
              email: profile.email,
              photoUrl: profile.picture,
            }),
          })

          if (!response.ok) {
            console.error("Google 인증 실패:", await response.text())
            return token
          }

          // 응답이 JSON이 아닌 경우 처리
          const contentType = response.headers.get("content-type")
          if (!contentType || !contentType.includes("application/json")) {
            console.error("Invalid response format:", await response.text())
            return token
          }

          const data = await response.json()

          console.log("백엔드 응답:", data)

          if (data.success) {
            token.id = data.user.id
            token.accessToken = data.token
            token.provider = "google"
          } else {
            console.error("Google 인증 실패:", data)
          }
        } catch (error) {
          console.error("Google auth error:", error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.provider = token.provider
        session.accessToken = token.accessToken
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // 로그인 성공 후 리디렉션 처리
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
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
