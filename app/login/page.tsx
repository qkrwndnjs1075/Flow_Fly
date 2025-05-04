"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { signIn, useSession } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { status } = useSession()

  // 이미 로그인된 경우 메인 페이지로 리디렉션
  useEffect(() => {
    console.log("로그인 페이지 세션 상태:", status)
    if (status === "authenticated") {
      console.log("인증됨, 메인 페이지로 리디렉션")
      router.push("/")
    }
  }, [status, router])

  const handleGoogleLogin = async () => {
    setError("")
    setIsLoading(true)

    try {
      console.log("구글 로그인 시도")
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      })

      console.log("구글 로그인 결과:", result)

      // 리디렉션이 자동으로 처리되므로 아래 코드는 실행되지 않을 수 있음
      if (result?.error) {
        setError("Google 로그인에 실패했습니다")
      }
    } catch (err) {
      console.error("로그인 오류:", err)
      setError("오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
        alt="Beautiful mountain landscape"
        fill
        className="object-cover"
        priority
      />

      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Flow_Fly</h1>

        <div className="text-center text-white mb-8">
          <p className="text-lg">스마트 캘린더 & 일정 관리</p>
          <p className="text-sm mt-2 opacity-80">Google 계정으로 로그인하여 시작하세요</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-md mb-4">{error}</div>}

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-md transition-colors font-medium hover:bg-gray-100 disabled:opacity-70 shadow-md"
        >
          <FcGoogle className="text-2xl" />
          <span>{isLoading ? "로그인 중..." : "Google로 계속하기"}</span>
        </button>

        <div className="mt-8 text-center text-white text-sm opacity-70">
          <p>
            로그인하면 Flow_Fly의{" "}
            <a href="#" className="underline">
              서비스 약관
            </a>{" "}
            및{" "}
            <a href="#" className="underline">
              개인정보처리방침
            </a>
            에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
