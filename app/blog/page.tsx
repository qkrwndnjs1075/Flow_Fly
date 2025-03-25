"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Calendar, User, ArrowRight, X, PlusCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { BlogCategories } from "@/components/blog-categories"
import { BlogTags } from "@/components/blog-tags"
import { BlogVisitorStats } from "@/components/blog-visitor-stats"
import { categories, tags, blogPosts, getPostsByCategoryId, findCategoryById, getCategoryPath } from "@/lib/blog-data"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>("all")
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)
  const [isLoaded, setIsLoaded] = useState(false)
  const [categoryPath, setCategoryPath] = useState<string[]>([])
  const { user } = useAuth()

  // 컴포넌트 마운트 후 애니메이션을 위한 상태 설정
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // 카테고리 선택 시 경로 업데이트
  useEffect(() => {
    if (selectedCategoryId && selectedCategoryId !== "all") {
      const path = getCategoryPath(selectedCategoryId)
      setCategoryPath(path.map((cat) => cat.name))
    } else {
      setCategoryPath([])
    }
  }, [selectedCategoryId])

  // 검색어, 카테고리, 태그에 따라 포스트 필터링
  useEffect(() => {
    let filtered = [...blogPosts]

    // 카테고리 필터링
    if (selectedCategoryId && selectedCategoryId !== "all") {
      filtered = getPostsByCategoryId(selectedCategoryId)
    }

    // 태그 필터링
    if (selectedTagIds.length > 0) {
      filtered = filtered.filter((post) => selectedTagIds.every((tagId) => post.tags.includes(tagId)))
    }

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // 날짜순 정렬
    filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setFilteredPosts(filtered)
  }, [searchQuery, selectedCategoryId, selectedTagIds])

  // 태그 선택/해제 처리
  const handleTagSelect = (tagId: string) => {
    setSelectedTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  // 카테고리 선택 처리
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    // 카테고리 변경 시 태그 선택 초기화
    setSelectedTagIds([])
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 왼쪽 사이드바 */}
        <div className="w-full md:w-64 space-y-8">
          {/* 공지사항 - 이제 맨 위로 이동 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center">
              <span className="relative">
                공지사항
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse-glow"></span>
              </span>
            </h2>
            <div className="bg-[#161625] p-4 rounded-lg border border-indigo-900/30">
              <p className="text-sm text-muted-foreground">
                블로그가 새롭게 개편되었습니다. 더 나은 경험을 위해 디자인과 기능을 개선했습니다.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center">
              <span className="relative">
                카테고리
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse-glow"></span>
              </span>
            </h2>
            <BlogCategories
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleCategorySelect}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center">
              <span className="relative">
                태그
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse-glow"></span>
              </span>
            </h2>
            <BlogTags
              tags={tags}
              selectedTagIds={selectedTagIds}
              onSelectTag={handleTagSelect}
              onClearTags={() => setSelectedTagIds([])}
            />
          </div>

          {/* 방문자 통계 - 이제 맨 아래로 이동 */}
          <BlogVisitorStats />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1">
          {/* 검색 바 */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="블로그 검색..."
                className="pl-10 bg-[#161625] border-indigo-900/30 focus:border-indigo-500 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50"
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

          {/* 현재 카테고리 경로 */}
          {categoryPath.length > 0 && (
            <div className="mb-6 flex items-center text-sm text-muted-foreground animate-fade-in">
              <span
                className="cursor-pointer hover:text-indigo-400 transition-colors"
                onClick={() => setSelectedCategoryId("all")}
              >
                전체 글
              </span>
              {categoryPath.map((name, index) => (
                <div key={index} className="flex items-center">
                  <span className="mx-2">/</span>
                  <span
                    className={`
                      cursor-pointer 
                      ${
                        index === categoryPath.length - 1
                          ? "text-indigo-400"
                          : "hover:text-indigo-400 transition-colors"
                      }
                    `}
                    onClick={() => {
                      if (index < categoryPath.length - 1) {
                        const category = findCategoryById(selectedCategoryId || "")
                        if (category?.parentId) {
                          setSelectedCategoryId(category.parentId)
                        }
                      }
                    }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 새 글 작성 버튼 (로그인한 경우) */}
          {user && (
            <div className="mb-6 flex justify-end animate-fade-in">
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <Link href="/blog/create">
                  <PlusCircle className="h-4 w-4 mr-2" /> 새 글 작성
                </Link>
              </Button>
            </div>
          )}

          {/* 블로그 포스트 목록 */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => {
                const category = findCategoryById(post.categoryId)

                return (
                  <Link
                    href={`/blog/${post.id}`}
                    key={post.id}
                    className={`block group transition-all duration-500 ${
                      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <article className="blog-card flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-indigo-900/20 hover:border-indigo-500/50 bg-[#161625] hover:bg-[#1a1a2e] transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/10">
                      <div className="md:flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge
                            variant="outline"
                            className="bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30"
                          >
                            {category?.name || post.categoryId}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {post.date}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold group-hover:text-indigo-400 transition-colors duration-300">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {post.tags.slice(0, 3).map((tagId) => {
                            const tag = tags.find((t) => t.id === tagId)
                            return tag ? (
                              <Badge
                                key={tag.id}
                                variant="secondary"
                                className="text-xs bg-indigo-900/10 border-indigo-900/30"
                              >
                                {tag.name}
                              </Badge>
                            ) : null
                          })}
                          {post.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-indigo-900/10 border-indigo-900/30">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <User className="h-3 w-3" /> {post.author}
                          </span>
                          <span className="text-sm text-indigo-400 flex items-center group-hover:translate-x-1 transition-transform duration-300">
                            더 읽기 <ArrowRight className="h-3 w-3 ml-1" />
                          </span>
                        </div>
                      </div>
                      <div className="md:w-1/4 h-32 md:h-auto overflow-hidden rounded-md">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </article>
                  </Link>
                )
              })
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <p className="text-muted-foreground mb-4">검색 결과가 없습니다.</p>
                <Button
                  variant="outline"
                  className="hover:bg-indigo-900/20 hover:border-indigo-500 transition-all duration-300"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategoryId("all")
                    setSelectedTagIds([])
                  }}
                >
                  모든 글 보기
                </Button>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {filteredPosts.length > 0 && (
            <div className="mt-8 flex justify-center animate-fade-in" style={{ animationDelay: "300ms" }}>
              <nav className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 bg-[#161625] border-indigo-900/30 hover:bg-indigo-900/20 hover:text-indigo-400"
                >
                  &lt;
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 bg-indigo-900/20 border-indigo-500 text-indigo-400"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 bg-[#161625] border-indigo-900/30 hover:bg-indigo-900/20 hover:text-indigo-400"
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 bg-[#161625] border-indigo-900/30 hover:bg-indigo-900/20 hover:text-indigo-400"
                >
                  3
                </Button>
                <span className="text-muted-foreground">...</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 bg-[#161625] border-indigo-900/30 hover:bg-indigo-900/20 hover:text-indigo-400"
                >
                  &gt;
                </Button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

