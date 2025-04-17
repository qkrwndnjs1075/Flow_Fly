"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, User } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import ProfilePictureUpload from "@/components/profile-picture-upload"
import { useSettings } from "@/hooks/use-settings"

export default function Settings() {
  const { user, logout, updateUserProfile } = useAuth()
  const { settings, updateSettings, isLoading: settingsLoading } = useSettings()
  const router = useRouter()
  
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [timeFormat, setTimeFormat] = useState("12h")
  const [startOfWeek, setStartOfWeek] = useState("sunday")
  const [isSaved, setIsSaved] = useState(false)
  const [name, setName] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 초기 설정값 로드
  useEffect(() => {
    // 백엔드 설정 데이터 로드
    if (settings) {
      setDarkMode(settings.darkMode)
      setNotifications(settings.notifications)
      setTimeFormat(settings.timeFormat)
      setStartOfWeek(settings.startOfWeek)
    }

    // 사용자 정보 로드
    if (user) {
      setName(user.name || "")
      setPhotoUrl(user.photoUrl || "")
    }
  }, [user, settings])

  const handleLogout = async () => {
    await logout()
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

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // 설정 저장
      await updateSettings({
        darkMode,
        notifications,
        timeFormat,
        startOfWeek,
      })

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
    } catch (error) {
      console.error("설정 저장 오류:", error)
    } finally {
      setIsLoading(false)
    }
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

  if (settingsLoading) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="mb-4">로딩 중...</div>
          <div className="w-10 h-10 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
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
                    <div className="flex items-center justify-center w-32 h-32 rounded-full overflow-hidden bg-gray-700">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt="Profile"
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="text-gray-500 w-16 h-16" />
                      )}
                    </div>
                  ) : (
                    <ProfilePictureUpload
                      photoUrl={photoUrl}
                      onChange={handlePhotoChange}
                    />
                  )}
                </div>\
