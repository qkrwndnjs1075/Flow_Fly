"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"

type User = {
  id: string
  name: string
  email: string
  photoUrl?: string
  provider?: string
} | null

interface AuthResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    name: string
    email: string
    photoUrl?: string
    provider?: string
  }
  message?: string
  verificationCode?: string
}

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, verificationCode: string) => Promise<boolean>
  googleLogin: () => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
  updateUserProfile: (data: { name?: string; photoUrl?: string }) => Promise<boolean>
  verifyEmail: (email: string) => Promise<{ success: boolean; verificationCode?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 세션 상태에 따라 사용자 정보 업데이트
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name || "",
        email: session.user.email || "",
        photoUrl: session.user.image || undefined,
        provider: (session.user.provider as string) || "credentials",
      })
      setIsLoading(false)
    } else if (status === "unauthenticated") {
      setUser(null)
      setIsLoading(false)
    }
  }, [session, status])

  // 이메일/비밀번호 로그인
  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      return result?.ok || false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // 회원가입
  const signup = async (name: string, email: string, password: string, verificationCode: string) => {
    try {
      setIsLoading(true)

      const data = await apiClient<AuthResponse>("auth/signup", {
        method: "POST",
        body: { name, email, password, verificationCode },
      })

      if (data.success) {
        // 회원가입 후 자동 로그인
        return await login(email, password)
      }
      return false
    } catch (error) {
      console.error("Signup error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // 이메일 인증 코드 발송
  const verifyEmail = async (email: string) => {
    try {
      const data = await apiClient<AuthResponse>("auth/verify-email", {
        method: "POST",
        body: { email },
      })

      return {
        success: true,
        verificationCode: data.verificationCode,
      }
    } catch (error) {
      console.error("Email verification error:", error)
      return { success: false }
    }
  }

  // 구글 로그인
  const googleLogin = async () => {
    try {
      const result = await signIn("google", { redirect: false })
      return result?.ok || false
    } catch (error) {
      console.error("Google login error:", error)
      return false
    }
  }

  // 사용자 프로필 업데이트
  const updateUserProfile = async (data: { name?: string; photoUrl?: string }) => {
    if (!user || !session?.accessToken) return false

    try {
      setIsLoading(true)

      // 이름 업데이트
      if (data.name) {
        await apiClient<AuthResponse>("users/profile", {
          token: session.accessToken as string,
          method: "PUT",
          body: { name: data.name },
        })
      }

      // 프로필 사진 업데이트 (base64 문자열인 경우)
      if (data.photoUrl && data.photoUrl.startsWith("data:image")) {
        // base64 문자열을 Blob으로 변환
        const response = await fetch(data.photoUrl)
        const blob = await response.blob()

        // FormData 생성
        const formData = new FormData()
        formData.append("photo", blob, "profile.jpg")

        const uploadData = await apiClient<{ success: boolean; photoUrl: string }>("users/profile-photo", {
          token: session.accessToken as string,
          method: "POST",
          formData,
        })

        data.photoUrl = uploadData.photoUrl
      }

      // 사용자 상태 업데이트
      setUser((prev) => (prev ? { ...prev, ...data } : null))
      return true
    } catch (error) {
      console.error("프로필 업데이트 오류:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // 로그아웃
  const logout = async () => {
    await signOut({ redirect: false })
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{ user, login, signup, googleLogin, logout, isLoading, updateUserProfile, verifyEmail }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
