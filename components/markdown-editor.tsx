"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bold, Italic, List, ListOrdered, Image, LinkIcon, Code } from "lucide-react"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "내용을 입력하세요...",
  minHeight = "300px",
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write")
  const [renderedHtml, setRenderedHtml] = useState("")

  // 마크다운을 HTML로 변환 (간단한 구현)
  useEffect(() => {
    // 실제로는 marked.js 같은 라이브러리를 사용하는 것이 좋습니다
    const html = value
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold my-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold my-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br />")
      .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img alt="$1" src="$2" class="my-4 rounded-lg max-w-full" />')
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" class="text-blue-500 hover:underline">$1</a>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-gray-200 px-1 rounded">$1</code>')
      .replace(/```(.*?)```/gs, '<pre class="bg-gray-800 text-gray-200 p-4 rounded-lg my-4 overflow-x-auto">$1</pre>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^[0-9]+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')

    setRenderedHtml(html)
  }, [value, tab])

  const insertMarkdown = (markdownSyntax: string, placeholder = "") => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const beforeText = value.substring(0, start)
    const afterText = value.substring(end)

    let newText
    if (selectedText) {
      // 텍스트가 선택된 경우
      newText = beforeText + markdownSyntax.replace(placeholder, selectedText) + afterText
    } else {
      // 텍스트가 선택되지 않은 경우
      newText = beforeText + markdownSyntax.replace(placeholder, placeholder) + afterText
    }

    onChange(newText)

    // 포커스 유지 및 커서 위치 조정
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + markdownSyntax.indexOf(placeholder) + (selectedText ? selectedText.length : 0)
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="border rounded-md">
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("**텍스트**", "텍스트")}
          title="굵게"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("*텍스트*", "텍스트")}
          title="기울임"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("[링크 텍스트](https://example.com)", "링크 텍스트")}
          title="링크"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("![이미지 설명](이미지 URL)", "이미지 설명")}
          title="이미지"
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("- 항목", "항목")}
          title="글머리 기호 목록"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("1. 항목", "항목")}
          title="번호 매기기 목록"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown("`코드`", "코드")}
          title="인라인 코드"
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="flex-1"></div>
        <Tabs value={tab} onValueChange={(value) => setTab(value as "write" | "preview")}>
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="write">작성</TabsTrigger>
            <TabsTrigger value="preview">미리보기</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>
        {tab === "write" ? (
          <textarea
            id="markdown-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 resize-y bg-transparent focus:outline-none"
            style={{ minHeight }}
          />
        ) : (
          <div
            className="p-4 prose prose-invert max-w-none"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{
              __html: renderedHtml || "<p class='text-muted-foreground'>내용이 없습니다.</p>",
            }}
          />
        )}
      </div>
    </div>
  )
}

