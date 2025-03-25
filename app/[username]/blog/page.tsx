import { getUserProfileByUsername, getUserBlogPosts } from "@/lib/supabase-client";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function UserBlogPage({ params }: { params: { username: string } }) {
  const { username } = params;

  const userProfile = await getUserProfileByUsername(username);

  if (!userProfile) {
    notFound();
  }

  const posts = await getUserBlogPosts(userProfile.id);

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userProfile.photoURL || ""} alt={userProfile.displayName || userProfile.username} />
            <AvatarFallback className="text-2xl">
              {userProfile.displayName
                ? userProfile.displayName[0].toUpperCase()
                : userProfile.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-2">{userProfile.displayName || userProfile.username}의 블로그</h1>
            {userProfile.bio && <p className="text-muted-foreground">{userProfile.bio}</p>}
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">아직 블로그 포스트가 없습니다</h2>
            <p className="text-muted-foreground">곧 흥미로운 포스트가 추가될 예정입니다!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Card key={post.id}>
                <div className="md:flex">
                  {post.coverImageUrl && (
                    <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                      <img
                        src={post.coverImageUrl || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  <div className={`flex flex-col ${post.coverImageUrl ? "md:w-2/3" : "w-full"}`}>
                    <CardHeader>
                      <CardTitle className="text-2xl">{post.title}</CardTitle>
                      <CardDescription className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(post.createdAt), "yyyy년 MM월 dd일")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-primary/10 text-primary text-xs rounded-full px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href={`/${username}/blog/${post.slug}`}>
                          자세히 보기
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
