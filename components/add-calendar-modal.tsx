"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

type CalendarFormData = {
  name: string
  color: string
}

type AddCalendarModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (calendar: CalendarFormData) => void
}

export default function AddCalendarModal({ isOpen, onClose, onSave }: AddCalendarModalProps) {
  const [formData, setFormData] = useState<CalendarFormData>({
    name: "",
    color: "bg-blue-500",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-6 w-full max-w-md text-white modal-animation">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">새 캘린더 추가</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">캘린더 이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 업무, 개인, 가족"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">색상</label>
              <select
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-all hover:translate-y-[-2px]"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-all hover:translate-y-[-2px] hover:shadow-md"
            >
              캘린더 추가
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
