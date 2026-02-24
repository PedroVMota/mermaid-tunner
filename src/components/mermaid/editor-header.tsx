"use client"

import Link from "next/link"
import { Code2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EditorHeader() {
  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/50 bg-white/80 px-4 backdrop-blur-md dark:border-white/10 dark:bg-[#0a0a1a]/80">
      {/* Left: Back + Logo */}
      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <Link href="/">
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20">
            <Code2 className="size-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              Diagram Tuner
            </span>
            <span className="hidden text-[10px] text-zinc-500 dark:text-zinc-400 sm:block">
              Mermaid Editor
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2" />
    </header>
  )
}
