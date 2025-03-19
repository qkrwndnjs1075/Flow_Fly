import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, FileText, User } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Starry Night Background */}
      <section className="py-20 md:py-28 relative flex items-center justify-center min-h-[80vh] overflow-hidden bg-[#0a0a12]">
        {/* Starry Background */}
        <div className="absolute inset-0 bg-[#0a0a12]">
          {/* 배경 별 (고정된 별) */}
          <div className="stars-bg"></div>

          {/* 깜빡이는 별 */}
          <div className="twinkle"></div>
          <div className="twinkle"></div>
          <div className="twinkle"></div>
          <div className="twinkle"></div>
          <div className="twinkle"></div>
          <div className="twinkle"></div>
          <div className="twinkle"></div>
          <div className="twinkle"></div>
          <div className="twinkle"></div>
          <div className="twinkle"></div>

          {/* 떨어지는 별 */}
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a12]/30 to-[#0a0a12] pointer-events-none"></div>

        {/* Content */}
        <div className="container px-4 md:px-6 max-w-4xl relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4 animate-slide-down">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-glow">
                plob에 오신 것을 환영합니다
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl animate-slide-up">
                디자인, 개발 등에 대한 작업과 생각을 공유하는 공간입니다.
              </p>
            </div>
            <div className="space-x-4 animate-scale-in">
              <Link href="/portfolio">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg gap-1 transition-all duration-500 hover:translate-y-[-3px]">
                  포트폴리오 보기 <ArrowRight className="h-4 w-4 ml-1 animate-bounce-right" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button
                  variant="outline"
                  className="gap-1 border-2 border-white text-white hover:bg-white/10 transition-all duration-500 hover:translate-y-[-3px]"
                >
                  블로그 읽기 <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-12 md:py-16 bg-[#0f0f18]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Portfolio Card */}
            <div
              className="flex flex-col p-6 bg-[#161625] rounded-lg shadow-md border border-gray-800 hover:shadow-lg hover:border-indigo-500 transition-all duration-500 hover:translate-y-[-10px] group animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-70 blur-xl transition-all duration-500 group-hover:duration-200"></div>
                <Briefcase className="h-10 w-10 mb-4 text-white relative" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-300 transition-colors duration-300">
                포트폴리오
              </h3>
              <p className="text-gray-300 mb-4">최신 프로젝트와 작업 샘플을 확인하세요.</p>
              <Link href="/portfolio" className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-200 group-hover:bg-indigo-500/20 group-hover:border-indigo-500 transition-all duration-300"
                >
                  프로젝트 보기
                </Button>
              </Link>
            </div>

            {/* Blog Card */}
            <div
              className="flex flex-col p-6 bg-[#161625] rounded-lg shadow-md border border-gray-800 hover:shadow-lg hover:border-indigo-500 transition-all duration-500 hover:translate-y-[-10px] group animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-70 blur-xl transition-all duration-500 group-hover:duration-200"></div>
                <FileText className="h-10 w-10 mb-4 text-white relative" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-300 transition-colors duration-300">
                블로그
              </h3>
              <p className="text-gray-300 mb-4">다양한 주제에 대한 생각, 튜토리얼, 인사이트를 읽어보세요.</p>
              <Link href="/blog" className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-200 group-hover:bg-indigo-500/20 group-hover:border-indigo-500 transition-all duration-300"
                >
                  글 읽기
                </Button>
              </Link>
            </div>

            {/* About Card */}
            <div
              className="flex flex-col p-6 bg-[#161625] rounded-lg shadow-md border border-gray-800 hover:shadow-lg hover:border-indigo-500 transition-all duration-500 hover:translate-y-[-10px] group animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-70 blur-xl transition-all duration-500 group-hover:duration-200"></div>
                <User className="h-10 w-10 mb-4 text-white relative" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-300 transition-colors duration-300">
                소개
              </h3>
              <p className="text-gray-300 mb-4">제 배경, 기술, 경험에 대해 더 알아보세요.</p>
              <Link href="/about" className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-200 group-hover:bg-indigo-500/20 group-hover:border-indigo-500 transition-all duration-300"
                >
                  내 이야기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
