export interface Calendar {
  _id: string
  name: string
  color: string
  user: string
  createdAt: string
  updatedAt: string
}

// Event API 서비스
export interface Event {
  _id: string
  title: string
  startTime: string
  endTime: string
  description: string
  location: string
  color: string
  day: number
  date: string
  calendar: string | Calendar
  user: string
  attendees: string[]
  organizer: string
  createdAt: string
  updatedAt: string
}

// Notification API 서비스
export interface Notification {
  _id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "reminder" | "invitation" | "update"
  user: string
  relatedEvent?: string
  createdAt: string
  updatedAt: string
}

// Settings API 서비스
export interface UserSettings {
  _id: string
  user: string
  darkMode: boolean
  notifications: boolean
  timeFormat: "12h" | "24h"
  startOfWeek: "sunday" | "monday"
  createdAt: string
  updatedAt: string
}
