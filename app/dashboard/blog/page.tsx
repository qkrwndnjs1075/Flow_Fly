"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { getUserBlogPosts, deleteBlogPost, updateBlogPost } from "@/lib/supabase-client"
import type { BlogPost } from "@/lib/types"
import Link from "next/link"
import { format } from "date-fns"

export default function BlogDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    async function loadPosts() {
      if (user) {
        try {
          const data = await getUserBlogPosts(user.id, true) // 비공개 포스트 포함
          setPosts(data)
        } catch (error) {
          console.error("Failed to load posts:", error)
          toast({
            title: "포스트 로딩 실패",
            description: "블로그 포스트를 불러오는 중 오류가 발생했습니다.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      loadPosts()
    }
  }, [user, toast])

  const handleDelete = async (postId: string) => {
    if (confirm("정말로 이 포스트를 삭제하시겠습니까?")) {
      setIsDeleting(postId)
      try {
        await deleteBlogPost(postId)
        setPosts((prev) => prev.filter((post) => post.id !== postId))
        toast({
          title: "포스트 삭제됨",
          description: "블로그 포스트가 성공적으로 삭제되었습니다.",
        })
      } catch (error) {
        console.error("Failed to delete post:", error)
        toast({
          title: "포스트 삭제 실패",
          description: "블로그 포스트를 삭제하는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const togglePublished = async (post: BlogPost) => {
    setIsToggling(post.id)
    try {
      const updatedPost = await updateBlogPost(post.id, { published: !post.published })
      setPosts((prev) => prev.map((p) => (p.id === post.id ? ({ ...p, published: !p.published } as BlogPost) : p)))
      toast({
        title: updatedPost.published ? "포스트 공개됨" : "포스트 비공개됨",
        description: updatedPost.published
          ? "블로그 포스트가 공개되었습니다."
          : "블로그 포스트가 비공개로 설정되었습니다.",
      })
    } catch (error) {
      console.error("Failed to toggle post visibility:", error)
      toast({
        title: "상태 변경 실패",
        description: "블로그 포스트 상태를 변경하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsToggling(null)
    }
  }

  if (loading || !user) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">블로그 관리</h1>
        <Button asChild>
          <Link href="/dashboard/blog/new">
            <PlusCircle className="mr-2 h-4 w-4" />새 포스트 작성
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p>포스트 로딩 중...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-card border rounded-lg p-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">블로그 포스트가 없습니다</h2>
          <p className="text-muted-foreground mb-8">첫 번째 블로그 포스트를 작성해 보세요!</p>
          <Button asChild>
            <Link href="/dashboard/blog/new">
              <PlusCircle className="mr-2 h-4 w-4" />새 포스트 작성
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="mr-2">{post.title}</CardTitle>
                  <Badge variant={post.published ? "default" : "outline"}>{post.published ? "공개" : "비공개"}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 mb-2">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="inline-block bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  작성일: {format(new Date(post.createdAt), "yyyy년 MM월 dd일")} · 수정일:{" "}
                  {format(new Date(post.updatedAt), "yyyy년 MM월 dd일")}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/blog/edit/${post.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    disabled={isDeleting === post.id}
                  >
                    <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                    삭제
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant={post.published ? "outline" : "default"}
                    size="sm"
                    onClick={() => togglePublished(post)}
                    disabled={isToggling === post.id}
                  >
                    {post.published ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        비공개로 전환
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        공개로 전환
                      </>
                    )}
                  </Button>
                  {post.published && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Eye className="h-4 w-4 mr-2" />
                        보기
                      </Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

