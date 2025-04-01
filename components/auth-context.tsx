"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
  signup: (name: string, email: string, password: string) => Promise<boolean>
  googleLogin: () => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // MVP에서는 간단한 검증만 수행
    if (email && password) {
      // 실제 앱에서는 API 호출로 대체
      const mockUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        name: email.split("@")[0],
        email,
        provider: "email",
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    }
    return false
  }

  const signup = async (name: string, email: string, password: string) => {
    // MVP에서는 간단한 검증만 수행
    if (name && email && password) {
      // 실제 앱에서는 API 호출로 대체
      const mockUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        provider: "email",
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    }
    return false
  }

  const googleLogin = async () => {
    try {
      // 실제 앱에서는 Google OAuth API를 사용하여 인증
      // MVP에서는 간단히 모의 사용자 생성
      const mockGoogleUser = {
        id: "google-" + Math.random().toString(36).substr(2, 9),
        name: "Google User",
        email: "user@gmail.com",
        photoUrl: "https://lh3.googleusercontent.com/a/default-user",
        provider: "google",
      }

      setUser(mockGoogleUser)
      localStorage.setItem("user", JSON.stringify(mockGoogleUser))
      return true
    } catch (error) {
      console.error("Google login failed:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, isLoading }}>
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

