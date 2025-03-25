"use client"

import type React from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">대시보드</h1>
        <p className="text-muted-foreground">포트폴리오와 블로그를 관리하세요.</p>
      </div>

      <DashboardTabs />

      <div className="mt-8">{children}</div>
    </div>
  )
}

function DashboardTabs() {
  const pathname = usePathname()

  const getActiveTab = () => {
    if (pathname.includes("/dashboard/portfolio")) return "portfolio"
    if (pathname.includes("/dashboard/blog")) return "blog"
    return "overview"
  }

  return (
    <Tabs defaultValue={getActiveTab()} className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-md">
        <TabsTrigger value="overview" asChild>
          <Link href="/dashboard">개요</Link>
        </TabsTrigger>
        <TabsTrigger value="portfolio" asChild>
          <Link href="/dashboard/portfolio">포트폴리오</Link>
        </TabsTrigger>
        <TabsTrigger value="blog" asChild>
          <Link href="/dashboard/blog">블로그</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

