"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { createPortfolioProject, uploadImage } from "@/lib/supabase-client"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"

export default function NewPortfolioProjectPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    projectUrl: "",
    githubUrl: "",
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    try {
      let imageUrl = undefined

      // 이미지 업로드 처리
      if (imageFile) {
        const path = `portfolio/${user.id}/${Date.now()}-${imageFile.name}`
        imageUrl = await uploadImage(imageFile, path)
      }

      // 프로젝트 생성
      await createPortfolioProject({
        userId: user.id,
        title: formData.title,
        description: formData.description,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        projectUrl: formData.projectUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        imageUrl,
      })

      toast({
        title: "프로젝트 생성 완료",
        description: "포트폴리오 프로젝트가 성공적으로 생성되었습니다.",
      })

      router.push("/dashboard/portfolio")
    } catch (error) {
      console.error("Failed to create project:", error)
      toast({
        title: "프로젝트 생성 실패",
        description: "포트폴리오 프로젝트를 생성하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
      <div className="flex items-center mb-8">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/dashboard/portfolio">
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">새 포트폴리오 프로젝트</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>프로젝트 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">프로젝트 제목</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="프로젝트 제목을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">프로젝트 설명</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="프로젝트에 대한 설명을 입력하세요"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">태그</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="태그를 쉼표로 구분하여 입력하세요 (예: React, TypeScript, UI/UX)"
              />
              <p className="text-sm text-muted-foreground">쉼표로 구분하여 여러 태그를 입력할 수 있습니다.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectUrl">프로젝트 URL</Label>
              <Input
                id="projectUrl"
                name="projectUrl"
                type="url"
                value={formData.projectUrl}
                onChange={handleChange}
                placeholder="https://your-project.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/project"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">프로젝트 이미지</Label>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/portfolio">취소</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "프로젝트 저장"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

