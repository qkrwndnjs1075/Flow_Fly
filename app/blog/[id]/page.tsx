"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import {
  ArrowLeft,
  Edit,
  Calendar,
  User,
  Bookmark,
  Share2,
  ThumbsUp,
  Eye,
  MessageSquare,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { Comments } from "@/components/comments"
import { getPostById, getRelatedPosts, findCategoryById, getCategoryPath, findTagById } from "@/lib/blog-data"

export default function BlogPostPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [post, setPost] = useState<any>(null)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [categoryPath, setCategoryPath] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [animateContent, setAnimateContent] = useState(false)

  useEffect(() => {
    if (params.id) {
      // 포스트 데이터 가져오기
      const postId = Number(params.id)
      const postData = getPostById(postId)

      if (postData) {
        setPost(postData)

        // 관련 포스트 가져오기
        const related = getRelatedPosts(postId, 3)
        setRelatedPosts(related)

        // 카테고리 경로 가져오기
        if (postData.categoryId) {
          const path = getCategoryPath(postData.categoryId)
          setCategoryPath(path.map((cat) => cat.name))
        }
      }

      setIsLoading(false)

      // 콘텐츠 애니메이션 지연 시작
      setTimeout(() => {
        setAnimateContent(true)
      }, 100)
    }
  }, [params.id])

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 클립보드에 복사되었습니다.")
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-3xl">
          <div className="h-8 bg-muted/20 animate-pulse rounded-md w-40"></div>
          <div className="h-12 bg-muted/20 animate-pulse rounded-md"></div>
          <div className="h-64 bg-muted/20 animate-pulse rounded-md"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted/20 animate-pulse rounded-md"></div>
            <div className="h-4 bg-muted/20 animate-pulse rounded-md"></div>
            <div className="h-4 bg-muted/20 animate-pulse rounded-md w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">포스트를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground mb-6">요청하신 블로그 포스트가 존재하지 않거나 삭제되었습니다.</p>
          <Button asChild>
            <Link href="/blog">블로그로 돌아가기</Link>
          </Button>
        </div>
      </div>
    )
  }

  const category = findCategoryById(post.categoryId)

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 메인 콘텐츠 */}
        <div className="flex-1 max-w-3xl">
          {/* 카테고리 경로 */}
          <div className="mb-4 flex items-center text-sm text-muted-foreground animate-fade-in">
            <Link href="/blog" className="hover:text-indigo-400 transition-colors">
              블로그
            </Link>
            {categoryPath.map((name, index) => (
              <div key={index} className="flex items-center">
                <ChevronRight className="mx-1 h-3 w-3" />
                <span className={index === categoryPath.length - 1 ? "text-indigo-400" : ""}>{name}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-8">
            <Button variant="ghost" asChild className="group">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                블로그로 돌아가기
              </Link>
            </Button>

            {/* 로그인한 사용자에게 편집 버튼 표시 */}
            {user && (
              <Button variant="outline" asChild>
                <Link href={`/blog/edit/${post.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  편집하기
                </Link>
              </Button>
            )}
          </div>

          {post.image && (
            <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8 animate-fade-in">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          )}

          <div className="mb-6 animate-fade-in">
            <Badge variant="outline" className="mb-4 bg-indigo-900/20 border-indigo-500/50">
              {category?.name || post.categoryId}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-up">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {post.date}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" /> {post.author}
              </span>
              {post.readTime && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" /> {post.readTime} 소요
                </span>
              )}
              {post.views !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" /> 조회수 {post.views.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tagId: string) => {
                const tag = findTagById(tagId)
                return tag ? (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="bg-indigo-900/20 border-indigo-500/50 animate-fade-in"
                  >
                    {tag.name}
                  </Badge>
                ) : null
              })}
            </div>

            <div className="flex gap-2 mb-8">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className={`
                  transition-all duration-300 animate-fade-in
                  ${isLiked ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                `}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                좋아요 {isLiked ? post.likes + 1 : post.likes}
              </Button>
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                onClick={handleBookmark}
                className={`
                  transition-all duration-300 animate-fade-in
                  ${isBookmarked ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                `}
                style={{ animationDelay: "50ms" }}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                북마크
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="animate-fade-in"
                style={{ animationDelay: "100ms" }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                공유하기
              </Button>
            </div>
          </div>

          <div
            className={`
            prose prose-lg dark:prose-invert max-w-none mb-12 transition-opacity duration-500
            ${animateContent ? "opacity-100" : "opacity-0"}
          `}
          >
            {post.content.split("\n\n").map((paragraph: string, index: number) => {
              // 마크다운 헤딩 처리
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                    {paragraph.replace("## ", "")}
                  </h2>
                )
              } else if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-xl font-bold mt-6 mb-3">
                    {paragraph.replace("### ", "")}
                  </h3>
                )
              } else if (paragraph.startsWith("```")) {
                // 코드 블록 처리
                const language = paragraph.split("\n")[0].replace("```", "").trim()
                const code = paragraph.split("\n").slice(1, -1).join("\n")
                return (
                  <pre key={index} className="bg-[#1a1a2e] p-4 rounded-lg overflow-x-auto my-4">
                    <code className={`language-${language}`}>{code}</code>
                  </pre>
                )
              } else if (paragraph.startsWith("1. ")) {
                // 번호 목록 처리
                const items = paragraph.split("\n").map((item) => item.replace(/^\d+\.\s/, ""))
                return (
                  <ol key={index} className="list-decimal pl-6 my-4 space-y-2">
                    {items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                )
              } else {
                return (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                )
              }
            })}
          </div>

          {/* 태그 클라우드 */}
          <div className="mb-12 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <h3 className="text-lg font-bold mb-4">태그</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tagId: string) => {
                const tag = findTagById(tagId)
                return tag ? (
                  <Link href={`/blog?tag=${tag.id}`} key={tag.id}>
                    <Badge
                      variant="outline"
                      className="bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30 cursor-pointer"
                    >
                      {tag.name}
                    </Badge>
                  </Link>
                ) : null
              })}
            </div>
          </div>

          {/* 댓글 섹션 */}
          <Comments postId={post.id} />
        </div>

        {/* 사이드바 */}
        <div className="w-full md:w-64 space-y-8">
          <div className="space-y-4 sticky top-20">
            <h2 className="text-xl font-bold flex items-center">
              <span className="relative">
                관련 포스트
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse-glow"></span>
              </span>
            </h2>
            <div className="space-y-4">
              {relatedPosts.length > 0 ? (
                relatedPosts.map((relatedPost, index) => (
                  <Link href={`/blog/${relatedPost.id}`} key={relatedPost.id} className="block group">
                    <div
                      className="flex gap-3 p-3 rounded-lg border border-indigo-900/20 hover:border-indigo-500/50 bg-[#161625] hover:bg-[#1a1a2e] transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 100 + 200}ms` }}
                    >
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-indigo-400 transition-colors duration-300">
                          {relatedPost.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{relatedPost.date}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">관련 포스트가 없습니다.</p>
              )}
            </div>

            {/* 인기 태그 */}
            <h2 className="text-xl font-bold mt-8 flex items-center">
              <span className="relative">
                인기 태그
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse-glow"></span>
              </span>
            </h2>
            <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: "500ms" }}>
              {post.tags.slice(0, 6).map((tagId: string) => {
                const tag = findTagById(tagId)
                return tag ? (
                  <Link href={`/blog?tag=${tag.id}`} key={tag.id}>
                    <Badge
                      variant="secondary"
                      className="bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30 cursor-pointer"
                    >
                      {tag.name}
                    </Badge>
                  </Link>
                ) : null
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

