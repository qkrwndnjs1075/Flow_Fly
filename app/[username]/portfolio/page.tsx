import { getUserProfileByUsername, getUserPortfolioProjects } from "@/lib/supabase-client"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, ExternalLink } from "lucide-react"

export default async function UserPortfolioPage({ params }: { params: { username: string } }) {
  const { username } = params
  const userProfile = await getUserProfileByUsername(username)

  if (!userProfile) {
    notFound()
  }

  const projects = await getUserPortfolioProjects(userProfile.id)

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userProfile.photoURL || ""} alt={userProfile.displayName || userProfile.username} />
            <AvatarFallback className="text-2xl">
              {userProfile.displayName
                ? userProfile.displayName[0].toUpperCase()
                : userProfile.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-2">{userProfile.displayName || userProfile.username}의 포트폴리오</h1>
            {userProfile.bio && <p className="text-muted-foreground mb-4">{userProfile.bio}</p>}

            {userProfile.socialLinks && (
              <div className="flex gap-2">
                {userProfile.socialLinks.github && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={userProfile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  </Button>
                )}
                {userProfile.socialLinks.website && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={userProfile.socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Website</span>
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">아직 포트폴리오 프로젝트가 없습니다</h2>
            <p className="text-muted-foreground">곧 멋진 프로젝트가 추가될 예정입니다!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <p className="text-muted-foreground">{project.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t p-4">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {project.projectUrl && (
                    <Button size="sm" asChild>
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        프로젝트 보기
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

