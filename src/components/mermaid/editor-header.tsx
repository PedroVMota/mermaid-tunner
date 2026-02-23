"use client"

import { Menu, Github, History, Share2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MermaidLogo } from "./mermaid-logo"

interface EditorHeaderProps {
  onMenuToggle?: () => void
  onShare?: () => void
  onSave?: () => void
}

export function EditorHeader({ onMenuToggle, onShare, onSave }: EditorHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-[#1a1a2e]">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="size-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <Menu className="size-5" />
        </Button> */}
        <div className="flex items-center gap-2">
          {/* <MermaidLogo className="size-6 text-pink-500" /> */}
          <span className="font-semibold text-zinc-900 dark:text-white">
            Mermaid Live Editor
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
      </div>
    </header>
  )
}
