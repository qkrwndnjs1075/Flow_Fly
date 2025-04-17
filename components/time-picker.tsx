"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

type TimePickerProps = {
  value: string
  onChange: (time: string) => void
  className?: string
}

export default function TimePicker({ value, onChange, className = "" }: TimePickerProps) {
  // 시간 파싱 함수
  const parseTime = (timeString: string) => {
    const [hourStr, minuteStr] = timeString.split(":")
    let hour = Number.parseInt(hourStr, 10)
    const minute = Number.parseInt(minuteStr, 10)

    let period: "AM" | "PM" = "AM"
    if (hour >= 12) {
      period = "PM"
      if (hour > 12) hour -= 12
    } else if (hour === 0) {
      hour = 12
    }

    return { hour, minute, period }
  }

  // 초기 시간 파싱
  const initialTime = parseTime(value)

  // 로컬 상태 설정
  const [hours, setHours] = useState<number>(initialTime.hour)
  const [minutes, setMinutes] = useState<number>(initialTime.minute)
  const [period, setPeriod] = useState<"AM" | "PM">(initialTime.period)

  // 입력 필드 참조
  const hourInputRef = useRef<HTMLInputElement>(null)
  const minuteInputRef = useRef<HTMLInputElement>(null)

  // 외부 value가 변경될 때만 내부 상태 업데이트
  useEffect(() => {
    const { hour, minute, period } = parseTime(value)
    setHours(hour)
    setMinutes(minute)
    setPeriod(period)
  }, [value])

  // 시간 포맷팅 및 변경 함수
  const formatAndNotifyChange = () => {
    let hour = hours

    // 12시간제에서 24시간제로 변환
    if (period === "PM" && hour < 12) {
      hour += 12
    } else if (period === "AM" && hour === 12) {
      hour = 0
    }

    const formattedHour = hour.toString().padStart(2, "0")
    const formattedMinute = minutes.toString().padStart(2, "0")
    onChange(`${formattedHour}:${formattedMinute}`)
  }

  // 시간 증가/감소 함수
  const incrementHour = () => {
    setHours((prev) => {
      const newHours = prev === 12 ? 1 : prev + 1
      return newHours
    })
  }

  const decrementHour = () => {
    setHours((prev) => {
      const newHours = prev === 1 ? 12 : prev - 1
      return newHours
    })
  }

  const incrementMinute = () => {
    setMinutes((prev) => {
      const newMinutes = prev === 59 ? 0 : prev + 1
      return newMinutes
    })
  }

  const decrementMinute = () => {
    setMinutes((prev) => {
      const newMinutes = prev === 0 ? 59 : prev - 1
      return newMinutes
    })
  }

  const togglePeriod = () => {
    setPeriod((prev) => (prev === "AM" ? "PM" : "AM"))
  }

  // 시간 변경 후 포맷팅 및 알림
  useEffect(() => {
    formatAndNotifyChange()
  }, [hours, minutes, period])

  // 시간 입력 핸들러 수정
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 숫자만 입력 가능하도록
    if (/^\d*$/.test(value)) {
      const numValue = value === "" ? 0 : Number.parseInt(value)
      if (numValue >= 0 && numValue <= 12) {
        setHours(numValue || 0)
      }
    }
  }

  // 분 입력 핸들러 수정
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 숫자만 입력 가능하도록
    if (/^\d*$/.test(value)) {
      const numValue = value === "" ? 0 : Number.parseInt(value)
      if (numValue >= 0 && numValue <= 59) {
        setMinutes(numValue || 0)
      }
    }
  }

  // 키보드 이벤트 핸들러
  const handleHourKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      incrementHour()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      decrementHour()
    }
  }

  const handleMinuteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      incrementMinute()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      decrementMinute()
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex flex-col items-center">
        <button type="button" onClick={incrementHour} className="p-1 hover:bg-white/10 rounded-md">
          <ChevronUp className="h-4 w-4 text-white" />
        </button>
        <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-md text-white relative">
          <input
            ref={hourInputRef}
            type="text"
            value={hours.toString().padStart(2, "0")}
            onChange={handleHourChange}
            onKeyDown={handleHourKeyDown}
            className="w-full h-full bg-transparent text-center focus:outline-none"
            maxLength={2}
          />
        </div>
        <button type="button" onClick={decrementHour} className="p-1 hover:bg-white/10 rounded-md">
          <ChevronDown className="h-4 w-4 text-white" />
        </button>
      </div>

      <div className="text-white text-xl">:</div>

      <div className="flex flex-col items-center">
        <button type="button" onClick={incrementMinute} className="p-1 hover:bg-white/10 rounded-md">
          <ChevronUp className="h-4 w-4 text-white" />
        </button>
        <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-md text-white relative">
          <input
            ref={minuteInputRef}
            type="text"
            value={minutes.toString().padStart(2, "0")}
            onChange={handleMinuteChange}
            onKeyDown={handleMinuteKeyDown}
            className="w-full h-full bg-transparent text-center focus:outline-none"
            maxLength={2}
          />
        </div>
        <button type="button" onClick={decrementMinute} className="p-1 hover:bg-white/10 rounded-md">
          <ChevronDown className="h-4 w-4 text-white" />
        </button>
      </div>

      <button
        type="button"
        onClick={togglePeriod}
        className="w-12 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors"
      >
        {period}
      </button>
    </div>
  )
}
