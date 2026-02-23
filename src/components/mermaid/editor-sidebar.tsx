"use client"

import { useState } from "react"
import { ChevronUp, Settings2 } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { MERMAID_SAMPLES, SAMPLE_NAMES } from "@/lib/mermaid-samples"
import { cn } from "@/lib/utils"

interface EditorSidebarProps {
  onSampleSelect: (code: string) => void
  selectedSample: string | null
}

const CHIP_COLORS: Record<string, { base: string; active: string }> = {
  Flowchart: {
    base: "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-500/40 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30",
    active: "border-blue-500 bg-blue-500 text-white dark:border-blue-500 dark:bg-blue-500",
  },
  Class: {
    base: "border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-500/40 dark:bg-purple-500/20 dark:text-purple-400 dark:hover:bg-purple-500/30",
    active: "border-purple-500 bg-purple-500 text-white dark:border-purple-500 dark:bg-purple-500",
  },
  Sequence: {
    base: "border-green-300 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-500/40 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30",
    active: "border-green-500 bg-green-500 text-white dark:border-green-500 dark:bg-green-500",
  },
  "Entity Relationship": {
    base: "border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-500/40 dark:bg-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500/30",
    active: "border-orange-500 bg-orange-500 text-white dark:border-orange-500 dark:bg-orange-500",
  },
  State: {
    base: "border-pink-300 bg-pink-50 text-pink-700 hover:bg-pink-100 dark:border-pink-500/40 dark:bg-pink-500/20 dark:text-pink-400 dark:hover:bg-pink-500/30",
    active: "border-pink-500 bg-pink-500 text-white dark:border-pink-500 dark:bg-pink-500",
  },
  Mindmap: {
    base: "border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-500/40 dark:bg-cyan-500/20 dark:text-cyan-400 dark:hover:bg-cyan-500/30",
    active: "border-cyan-500 bg-cyan-500 text-white dark:border-cyan-500 dark:bg-cyan-500",
  },
  Git: {
    base: "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/30",
    active: "border-rose-500 bg-rose-500 text-white dark:border-rose-500 dark:bg-rose-500",
  },
  Pie: {
    base: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30",
    active: "border-amber-500 bg-amber-500 text-white dark:border-amber-500 dark:bg-amber-500",
  },
  Quadrant: {
    base: "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-indigo-500/20 dark:text-indigo-400 dark:hover:bg-indigo-500/30",
    active: "border-indigo-500 bg-indigo-500 text-white dark:border-indigo-500 dark:bg-indigo-500",
  },
  Gantt: {
    base: "border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:border-teal-500/40 dark:bg-teal-500/20 dark:text-teal-400 dark:hover:bg-teal-500/30",
    active: "border-teal-500 bg-teal-500 text-white dark:border-teal-500 dark:bg-teal-500",
  },
  Timeline: {
    base: "border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-500/40 dark:bg-violet-500/20 dark:text-violet-400 dark:hover:bg-violet-500/30",
    active: "border-violet-500 bg-violet-500 text-white dark:border-violet-500 dark:bg-violet-500",
  },
  "User Journey": {
    base: "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30",
    active: "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-500 dark:bg-emerald-500",
  },
}

export function EditorSidebar({ onSampleSelect, selectedSample }: EditorSidebarProps) {
  const [samplesOpen, setSamplesOpen] = useState(true)

  const handleSelect = (name: string) => {
    onSampleSelect(MERMAID_SAMPLES[name].code)
  }

  return (
    <aside className="flex w-80 shrink-0 flex-col gap-3 overflow-y-auto">
      <Collapsible open={samplesOpen} onOpenChange={setSamplesOpen}>
        <div className="rounded-lg border border-zinc-200/50 bg-white/70 backdrop-blur-md dark:border-zinc-700/50 dark:bg-zinc-900/60">
          <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100">
            <span className="flex items-center gap-2">
              <Settings2 className="size-4 text-zinc-500 dark:text-zinc-400" />
              Sample Diagrams
            </span>
            <ChevronUp
              className={cn(
                "size-4 text-zinc-500 transition-transform dark:text-zinc-400",
                !samplesOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-2 px-4 pb-4">
              {SAMPLE_NAMES.map((name) => {
                const isActive = selectedSample === name
                const colors = CHIP_COLORS[name]
                return (
                  <button
                    key={name}
                    onClick={() => handleSelect(name)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-medium transition-all",
                      isActive ? colors.active : colors.base
                    )}
                  >
                    {name}
                  </button>
                )
              })}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </aside>
  )
}
