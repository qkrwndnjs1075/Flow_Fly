"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import type { Tag } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogTagsProps {
  tags: Tag[]
  selectedTagIds: string[]
  onSelectTag: (tagId: string) => void
  onClearTags: () => void
}

export function BlogTags({ tags, selectedTagIds, onSelectTag, onClearTags }: BlogTagsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAll, setShowAll] = useState(false)

  // 태그 검색 및 필터링
  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // 인기 태그 (count 기준 정렬)
  const sortedTags = [...filteredTags].sort((a, b) => (b.count || 0) - (a.count || 0))

  // 표시할 태그 (전체 보기 또는 상위 10개)
  const displayTags = showAll ? sortedTags : sortedTags.slice(0, 10)

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="태그 검색..."
          className="pl-9 bg-[#161625] border-indigo-900/30 focus:border-indigo-500 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-indigo-900/20"
            onClick={() => setSearchQuery("")}
            aria-label="검색어 지우기"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {selectedTagIds.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          <div className="w-full flex justify-between items-center">
            <span className="text-sm text-muted-foreground">선택된 태그:</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-indigo-400"
              onClick={onClearTags}
            >
              모두 지우기
            </Button>
          </div>
          {selectedTagIds.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId)
            if (!tag) return null

            return (
              <Badge
                key={tag.id}
                variant="secondary"
                className="bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30 cursor-pointer animate-scale-in"
                onClick={() => onSelectTag(tag.id)}
              >
                {tag.name}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTagIds.includes(tag.id) ? "default" : "secondary"}
            className={`
              cursor-pointer animate-fade-in
              ${
                selectedTagIds.includes(tag.id)
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-indigo-900/20 border-indigo-500/50 hover:bg-indigo-900/30"
              }
            `}
            onClick={() => onSelectTag(tag.id)}
          >
            {tag.name}
            {tag.count !== undefined && <span className="ml-1 text-xs opacity-80">({tag.count})</span>}
          </Badge>
        ))}
      </div>

      {filteredTags.length > 10 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground hover:text-indigo-400"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "접기" : `더 보기 (${filteredTags.length - 10}개 더)`}
        </Button>
      )}
    </div>
  )
}

