"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Shield, Home, LogOut, Loader2 } from "lucide-react"
import Link from "next/link"

// 어드민 레이아웃 래퍼
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  )
}

// 어드민 레이아웃 내용
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { adminUser, loading, logout, isAuthenticated } = useAdminAuth()
  const [isMounted, setIsMounted] = useState(false)

  // 로그인 페이지인지 확인
  const isLoginPage = pathname === "/admin/login"

  // 클라이언트 사이드에서만 인증 확인
  useEffect(() => {
    setIsMounted(true)

    // 로그인 페이지가 아니고 인증되지 않은 경우 로그인 페이지로 리디렉션
    if (isMounted && !loading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login")
    }
  }, [isMounted, loading, isAuthenticated, isLoginPage, router])

  // 로딩 중이거나 마운트되지 않은 경우 로딩 표시
  if (!isMounted || (loading && !isLoginPage)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a12]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 로그인 페이지인 경우 레이아웃 없이 렌더링
  if (isLoginPage) {
    return children
  }

  // 인증되지 않은 경우 로그인 페이지로 리디렉션 (이미 useEffect에서 처리됨)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0a12]">
      {/* 헤더 */}
      <header className="h-16 bg-[#161625] border-b border-indigo-900/30 flex items-center px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-400" />
            <h1 className="text-xl font-bold">어드민 대시보드</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground mr-2">로그인:</span>
              <span className="font-medium">{adminUser?.username}</span>
            </div>
            <Button variant="outline" asChild className="hover:bg-indigo-900/20">
              <Link href="/" target="_blank">
                <Home className="mr-2 h-4 w-4" />
                사이트 보기
              </Link>
            </Button>
            <Button variant="outline" className="hover:bg-indigo-900/20 hover:text-white" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  )
}

