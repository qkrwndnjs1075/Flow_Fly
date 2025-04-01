"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, Save } from "lucide-react"
import { useAuth } from "@/components/auth-context"

export default function Settings() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [timeFormat, setTimeFormat] = useState("12h")
  const [startOfWeek, setStartOfWeek] = useState("sunday")
  const [isSaved, setIsSaved] = useState(false)

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
  }, [])

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
  const handleTimeFormatChange = (e) => {
    const value = e.target.value
    setTimeFormat(value)
  }

  // 주 시작일 변경
  const handleStartOfWeekChange = (e) => {
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

    // 저장 성공 표시
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
      router.push("/")
    }, 1500)
  }

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
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push("/")}
            className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">설정</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-6 text-white">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">계정</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/70">이메일</p>
                  <p>{user?.email || "로그인되지 않음"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">이름</p>
                  <p>{user?.name || "로그인되지 않음"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>

            <hr className="border-white/20" />

            <div>
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
                  <select
                    id="timeFormat"
                    value={timeFormat}
                    onChange={handleTimeFormatChange}
                    className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="12h">12시간 (오전/오후)</option>
                    <option value="24h">24시간</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="startOfWeek" className="block mb-2">
                    주 시작일
                  </label>
                  <select
                    id="startOfWeek"
                    value={startOfWeek}
                    onChange={handleStartOfWeekChange}
                    className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sunday">일요일</option>
                    <option value="monday">월요일</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end items-center">
            {isSaved && (
              <div className="mr-4 text-green-400 bg-green-400/10 px-3 py-1 rounded-md">설정이 저장되었습니다!</div>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
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

