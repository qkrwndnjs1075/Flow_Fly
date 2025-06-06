"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import ProfilePictureUpload from "@/components/profile-picture-upload"

export default function Settings() {
  const { user, logout, updateUserProfile } = useAuth()
  const router = useRouter()

  const [isSaved, setIsSaved] = useState(false)
  const [name, setName] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 초기 설정값 로드
  useEffect(() => {
    // 사용자 정보 로드
    if (user) {
      setName(user.name || "")
      setPhotoUrl(user.photoUrl || "/images/default-profile.png")
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  // 프로필 사진 변경 처리
  const handlePhotoChange = (newPhotoUrl: string, file?: File) => {
    setPhotoUrl(newPhotoUrl)
    console.log("프로필 사진 변경:", newPhotoUrl)
  }

  // 설정 저장 함수
  const handleSave = async () => {
    setIsLoading(true)

    try {
      console.log("프로필 정보 저장 시도:", { name, photoUrl })

      // 사용자 프로필 업데이트
      if (user) {
        await updateUserProfile({
          name: name !== user.name ? name : undefined,
          photoUrl: photoUrl !== user.photoUrl ? photoUrl : undefined,
        })
      }

      // 저장 성공 표시
      setIsSaved(true)
      setTimeout(() => {
        setIsSaved(false)
      }, 3000)

      // 설정 변경 알림
      alert("프로필이 성공적으로 저장되었습니다.")
    } catch (error) {
      console.error("프로필 저장 오류:", error)
      alert("프로필 저장 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // 이름 변경 처리
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  // 구글 로그인 사용자인지 확인
  const isGoogleUser = user?.provider === "google"

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
        alt="Beautiful mountain landscape"
        fill
        className="object-cover"
        priority
      />

      <div className="relative z-10 p-6 max-w-2xl mx-auto">
        <div className="flex items-center mb-8 animate-slide-in-up">
          <button
            onClick={() => router.push("/")}
            className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">설정</h1>
        </div>

        <div
          className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-6 text-white animate-slide-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">계정</h2>

              <div className="flex flex-col md:flex-row gap-8 mb-6">
                {/* 프로필 사진 섹션 */}
                <div>
                  <div className="flex flex-col items-center">
                    <ProfilePictureUpload initialPhotoUrl={photoUrl} onPhotoChange={handlePhotoChange} size="lg" />
                    <p className="text-xs text-white/70 mt-2 text-center max-w-[200px]">
                      {isGoogleUser
                        ? "Google 계정으로 로그인한 사용자도 프로필 사진을 변경할 수 있습니다"
                        : "프로필 사진"}
                    </p>
                  </div>
                </div>

                {/* 계정 정보 섹션 */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm text-white/70 mb-1">
                      이름
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="이름"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-white/70">이메일</p>
                    <p>{user?.email || "로그인되지 않음"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-white/70">계정 유형</p>
                    <p className="flex items-center">
                      {user?.provider === "google" ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            width="16px"
                            height="16px"
                            className="mr-2"
                          >
                            <path
                              fill="#FFC107"
                              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                            <path
                              fill="#FF3D00"
                              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                            />
                            <path
                              fill="#4CAF50"
                              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                            />
                            <path
                              fill="#1976D2"
                              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                          </svg>
                          Google 계정
                        </>
                      ) : (
                        "이메일 계정"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md transition-colors"
                >
                  로그아웃
                </button>

                <div className="flex items-center gap-3">
                  {isSaved && <span className="text-green-400 text-sm animate-fade-in">저장되었습니다!</span>}
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-70"
                  >
                    {isLoading ? "저장 중..." : "프로필 저장"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
