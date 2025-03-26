"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  PlusCircle,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Github,
  Upload,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import { useToast } from "@/hooks/use-toast";
import { blogPosts } from "@/lib/blog-data";

// 포트폴리오 프로젝트 데이터 (실제로는 API에서 가져와야 함)
const portfolioProjects = [
  {
    id: 1,
    title: "이커머스 웹사이트",
    description: "Next.js와 Stripe 통합으로 구축된 완전 반응형 이커머스 플랫폼.",
    tags: ["Next.js", "React", "Stripe", "Tailwind CSS"],
    featured: true,
    createdAt: "2025-01-15",
    projectUrl: "https://example.com",
    githubUrl: "https://github.com/username/project",
  },
  {
    id: 2,
    title: "작업 관리 앱",
    description: "사용자가 일상 작업을 구성하고 추적하는 데 도움이 되는 생산성 앱.",
    tags: ["React", "Firebase", "Material UI"],
    featured: false,
    createdAt: "2024-11-20",
    projectUrl: "https://example.com",
    githubUrl: "https://github.com/username/project",
  },
  {
    id: 3,
    title: "포트폴리오 웹사이트",
    description: "프로젝트와 기술을 선보이는 개인 포트폴리오 웹사이트.",
    tags: ["HTML", "CSS", "JavaScript"],
    featured: false,
    createdAt: "2024-09-05",
    projectUrl: "https://example.com",
    githubUrl: "https://github.com/username/project",
  },
  {
    id: 4,
    title: "날씨 앱",
    description: "위치 기반 실시간 날씨 정보를 제공하는 날씨 애플리케이션.",
    tags: ["React", "OpenWeather API", "Tailwind CSS"],
    featured: true,
    createdAt: "2024-07-10",
    projectUrl: "https://example.com",
    githubUrl: "https://github.com/username/project",
  },
];

