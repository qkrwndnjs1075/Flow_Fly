"use client"

import { useEffect, useState } from "react"
import { trackVisitor } from "@/lib/visitor-actions"
import { Users, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function BlogVisitorStats() {
  const [stats, setStats] = useState<{ totalVisitors: number; todayVisitors: number } | null>(null)
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

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold flex items-center">
        <span className="relative">
          방문자 통계
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse-glow"></span>
        </span>
      </h2>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-6 bg-muted/50 animate-pulse rounded"></div>
          <div className="h-6 bg-muted/50 animate-pulse rounded"></div>
        </div>
      ) : (
        <div className="bg-[#161625] p-4 rounded-lg border border-indigo-900/30 space-y-3">
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

          <div className="pt-2 text-xs text-center text-muted-foreground border-t border-indigo-900/20">
            마지막 업데이트: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  )
}

