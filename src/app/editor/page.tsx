import type { Metadata } from "next"
import Link from "next/link"
import { MermaidEditor } from "@/components/mermaid"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export const metadata: Metadata = {
  title: "Editor | Mermaid Diagram Editor",
  description: "Create and preview Mermaid diagrams in real-time",
}

export default function EditorPage() {
  return (
    <div className="flex h-screen flex-col bg-zinc-100 dark:bg-zinc-950">
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-lg font-bold text-transparent">
          Mermaid Editor
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/"
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden p-4">
        <MermaidEditor />
      </main>
    </div>
  )
}
