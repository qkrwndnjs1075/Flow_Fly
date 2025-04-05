"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Camera } from "lucide-react"
import Image from "next/image"

type ProfilePictureUploadProps = {
  currentPhotoUrl?: string
  onPhotoChange: (photoUrl: string) => void
}

export default function ProfilePictureUpload({ currentPhotoUrl, onPhotoChange }: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 이미지 처리 함수
  const processFile = (file: File) => {
    if (!file) return

    // 허용된 파일 타입인지 확인
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      alert("JPG, PNG, GIF, WEBP 형식의 이미지만 업로드 가능합니다.")
      return
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    // 이미지 미리보기 생성
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      onPhotoChange(result) // 상위 컴포넌트에 URL 전달
    }
    reader.readAsDataURL(file)
  }

  // 파일 선택 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  // 드래그 앤 드롭 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const clearImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onPhotoChange("/placeholder.svg?height=100&width=100") // 기본 이미지로 리셋
  }

  const displayUrl = preview || currentPhotoUrl || "/placeholder.svg?height=100&width=100"

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden relative shadow-lg">
          <Image src={displayUrl || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
        </div>
        {preview && (
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-4 mb-4 text-center w-full max-w-xs cursor-pointer transition-colors ${
          isDragging ? "border-blue-500 bg-blue-500/10" : "border-white/30 hover:border-blue-400 hover:bg-white/5"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/gif, image/webp"
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-6 w-6 text-white/70" />
          <p className="text-sm text-white/70">이미지를 끌어다 놓거나 클릭하여 업로드하세요</p>
          <p className="text-xs text-white/50">JPG, PNG, GIF, WEBP (최대 5MB)</p>
        </div>
      </div>

      <div className={`animate-slide-in-up ${preview ? "opacity-100" : "opacity-0"} transition-opacity`}>
        {preview && (
          <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            onClick={triggerFileInput}
          >
            <Camera className="h-4 w-4" />
            다른 사진 선택
          </button>
        )}
      </div>
    </div>
  )
}

