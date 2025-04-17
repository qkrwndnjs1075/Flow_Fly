"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

type User = {
  id: string
  name: string
  email: string
  photoUrl?: string
  provider?: string
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, verificationCode: string) => Promise<boolean>
  googleLogin: () => Promise<boolean>
  logout: () => void
  isLoading: boolean
  updateUserProfile: (data: { name?: string; photoUrl?: string }) => Promise<boolean>
  verifyEmail: (email: string) => Promise<{ success: boolean; verificationCode?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name || "",
        email: session.user.email || "",
        photoUrl: session.user.image || undefined,
        provider: session.user.email?.includes("gmail.com") ? "google" : "email", // 간단한 추측, 실제로는 세션에서 provider 정보를 받아오는 것이 좋음
      })
      setIsLoading(false)
    } else if (status === "unauthenticated") {
      setUser(null)
      setIsLoading(false)
    }
  }, [session, status])

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

  const signup = async (name: string, email: string, password: string, verificationCode: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, verificationCode }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // 회원가입 후 자동 로그인
        const loginResult = await login(email, password)
        return loginResult
      }
      return false
    } catch (error) {
      console.error("Signup error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      return {
        success: response.ok && data.success,
        verificationCode: data.verificationCode,
      }
    } catch (error) {
      console.error("Email verification error:", error)
      return { success: false }
    }
  }

  const googleLogin = async () => {
    try {
      const result = await signIn("google", { redirect: false })
      return result?.ok || false
    } catch (error) {
      console.error("Google login error:", error)
      return false
    }
  }

  const updateUserProfile = async (data: { name?: string; photoUrl?: string }) => {
    if (!user || !session?.accessToken) return false

    try {
      setIsLoading(true)

      // 이름 업데이트
      if (data.name) {
        const response = await fetch(`${API_URL}/users/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ name: data.name }),
        })

        if (!response.ok) {
          throw new Error("이름 업데이트 실패")
        }
      }

      // 프로필 사진 업데이트 (base64 문자열인 경우)
      if (data.photoUrl && data.photoUrl.startsWith("data:image")) {
        // base64 문자열을 Blob으로 변환
        const response = await fetch(data.photoUrl)
        const blob = await response.blob()

        // FormData 생성
        const formData = new FormData()
        formData.append("photo", blob, "profile.jpg")

        const uploadResponse = await fetch(`${API_URL}/users/profile-photo`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("프로필 사진 업로드 실패")
        }

        const uploadData = await uploadResponse.json()
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

  const logout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" })
    setUser(null)
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
