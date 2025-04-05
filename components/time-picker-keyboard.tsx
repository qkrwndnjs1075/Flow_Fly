"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

type TimePickerKeyboardProps = {
  value: string
  onChange: (time: string) => void
  className?: string
}

export default function TimePickerKeyboard({ value, onChange, className = "" }: TimePickerKeyboardProps) {
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

  // 입력 상태
  const [hourInput, setHourInput] = useState<string>(initialTime.hour.toString().padStart(2, "0"))
  const [minuteInput, setMinuteInput] = useState<string>(initialTime.minute.toString().padStart(2, "0"))

  // 입력 필드 참조
  const hourInputRef = useRef<HTMLInputElement>(null)
  const minuteInputRef = useRef<HTMLInputElement>(null)

  // 외부 value가 변경될 때만 내부 상태 업데이트
  useEffect(() => {
    const { hour, minute, period } = parseTime(value)
    setHours(hour)
    setMinutes(minute)
    setPeriod(period)
    setHourInput(hour.toString().padStart(2, "0"))
    setMinuteInput(minute.toString().padStart(2, "0"))
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
      setHourInput(newHours.toString().padStart(2, "0"))
      return newHours
    })
  }

  const decrementHour = () => {
    setHours((prev) => {
      const newHours = prev === 1 ? 12 : prev - 1
      setHourInput(newHours.toString().padStart(2, "0"))
      return newHours
    })
  }

  const incrementMinute = () => {
    setMinutes((prev) => {
      const newMinutes = prev === 59 ? 0 : prev + 1
      setMinuteInput(newMinutes.toString().padStart(2, "0"))
      return newMinutes
    })
  }

  const decrementMinute = () => {
    setMinutes((prev) => {
      const newMinutes = prev === 0 ? 59 : prev - 1
      setMinuteInput(newMinutes.toString().padStart(2, "0"))
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

  // 시간 입력 핸들러
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setHourInput(value)

    // 숫자만 입력 가능하도록
    if (/^\d{1,2}$/.test(value)) {
      const numValue = Number.parseInt(value)
      if (numValue >= 1 && numValue <= 12) {
        setHours(numValue)
      }
    }
  }

  // 시간 입력 완료 핸들러
  const handleHourBlur = () => {
    let numValue = Number.parseInt(hourInput)
    if (isNaN(numValue) || numValue < 1) {
      numValue = 1
    } else if (numValue > 12) {
      numValue = 12
    }
    setHours(numValue)
    setHourInput(numValue.toString().padStart(2, "0"))
  }

  // 분 입력 핸들러
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMinuteInput(value)

    // 숫자만 입력 가능하도록
    if (/^\d{1,2}$/.test(value)) {
      const numValue = Number.parseInt(value)
      if (numValue >= 0 && numValue <= 59) {
        setMinutes(numValue)
      }
    }
  }

  // 분 입력 완료 핸들러
  const handleMinuteBlur = () => {
    let numValue = Number.parseInt(minuteInput)
    if (isNaN(numValue)) {
      numValue = 0
    } else if (numValue > 59) {
      numValue = 59
    }
    setMinutes(numValue)
    setMinuteInput(numValue.toString().padStart(2, "0"))
  }

  // 키보드 이벤트 핸들러
  const handleHourKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      incrementHour()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      decrementHour()
    } else if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault()
      minuteInputRef.current?.focus()
      minuteInputRef.current?.select()
    }
  }

  const handleMinuteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      incrementMinute()
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      decrementMinute()
    } else if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault()
      hourInputRef.current?.focus()
      hourInputRef.current?.select()
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={incrementHour}
          className="p-1 hover:bg-white/10 rounded-md text-white"
          aria-label="시간 증가"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-md text-white relative">
          <input
            ref={hourInputRef}
            type="text"
            value={hourInput}
            onChange={handleHourChange}
            onBlur={handleHourBlur}
            onKeyDown={handleHourKeyDown}
            className="w-full h-full bg-transparent text-center focus:outline-none"
            maxLength={2}
            aria-label="시간"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
        </div>
        <button
          type="button"
          onClick={decrementHour}
          className="p-1 hover:bg-white/10 rounded-md text-white"
          aria-label="시간 감소"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="text-white text-xl">:</div>

      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={incrementMinute}
          className="p-1 hover:bg-white/10 rounded-md text-white"
          aria-label="분 증가"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-md text-white relative">
          <input
            ref={minuteInputRef}
            type="text"
            value={minuteInput}
            onChange={handleMinuteChange}
            onBlur={handleMinuteBlur}
            onKeyDown={handleMinuteKeyDown}
            className="w-full h-full bg-transparent text-center focus:outline-none"
            maxLength={2}
            aria-label="분"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
        </div>
        <button
          type="button"
          onClick={decrementMinute}
          className="p-1 hover:bg-white/10 rounded-md text-white"
          aria-label="분 감소"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={togglePeriod}
        className="w-12 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors"
        aria-label="오전/오후 전환"
      >
        {period}
      </button>
    </div>
  )
}

