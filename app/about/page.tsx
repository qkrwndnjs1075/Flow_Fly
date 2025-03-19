"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("about")

  // Set isLoaded to true after component mounts for animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <div
          className={`space-y-4 text-center transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="relative inline-block">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">소개</h1>
          </div>
          <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto">
            저의 이야기, 기술, 경험을 공유합니다. 함께 성장하고 배우는 여정에 동참해주세요.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div
            className={`md:col-span-1 transition-all duration-700 delay-100 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <div className="sticky top-20 space-y-4">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-1 animate-pulse-glow">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-50 animate-gradient-x"></div>
                <img
                  src="/placeholder.svg?height=400&width=300"
                  alt="프로필 이미지"
                  className="rounded-lg w-full object-cover aspect-[3/4] bg-[#161625] relative z-10 animate-fade-in"
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold animate-slide-up" style={{ animationDelay: "200ms" }}>
                  홍길동
                </h2>
                <p className="text-muted-foreground animate-slide-up" style={{ animationDelay: "250ms" }}>
                  풀스택 개발자 & 디자이너
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["React", "Next.js", "TypeScript", "UI/UX"].map((skill, index) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30 animate-fade-in"
                      style={{ animationDelay: `${300 + index * 50}ms` }}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`md:col-span-2 space-y-8 transition-all duration-700 delay-200 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#161625]">
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-300 hover:bg-indigo-900/50"
                  onClick={() => setActiveTab("about")}
                >
                  소개
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-300 hover:bg-indigo-900/50"
                  onClick={() => setActiveTab("skills")}
                >
                  기술
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6 pt-4">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p
                    className={`text-lg animate-fade-in ${activeTab === "about" ? "block" : "hidden"}`}
                    style={{ animationDelay: "100ms" }}
                  >
                    안녕하세요! 저는 사용자 중심의 웹 경험을 만드는 데 열정을 가진 개발자입니다. 5년 이상의 경험을 통해
                    아이디어를 현실로 구현하는 과정에서 기술적 도전을 해결하는 것을 즐기고 있습니다.
                  </p>

                  <h3
                    className={`text-xl font-medium mt-6 mb-3 animate-slide-up ${activeTab === "about" ? "block" : "hidden"}`}
                    style={{ animationDelay: "200ms" }}
                  >
                    나의 철학
                  </h3>
                  <p
                    className={`animate-slide-up ${activeTab === "about" ? "block" : "hidden"}`}
                    style={{ animationDelay: "250ms" }}
                  >
                    저는 기술이 사람들의 삶을 개선하는 도구라고 믿습니다. 모든 프로젝트에서 사용자 경험을 최우선으로
                    생각하며, 접근성과 포용성을 핵심 가치로 삼고 있습니다. 코드의 품질과 유지보수성을 중요시하며,
                    지속적인 학습과 개선을 통해 더 나은 솔루션을 만들기 위해 노력합니다.
                  </p>

                  <h3
                    className={`text-xl font-medium mt-6 mb-3 animate-slide-up ${activeTab === "about" ? "block" : "hidden"}`}
                    style={{ animationDelay: "300ms" }}
                  >
                    교육 및 배경
                  </h3>
                  <p
                    className={`animate-slide-up ${activeTab === "about" ? "block" : "hidden"}`}
                    style={{ animationDelay: "350ms" }}
                  >
                    서울대학교에서 컴퓨터 공학을 전공했으며, 졸업 후 스타트업에서 경력을 시작했습니다. 다양한 규모의
                    프로젝트와 팀에서 일하면서 기술적 역량뿐만 아니라 협업과 소통 능력도 키워왔습니다. 현재는 프리랜서로
                    활동하며 다양한 클라이언트와 함께 창의적인 디지털 솔루션을 만들고 있습니다.
                  </p>

                  <h3
                    className={`text-xl font-medium mt-6 mb-3 animate-slide-up ${activeTab === "about" ? "block" : "hidden"}`}
                    style={{ animationDelay: "400ms" }}
                  >
                    취미 및 관심사
                  </h3>
                  <p
                    className={`animate-slide-up ${activeTab === "about" ? "block" : "hidden"}`}
                    style={{ animationDelay: "450ms" }}
                  >
                    개발 외에도 사진 촬영, 여행, 독서를 즐깁니다. 새로운 장소를 탐험하고 다양한 문화를 경험하는 것이
                    창의적인 영감의 원천이 됩니다. 또한 오픈 소스 커뮤니티에 기여하고 기술 밋업에 참여하며 지식을
                    공유하는 것을 좋아합니다.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card
                    className={`animate-slide-up ${activeTab === "skills" ? "block" : "hidden"}`}
                    style={{ animationDelay: "100ms" }}
                  >
                    <CardHeader>
                      <CardTitle className="relative inline-block">
                        프론트엔드
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </CardTitle>
                      <CardDescription>사용자 인터페이스 개발</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { name: "React/Next.js", value: 95 },
                        { name: "TypeScript", value: 90 },
                        { name: "CSS/Tailwind", value: 85 },
                        { name: "UI/UX 디자인", value: 80 },
                      ].map((skill, index) => (
                        <div
                          key={skill.name}
                          className="animate-fade-in"
                          style={{ animationDelay: `${200 + index * 100}ms` }}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{skill.name}</span>
                            <span>{skill.value}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                              style={{ width: `${skill.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card
                    className={`animate-slide-up ${activeTab === "skills" ? "block" : "hidden"}`}
                    style={{ animationDelay: "200ms" }}
                  >
                    <CardHeader>
                      <CardTitle className="relative inline-block">
                        백엔드
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </CardTitle>
                      <CardDescription>서버 및 데이터베이스</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { name: "Node.js/Express", value: 85 },
                        { name: "PostgreSQL/MongoDB", value: 80 },
                        { name: "GraphQL", value: 75 },
                        { name: "AWS/Firebase", value: 70 },
                      ].map((skill, index) => (
                        <div
                          key={skill.name}
                          className="animate-fade-in"
                          style={{ animationDelay: `${300 + index * 100}ms` }}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{skill.name}</span>
                            <span>{skill.value}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                              style={{ width: `${skill.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card
                    className={`md:col-span-2 animate-slide-up ${activeTab === "skills" ? "block" : "hidden"}`}
                    style={{ animationDelay: "300ms" }}
                  >
                    <CardHeader>
                      <CardTitle className="relative inline-block">
                        기타 기술 및 도구
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </CardTitle>
                      <CardDescription>개발 프로세스 및 협업</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["Git/GitHub", "Docker", "Jest/Testing", "CI/CD", "Figma", "Agile/Scrum", "Vercel", "SEO"].map(
                          (tool, index) => (
                            <div
                              key={tool}
                              className="bg-muted p-3 rounded-lg text-center hover:bg-indigo-900/20 hover:border-indigo-500 transition-all duration-300 animate-fade-in hover:scale-105 border border-transparent hover:border-indigo-500/50"
                              style={{ animationDelay: `${400 + index * 50}ms` }}
                            >
                              <p className="font-medium">{tool}</p>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <Card
              className={`transition-all duration-700 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <CardHeader>
                <CardTitle className="relative inline-block">
                  연락처
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse-glow"></div>
                </CardTitle>
                <CardDescription>함께 일하거나 이야기를 나누고 싶으시다면 연락주세요</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    ),
                    text: "contact@example.com",
                    delay: 400,
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    ),
                    text: "010-1234-5678",
                    delay: 450,
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <path d="M15 11h.01" />
                        <path d="M11 15h.01" />
                        <path d="M16 16h.01" />
                        <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" />
                        <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
                      </svg>
                    ),
                    text: "github.com/username",
                    delay: 500,
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    ),
                    text: "linkedin.com/in/username",
                    delay: 550,
                  },
                ].map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 animate-slide-up hover:text-indigo-400 transition-colors duration-300 cursor-pointer group"
                    style={{ animationDelay: `${contact.delay}ms` }}
                  >
                    <div className="group-hover:animate-pulse-glow transition-all duration-300">{contact.icon}</div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{contact.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

