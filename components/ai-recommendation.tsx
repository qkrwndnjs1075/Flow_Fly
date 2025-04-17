"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

type Event = {
  title: string
  startTime: string
  endTime: string
  color: string
}

type AIRecommendationProps = {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  message: string
  upcomingEvents?: Event[]
}

export default function AIRecommendation({
  isOpen,
  onClose,
  onAccept,
  message,
  upcomingEvents = [],
}: AIRecommendationProps) {
  const [typedText, setTypedText] = useState("")

  useEffect(() => {
    if (isOpen && message) {
      setTypedText("")
      let i = 0
      const typingInterval = setInterval(() => {
        if (i < message.length) {
          setTypedText((prev) => prev + message.charAt(i))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 50)

      return () => clearInterval(typingInterval)
    }
  }, [isOpen, message])

  if (!isOpen) return null

  return (
    <div className="fixed bottom-8 right-8 z-20 flex gap-2">
      {/* 메인 AI 추천 메시지 */}
      <div className="w-[300px] relative bg-emerald-500/80 backdrop-blur-lg p-5 rounded-2xl shadow-xl border border-emerald-400/30 text-white">
        <button onClick={onClose} className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="flex gap-2 items-start">
          <div className="flex-shrink-0 mt-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <p className="text-sm">{typedText}</p>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onAccept}
            className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors font-medium"
          >
            예
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors font-medium"
          >
            아니오
          </button>
        </div>
      </div>

      {/* 일정 카드들 */}
      {upcomingEvents.length > 0 && (
        <div className="flex flex-col gap-2 max-w-[200px]">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className={`${event.color} p-3 rounded-xl shadow-lg text-white text-sm`}
              style={{
                transform: `translateY(${index * 10}px)`,
                zIndex: 20 - index,
              }}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-xs mt-1">{`${event.startTime} - ${event.endTime}`}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
