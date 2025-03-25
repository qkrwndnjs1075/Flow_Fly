"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { getUserPortfolioProjects, getUserBlogPosts } from "@/lib/supabase-client"
import { trackVisitor } from "@/lib/visitor-actions"
import Link from "next/link"
import { PlusCircle, FileText, Briefcase, Users, UserCheck, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [portfolioCount, setPortfolioCount] = useState(0)
  const [blogCount, setBlogCount] = useState(0)
  const [visitorStats, setVisitorStats] = useState<{ totalVisitors: number; todayVisitors: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          const [portfolioProjects, blogPosts, visitors] = await Promise.all([
            getUserPortfolioProjects(user.id),
            getUserBlogPosts(user.id, true),
            trackVisitor(),
          ])

          setPortfolioCount(portfolioProjects.length)
          setBlogCount(blogPosts.length)
          setVisitorStats(visitors)
        } catch (error) {
          console.error("Failed to load data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      loadData()
    }
  }, [user])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p>로딩 중...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              포트폴리오
            </CardTitle>
            <CardDescription>포트폴리오 프로젝트를 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <p>로딩 중...</p> : <div className="text-3xl font-bold">{portfolioCount} 프로젝트</div>}
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/portfolio">관리하기</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              블로그
            </CardTitle>
            <CardDescription>블로그 포스트를 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <p>로딩 중...</p> : <div className="text-3xl font-bold">{blogCount} 포스트</div>}
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/blog">관리하기</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />총 방문자
            </CardTitle>
            <CardDescription>사이트 전체 방문자 수</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>로딩 중...</p>
            ) : (
              <div className="text-3xl font-bold">{visitorStats?.totalVisitors.toLocaleString()}</div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="#">
                <TrendingUp className="mr-2 h-4 w-4" />
                통계 보기
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              오늘 방문자
            </CardTitle>
            <CardDescription>오늘 방문한 사용자 수</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>로딩 중...</p>
            ) : (
              <div className="text-3xl font-bold">{visitorStats?.todayVisitors.toLocaleString()}</div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="#">
                <TrendingUp className="mr-2 h-4 w-4" />
                상세 분석
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>빠른 작업</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/dashboard/portfolio/new">
                <PlusCircle className="mr-2 h-4 w-4" />새 포트폴리오 프로젝트 추가
              </Link>
            </Button>
            <Button asChild className="w-full justify-start">
              <Link href="/dashboard/blog/new">
                <PlusCircle className="mr-2 h-4 w-4" />새 블로그 포스트 작성
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>내 페이지</CardTitle>
            <CardDescription>공개 페이지 링크</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href={`/${user.displayName || user.id}/portfolio`} target="_blank">
                <Briefcase className="mr-2 h-4 w-4" />내 포트폴리오 보기
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href={`/${user.displayName || user.id}/blog`} target="_blank">
                <FileText className="mr-2 h-4 w-4" />내 블로그 보기
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

