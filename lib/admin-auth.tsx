"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// 어드민 사용자 타입
type AdminUser = {
  id: string
  username: string
  role: "admin" | "super_admin"
}

// 어드민 인증 컨텍스트 타입
type AdminAuthContextType = {
  adminUser: AdminUser | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

// 어드민 인증 컨텍스트 생성
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

// 어드민 인증 제공자 컴포넌트
export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // 컴포넌트 마운트 시 로컬 스토리지에서 어드민 세션 확인
  useEffect(() => {
    const checkAdminSession = () => {
      try {
        const storedAdmin = localStorage.getItem("admin_session")
        if (storedAdmin) {
          setAdminUser(JSON.parse(storedAdmin))
        }
      } catch (error) {
        console.error("Failed to restore admin session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAdminSession()
  }, [])

  // 어드민 로그인 함수
  const login = async (username: string, password: string) => {
    setLoading(true)

    try {
      // 실제 구현에서는 API 호출로 대체
      // 데모 목적으로 하드코딩된 자격 증명 사용
      if (username === "admin" && password === "admin123") {
        const adminData: AdminUser = {
          id: "admin-1",
          username: "admin",
          role: "admin",
        }

        // 로컬 스토리지에 어드민 세션 저장
        localStorage.setItem("admin_session", JSON.stringify(adminData))
        setAdminUser(adminData)

        toast({
          title: "로그인 성공",
          description: "어드민 대시보드로 이동합니다.",
        })

        router.push("/admin")
      } else {
        toast({
          title: "로그인 실패",
          description: "아이디 또는 비밀번호가 올바르지 않습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "로그인 오류",
        description: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 어드민 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("admin_session")
    setAdminUser(null)
    router.push("/admin/login")

    toast({
      title: "로그아웃 성공",
      description: "성공적으로 로그아웃되었습니다.",
    })
  }

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        loading,
        login,
        logout,
        isAuthenticated: !!adminUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

// 어드민 인증 훅
export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

