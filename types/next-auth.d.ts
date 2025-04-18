import "next-auth"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id?: string
      provider?: string
    } & DefaultSession["user"]
  }

  interface User {
    id?: string
    token?: string
    provider?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    accessToken?: string
    provider?: string
  }
}
