"use client"

import type React from "react"

import { useState } from "react"
import { useAdminAuth } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login, loading } = useAdminAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(username, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a12] p-4">
      <div className="w-full max-w-md">
        <Card className="border-indigo-900/30 bg-[#161625]">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-indigo-900/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">어드민 로그인</CardTitle>
            <CardDescription>관리자 계정으로 로그인하여 사이트를 관리하세요</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-[#1a1a2e] border-indigo-900/30"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">비밀번호</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#1a1a2e] border-indigo-900/30"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 로그인 중...
                  </>
                ) : (
                  "로그인"
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  메인 페이지로 돌아가기
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>데모 계정: admin / admin123</p>
        </div>
      </div>
    </div>
  )
}

