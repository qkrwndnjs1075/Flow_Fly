import { createClient } from "@supabase/supabase-js"
import type { BlogPost, PortfolioProject, UserProfile } from "./types"

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = typeof window !== "undefined" ? createClient(supabaseUrl, supabaseAnonKey) : null

// 포트폴리오 관련 함수
export async function getUserPortfolioProjects(userId: string): Promise<PortfolioProject[]> {
  try {
    if (!supabase) return []

    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false })

    if (error) {
      console.error("Error fetching portfolio projects:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserPortfolioProjects:", error)
    return []
  }
}

export async function createPortfolioProject(
  project: Omit<PortfolioProject, "id" | "createdAt" | "updatedAt">,
): Promise<PortfolioProject | null> {
  try {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("portfolio_projects")
      .insert([{ ...project, createdAt: now, updatedAt: now }])
      .select()

    if (error) {
      throw error
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Error in createPortfolioProject:", error)
    throw error
  }
}

export async function updatePortfolioProject(
  projectId: string,
  updates: Partial<Omit<PortfolioProject, "id" | "userId" | "createdAt" | "updatedAt">>,
): Promise<PortfolioProject | null> {
  try {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    const { data, error } = await supabase
      .from("portfolio_projects")
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq("id", projectId)
      .select()

    if (error) {
      throw error
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Error in updatePortfolioProject:", error)
    throw error
  }
}

export async function deletePortfolioProject(projectId: string): Promise<boolean> {
  try {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return false
    }

    const { error } = await supabase.from("portfolio_projects").delete().eq("id", projectId)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("Error in deletePortfolioProject:", error)
    throw error
  }
}

// 블로그 관련 함수
export async function getUserBlogPosts(userId: string, includeUnpublished = false): Promise<BlogPost[]> {
  try {
    if (!supabase) return []

    let query = supabase.from("blog_posts").select("*").eq("userId", userId).order("createdAt", { ascending: false })

    if (!includeUnpublished) {
      query = query.eq("published", true)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching blog posts:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserBlogPosts:", error)
    return []
  }
}

export async function getBlogPostBySlug(username: string, slug: string): Promise<BlogPost | null> {
  try {
    if (!supabase) return null

    // 먼저 사용자 ID 가져오기
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single()

    if (userError || !userData) {
      console.error("Error fetching user:", userError)
      return null
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("userId", userData.id)
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (error) {
      console.error("Error fetching blog post:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error)
    return null
  }
}

export async function createBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost | null> {
  try {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("blog_posts")
      .insert([{ ...post, createdAt: now, updatedAt: now }])
      .select()

    if (error) {
      throw error
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Error in createBlogPost:", error)
    throw error
  }
}

export async function updateBlogPost(
  postId: string,
  updates: Partial<Omit<BlogPost, "id" | "userId" | "createdAt" | "updatedAt">>,
): Promise<BlogPost | null> {
  try {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq("id", postId)
      .select()

    if (error) {
      throw error
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Error in updateBlogPost:", error)
    throw error
  }
}

export async function deleteBlogPost(postId: string): Promise<boolean> {
  try {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return false
    }

    const { error } = await supabase.from("blog_posts").delete().eq("id", postId)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("Error in deleteBlogPost:", error)
    throw error
  }
}

// 사용자 프로필 관련 함수
export async function getUserProfileByUsername(username: string): Promise<UserProfile | null> {
  try {
    if (!supabase) return null

    const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserProfileByUsername:", error)
    return null
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, "id" | "createdAt">>,
): Promise<UserProfile | null> {
  try {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return null
    }

    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select()

    if (error) {
      throw error
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Error in updateUserProfile:", error)
    throw error
  }
}

// 파일 업로드 함수
export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    if (!supabase) {
      console.error("Supabase client not initialized")
      throw new Error("Supabase client not initialized")
    }

    const { data, error } = await supabase.storage.from("images").upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      throw error
    }

    // 공개 URL 생성
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (error) {
    console.error("Error in uploadImage:", error)
    throw error
  }
}

