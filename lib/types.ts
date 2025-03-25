export interface Category {
  id: string
  name: string
  slug: string
  count?: number
  parentId?: string | null
  children?: Category[]
}

// 태그 타입 정의
export interface Tag {
  id: string
  name: string
  slug: string
  count?: number
}

// 블로그 포스트 타입 정의
export interface BlogPost {
  id: number
  title: string
  slug?: string
  excerpt: string
  content: string
  date: string
  author: string
  categoryId: string
  image?: string
  tags: string[]
  readTime?: string
  views?: number
  likes?: number
  createdAt: string
  updatedAt: string
  published: boolean
  coverImageUrl?: string
  userId: string
}

export interface PortfolioProject {
  id: string
  userId: string
  title: string
  description: string
  projectUrl?: string
  githubUrl?: string
  tags: string[]
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  username: string
  displayName?: string
  photoURL?: string
  bio?: string
  socialLinks?: {
    website?: string
    github?: string
    linkedin?: string
    twitter?: string
  }
  createdAt: string
}

