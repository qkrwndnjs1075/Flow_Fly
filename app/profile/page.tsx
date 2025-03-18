"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // In a real app, you would update the user profile in your database
      // For this demo, we'll just show a success message
      toast({
        title: "프로필 업데이트됨",
        description: "프로필이 성공적으로 업데이트되었습니다.",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "프로필 업데이트 오류",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "프로필 업데이트 오류",
          description: "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">내 프로필</h1>

        <div className="grid gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                <AvatarFallback className="rounded-lg">
                  {user?.displayName ? user.displayName[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user?.displayName || "사용자"}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>프로필 정보</CardTitle>
                <CardDescription>여기에서 프로필 정보를 업데이트하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">표시 이름</Label>
                  <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" value={user?.email || ""} disabled />
                  <p className="text-sm text-muted-foreground">이메일은 변경할 수 없습니다.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "저장 중..." : "변경사항 저장"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
