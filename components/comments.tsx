"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { ThumbsUp, MessageSquare, Flag, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// 댓글 타입 정의
interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
  likes: number
  userLiked?: boolean
  replies?: Comment[]
}

interface CommentsProps {
  postId: string | number
}

export function Comments({ postId }: CommentsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  // 예시 댓글 데이터
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      content: "정말 유익한 글이네요! HTML, CSS, JavaScript에 대한 기초 설명이 명확해서 좋았습니다.",
      author: {
        id: "user1",
        name: "김철수",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date(2025, 2, 15),
      likes: 5,
      userLiked: true,
    },
    {
      id: "2",
      content: "웹 개발을 시작하려는 사람들에게 좋은 가이드가 될 것 같아요. 추가로 추천할만한 학습 자료가 있을까요?",
      author: {
        id: "user2",
        name: "이영희",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date(2025, 2, 14),
      likes: 3,
      replies: [
        {
          id: "2-1",
          content: "MDN 웹 문서와 freeCodeCamp를 추천합니다. 둘 다 무료로 이용할 수 있는 좋은 자료예요!",
          author: {
            id: "user1",
            name: "김철수",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          createdAt: new Date(2025, 2, 14, 15, 30),
          likes: 2,
        },
      ],
    },
  ])

  const handleSubmitComment = () => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "댓글을 작성하려면 먼저 로그인해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) return

    setIsSubmitting(true)

    // 실제로는 API 호출로 댓글 저장
    setTimeout(() => {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        content: comment,
        author: {
          id: user.id,
          name: user.displayName || "사용자",
          avatar: user.photoURL,
        },
        createdAt: new Date(),
        likes: 0,
      }

      setComments([newComment, ...comments])
      setComment("")
      setIsSubmitting(false)

      toast({
        title: "댓글이 등록되었습니다",
        description: "소중한 의견 감사합니다!",
      })
    }, 500)
  }

  const handleSubmitReply = (commentId: string) => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "댓글을 작성하려면 먼저 로그인해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!replyContent.trim()) return

    setIsSubmitting(true)

    // 실제로는 API 호출로 답글 저장
    setTimeout(() => {
      const newReply: Comment = {
        id: `reply-${Date.now()}`,
        content: replyContent,
        author: {
          id: user.id,
          name: user.displayName || "사용자",
          avatar: user.photoURL,
        },
        createdAt: new Date(),
        likes: 0,
      }

      const updatedComments = comments.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply],
          }
        }
        return c
      })

      setComments(updatedComments)
      setReplyContent("")
      setReplyTo(null)
      setIsSubmitting(false)

      toast({
        title: "답글이 등록되었습니다",
        description: "소중한 의견 감사합니다!",
      })
    }, 500)
  }

  const handleLikeComment = (commentId: string) => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "좋아요를 누르려면 먼저 로그인해주세요.",
        variant: "destructive",
      })
      return
    }

    // 댓글 좋아요 토글
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const newLikes = comment.userLiked ? comment.likes - 1 : comment.likes + 1
        return {
          ...comment,
          likes: newLikes,
          userLiked: !comment.userLiked,
        }
      }

      // 중첩 댓글 확인
      if (comment.replies) {
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === commentId) {
            const newLikes = reply.userLiked ? reply.likes - 1 : reply.likes + 1
            return {
              ...reply,
              likes: newLikes,
              userLiked: !reply.userLiked,
            }
          }
          return reply
        })
        return { ...comment, replies: updatedReplies }
      }

      return comment
    })

    setComments(updatedComments)
  }

  const handleDeleteComment = (commentId: string) => {
    if (confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      // 댓글 삭제 로직
      const updatedComments = comments.filter((comment) => {
        // 최상위 댓글 삭제
        if (comment.id === commentId) {
          return false
        }

        // 중첩 댓글 삭제
        if (comment.replies) {
          comment.replies = comment.replies.filter((reply) => reply.id !== commentId)
        }

        return true
      })

      setComments(updatedComments)

      toast({
        title: "댓글이 삭제되었습니다",
      })
    }
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-12 mt-4" : "border-b border-gray-800 py-4"}`}>
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{comment.author.name}</h4>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: ko })}
              </p>
            </div>
            {user && user.id === comment.author.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">메뉴</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)}>
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    <span>삭제</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="mt-2 text-sm">{comment.content}</div>
          <div className="mt-2 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 text-xs ${comment.userLiked ? "text-primary" : ""}`}
              onClick={() => handleLikeComment(comment.id)}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{comment.likes}</span>
            </Button>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-xs"
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>답글</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
              <Flag className="h-3.5 w-3.5" />
              <span>신고</span>
            </Button>
          </div>

          {/* 답글 입력 폼 */}
          {replyTo === comment.id && (
            <div className="mt-4 flex gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || "/placeholder.svg"} alt={user?.displayName || "사용자"} />
                <AvatarFallback>
                  {user?.displayName ? user.displayName[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글을 입력하세요..."
                  className="mb-2 min-h-[80px] resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setReplyTo(null)}>
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim() || isSubmitting}
                  >
                    {isSubmitting ? "등록 중..." : "답글 등록"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 중첩 댓글 렌더링 */}
          {comment.replies && comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">댓글 {comments.length}개</h2>

      {/* 댓글 입력 폼 */}
      <div className="mb-8">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || "/placeholder.svg"} alt={user?.displayName || "사용자"} />
            <AvatarFallback>
              {user?.displayName ? user.displayName[0].toUpperCase() : user?.email?.[0].toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={user ? "댓글을 입력하세요..." : "댓글을 작성하려면 로그인하세요."}
              className="mb-2 min-h-[100px] resize-none"
              disabled={!user}
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitComment} disabled={!comment.trim() || isSubmitting || !user}>
                {isSubmitting ? "등록 중..." : "댓글 등록"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-0">
        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <p className="text-center py-8 text-muted-foreground">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
        )}
      </div>
    </div>
  )
}

