"use client";

import { CardFooter } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExternalLink, Github, Sparkles } from "lucide-react";

// Mock portfolio data - in a real app, this would come from a database
const portfolioItems = [
  {
    id: 1,
    title: "이커머스 웹사이트",
    description: "Next.js와 Stripe 통합으로 구축된 완전 반응형 이커머스 플랫폼.",
    longDescription:
      "이 프로젝트는 현대적인 이커머스 경험을 제공하기 위해 Next.js와 Stripe를 활용했습니다. 사용자는 제품을 검색하고, 장바구니에 추가하고, 결제할 수 있습니다. 관리자는 제품, 주문 및 고객을 관리할 수 있는 대시보드에 접근할 수 있습니다. 이 프로젝트는 성능 최적화, SEO, 접근성에 중점을 두었습니다.",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["Next.js", "React", "Stripe", "Tailwind CSS"],
    completedAt: "2025년 1월",
    featured: true,
    demoLink: "https://example.com",
    githubLink: "https://github.com/username/project",
    screenshots: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
  {
    id: 2,
    title: "작업 관리 앱",
    description: "사용자가 일상 작업을 구성하고 추적하는 데 도움이 되는 생산성 앱.",
    longDescription:
      "이 작업 관리 앱은 사용자가 일상 작업을 효율적으로 관리할 수 있도록 설계되었습니다. 작업 생성, 마감일 설정, 우선순위 지정, 진행 상황 추적 등의 기능을 제공합니다. Firebase를 백엔드로 사용하여 실시간 데이터 동기화와 사용자 인증을 구현했습니다.",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["React", "Firebase", "Material UI"],
    completedAt: "2024년 11월",
    featured: false,
    demoLink: "https://example.com",
    githubLink: "https://github.com/username/project",
    screenshots: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
  },
  {
    id: 3,
    title: "포트폴리오 웹사이트",
    description: "프로젝트와 기술을 선보이는 개인 포트폴리오 웹사이트.",
    longDescription:
      "이 포트폴리오 웹사이트는 제 작업과 기술을 효과적으로 보여주기 위해 설계되었습니다. 반응형 디자인을 적용하여 모든 기기에서 최적의 사용자 경험을 제공합니다. 프로젝트 갤러리, 기술 쇼케이스, 연락처 양식 등의 기능을 포함하고 있습니다.",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["HTML", "CSS", "JavaScript"],
    completedAt: "2024년 9월",
    featured: false,
    demoLink: "https://example.com",
    githubLink: "https://github.com/username/project",
    screenshots: ["/placeholder.svg?height=600&width=800"],
  },
  {
    id: 4,
    title: "날씨 앱",
    description: "위치 기반 실시간 날씨 정보를 제공하는 날씨 애플리케이션.",
    longDescription:
      "이 날씨 앱은 사용자의 현재 위치 또는 검색한 도시의 실시간 날씨 정보를 제공합니다. OpenWeather API를 활용하여 현재 날씨, 시간별 예보, 5일 예보 등의 데이터를 가져옵니다. 직관적인 UI와 시각적 요소를 통해 날씨 정보를 쉽게 이해할 수 있도록 설계했습니다.",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["React", "OpenWeather API", "Tailwind CSS"],
    completedAt: "2024년 7월",
    featured: true,
    demoLink: "https://example.com",
    githubLink: "https://github.com/username/project",
    screenshots: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
  },
  {
    id: 5,
    title: "블로그 플랫폼",
    description: "마크다운 지원과 댓글 기능이 있는 개인 블로그 플랫폼.",
    longDescription:
      "이 블로그 플랫폼은 마크다운으로 글을 작성하고 관리할 수 있는 기능을 제공합니다. 사용자 인증, 댓글 시스템, 카테고리 및 태그 관리 등의 기능을 포함하고 있습니다. Next.js와 MongoDB를 사용하여 빠른 페이지 로딩과 효율적인 데이터 관리를 구현했습니다.",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["Next.js", "MongoDB", "Tailwind CSS"],
    completedAt: "2024년 5월",
    featured: false,
    demoLink: "https://example.com",
    githubLink: "https://github.com/username/project",
    screenshots: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
  },
  {
    id: 6,
    title: "음악 스트리밍 앱",
    description: "개인 음악 컬렉션을 스트리밍할 수 있는 웹 애플리케이션.",
    longDescription:
      "이 음악 스트리밍 앱은 사용자가 개인 음악 컬렉션을 업로드하고 스트리밍할 수 있는 플랫폼입니다. 재생 목록 생성, 음악 검색, 아티스트 및 앨범별 필터링 등의 기능을 제공합니다. React와 Node.js를 사용하여 프론트엔드와 백엔드를 구현했습니다.",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["React", "Node.js", "Express", "MongoDB"],
    completedAt: "2024년 3월",
    featured: false,
    demoLink: "https://example.com",
    githubLink: "https://github.com/username/project",
    screenshots: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
  },
];

export default function PortfolioPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Set isLoaded to true after component mounts for animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Get featured items
  const featuredItems = portfolioItems.filter((item) => item.featured);
  // Get all items except featured ones
  const regularItems = portfolioItems.filter((item) => !item.featured);

  return (
    <div className="container py-12">
      <div className="space-y-10">
        {/* Header with Animation */}
        <div
          className={`space-y-4 text-right pr-8 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative inline-block">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">포트폴리오</h1>
            <span className="absolute -top-2 -right-6">
              <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse-glow" />
            </span>
          </div>
          <p className="text-muted-foreground md:text-xl max-w-2xl ml-auto">
            제 프로젝트와 작업을 소개합니다. 각 프로젝트는 문제 해결과 창의적인 사고를 보여줍니다.
          </p>
        </div>

        {/* Featured Projects with Animation */}
        {featuredItems.length > 0 && (
          <div
            className={`space-y-6 transition-all duration-700 delay-100 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-2xl font-bold relative inline-block">
              주요 프로젝트
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse-glow"></div>
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {featuredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`group transition-all duration-500 ${isLoaded ? "animate-scale-in" : "opacity-0"}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="overflow-hidden flex flex-col h-full group-hover:shadow-lg transition-all duration-500 group-hover:translate-y-[-5px] group-hover:border-primary cursor-pointer relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                          />
                          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground animate-pulse-glow">
                            주요 프로젝트
                          </Badge>
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{item.completedAt}</span>
                          </div>
                          <CardTitle className="text-xl mt-2 group-hover:text-primary transition-colors duration-300">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2 pt-0">
                          {item.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30 transition-all duration-300"
                              style={{ animationDelay: `${tagIndex * 100}ms` }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </CardContent>
                        <CardFooter className="flex gap-2 mt-auto">
                          {item.demoLink && (
                            <Button
                              variant="default"
                              size="icon"
                              asChild
                              onClick={(e) => e.stopPropagation()}
                              className="animate-pulse-glow"
                            >
                              <a href={item.demoLink} target="_blank" rel="noopener noreferrer" aria-label="데모 보기">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {item.githubLink && (
                            <Button
                              variant="outline"
                              size="icon"
                              asChild
                              onClick={(e) => e.stopPropagation()}
                              className="hover:border-indigo-500 hover:bg-indigo-900/20 transition-all duration-300"
                            >
                              <a
                                href={item.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="코드 보기"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#161625] border-indigo-900/30">
                      <DialogHeader>
                        <DialogTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
                          {item.title}
                        </DialogTitle>
                        <DialogDescription className="text-base pt-2">{item.completedAt}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="overflow-hidden rounded-lg">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-auto object-cover animate-fade-in"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30 transition-all duration-300 animate-fade-in"
                              style={{ animationDelay: `${tagIndex * 100}ms` }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
                          <h3 className="text-lg font-medium">프로젝트 설명</h3>
                          <p className="text-muted-foreground">{item.longDescription}</p>
                        </div>
                        {item.screenshots.length > 0 && (
                          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "300ms" }}>
                            <h3 className="text-lg font-medium">스크린샷</h3>
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                              {item.screenshots.map((screenshot, ssIndex) => (
                                <div
                                  key={ssIndex}
                                  className="overflow-hidden rounded-lg animate-fade-in hover:shadow-lg transition-all duration-300"
                                  style={{ animationDelay: `${400 + ssIndex * 100}ms` }}
                                >
                                  <img
                                    src={screenshot || "/placeholder.svg"}
                                    alt={`${item.title} 스크린샷 ${ssIndex + 1}`}
                                    className="w-full h-auto object-cover transition-transform hover:scale-105 duration-500"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-4 pt-4 animate-slide-up" style={{ animationDelay: "500ms" }}>
                          {item.demoLink && (
                            <Button
                              asChild
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-3px]"
                            >
                              <a href={item.demoLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" /> 데모 보기
                              </a>
                            </Button>
                          )}
                          {item.githubLink && (
                            <Button
                              variant="outline"
                              asChild
                              className="hover:border-indigo-500 hover:bg-indigo-900/20 transition-all duration-300"
                            >
                              <a href={item.githubLink} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4 mr-2" /> 코드 보기
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Projects with Animation */}
        <div
          className={`space-y-6 transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-bold relative inline-block">
            모든 프로젝트
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse-glow"></div>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regularItems.map((item, index) => (
              <div
                key={item.id}
                className={`group transition-all duration-500 ${isLoaded ? "animate-slide-up" : "opacity-0"}`}
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-500 group-hover:translate-y-[-5px] group-hover:border-primary cursor-pointer relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      <div className="h-48 overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{item.completedAt}</span>
                        </div>
                        <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors duration-300">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2 pt-0">
                        {item.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30 transition-all duration-300"
                            style={{ animationDelay: `${tagIndex * 100}ms` }}
                          >
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30 transition-all duration-300"
                          >
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-2 mt-auto">
                        {item.demoLink && (
                          <Button
                            variant="default"
                            size="icon"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                            className="animate-pulse-glow"
                          >
                            <a href={item.demoLink} target="_blank" rel="noopener noreferrer" aria-label="데모 보기">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {item.githubLink && (
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                            className="hover:border-indigo-500 hover:bg-indigo-900/20 transition-all duration-300"
                          >
                            <a href={item.githubLink} target="_blank" rel="noopener noreferrer" aria-label="코드 보기">
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#161625] border-indigo-900/30">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{item.title}</DialogTitle>
                      <DialogDescription className="text-base pt-2">{item.completedAt}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-auto object-cover animate-fade-in"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, tagIndex) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30 transition-all duration-300 animate-fade-in"
                            style={{ animationDelay: `${tagIndex * 100}ms` }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="space-y-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
                        <h3 className="text-lg font-medium">프로젝트 설명</h3>
                        <p className="text-muted-foreground">{item.longDescription}</p>
                      </div>
                      {item.screenshots.length > 0 && (
                        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "300ms" }}>
                          <h3 className="text-lg font-medium">스크린샷</h3>
                          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                            {item.screenshots.map((screenshot, ssIndex) => (
                              <div
                                key={ssIndex}
                                className="overflow-hidden rounded-lg animate-fade-in hover:shadow-lg transition-all duration-300"
                                style={{ animationDelay: `${400 + ssIndex * 100}ms` }}
                              >
                                <img
                                  src={screenshot || "/placeholder.svg"}
                                  alt={`${item.title} 스크린샷 ${ssIndex + 1}`}
                                  className="w-full h-auto object-cover transition-transform hover:scale-105 duration-500"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-4 pt-4 animate-slide-up" style={{ animationDelay: "500ms" }}>
                        {item.demoLink && (
                          <Button
                            asChild
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-3px]"
                          >
                            <a href={item.demoLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" /> 데모 보기
                            </a>
                          </Button>
                        )}
                        {item.githubLink && (
                          <Button
                            variant="outline"
                            asChild
                            className="hover:border-indigo-500 hover:bg-indigo-900/20 transition-all duration-300"
                          >
                            <a href={item.githubLink} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-2" /> 코드 보기
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
