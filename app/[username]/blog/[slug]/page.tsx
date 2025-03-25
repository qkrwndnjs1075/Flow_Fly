import { getUserProfileByUsername, getBlogPostBySlug } from "@/lib/supabase-client";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { username: string; slug: string } }): Promise<Metadata> {
  const { username, slug } = params;
  const post = await getBlogPostBySlug(username, slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: { params: { username: string; slug: string } }) {
  const { username, slug } = params;
  const userProfile = await getUserProfileByUsername(username);

  if (!userProfile) {
    notFound();
  }

  const post = await getBlogPostBySlug(username, slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-8">
          <Link href={`/${username}/blog`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            모든 포스트로 돌아가기
          </Link>
        </Button>

        {post.coverImageUrl && (
          <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <img
              src={post.coverImageUrl || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile.photoURL || ""} alt={userProfile.displayName || userProfile.username} />
            <AvatarFallback>
              {userProfile.displayName
                ? userProfile.displayName[0].toUpperCase()
                : userProfile.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{userProfile.displayName || userProfile.username}</div>
            <div className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(post.createdAt), "yyyy년 MM월 dd일")}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span key={tag} className="inline-block bg-primary/10 text-primary text-sm rounded-full px-3 py-1">
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
