"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { signUpWithEmail, demoMode } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Set isLoaded to true after component mounts for animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      toast({
        title: "필수 항목 누락",
        description: "모든 항목을 입력해주세요",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "비밀번호가 일치하지 않습니다",
        description: "비밀번호가 일치하는지 확인해주세요",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signUpWithEmail(email, password)
      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse-glow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div
        className={`mx-auto w-full max-w-md space-y-6 bg-card p-8 rounded-lg border shadow-sm relative transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold animate-fade-in">계정 만들기</h1>
          <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: "100ms" }}>
            계정을 만들기 위한 정보를 입력하세요
          </p>
        </div>

        {demoMode && (
          <Alert className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              데모 모드: 회원가입이 시뮬레이션됩니다. <strong>demo@example.com</strong> / <strong>password</strong>로
              로그인하세요.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleEmailSignUp} className="space-y-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">비밀번호 확인</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-3px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                계정 생성 중...
              </span>
            ) : (
              "계정 생성하기"
            )}
          </Button>
        </form>

        <div className="text-center text-sm animate-fade-in" style={{ animationDelay: "600ms" }}>
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline transition-colors duration-300 relative group"
          >
            로그인
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>
      </div>
    </div>
  )
}

