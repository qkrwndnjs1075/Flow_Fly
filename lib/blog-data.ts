import type { BlogPost, Category, Tag } from "./types"

// 계층형 카테고리 데이터
export const categories: Category[] = [
  {
    id: "programming",
    name: "프로그래밍",
    slug: "programming",
    count: 12,
    children: [
      {
        id: "web",
        name: "웹 개발",
        slug: "web",
        parentId: "programming",
        count: 6,
        children: [
          {
            id: "frontend",
            name: "프론트엔드",
            slug: "frontend",
            parentId: "web",
            count: 4,
          },
          {
            id: "backend",
            name: "백엔드",
            slug: "backend",
            parentId: "web",
            count: 2,
          },
        ],
      },
      {
        id: "mobile",
        name: "모바일 개발",
        slug: "mobile",
        parentId: "programming",
        count: 4,
        children: [
          {
            id: "flutter",
            name: "Flutter",
            slug: "flutter",
            parentId: "mobile",
            count: 3,
          },
          {
            id: "react-native",
            name: "React Native",
            slug: "react-native",
            parentId: "mobile",
            count: 1,
          },
        ],
      },
      {
        id: "algorithm",
        name: "알고리즘",
        slug: "algorithm",
        parentId: "programming",
        count: 2,
      },
    ],
  },
  {
    id: "computer-science",
    name: "컴퓨터 과학",
    slug: "computer-science",
    count: 8,
    children: [
      {
        id: "data-structure",
        name: "자료구조",
        slug: "data-structure",
        parentId: "computer-science",
        count: 3,
      },
      {
        id: "os",
        name: "운영체제",
        slug: "os",
        parentId: "computer-science",
        count: 2,
      },
      {
        id: "network",
        name: "네트워크",
        slug: "network",
        parentId: "computer-science",
        count: 3,
      },
    ],
  },
  {
    id: "personal",
    name: "개인적인 견해",
    slug: "personal",
    count: 5,
  },
  {
    id: "project",
    name: "프로젝트",
    slug: "project",
    count: 4,
  },
]

// 태그 데이터
export const tags: Tag[] = [
  { id: "html", name: "HTML", slug: "html", count: 5 },
  { id: "css", name: "CSS", slug: "css", count: 5 },
  { id: "javascript", name: "JavaScript", slug: "javascript", count: 8 },
  { id: "typescript", name: "TypeScript", slug: "typescript", count: 6 },
  { id: "react", name: "React", slug: "react", count: 7 },
  { id: "nextjs", name: "Next.js", slug: "nextjs", count: 4 },
  { id: "flutter", name: "Flutter", slug: "flutter", count: 3 },
  { id: "python", name: "Python", slug: "python", count: 2 },
  { id: "java", name: "Java", slug: "java", count: 1 },
  { id: "spring", name: "Spring", slug: "spring", count: 1 },
  { id: "database", name: "Database", slug: "database", count: 3 },
  { id: "api", name: "API", slug: "api", count: 4 },
  { id: "algorithm", name: "알고리즘", slug: "algorithm", count: 2 },
  { id: "data-structure", name: "자료구조", slug: "data-structure", count: 3 },
  { id: "os", name: "운영체제", slug: "os", count: 2 },
  { id: "network", name: "네트워크", slug: "network", count: 3 },
  { id: "project", name: "프로젝트", slug: "project", count: 4 },
  { id: "experience", name: "경험", slug: "experience", count: 5 },
  { id: "review", name: "후기", slug: "review", count: 3 },
  { id: "tutorial", name: "튜토리얼", slug: "tutorial", count: 6 },
]

