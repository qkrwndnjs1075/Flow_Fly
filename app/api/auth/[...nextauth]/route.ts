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
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
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
    async jwt({ token, user, account }: any) {
      if (account && account.provider === "google") {
        try {
          // 구글 로그인 정보를 백엔드에 전달
          const response = await fetch(`${API_URL}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              photoUrl: user.image,
            }),
          })

          const data = await response.json()

          if (response.ok && data.success) {
            token.id = data.user.id
            token.accessToken = data.token
          }
        } catch (error) {
          console.error("Google auth error:", error)
        }
      }

      if (user) {
        token.id = user.id
        token.accessToken = user.token
      }

      return token
    },
    async session({ session, token }: any) {
      session.user.id = token.id
      session.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