export default function AdminDashboardPage() {
  const { adminUser } = useAdminAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // 블로그 관리 상태
  const [posts, setPosts] = useState(blogPosts);
  const [searchBlogQuery, setSearchBlogQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isEditingPost, setIsEditingPost] = useState(false);

  // 포트폴리오 관리 상태
  const [projects, setProjects] = useState(portfolioProjects);
  const [searchProjectQuery, setSearchProjectQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);

  // 새 블로그 포스트 상태
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    categoryId: "programming",
    tags: "",
    published: true,
  });

  // 새 포트폴리오 프로젝트 상태
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tags: "",
    featured: false,
    projectUrl: "",
    githubUrl: "",
  });

  // 이미지 업로드 상태
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 대시보드 통계 데이터 (실제로는 API에서 가져와야 함)
  const stats = {
    totalPosts: posts.length,
    totalProjects: projects.length,
    totalVisitors: 1240,
    todayVisitors: 42,
  };

  // 검색 기능
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchBlogQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchBlogQuery.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchProjectQuery.toLowerCase())
  );

  // 이미지 업로드 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // 블로그 포스트 관리 함수
  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter((post) => post.id !== postId));
    toast({
      title: "게시물 삭제됨",
      description: "블로그 게시물이 성공적으로 삭제되었습니다.",
    });
  };

  const handleTogglePostStatus = (postId: number) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, published: !post.published } : post)));

    const post = posts.find((p) => p.id === postId);
    toast({
      title: post?.published ? "게시물 비공개 처리됨" : "게시물 공개 처리됨",
      description: post?.published
        ? "블로그 게시물이 비공개로 설정되었습니다."
        : "블로그 게시물이 공개로 설정되었습니다.",
    });
  };

  const handleAddPost = () => {
    const newPostId = Math.max(...posts.map((post) => post.id)) + 1;
    const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "-");

    const postToAdd = {
      id: newPostId,
      title: newPost.title,
      excerpt: newPost.excerpt || newPost.content.substring(0, 150) + "...",
      content: newPost.content,
      date: currentDate,
      author: adminUser?.username || "Admin",
      categoryId: newPost.categoryId,
      tags: newPost.tags.split(",").map((tag) => tag.trim()),
      readTime: "5분",
      views: 0,
      likes: 0,
      createdAt: currentDate,
      updatedAt: currentDate,
      published: newPost.published,
      userId: adminUser?.id || "admin-1",
    };

    setPosts([postToAdd, ...posts]);

    // 폼 초기화
    setNewPost({
      title: "",
      content: "",
      excerpt: "",
      categoryId: "programming",
      tags: "",
      published: true,
    });

    setImageFile(null);
    setImagePreview(null);

    toast({
      title: "게시물 추가됨",
      description: "새 블로그 게시물이 성공적으로 추가되었습니다.",
    });
  };

  // 포트폴리오 프로젝트 관리 함수
  const handleDeleteProject = (projectId: number) => {
    setProjects(projects.filter((project) => project.id !== projectId));
    toast({
      title: "프로젝트 삭제됨",
      description: "포트폴리오 프로젝트가 성공적으로 삭제되었습니다.",
    });
  };

  const handleToggleProjectFeatured = (projectId: number) => {
    setProjects(
      projects.map((project) => (project.id === projectId ? { ...project, featured: !project.featured } : project))
    );

    const project = projects.find((p) => p.id === projectId);
    toast({
      title: project?.featured ? "주요 프로젝트에서 제거됨" : "주요 프로젝트로 설정됨",
      description: project?.featured
        ? "포트폴리오 프로젝트가 주요 프로젝트에서 제거되었습니다."
        : "포트폴리오 프로젝트가 주요 프로젝트로 설정되었습니다.",
    });
  };

  const handleAddProject = () => {
    const newProjectId = Math.max(...projects.map((project) => project.id)) + 1;
    const currentDate = new Date().toISOString().split("T")[0];

    const projectToAdd = {
      id: newProjectId,
      title: newProject.title,
      description: newProject.description,
      tags: newProject.tags.split(",").map((tag) => tag.trim()),
      featured: newProject.featured,
      createdAt: currentDate,
      projectUrl: newProject.projectUrl || "", // undefined일 경우 빈 문자열로 기본값 설정
      githubUrl: newProject.githubUrl || "", // undefined일 경우 빈 문자열로 기본값 설정
    };

    setProjects([projectToAdd, ...projects]);

    // 폼 초기화
    setNewProject({
      title: "",
      description: "",
      tags: "",
      featured: false,
      projectUrl: "",
      githubUrl: "",
    });

    setImageFile(null);
    setImagePreview(null);

    toast({
      title: "프로젝트 추가됨",
      description: "새 포트폴리오 프로젝트가 성공적으로 추가되었습니다.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">안녕하세요, {adminUser?.username}님!</h1>
        <p className="text-sm text-muted-foreground">
          마지막 로그인: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="blog">블로그 관리</TabsTrigger>
          <TabsTrigger value="portfolio">포트폴리오 관리</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#161625] border-indigo-900/30">
              <CardHeader className="pb-2">
                <CardDescription>총 블로그 포스트</CardDescription>
                <CardTitle className="text-2xl flex items-center justify-between">
                  {stats.totalPosts}
                  <FileText className="h-5 w-5 text-indigo-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  지난 주 대비 <span className="text-green-500">+2</span> 증가
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#161625] border-indigo-900/30">
              <CardHeader className="pb-2">
                <CardDescription>총 포트폴리오 프로젝트</CardDescription>
                <CardTitle className="text-2xl flex items-center justify-between">
                  {stats.totalProjects}
                  <Briefcase className="h-5 w-5 text-indigo-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  지난 주 대비 <span className="text-green-500">+1</span> 증가
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#161625] border-indigo-900/30">
              <CardHeader className="pb-2">
                <CardDescription>총 방문자 수</CardDescription>
                <CardTitle className="text-2xl flex items-center justify-between">
                  {stats.totalVisitors.toLocaleString()}
                  <Users className="h-5 w-5 text-indigo-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  지난 주 대비 <span className="text-green-500">+15%</span> 증가
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#161625] border-indigo-900/30">
              <CardHeader className="pb-2">
                <CardDescription>오늘 방문자 수</CardDescription>
                <CardTitle className="text-2xl flex items-center justify-between">
                  {stats.todayVisitors}
                  <Eye className="h-5 w-5 text-indigo-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  어제 대비 <span className="text-green-500">+8%</span> 증가
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#161625] border-indigo-900/30">
              <CardHeader>
                <CardTitle className="text-xl">최근 활동</CardTitle>
                <CardDescription>최근 관리자 활동 내역</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm">새 블로그 포스트 추가됨: "부동소수점의 생성과 계산, 그리고 FPU"</p>
                      <p className="text-xs text-muted-foreground">오늘, 14:32</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-sm">포트폴리오 프로젝트 수정됨: "이커머스 웹사이트"</p>
                      <p className="text-xs text-muted-foreground">어제, 16:45</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div>
                      <p className="text-sm">새 댓글 승인됨: "정말 유익한 글이네요!"</p>
                      <p className="text-xs text-muted-foreground">2일 전, 09:12</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#161625] border-indigo-900/30">
              <CardHeader>
                <CardTitle className="text-xl">트래픽 분석</CardTitle>
                <CardDescription>지난 7일간의 방문자 통계</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-5 w-5" />
                  <span>차트 데이터 로딩 중...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 블로그 관리 탭 */}
        <TabsContent value="blog" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="게시물 검색..."
                value={searchBlogQuery}
                onChange={(e) => setSearchBlogQuery(e.target.value)}
                className="pl-8 bg-[#1a1a2e] border-indigo-900/30"
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                  <PlusCircle className="mr-2 h-4 w-4" />새 게시물 작성
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a2e] border-indigo-900/30 max-w-3xl">
                <DialogHeader>
                  <DialogTitle>새 블로그 게시물 작성</DialogTitle>
                  <DialogDescription>새 블로그 게시물을 작성하여 사이트에 추가합니다.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">제목</Label>
                    <Input
                      id="title"
                      placeholder="게시물 제목"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="bg-[#161625] border-indigo-900/30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">내용</Label>
                    <Textarea
                      id="content"
                      placeholder="게시물 내용"
                      rows={8}
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="bg-[#161625] border-indigo-900/30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="excerpt">요약</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="게시물 요약 (비워두면 자동 생성)"
                      rows={2}
                      value={newPost.excerpt}
                      onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                      className="bg-[#161625] border-indigo-900/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">카테고리</Label>
                      <Input
                        id="category"
                        placeholder="카테고리"
                        value={newPost.categoryId}
                        onChange={(e) => setNewPost({ ...newPost, categoryId: e.target.value })}
                        className="bg-[#161625] border-indigo-900/30"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tags">태그</Label>
                      <Input
                        id="tags"
                        placeholder="태그 (쉼표로 구분)"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                        className="bg-[#161625] border-indigo-900/30"
                      />
                    </div>
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
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-primary/5 border-indigo-900/30"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF (최대 10MB)</p>
                          </div>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </Label>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={newPost.published}
                      onCheckedChange={(checked) => setNewPost({ ...newPost, published: checked })}
                    />
                    <Label htmlFor="published">즉시 공개</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>
                    취소
                  </Button>
                  <Button
                    onClick={handleAddPost}
                    disabled={!newPost.title || !newPost.content}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    게시물 저장
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-[#161625] border-indigo-900/30">
            <CardHeader>
              <CardTitle>블로그 게시물 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-indigo-900/10">
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead>작성자</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>날짜</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <TableRow key={post.id} className="hover:bg-indigo-900/10">
                        <TableCell className="font-medium">{post.id}</TableCell>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{post.categoryId}</TableCell>
                        <TableCell>{post.date}</TableCell>
                        <TableCell>
                          <Badge variant={post.published ? "default" : "outline"}>
                            {post.published ? "공개" : "비공개"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">메뉴 열기</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-indigo-900/30">
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                <span>수정</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleTogglePostStatus(post.id)}
                              >
                                {post.published ? (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    <span>비공개로 전환</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    <span>공개로 전환</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                <span>보기</span>
                              </DropdownMenuItem>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>삭제</span>
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="bg-[#1a1a2e] border-indigo-900/30">
                                  <DialogHeader>
                                    <DialogTitle>게시물 삭제</DialogTitle>
                                    <DialogDescription>
                                      정말로 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => {}}>
                                      취소
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDeletePost(post.id)}>
                                      삭제
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 포트폴리오 관리 탭 */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="프로젝트 검색..."
                value={searchProjectQuery}
                onChange={(e) => setSearchProjectQuery(e.target.value)}
                className="pl-8 bg-[#1a1a2e] border-indigo-900/30"
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                  <PlusCircle className="mr-2 h-4 w-4" />새 프로젝트 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a2e] border-indigo-900/30 max-w-3xl">
                <DialogHeader>
                  <DialogTitle>새 포트폴리오 프로젝트 추가</DialogTitle>
                  <DialogDescription>새 포트폴리오 프로젝트를 추가하여 사이트에 표시합니다.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project-title">제목</Label>
                    <Input
                      id="project-title"
                      placeholder="프로젝트 제목"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="bg-[#161625] border-indigo-900/30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project-description">설명</Label>
                    <Textarea
                      id="project-description"
                      placeholder="프로젝트 설명"
                      rows={4}
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="bg-[#161625] border-indigo-900/30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project-tags">태그</Label>
                    <Input
                      id="project-tags"
                      placeholder="태그 (쉼표로 구분)"
                      value={newProject.tags}
                      onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                      className="bg-[#161625] border-indigo-900/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="project-url">프로젝트 URL</Label>
                      <Input
                        id="project-url"
                        placeholder="https://example.com"
                        value={newProject.projectUrl}
                        onChange={(e) => setNewProject({ ...newProject, projectUrl: e.target.value })}
                        className="bg-[#161625] border-indigo-900/30"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="github-url">GitHub URL</Label>
                      <Input
                        id="github-url"
                        placeholder="https://github.com/username/project"
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                        className="bg-[#161625] border-indigo-900/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-image">프로젝트 이미지</Label>
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
                          htmlFor="project-image"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-primary/5 border-indigo-900/30"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF (최대 10MB)</p>
                          </div>
                          <Input
                            id="project-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </Label>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={newProject.featured}
                      onCheckedChange={(checked) => setNewProject({ ...newProject, featured: checked })}
                    />
                    <Label htmlFor="featured">주요 프로젝트로 표시</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>
                    취소
                  </Button>
                  <Button
                    onClick={handleAddProject}
                    disabled={!newProject.title || !newProject.description}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    프로젝트 저장
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-[#161625] border-indigo-900/30">
            <CardHeader>
              <CardTitle>포트폴리오 프로젝트 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-indigo-900/10">
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>태그</TableHead>
                    <TableHead>생성일</TableHead>
                    <TableHead>주요 프로젝트</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-indigo-900/10">
                        <TableCell className="font-medium">{project.id}</TableCell>
                        <TableCell>{project.title}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{project.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-indigo-900/20 text-indigo-400 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 2 && (
                              <span className="inline-block px-2 py-1 text-xs bg-indigo-900/20 text-indigo-400 rounded-full">
                                +{project.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{project.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={project.featured}
                              onChange={() => handleToggleProjectFeatured(project.id)}
                              className="rounded border-indigo-900/30 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">메뉴 열기</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-indigo-900/30">
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                <span>수정</span>
                              </DropdownMenuItem>
                              {project.projectUrl && (
                                <DropdownMenuItem className="cursor-pointer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  <span>사이트 방문</span>
                                </DropdownMenuItem>
                              )}
                              {project.githubUrl && (
                                <DropdownMenuItem className="cursor-pointer">
                                  <Github className="mr-2 h-4 w-4" />
                                  <span>GitHub</span>
                                </DropdownMenuItem>
                              )}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>삭제</span>
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="bg-[#1a1a2e] border-indigo-900/30">
                                  <DialogHeader>
                                    <DialogTitle>프로젝트 삭제</DialogTitle>
                                    <DialogDescription>
                                      정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => {}}>
                                      취소
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDeleteProject(project.id)}>
                                      삭제
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
