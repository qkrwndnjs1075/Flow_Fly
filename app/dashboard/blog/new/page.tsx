"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { createBlogPost } from "@/lib/supabase-client"

export default function NewBlogPostPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    tags: "",
    published: true,
    categoryId: "programming",
  })

  // 컴포넌트 마운트 상태 추적
  const isMounted = useRef(true)

  // 컴포넌트 언마운트 시 isMounted 플래그 업데이트
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // 로그인 확인
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // 제목이 변경될 때 자동으로 슬러그 생성
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.title, formData.slug])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isMounted.current) {
          setImagePreview(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!formData.title || !formData.content || !formData.slug) {
      toast({
        title: "필수 항목 누락",
        description: "제목, 내용, 슬러그는 필수 항목입니다.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 이미지 업로드 처리
      let coverImageUrl = undefined
      if (imageFile) {
        try {
          // 실제 환경에서는 이 부분을 활성화
          // coverImageUrl = await uploadImage(imageFile, `blog/${user.id}/${Date.now()}-${imageFile.name}`);

          // 데모 모드에서는 임시 URL 사용
          coverImageUrl = URL.createObjectURL(imageFile)
        } catch (error) {
          console.error("Image upload failed:", error)
          if (isMounted.current) {
            toast({
              title: "이미지 업로드 실패",
              description: "이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.",
              variant: "destructive",
            })
            setIsSubmitting(false)
          }
          return
        }
      }

      // 태그 처리
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      // 블로그 포스트 생성
      const now = new Date().toISOString()
      const newPost = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + "...",
        tags,
        published: formData.published,
        categoryId: formData.categoryId,
        userId: user.id,
        coverImageUrl,
        createdAt: now,
        updatedAt: now,
      }

      // 데모 모드에서는 API 호출 시뮬레이션
      if (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // 시뮬레이션된 지연
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (isMounted.current) {
          toast({
            title: "블로그 포스트 생성 완료",
            description: "새 블로그 포스트가 성공적으로 생성되었습니다.",
          })

          router.push("/dashboard/blog")
        }
        return
      }

      // 실제 API 호출
      await createBlogPost(newPost)

      if (isMounted.current) {
        toast({
          title: "블로그 포스트 생성 완료",
          description: "새 블로그 포스트가 성공적으로 생성되었습니다.",
        })

        router.push("/dashboard/blog")
      }
    } catch (error: any) {
      console.error("Failed to create post:", error)
      if (isMounted.current) {
        toast({
          title: "포스트 생성 실패",
          description: error.message || "블로그 포스트를 생성하는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } finally {
      if (isMounted.current) {
        setIsSubmitting(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex items-center mb-8">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/dashboard/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">새 블로그 포스트</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>포스트 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="포스트 제목을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">슬러그</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="url-friendly-slug"
              />
              <p className="text-xs text-muted-foreground">
                URL에 사용될 고유 식별자입니다. 영문, 숫자, 하이픈만 사용하세요.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="포스트 내용을 입력하세요"
                rows={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">요약</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="포스트 요약을 입력하세요 (비워두면 자동 생성됩니다)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">카테고리</Label>
              <Input
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                placeholder="카테고리 ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">태그</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="태그를 쉼표로 구분하여 입력하세요 (예: React, TypeScript, 튜토리얼)"
              />
              <p className="text-sm text-muted-foreground">쉼표로 구분하여 여러 태그를 입력할 수 있습니다.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">커버 이미지</Label>
              {imagePreview ? (
                <div className="relative mt-2 rounded-md overflow-hidden">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="max-h-64 w-auto" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="mt-2">
                  <Label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-primary/5"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF (최대 10MB)</p>
                    </div>
                    <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </Label>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="published" checked={formData.published} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="published">즉시 공개</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/blog">취소</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "포스트 저장"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

