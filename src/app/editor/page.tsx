import type { Metadata } from "next"
import { MermaidEditor } from "@/components/mermaid"
import { EditorHeader } from "@/components/mermaid/editor-header"

export const metadata: Metadata = {
  title: "Editor | Mermaid Diagram Editor",
  description: "Create and preview Mermaid diagrams in real-time",
}

export default function EditorPage() {
  return (
    <div className="flex h-screen flex-col bg-zinc-100 dark:bg-[#0f0f23]">
      <EditorHeader />
      <main className="flex flex-1 overflow-hidden">
        <MermaidEditor />
      </main>
    </div>
  )
}
