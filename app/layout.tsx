import type React from "react";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/footer";
import AppProvider from "@/components/AppProvider"; // 절대 경로 사용 (상대경로 필요 시 변경)
import "./globals.css";

export const metadata = {
  title: "plob - 포트폴리오 & 블로그",
  description: "포트폴리오와 블로그가 결합된 개인 사이트",
  icons: {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-19%20093722-RTDceE3SEwtLiPPRyY8LVNRwDIbXO0.png",
    apple:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202025-03-19%20093722-RTDceE3SEwtLiPPRyY8LVNRwDIbXO0.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href={metadata.icons.icon} type="image/png" />
        <link rel="apple-touch-icon" href={metadata.icons.apple} />
      </head>
      <body className="bg-[#0f0f18]">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <AppProvider>
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
