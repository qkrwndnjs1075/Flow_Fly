"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Calendar, User, X } from "lucide-react"

// Mock blog data - in a real app, this would come from a database
const blogPosts = [
  {
    id: 1,
    title: "웹 개발 시작하기",
    excerpt: "웹 개발 여정을 시작하기 위한 HTML, CSS, JavaScript의 기초를 배워보세요.",
    date: "2025년 3월 10일",
    author: "김지민",
    category: "웹 개발",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    readTime: "5분",
  },
  {
    id: 2,
    title: "React Hooks의 힘",
    excerpt: "React Hooks가 어떻게 코드를 단순화하고 컴포넌트를 더 재사용 가능하게 만드는지 알아보세요.",
    date: "2025년 3월 5일",
    author: "이준호",
    category: "React",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    readTime: "8분",
  },
  {
    id: 3,
    title: "돋보이는 포트폴리오 만들기",
    excerpt: "잠재적 고용주와 고객에게 인상을 줄 수 있는 포트폴리오를 만들기 위한 팁과 요령.",
    date: "2025년 2월 28일",
    author: "박서연",
    category: "커리어",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    readTime: "6분",
  },
  {
    id: 4,
    title: "Next.js 소개",
    excerpt: "Next.js가 왜 React 애플리케이션을 위한 필수 프레임워크가 되고 있는지 알아보세요.",
    date: "2025년 2월 20일",
    author: "최민준",
    category: "Next.js",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    readTime: "7분",
  },
  {
    id: 5,
    title: "TypeScript로 코드 품질 향상하기",
    excerpt: "TypeScript를 사용하여 JavaScript 프로젝트의 코드 품질과 유지보수성을 높이는 방법.",
    date: "2025년 2월 15일",
    author: "정다은",
    category: "TypeScript",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    readTime: "10분",
  },
  {
    id: 6,
    title: "UI/UX 디자인 기초",
    excerpt: "사용자 경험을 향상시키는 효과적인 UI/UX 디자인 원칙과 실전 팁.",
    date: "2025년 2월 10일",
    author: "김지민",
    category: "디자인",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    readTime: "9분",
  },
]

// Get unique categories
const categories = ["전체", ...new Set(blogPosts.map((post) => post.category))]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  // Set isLoaded to true after component mounts for animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Filter posts based on active category and search query
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "전체" || post.category === activeCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Get featured posts
  const featuredPosts = blogPosts.filter((post) => post.featured)

  return (
    <div className="container py-12">
      <div className="space-y-10">
        {/* Header */}
        <div
          className={`space-y-4 text-right pr-8 transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0 translate-y-10"}`}
        >
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">블로그</h1>
          <p className="text-muted-foreground md:text-xl max-w-2xl ml-auto">
            디자인, 개발 등에 관한 생각, 이야기, 아이디어를 공유합니다.
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div
            className={`space-y-4 transition-all duration-700 delay-100 ${isLoaded ? "opacity-100" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-2xl font-bold">추천 글</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredPosts.map((post, index) => (
                <Link href={`/blog/${post.id}`} key={post.id} className="block group">
                  <Card
                    className={`overflow-hidden flex flex-col h-full group-hover:shadow-lg transition-all duration-500 group-hover:translate-y-[-5px] group-hover:border-primary ${isLoaded ? "animate-scale-in" : "opacity-0"}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg?height=400&width=600"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground animate-pulse-glow">
                        추천
                      </Badge>
                    </div>
                    <CardHeader className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Badge
                          variant="outline"
                          className="bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30"
                        >
                          {post.category}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {post.author}
                        </span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <div className="w-full flex items-center justify-start group-hover:text-primary transition-colors duration-300">
                        <span>더 읽기</span>{" "}
                        <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2">
                          →
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div
          className={`flex flex-col md:flex-row gap-6 items-center justify-between p-4 bg-[#161625] rounded-lg border border-indigo-900/30 transition-all duration-700 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="w-full md:w-auto">
            <h3 className="text-sm font-medium mb-2 text-gray-300">주제별 필터링</h3>
            <Tabs defaultValue="전체" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto p-1 bg-[#0f0f18]">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-xs md:text-sm py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-300 hover:bg-indigo-900/50"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="relative w-full md:w-80">
            <h3 className="text-sm font-medium mb-2 text-gray-300">글 검색</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목 또는 내용으로 검색..."
                className="pl-10 bg-[#0f0f18] border-indigo-900/30 focus:border-indigo-500 h-10 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-indigo-900/20"
                  onClick={() => setSearchQuery("")}
                  aria-label="검색어 지우기"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <Link href={`/blog/${post.id}`} key={post.id} className="block group">
                <Card
                  className={`overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-500 hover:translate-y-[-5px] hover:border-primary ${isLoaded ? "animate-slide-up" : "opacity-0"}`}
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg?height=400&width=600"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader className="flex-1">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <Badge variant="outline" className="bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30">
                        {post.category}
                      </Badge>
                      <span>{post.readTime} 소요</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" /> {post.date}
                      <span className="mx-1">•</span>
                      <User className="h-3 w-3" /> {post.author}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full flex items-center justify-start group-hover:text-primary transition-colors duration-300">
                      <span>더 읽기</span>{" "}
                      <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2">
                        →
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 animate-fade-in">
              <p className="text-muted-foreground">검색 결과가 없습니다.</p>
              <Button
                variant="outline"
                className="mt-4 hover:bg-indigo-900/20 hover:border-indigo-500 transition-all duration-300"
                onClick={() => {
                  setActiveCategory("전체")
                  setSearchQuery("")
                }}
              >
                모든 글 보기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

