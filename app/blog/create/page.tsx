"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { MarkdownEditor } from "@/components/markdown-editor"

export default function CreateBlogPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    published: false,
  })

  // 로그인 확인만 수행
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
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

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    try {
      // 여기서 실제 블로그 포스트 생성 로직 구현
      // 데모 모드에서는 성공 메시지만 표시

      toast({
        title: "블로그 포스트 생성 완료",
        description: "새 블로그 포스트가 성공적으로 생성되었습니다.",
      })

      router.push("/blog")
    } catch (error) {
      console.error("Failed to create post:", error)
      toast({
        title: "포스트 생성 실패",
        description: "블로그 포스트를 생성하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
          <Link href="/blog">
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
              <Label htmlFor="content">내용</Label>
              <MarkdownEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="마크다운 형식으로 내용을 작성하세요..."
                minHeight="400px"
              />
              <p className="text-xs text-muted-foreground mt-1">
                마크다운 문법을 지원합니다. 제목은 #, 굵게는 **, 기울임은 *, 링크는 [텍스트](URL) 형식으로 작성하세요.
              </p>
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
              <Link href="/blog">취소</Link>
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

