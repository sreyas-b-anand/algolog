"use client"

import { ThemeProvider } from "next-themes"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./react-query"
import { Toaster } from "sonner"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  )
}