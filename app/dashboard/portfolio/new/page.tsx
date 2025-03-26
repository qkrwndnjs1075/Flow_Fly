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
import { createPortfolioProject } from "@/lib/supabase-client"

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
    featured: false,
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
    setFormData((prev) => ({ ...prev, featured: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!formData.title || !formData.description) {
      toast({
        title: "필수 항목 누락",
        description: "제목과 설명은 필수 항목입니다.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 이미지 업로드 처리
      let imageUrl = undefined
      if (imageFile) {
        try {
          // 실제 환경에서는 이 부분을 활성화
          // imageUrl = await uploadImage(imageFile, `portfolio/${user.id}/${Date.now()}-${imageFile.name}`);

          // 데모 모드에서는 임시 URL 사용
          imageUrl = URL.createObjectURL(imageFile)
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

      // 포트폴리오 프로젝트 생성
      const now = new Date().toISOString()
      const newProject = {
        title: formData.title,
        description: formData.description,
        tags,
        projectUrl: formData.projectUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        imageUrl,
        userId: user.id,
        featured: formData.featured,
        createdAt: now,
        updatedAt: now,
      }

      // 데모 모드에서는 API 호출 시뮬레이션
      if (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // 시뮬레이션된 지연
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (isMounted.current) {
          toast({
            title: "프로젝트 생성 완료",
            description: "새 포트폴리오 프로젝트가 성공적으로 생성되었습니다.",
          })

          router.push("/dashboard/portfolio")
        }
        return
      }

      // 실제 API 호출
      await createPortfolioProject(newProject)

      if (isMounted.current) {
        toast({
          title: "프로젝트 생성 완료",
          description: "새 포트폴리오 프로젝트가 성공적으로 생성되었습니다.",
        })

        router.push("/dashboard/portfolio")
      }
    } catch (error: any) {
      console.error("Failed to create project:", error)
      if (isMounted.current) {
        toast({
          title: "프로젝트 생성 실패",
          description: error.message || "포트폴리오 프로젝트를 생성하는 중 오류가 발생했습니다.",
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
              <Label htmlFor="title">제목</Label>
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
              <Label htmlFor="description">설명</Label>
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

            <div className="flex items-center space-x-2">
              <Switch id="featured" checked={formData.featured} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="featured">주요 프로젝트로 표시</Label>
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

