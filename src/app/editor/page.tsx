import type { Metadata } from "next"
import { MermaidEditor } from "@/components/mermaid"
import { EditorHeader } from "@/components/mermaid/editor-header"

export const metadata: Metadata = {
  title: "Editor | Mermaid Diagram Editor",
  description: "Create and preview Mermaid diagrams in real-time",
}

export default function EditorPage() {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-zinc-50 dark:bg-[#0a0a1a]">
      {/* Background grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(233,69,96,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(233,69,96,0.02)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(rgba(233,69,96,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(233,69,96,0.03)_1px,transparent_1px)]" />
      {/* Radial gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(233,69,96,0.08)_0%,transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(233,69,96,0.1)_0%,transparent_50%)]" />

      <EditorHeader />
      <main className="relative z-10 flex flex-1 overflow-hidden">
        <MermaidEditor />
      </main>
    </div>
  )
}
