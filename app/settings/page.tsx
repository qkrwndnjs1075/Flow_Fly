"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, Save, User } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import ProfilePictureUpload from "@/components/profile-picture-upload"

export default function Settings() {
  const { user, logout, updateUserProfile } = useAuth()
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [timeFormat, setTimeFormat] = useState("12h")
  const [startOfWeek, setStartOfWeek] = useState("sunday")
  const [isSaved, setIsSaved] = useState(false)
  const [name, setName] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")

  // 초기 설정값 로드
  useEffect(() => {
    // 다크 모드 설정 로드
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true)
    } else {
      setDarkMode(false)
    }

    // 다른 설정값 로드
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications !== null) {
      setNotifications(savedNotifications === "true")
    }

    const savedTimeFormat = localStorage.getItem("timeFormat")
    if (savedTimeFormat) {
      setTimeFormat(savedTimeFormat)
    }

    const savedStartOfWeek = localStorage.getItem("startOfWeek")
    if (savedStartOfWeek) {
      setStartOfWeek(savedStartOfWeek)
    }

    // 사용자 정보 로드
    if (user) {
      setName(user.name || "")
      setPhotoUrl(user.photoUrl || "")
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // 다크 모드 토글
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // 알림 토글
  const toggleNotifications = () => {
    setNotifications(!notifications)
  }

  // 시간 형식 변경
  const handleTimeFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setTimeFormat(value)
  }

  // 주 시작일 변경
  const handleStartOfWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setStartOfWeek(value)
  }

  const handleSave = () => {
    // 다크 모드 설정 저장 및 적용
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }

    // 다른 설정 저장
    localStorage.setItem("notifications", notifications.toString())
    localStorage.setItem("timeFormat", timeFormat)
    localStorage.setItem("startOfWeek", startOfWeek)

    // 사용자 프로필 업데이트
    if (user) {
      updateUserProfile({
        name: name || user.name,
        photoUrl: photoUrl || user.photoUrl,
      })
    }

    // 저장 성공 표시
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
    }, 3000)
  }

  // 프로필 사진 변경 처리
  const handlePhotoChange = (newPhotoUrl: string) => {
    setPhotoUrl(newPhotoUrl)
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
                <div className={`${isGoogleUser ? "opacity-80" : ""}`}>
                  {isGoogleUser ? (
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden relative shadow-lg mb-2">
                        <Image
                          src={user?.photoUrl || "/placeholder.svg?height=100&width=100"}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs text-white/70 mt-2 text-center max-w-[200px]">
                        Google 계정으로 로그인한 사용자는 Google 프로필 사진이 사용됩니다
                      </p>
                    </div>
                  ) : (
                    <ProfilePictureUpload currentPhotoUrl={user?.photoUrl} onPhotoChange={handlePhotoChange} />
                  )}
                </div>

                {/* 계정 정보 섹션 */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm text-white/70 mb-1">
                      이름
                    </label>
                    {isGoogleUser ? (
                      <p>{user?.name || ""}</p>
                    ) : (
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="이름"
                      />
                    )}
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
                        <>
                          <User className="h-4 w-4 mr-2" />
                          일반 계정
                        </>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-all hover:translate-y-[-2px] mt-4"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-white/20" />

            <div className="animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-xl font-semibold mb-4">환경설정</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="darkMode" className="cursor-pointer">
                    다크 모드
                  </label>
                  <div className="relative inline-block w-12 h-6" onClick={toggleDarkMode}>
                    <input
                      id="darkMode"
                      type="checkbox"
                      className="opacity-0 w-0 h-0"
                      checked={darkMode}
                      onChange={() => {}}
                    />
                    <span
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${
                        darkMode ? "bg-blue-500" : "bg-white/30"
                      }`}
                    >
                      <span
                        className={`absolute h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-transform ${
                          darkMode ? "transform translate-x-6" : ""
                        }`}
                      ></span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="notifications" className="cursor-pointer">
                    알림
                  </label>
                  <div className="relative inline-block w-12 h-6" onClick={toggleNotifications}>
                    <input
                      id="notifications"
                      type="checkbox"
                      className="opacity-0 w-0 h-0"
                      checked={notifications}
                      onChange={() => {}}
                    />
                    <span
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors ${
                        notifications ? "bg-blue-500" : "bg-white/30"
                      }`}
                    >
                      <span
                        className={`absolute h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-transform ${
                          notifications ? "transform translate-x-6" : ""
                        }`}
                      ></span>
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="timeFormat" className="block mb-2">
                    시간 형식
                  </label>
                  <div className="relative">
                    <select
                      id="timeFormat"
                      value={timeFormat}
                      onChange={handleTimeFormatChange}
                      className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="12h">12시간 (오전/오후)</option>
                      <option value="24h">24시간</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="startOfWeek" className="block mb-2">
                    주 시작일
                  </label>
                  <div className="relative">
                    <select
                      id="startOfWeek"
                      value={startOfWeek}
                      onChange={handleStartOfWeekChange}
                      className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="sunday">일요일</option>
                      <option value="monday">월요일</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end items-center animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
            {isSaved && (
              <div className="mr-4 text-green-400 bg-green-400/10 px-3 py-1 rounded-md animate-bounce-in">
                설정이 저장되었습니다!
              </div>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-all hover:translate-y-[-2px] hover:shadow-lg"
            >
              <Save className="h-4 w-4" />
              변경사항 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
