import type React from "react";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata = {
  title: "plob - 포트폴리오 & 블로그",
  description: "포트폴리오와 블로그가 결합된 개인 사이트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className="dark">
      <body className="bg-[#0f0f18]">
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
