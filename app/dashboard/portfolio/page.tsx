"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit, Trash2, ExternalLink, Github } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { getUserPortfolioProjects, deletePortfolioProject } from "@/lib/supabase-client"
import type { PortfolioProject } from "@/lib/types"
import Link from "next/link"

export default function PortfolioDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    async function loadProjects() {
      if (user) {
        try {
          const data = await getUserPortfolioProjects(user.id)
          setProjects(data)
        } catch (error) {
          console.error("Failed to load projects:", error)
          toast({
            title: "프로젝트 로딩 실패",
            description: "포트폴리오 프로젝트를 불러오는 중 오류가 발생했습니다.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      loadProjects()
    }
  }, [user, toast])

  const handleDelete = async (projectId: string) => {
    if (confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
      setIsDeleting(projectId)
      try {
        await deletePortfolioProject(projectId)
        setProjects((prev) => prev.filter((project) => project.id !== projectId))
        toast({
          title: "프로젝트 삭제됨",
          description: "포트폴리오 프로젝트가 성공적으로 삭제되었습니다.",
        })
      } catch (error) {
        console.error("Failed to delete project:", error)
        toast({
          title: "프로젝트 삭제 실패",
          description: "포트폴리오 프로젝트를 삭제하는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(null)
      }
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
        <h1 className="text-3xl font-bold">포트폴리오 관리</h1>
        <Button asChild>
          <Link href="/dashboard/portfolio/new">
            <PlusCircle className="mr-2 h-4 w-4" />새 프로젝트 추가
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p>프로젝트 로딩 중...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-card border rounded-lg p-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">포트폴리오 프로젝트가 없습니다</h2>
          <p className="text-muted-foreground mb-8">첫 번째 포트폴리오 프로젝트를 추가해 보세요!</p>
          <Button asChild>
            <Link href="/dashboard/portfolio/new">
              <PlusCircle className="mr-2 h-4 w-4" />새 프로젝트 추가
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden flex flex-col">
              {project.imageUrl && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-primary/10 text-primary text-xs rounded-full px-2 py-1 mr-2 mb-2"
                    >
                      {tag}
                    </span>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{project.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/dashboard/portfolio/edit/${project.id}`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(project.id)}
                    disabled={isDeleting === project.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
                <div className="flex space-x-2">
                  {project.githubUrl && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        <span className="sr-only">GitHub</span>
                      </a>
                    </Button>
                  )}
                  {project.projectUrl && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Visit</span>
                      </a>
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

