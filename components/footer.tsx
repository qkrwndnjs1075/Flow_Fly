"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"

export function Footer() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Set isLoaded to true after component mounts for animations
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <footer className="bg-[#080810] text-gray-400 py-10 border-t border-indigo-900/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 animate-shimmer"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div
          className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col space-y-6">
          <div
            className={`transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          >
            <h2 className="text-xl font-bold text-white group relative inline-block">
              plob
              <span className="absolute -top-1 -right-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              </span>
            </h2>
            <p className="text-sm mt-1">© {new Date().getFullYear()} plob</p>
          </div>

          <div
            className={`space-y-1 text-sm transition-all duration-700 delay-100 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          >
            <p className="hover:text-gray-300 transition-colors duration-300 cursor-pointer">
              주소 : 대전광역시 유성구 가정북로 76 (명동 23-9)
            </p>
            <p className="hover:text-gray-300 transition-colors duration-300 cursor-pointer">
              교무실 : 042-866-8822 Fax : 042-867-9900 행정실 : 042-866-8885 | Fax : 042-863-4308
            </p>
          </div>

          <div
            className={`flex space-x-4 text-sm pt-2 border-t border-indigo-900/30 transition-all duration-700 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          >
            <span className="text-gray-400 cursor-default">이용약관</span>
            <span>|</span>
            <span className="text-gray-400 cursor-default">개인정보처리방침</span>
          </div>

          <div
            className={`text-center text-xs text-gray-500 pt-4 transition-all duration-700 delay-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          >
            <p className="flex items-center justify-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500 animate-heartbeat" /> and passion
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

