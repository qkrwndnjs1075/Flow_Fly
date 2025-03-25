"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"

interface BlogCategoriesProps {
  categories: Category[]
  selectedCategoryId: string | null
  onSelectCategory: (categoryId: string) => void
}

export function BlogCategories({ categories, selectedCategoryId, onSelectCategory }: BlogCategoriesProps) {
  return (
    <div className="space-y-1">
      <CategoryItem
        category={{ id: "all", name: "전체 글", slug: "all", count: 0 }}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={onSelectCategory}
        level={0}
      />
      {categories.map((category) => (
        <CategoryTree
          key={category.id}
          category={category}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={onSelectCategory}
          level={0}
        />
      ))}
    </div>
  )
}

interface CategoryTreeProps {
  category: Category
  selectedCategoryId: string | null
  onSelectCategory: (categoryId: string) => void
  level: number
}

function CategoryTree({ category, selectedCategoryId, onSelectCategory, level }: CategoryTreeProps) {
  const [isExpanded, setIsExpanded] = useState(
    // 선택된 카테고리가 현재 카테고리의 하위 카테고리인 경우 자동으로 확장
    selectedCategoryId === category.id ||
      (category.children?.some(
        (child) =>
          child.id === selectedCategoryId || child.children?.some((grandchild) => grandchild.id === selectedCategoryId),
      ) ??
        false),
  )

  const hasChildren = category.children && category.children.length > 0

  return (
    <div>
      <CategoryItem
        category={category}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={onSelectCategory}
        level={level}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
      />

      {hasChildren && isExpanded && (
        <div className={`ml-4 pl-2 border-l border-indigo-900/30 animate-fade-in`}>
          {category.children!.map((child) => (
            <CategoryTree
              key={child.id}
              category={child}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={onSelectCategory}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CategoryItemProps {
  category: Category
  selectedCategoryId: string | null
  onSelectCategory: (categoryId: string) => void
  level: number
  hasChildren?: boolean
  isExpanded?: boolean
  onToggleExpand?: () => void
}

function CategoryItem({
  category,
  selectedCategoryId,
  onSelectCategory,
  level,
  hasChildren,
  isExpanded,
  onToggleExpand,
}: CategoryItemProps) {
  const isSelected = selectedCategoryId === category.id

  return (
    <div
      className={cn(
        "flex items-center py-1.5 px-2 rounded-md transition-all cursor-pointer group",
        isSelected
          ? "bg-indigo-900/20 text-indigo-400"
          : "hover:bg-indigo-900/10 text-foreground hover:text-indigo-400",
      )}
    >
      {hasChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand?.()
          }}
          className="mr-1 text-muted-foreground hover:text-indigo-400 transition-colors"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      )}

      {!hasChildren && <div className="w-5" />}

      <div className="flex items-center justify-between w-full" onClick={() => onSelectCategory(category.id)}>
        <div className="flex items-center">
          <span className={`text-sm ${isSelected ? "font-medium" : ""}`}>{category.name}</span>
        </div>

        {category.count !== undefined && (
          <Badge
            variant="outline"
            className={`ml-2 text-xs ${
              isSelected ? "bg-indigo-500/20 border-indigo-500/50" : "bg-indigo-900/10 border-indigo-900/30"
            }`}
          >
            {category.count}
          </Badge>
        )}
      </div>
    </div>
  )
}

