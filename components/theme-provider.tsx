"use client"

import type * as React from "react"

export function ThemeProvider({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <>{children}</>
}