// 블로그 포스트 데이터
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "나의 올바른 연결 준비 전략과 연결을 보며 느낀 점들",
    excerpt:
      "내 개인적인 연결 준비 전략과, 그리고 그동안 여러 동아리에서 연결 과정을 경험하면서 느꼈던 점들에 대해 써 보려합니다. 최근 몇개의 다양 글을 보니다, 제일 중이라는 기준으로 작성...",
    content:
      "내 개인적인 연결 준비 전략과, 그리고 그동안 여러 동아리에서 연결 과정을 경험하면서 느꼈던 점들에 대해 써 보려합니다. 최근 몇개의 다양 글을 보니다, 제일 중이라는 기준으로 작성...",
    date: "2024-7-10",
    author: "김지민",
    categoryId: "personal",
    image: "/placeholder.svg?height=150&width=250",
    tags: ["experience", "review", "personal"],
    readTime: "5분",
    views: 1240,
    likes: 42,
  },
  {
    id: 2,
    title: "개발 블로그를 운영하면서 느낀 점들 (7만 뷰 달성 후)",
    excerpt:
      "지난달 v1.0 출시한지 7개월 정확히 달성했습니다. 그런 기념 그동안 블로그를 운영하면서 느낀 후기를 써보려고 합니다. 현재 개발 블로그 조회 누적는 약 6만 7천 정도인데요 제 블로그 정리, 블로 글쓰기 시작한...",
    content:
      "지난달 v1.0 출시한지 7개월 정확히 달성했습니다. 그런 기념 그동안 블로그를 운영하면서 느낀 후기를 써보려고 합니다. 현재 개발 블로그 조회 누적는 약 6만 7천 정도인데요 제 블로그 정리, 블로 글쓰기 시작한...",
    date: "2024-7-13",
    author: "이준호",
    categoryId: "personal",
    image: "/placeholder.svg?height=150&width=250",
    tags: ["blog", "experience", "review"],
    readTime: "8분",
    views: 7000,
    likes: 156,
  },
  {
    id: 3,
    title: "소지역에서 오프라인 생기는 사고들",
    excerpt:
      "소지역에서 오프라인 특성상 다양한 종류의 사고 발생하는 특성을 서비스에 반기기 위한 준비 과정에 대해 써보려 합니다. 일반 시간에 온라인에서 특성은 아래와 같이 해서, 오류라고 길게 저리고 위험을 방지...",
    content:
      "소지역에서 오프라인 특성상 다양한 종류의 사고 발생하는 특성을 서비스에 반기기 위한 준비 과정에 대해 써보려 합니다. 일반 시간에 온라인에서 특성은 아래와 같이 해서, 오류라고 길게 저리고 위험을 방지...",
    date: "2024-4-13",
    author: "박서연",
    categoryId: "computer-science",
    image: "/placeholder.svg?height=150&width=250",
    tags: ["service", "offline", "error-handling"],
    readTime: "6분",
    views: 890,
    likes: 23,
  },
  {
    id: 4,
    title: "[SAFY 개발일지] API 명세를 통해 백/프론트엔드 추상화하기",
    excerpt:
      "SAFY Solution Challenge 2024 진행 중기 일지입니다. 저희 소규모 개발을 시작하기 전 가장 먼저 해야 할 일은 바로 API를 명세하는 일이다. 먼저 개발해야 하는 화면을 설명하자. 홈화면 스크린 캡처...",
    content:
      "SAFY Solution Challenge 2024 진행 중기 일지입니다. 저희 소규모 개발을 시작하기 전 가장 먼저 해야 할 일은 바로 API를 명세하는 일이다. 먼저 개발해야 하는 화면을 설명하자. 홈화면 스크린 캡처...",
    date: "2024-3-2",
    author: "최민준",
    categoryId: "project",
    image: "/placeholder.svg?height=150&width=250",
    tags: ["api", "backend", "frontend", "project"],
    readTime: "10분",
    views: 1560,
    likes: 78,
  },
  {
    id: 5,
    title: "Solution Challenge 2024 참여 후기",
    excerpt:
      "Solution Challenge 2024/GDSC Solution Challenge 2024에 참여하게 되었다. 서울 청년 2023년에는 참여하였는데, 이번에 나올 주제를 보면 오늘가 꼭 출전하고 싶은 사항이었다...",
    content:
      "Solution Challenge 2024/GDSC Solution Challenge 2024에 참여하게 되었다. 서울 청년 2023년에는 참여하였는데, 이번에 나올 주제를 보면 오늘가 꼭 출전하고 싶은 사항이었다...",
    date: "2024-2-27",
    author: "정다은",
    categoryId: "project",
    image: "/placeholder.svg?height=150&width=250",
    tags: ["project", "review", "challenge"],
    readTime: "7분",
    views: 1200,
    likes: 45,
  },
  {
    id: 6,
    title: "[Flutter Error] Uncategorized (Xcode): Command CodeSign failed with a nonzero exit code 원인 해결 방법",
    excerpt:
      "최근 앱을 Flutter에서 iOS 빌드 시 다음과 같은 에러가 발생하였다. Launching lib/main.dart on iPhone 15 Pro in debug mode... Running Xcode build... Xcode build done. 6:21 Flutter...",
    content:
      "최근 앱을 Flutter에서 iOS 빌드 시 다음과 같은 에러가 발생하였다. Launching lib/main.dart on iPhone 15 Pro in debug mode... Running Xcode build... Xcode build done. 6:21 Flutter...",
    date: "2024-2-18",
    author: "김지민",
    categoryId: "flutter",
    image: "/placeholder.svg?height=150&width=250",
    tags: ["flutter", "ios", "error", "xcode"],
    readTime: "5분",
    views: 2300,
    likes: 112,
  },
  {
    id: 7,
    title: "버튼 바이너 웹스",
    excerpt:
      "버튼 바이너 위치 위기에 노하면로 자동을 수정하면 됨, 기명고서 서버 문제로 버튼 바이너에 대한 문제가 생겨 버렸다. 새로 바이너 업체서 자체적에서 제 출력을 개선하다. 특히는 버튼 가지 자리고는...",
    content:
      "버튼 바이너 위치 위기에 노하면로 자동을 수정하면 됨, 기명고서 서버 문제로 버튼 바이너에 대한 문제가 생겨 버렸다. 새로 바이너 업체서 자체적에서 제 출력을 개선하다. 특히는 버튼 가지 자리고는...",
    date: "2024-2-11",
    author: "이준호",
    categoryId: "frontend",
    image: "/placeholder.svg?height=150&width=250",
    tags: ["web", "button", "server"],
    readTime: "4분",
    views: 780,
    likes: 19,
  },
  {
    id: 8,
    title: "부동소수점의 생성과 계산, 그리고 FPU",
    excerpt:
      "부동 소수점의 정의를 먼저 그리고 부동 소수점의 컴퓨터에서의 부동소수점을 저장하고 계산하는 방식 그 상에에 대해서 다루어볼 것이다. 또한 부동소수점을 처리하는 하드웨어인 FPU에 대해서 간략...",
    content:
      "부동 소수점의 정의를 먼저 그리고 부동 소수점의 컴퓨터에서의 부동소수점을 저장하고 계산하는 방식 그 상에에 대해서 다루어볼 것이다. 또한 부동소수점을 처리하는 하드웨어인 FPU에 대해서 간략...",
    date: "2023-12-30",
    author: "최민준",
    categoryId: "computer-science",
    image: "/placeholder.svg?height=150&width=250",
    tags: ["floating-point", "fpu", "computer-architecture"],
    readTime: "12분",
    views: 1450,
    likes: 67,
  },
]

