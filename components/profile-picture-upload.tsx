"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Camera, Upload, X } from "lucide-react"

interface ProfilePictureUploadProps {
  initialPhotoUrl?: string
  onPhotoChange: (photoUrl: string, file?: File) => void
  size?: "sm" | "md" | "lg"
}

export default function ProfilePictureUpload({
  initialPhotoUrl,
  onPhotoChange,
  size = "md",
}: ProfilePictureUploadProps) {
  const [photoUrl, setPhotoUrl] = useState<string>(initialPhotoUrl || "/images/default-profile.png")
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 초기 사진 URL 업데이트
  useEffect(() => {
    if (initialPhotoUrl) {
      setPhotoUrl(initialPhotoUrl)
    }
  }, [initialPhotoUrl])

  // 사이즈에 따른 크기 설정
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    // 이미지 파일 타입 확인
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const newPhotoUrl = event.target?.result as string
      setPhotoUrl(newPhotoUrl)
      onPhotoChange(newPhotoUrl, file)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    const defaultPhoto = "/images/default-profile.png"
    setPhotoUrl(defaultPhoto)
    onPhotoChange(defaultPhoto)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/30 shadow-md`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Image
          src={photoUrl || "/images/default-profile.png"}
          alt="Profile picture"
          fill
          className="object-cover"
          sizes={`(max-width: 768px) ${size === "sm" ? "64px" : size === "md" ? "96px" : "128px"}, ${
            size === "sm" ? "64px" : size === "md" ? "96px" : "128px"
          }`}
        />

        {isHovering && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition-colors"
              >
                <Camera className="h-5 w-5" />
              </button>
              {photoUrl !== "/images/default-profile.png" && (
                <button
                  onClick={handleRemovePhoto}
                  className="p-1 bg-white rounded-full text-red-500 hover:bg-gray-200 transition-colors mt-2"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload profile picture"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="mt-3 flex items-center text-sm text-blue-400 hover:text-blue-300"
      >
        <Upload className="h-4 w-4 mr-1" />
        사진 변경
      </button>
    </div>
  )
}
