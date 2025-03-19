import type React from "react";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/footer";
import AppProvider from "../components/AppProvider"; // 두 번째 코드와 합치기 위해 추가
import "./globals.css";

export const metadata = {
  title: "plob - 포트폴리오 & 블로그",
  description: "포트폴리오와 블로그가 결합된 개인 사이트",
  icons: {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/your-icon.png",
    apple: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/your-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/your-icon.png" />
        <link rel="apple-touch-icon" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/your-icon.png" />
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
