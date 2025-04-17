"use client"
import { X, Bell, Calendar, Clock } from "lucide-react"

type Notification = {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "reminder" | "invitation" | "update"
}

type NotificationsPanelProps = {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onClearAll: () => void
}

export default function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
}: NotificationsPanelProps) {
  if (!isOpen) return null

  return (
    <div className="fixed right-4 top-20 w-80 bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/50 shadow-xl z-50 overflow-hidden animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-gray-700/50">
        <h3 className="font-medium text-white">알림</h3>
        <div className="flex items-center gap-2">
          <button onClick={onClearAll} className="text-xs text-white/70 hover:text-white">
            모두 지우기
          </button>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-white/70">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>알림 없음</p>
          </div>
        ) : (
          notifications.map((notification, i) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-white/10 dark:border-gray-700/30 hover:bg-white/10 dark:hover:bg-gray-700/30 cursor-pointer transition-all ${
                notification.read ? "opacity-70" : ""
              } animate-slide-in-up`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 p-2 rounded-full ${
                    notification.type === "reminder"
                      ? "bg-blue-500/20"
                      : notification.type === "invitation"
                        ? "bg-green-500/20"
                        : "bg-yellow-500/20"
                  }`}
                >
                  {notification.type === "reminder" ? (
                    <Clock className="h-4 w-4 text-blue-300" />
                  ) : notification.type === "invitation" ? (
                    <Calendar className="h-4 w-4 text-green-300" />
                  ) : (
                    <Bell className="h-4 w-4 text-yellow-300" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-white">{notification.title}</h4>
                  <p className="text-sm text-white/70 mt-1">{notification.message}</p>
                  <p className="text-xs text-white/50 mt-2">{notification.time}</p>
                </div>
                {!notification.read && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
