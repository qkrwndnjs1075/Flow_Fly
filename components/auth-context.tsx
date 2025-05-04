"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

// 기본 프로필 이미지 URL
const DEFAULT_PROFILE_IMAGE = "/images/default-profile.png"

interface User {
  id: string
  name: string
  email: string
  photoUrl: string
  provider: string
}

interface UpdateUserProfileParams {
  name?: string
  photoUrl?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  logout: () => Promise<void>
  updateUserProfile: (params: UpdateUserProfileParams) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  logout: async () => {},
  updateUserProfile: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    console.log("AuthProvider 세션 상태:", status, session)

    if (status === "loading") {
      setIsLoading(true)
      return
    }

    if (status === "unauthenticated") {
      setUser(null)
      setIsLoading(false)

      // 로그인 페이지가 아닌 경우에만 리디렉션
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        console.log("인증되지 않음, 로그인 페이지로 리디렉션")
        router.push("/login")
      }
      return
    }

    if (status === "authenticated" && session?.user) {
      console.log("인증됨, 사용자 정보 설정:", session.user)

      // 로컬 스토리지에서 사용자 정보 확인 (프로필 사진 업데이트 등을 위해)
      let storedUser = null
      if (typeof window !== "undefined") {
        const storedUserJson = localStorage.getItem("user")
        if (storedUserJson) {
          try {
            storedUser = JSON.parse(storedUserJson)
          } catch (e) {
            console.error("로컬 스토리지 사용자 정보 파싱 오류:", e)
          }
        }
      }

      setUser({
        id: session.user.id || "temp-id",
        name: session.user.name || "사용자",
        email: session.user.email || "",
        photoUrl: storedUser?.photoUrl || session.user.image || DEFAULT_PROFILE_IMAGE,
        provider: session.user.provider || "google",
      })

      setIsLoading(false)
      setError(null)

      // 로컬 스토리지에 사용자 정보 저장
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: session.user.id || "temp-id",
            name: session.user.name || "사용자",
            email: session.user.email || "",
            photoUrl: storedUser?.photoUrl || session.user.image || DEFAULT_PROFILE_IMAGE,
            provider: session.user.provider || "google",
          }),
        )
      }
    }
  }, [session, status, router])

  // 사용자 프로필 업데이트 함수
  const updateUserProfile = async (params: UpdateUserProfileParams) => {
    if (!user) return

    try {
      const updatedUser = {
        ...user,
        ...(params.name && { name: params.name }),
        ...(params.photoUrl && { photoUrl: params.photoUrl }),
      }

      setUser(updatedUser)

      // 로컬 스토리지 업데이트
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      // 백엔드 API 호출 (필요한 경우)
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      // await fetch(`${apiUrl}/users/profile`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      //   body: JSON.stringify({
      //     name: params.name,
      //     photoUrl: params.photoUrl,
      //   }),
      // })

      console.log("사용자 프로필 업데이트 성공:", updatedUser)
    } catch (error) {
      console.error("사용자 프로필 업데이트 오류:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      setUser(null)

      // 로컬 스토리지에서 사용자 정보 제거
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
      }

      router.push("/login")
    } catch (err) {
      console.error("로그아웃 오류:", err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
