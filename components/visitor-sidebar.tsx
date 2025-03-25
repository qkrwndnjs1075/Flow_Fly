"use client"

import { useEffect, useState } from "react"
import { trackVisitor } from "@/lib/visitor-actions"
import { Users, UserCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function VisitorSidebar() {
  const [stats, setStats] = useState<{ totalVisitors: number; todayVisitors: number } | null>(null)
  const [isOpen, setIsOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVisitorStats = async () => {
      try {
        const data = await trackVisitor()
        setStats(data)
      } catch (error) {
        console.error("방문자 통계를 가져오는 중 오류 발생:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVisitorStats()
  }, [])

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 rounded-l-lg rounded-r-none bg-indigo-600 hover:bg-indigo-700 shadow-lg z-50"
        size="sm"
      >
        <Users className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#161625] border border-indigo-900/30 rounded-l-lg shadow-lg z-50 transition-all duration-300 ease-in-out">
      <div className="p-4 w-48">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-sm">방문자 통계</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <div className="h-6 bg-muted/50 animate-pulse rounded"></div>
            <div className="h-6 bg-muted/50 animate-pulse rounded"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  "bg-indigo-900/20 text-indigo-400",
                )}
              >
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">총 방문자</p>
                <p className="font-bold">{stats?.totalVisitors.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  "bg-indigo-900/20 text-indigo-400",
                )}
              >
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">오늘 방문자</p>
                <p className="font-bold">{stats?.todayVisitors.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

