"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  // Set isLoaded to true after component mounts for animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const routes = [
    { href: "/", label: "홈" },
    { href: "/portfolio", label: "포트폴리오" },
    { href: "/blog", label: "블로그" },
    { href: "/about", label: "소개" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled ? "bg-[#0a0a12]/95 backdrop-blur-md border-b border-indigo-900/30 shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center">
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className={`relative w-10 h-10 flex items-center justify-center transition-all duration-700 ${isLoaded ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-19%20093722-RTDceE3SEwtLiPPRyY8LVNRwDIbXO0.png"
                alt="plob logo"
                className="w-8 h-8 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 rounded-lg"
                style={{ aspectRatio: "1/1" }}
              />
            </div>
            <span
              className={`font-bold text-xl text-white tracking-tight group-hover:text-indigo-300 transition-all duration-500 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
            >
              plob
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {routes.map((route, index) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-all duration-500 hover:text-white relative py-1 px-2 overflow-hidden group",
                pathname === route.href ? "text-white" : "text-gray-300",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="relative z-10">{route.label}</span>
              {pathname === route.href ? (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600"></span>
              ) : (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              )}
              <span className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 group-hover:h-full transition-all duration-300 -z-10"></span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full overflow-hidden border border-indigo-900/50 hover:border-indigo-500 transition-all duration-500 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                  style={{ transitionDelay: "500ms" }}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL || "/placeholder.svg"}
                      alt={user.displayName || "User"}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#161625] border-indigo-900/30 animate-in fade-in-80 slide-in-from-top-5"
              >
                <DropdownMenuItem
                  asChild
                  className="hover:bg-indigo-900/20 focus:bg-indigo-900/20 transition-colors duration-200"
                >
                  <Link href="/profile">프로필</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="hover:bg-indigo-900/20 focus:bg-indigo-900/20 transition-colors duration-200"
                >
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className={`text-gray-300 hover:text-white hover:bg-indigo-900/20 transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: "400ms" }}
                >
                  로그인
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className={`bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-500 hover:translate-y-[-3px] ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  style={{ transitionDelay: "500ms" }}
                >
                  회원가입
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden text-gray-300 hover:text-white transition-all duration-500 ${isLoaded ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-indigo-900/30 bg-[#0a0a12]/95 backdrop-blur-md animate-in slide-in-from-top-5">
          <div className="container py-4 flex flex-col gap-4">
            {routes.map((route, index) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-white py-2 px-3 rounded-md animate-slide-right",
                  pathname === route.href
                    ? "text-white bg-indigo-900/20 border-l-2 border-indigo-500"
                    : "text-gray-300",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {route.label}
              </Link>
            ))}
            <div className="border-t border-indigo-900/30 pt-4 mt-2">
              {user ? (
                <>
                  <div
                    className="flex items-center gap-3 mb-3 p-3 bg-indigo-900/10 rounded-md animate-slide-up"
                    style={{ animationDelay: "200ms" }}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL || "/placeholder.svg"}
                        alt={user.displayName || "User"}
                        className="h-8 w-8 rounded-full border border-indigo-500"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-900/50 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="font-medium text-white">{user.displayName || user.email}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href="/profile">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-indigo-900/30 text-gray-200 hover:bg-indigo-900/20 hover:border-indigo-500 transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: "250ms" }}
                      >
                        프로필
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-indigo-900/30 text-gray-200 hover:bg-indigo-900/20 hover:border-indigo-500 transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: "300ms" }}
                      onClick={() => signOut()}
                    >
                      로그아웃
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full border-indigo-900/30 text-gray-200 hover:bg-indigo-900/20 hover:border-indigo-500 transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: "200ms" }}
                    >
                      로그인
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: "250ms" }}
                    >
                      회원가입
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