// 카테고리 ID로 카테고리 찾기 (재귀적으로 모든 하위 카테고리 검색)
export function findCategoryById(categoryId: string, categoriesList = categories): Category | undefined {
  for (const category of categoriesList) {
    if (category.id === categoryId) {
      return category
    }

    if (category.children) {
      const found = findCategoryById(categoryId, category.children)
      if (found) return found
    }
  }

  return undefined
}

// 카테고리 ID로 모든 상위 카테고리 경로 찾기
export function getCategoryPath(categoryId: string): Category[] {
  const path: Category[] = []

  function findPath(categoryId: string, categoriesList = categories, currentPath: Category[] = []): boolean {
    for (const category of categoriesList) {
      const newPath = [...currentPath, category]

      if (category.id === categoryId) {
        path.push(...newPath)
        return true
      }

      if (category.children && findPath(categoryId, category.children, newPath)) {
        return true
      }
    }

    return false
  }

  findPath(categoryId)
  return path
}

// 태그 ID로 태그 찾기
export function findTagById(tagId: string): Tag | undefined {
  return tags.find((tag) => tag.id === tagId)
}

// 카테고리 ID로 해당 카테고리의 모든 포스트 찾기 (하위 카테고리 포함)
export function getPostsByCategoryId(categoryId: string): BlogPost[] {
  const allCategoryIds = getAllChildCategoryIds(categoryId)
  return blogPosts.filter((post) => allCategoryIds.includes(post.categoryId))
}

// 카테고리 ID로 해당 카테고리의 모든 하위 카테고리 ID 찾기
export function getAllChildCategoryIds(categoryId: string): string[] {
  const result: string[] = [categoryId]

  function collectChildIds(category: Category | undefined) {
    if (!category || !category.children) return

    for (const child of category.children) {
      result.push(child.id)
      collectChildIds(child)
    }
  }

  const category = findCategoryById(categoryId)
  collectChildIds(category)

  return result
}

// 태그 ID로 해당 태그의 모든 포스트 찾기
export function getPostsByTagId(tagId: string): BlogPost[] {
  return blogPosts.filter((post) => post.tags.includes(tagId))
}

// 포스트 ID로 포스트 찾기
export function getPostById(postId: number): BlogPost | undefined {
  return blogPosts.find((post) => post.id === postId)
}

// 관련 포스트 찾기 (같은 카테고리 또는 같은 태그를 가진 포스트)
export function getRelatedPosts(postId: number, limit = 3): BlogPost[] {
  const post = getPostById(postId)
  if (!post) return []

  // 같은 카테고리의 포스트 찾기
  const sameCategoryPosts = blogPosts.filter((p) => p.id !== postId && p.categoryId === post.categoryId)

  // 같은 태그를 가진 포스트 찾기
  const sameTagPosts = blogPosts.filter((p) => p.id !== postId && p.tags.some((tag) => post.tags.includes(tag)))

  // 중복 제거 및 정렬
  const relatedPosts = [...new Set([...sameCategoryPosts, ...sameTagPosts])]

  // 최신순으로 정렬하고 limit 개수만큼 반환
  return relatedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit)
}

