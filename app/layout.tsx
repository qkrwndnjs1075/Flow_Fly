import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-context"
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flow_Fly | 스마트 글래스 OS",
  description: "실시간 성능 추적 기능을 갖춘 스마트 글래스용 고급 e-OS 시스템",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>{/* 카카오맵 API 스크립트는 kakao-map-search.tsx 컴포넌트 내에서 동적으로 로드됩니다 */}</head>
      <body className={inter.className}>
        <SessionProvider>
          <AuthProvider>{children}</AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
