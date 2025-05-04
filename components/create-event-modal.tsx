"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import TimePickerKeyboard from "./time-picker-keyboard"

// 컴포넌트 props 수정
type CreateEventModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (event: EventFormData) => void
  currentDate: number
  currentYear?: number
  currentMonthIndex?: number
  calendars: Array<{ name: string; color: string; id: string }>
  selectedCalendarId: string
}

type EventFormData = {
  title: string
  startTime: string
  endTime: string
  description: string
  color: string
  day: number
  calendarId: string
  date: string
}

// 컴포넌트 함수 수정
export default function CreateEventModal({
  isOpen,
  onClose,
  onSave,
  currentDate,
  currentYear = new Date().getFullYear(),
  currentMonthIndex = new Date().getMonth(),
  calendars,
  selectedCalendarId,
}: CreateEventModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    color: "bg-blue-500",
    day: new Date(currentYear, currentMonthIndex, currentDate).getDay(), // 요일 계산 (0: 일요일, 1: 월요일, ...)
    calendarId: selectedCalendarId,
    date: new Date(currentYear, currentMonthIndex, currentDate).toISOString(), // ISO 문자열로 변환
  })

  // 모달이 열릴 때마다 폼 데이터 초기화
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        startTime: "09:00",
        endTime: "10:00",
        description: "",
        color: "bg-blue-500",
        day: new Date(currentYear, currentMonthIndex, currentDate).getDay(),
        calendarId: selectedCalendarId,
        date: new Date(currentYear, currentMonthIndex, currentDate).toISOString(),
      })
    }
  }, [isOpen, currentDate, currentYear, currentMonthIndex, selectedCalendarId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 날짜 객체 생성 (현재 날짜에 선택된 날짜로 설정)
    const eventDate = new Date(currentYear, currentMonthIndex, currentDate)

    // 서버에 전송할 데이터 준비
    const eventData = {
      ...formData,
      date: eventDate.toISOString(), // ISO 문자열로 변환
      day: eventDate.getDay(), // 요일 정보 추가 (0: 일요일, 1: 월요일, ...)
    }

    console.log("이벤트 저장 데이터:", eventData)

    try {
      onSave(eventData)
      onClose()
    } catch (error) {
      console.error("이벤트 저장 오류:", error)
      alert("일정을 저장하는 중 오류가 발생했습니다.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/20 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl p-6 w-full max-w-md text-white modal-animation">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">새 일정 만들기</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">일정 제목</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/30 rounded-md px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="제목 추가"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">캘린더</label>
              <select
                name="calendarId"
                value={formData.calendarId}
                onChange={handleChange}
                className="w-full bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {calendars.map((calendar) => (
                  <option key={calendar.id} value={calendar.id}>
                    {calendar.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm">시작 시간</label>
                <TimePickerKeyboard
                  value={formData.startTime}
                  onChange={(time) => handleTimeChange("startTime", time)}
                />
                <p className="text-xs text-white/50 mt-1">직접 입력하거나 화살표로 조정</p>
              </div>
              <div>
                <label className="block mb-1 text-sm">종료 시간</label>
                <TimePickerKeyboard value={formData.endTime} onChange={(time) => handleTimeChange("endTime", time)} />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm">설명</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/30 rounded-md px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="설명 추가"
              ></textarea>
            </div>

            <div>
              <label className="block mb-1 text-sm">색상</label>
              <select
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full bg-white/10 dark:bg-gray-700/30 border border-white/20 dark:border-gray-600/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bg-blue-500">파란색</option>
                <option value="bg-green-500">초록색</option>
                <option value="bg-purple-500">보라색</option>
                <option value="bg-yellow-500">노란색</option>
                <option value="bg-pink-500">분홍색</option>
                <option value="bg-indigo-500">인디고</option>
                <option value="bg-orange-500">주황색</option>
                <option value="bg-teal-500">청록색</option>
                <option value="bg-red-500">빨간색</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 dark:bg-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-600/30 rounded-md transition-all hover:translate-y-[-2px]"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-all hover:translate-y-[-2px] hover:shadow-md"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
