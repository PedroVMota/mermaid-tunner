"use client"

import { useState } from "react"
import { Grid3X3 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { MermaidPreview } from "./mermaid-preview"
import { EditorSidebar } from "./editor-sidebar"
import { MERMAID_SAMPLES } from "@/lib/mermaid-samples"
import { cn } from "@/lib/utils"

const DEFAULT_DIAGRAM = `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`

export function MermaidEditor() {
  const [code, setCode] = useState(DEFAULT_DIAGRAM)
  const [selectedSample, setSelectedSample] = useState<string | null>("Flowchart")
  const [showGrid, setShowGrid] = useState(true)

  const handleSampleSelect = (sampleCode: string) => {
    setCode(sampleCode)
    const sampleName = Object.entries(MERMAID_SAMPLES).find(
      ([, sample]) => sample.code === sampleCode
    )?.[0]
    setSelectedSample(sampleName ?? null)
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    setSelectedSample(null)
  }

  return (
    <div className="flex h-full w-full gap-4">
      <EditorSidebar onSampleSelect={handleSampleSelect} selectedSample={selectedSample} />

      <div className="flex flex-1 flex-col gap-4 lg:flex-row">
        {/* Code Panel */}
        <div className="flex flex-1 flex-col rounded-xl border border-zinc-200/50 bg-white/70 backdrop-blur-md dark:border-zinc-700/50 dark:bg-zinc-900/60">
          <div className="flex items-center border-b border-zinc-200/50 px-4 py-3 dark:border-zinc-700/50">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Code</h2>
          </div>
          <div className="flex-1 p-4">
            <Textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="Enter your Mermaid diagram code..."
              className="h-full min-h-[300px] resize-none border-0 bg-transparent font-mono text-sm text-zinc-800 placeholder:text-zinc-400 focus-visible:ring-0 dark:text-zinc-100 dark:placeholder:text-zinc-500 lg:min-h-0"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-1 flex-col rounded-xl border border-zinc-200/50 bg-white/70 backdrop-blur-md dark:border-zinc-700/50 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between border-b border-zinc-200/50 px-4 py-3 dark:border-zinc-700/50">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Preview</h2>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                showGrid
                  ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
                  : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              )}
              aria-label={showGrid ? "Hide grid" : "Show grid"}
            >
              <Grid3X3 className="size-4" />
            </button>
          </div>
          <div
            className={cn(
              "relative flex flex-1 items-center justify-center overflow-auto p-4",
              showGrid && "bg-grid"
            )}
          >
            <MermaidPreview code={code} className="max-h-full max-w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
