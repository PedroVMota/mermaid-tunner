"use client"

import { useState } from "react"
import {
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Sparkles,
  Code2,
  Settings,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MERMAID_SAMPLES, SAMPLE_NAMES } from "@/lib/mermaid-samples"
import { cn } from "@/lib/utils"
import { CodeEditor } from "./code-editor"

interface EditorSidebarProps {
  code: string
  onCodeChange: (code: string) => void
  onSampleSelect: (code: string) => void
  selectedSample: string | null
  onExportPng: (scale?: number) => void
  onExportSvg: () => void
  onCopyImage: () => void
  onOpenDrawio: () => void
  className?: string
  style?: React.CSSProperties
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

export function EditorSidebar({
  code,
  onCodeChange,
  onSampleSelect,
  selectedSample,
  onExportPng,
  onExportSvg,
  onCopyImage,
  onOpenDrawio,
  className,
  style,
}: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState("code")
  const [samplesOpen, setSamplesOpen] = useState(true)
  const [actionsOpen, setActionsOpen] = useState(true)
  const [exportScale, setExportScale] = useState(2)

  const handleSampleClick = (name: string) => {
    onSampleSelect(MERMAID_SAMPLES[name].code)
  }

  const handleExportPng = () => {
    onExportPng(exportScale)
  }

  return (
    <aside
      className={cn(
        "flex flex-col overflow-hidden border-r border-zinc-200/50 bg-zinc-50/80 backdrop-blur-sm dark:border-white/10 dark:bg-[#0a0a1a]/90",
        className
      )}
      style={style}
    >
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 p-3">
          {/* Code/Config Island */}
          <div className="group overflow-hidden rounded-xl border border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:border-pink-500/30 hover:shadow-md hover:shadow-pink-500/5 dark:border-white/10 dark:bg-white/5">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
              <TabsList className="h-11 w-full justify-start gap-0 rounded-t-xl border-b border-zinc-200/80 bg-zinc-50/50 px-0 dark:border-white/10 dark:bg-white/5">
                <TabsTrigger
                  value="code"
                  className="h-full gap-2 rounded-none rounded-tl-xl border-b-2 border-transparent px-4 text-zinc-600 transition-all data-[state=active]:border-pink-500 data-[state=active]:bg-white/80 data-[state=active]:text-zinc-900 data-[state=active]:shadow-none dark:text-zinc-400 dark:data-[state=active]:bg-white/10 dark:data-[state=active]:text-white"
                >
                  <span className="flex size-5 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-cyan-500 shadow-sm">
                    <Code2 className="size-3 text-white" />
                  </span>
                  Code
                </TabsTrigger>
                <TabsTrigger
                  value="config"
                  className="relative h-full gap-2 rounded-none border-b-2 border-transparent px-4 text-zinc-600 transition-all data-[state=active]:border-pink-500 data-[state=active]:bg-white/80 data-[state=active]:text-zinc-900 data-[state=active]:shadow-none dark:text-zinc-400 dark:data-[state=active]:bg-white/10 dark:data-[state=active]:text-white"
                >
                  <span className="flex size-5 items-center justify-center rounded bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm">
                    <Settings className="size-3 text-white" />
                  </span>
                  Config
                  <span className="absolute -right-1 -top-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm">
                    Soon
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="mt-0 rounded-b-xl">
                <div className="h-[280px]">
                  <CodeEditor value={code} onChange={onCodeChange} className="h-full" />
                </div>
              </TabsContent>

              <TabsContent value="config" className="mt-0 rounded-b-xl p-4">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Configuration options coming soon...
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sample Diagrams Island */}
          <div className="group overflow-hidden rounded-xl border border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:border-pink-500/30 hover:shadow-md hover:shadow-pink-500/5 dark:border-white/10 dark:bg-white/5">
            <Collapsible open={samplesOpen} onOpenChange={setSamplesOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100/50 dark:text-zinc-200 dark:hover:bg-white/5">
                <span className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-pink-500 to-rose-500 shadow-sm">
                    <Sparkles className="size-3.5 text-white" />
                  </span>
                  <span>Sample Diagrams</span>
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-zinc-400 transition-transform duration-200 dark:text-zinc-500",
                    !samplesOpen && "-rotate-90"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-wrap gap-1.5 border-t border-zinc-200/80 p-3 dark:border-white/10">
                  {SAMPLE_NAMES.map((name) => {
                    const isActive = selectedSample === name
                    const colors = CHIP_COLORS[name] || {
                      base: "border-zinc-300 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
                      active: "border-zinc-500 bg-zinc-500 text-white",
                    }
                    return (
                      <button
                        key={name}
                        onClick={() => handleSampleClick(name)}
                        className={cn(
                          "shrink-0 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium transition-all",
                          isActive ? colors.active : colors.base
                        )}
                      >
                        {name}
                      </button>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Actions Island */}
          <div className="group overflow-hidden rounded-xl border border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:border-pink-500/30 hover:shadow-md hover:shadow-pink-500/5 dark:border-white/10 dark:bg-white/5">
            <Collapsible open={actionsOpen} onOpenChange={setActionsOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100/50 dark:text-zinc-200 dark:hover:bg-white/5">
                <span className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-purple-500 shadow-sm">
                    <Download className="size-3.5 text-white" />
                  </span>
                  <span>Export & Actions</span>
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-zinc-400 transition-transform duration-200 dark:text-zinc-500",
                    !actionsOpen && "-rotate-90"
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4 border-t border-zinc-200/80 p-4 dark:border-white/10">
                  {/* Export Scale Controls */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Export quality
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {[1, 2, 3, 4, 5, 6].map((scale) => (
                        <Button
                          key={scale}
                          variant={exportScale === scale ? "default" : "outline"}
                          size="sm"
                          onClick={() => setExportScale(scale)}
                          className={cn(
                            "h-7 min-w-[36px] flex-1 px-1 text-xs transition-all",
                            exportScale === scale
                              ? "border-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25 hover:from-pink-600 hover:to-rose-600"
                              : "border-zinc-200 hover:border-pink-500/50 hover:bg-pink-50 dark:border-zinc-700 dark:hover:border-pink-500/50 dark:hover:bg-pink-500/10"
                          )}
                        >
                          {scale}x
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Download Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportPng}
                      className="h-9 min-w-[70px] flex-1 gap-1.5 border-zinc-200 text-xs transition-all hover:border-pink-500/50 hover:bg-pink-50 hover:text-pink-600 dark:border-zinc-700 dark:hover:border-pink-500/50 dark:hover:bg-pink-500/10 dark:hover:text-pink-400"
                    >
                      <Download className="size-3.5 shrink-0" />
                      <span className="font-medium">PNG</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onExportSvg}
                      className="h-9 min-w-[70px] flex-1 gap-1.5 border-zinc-200 text-xs transition-all hover:border-violet-500/50 hover:bg-violet-50 hover:text-violet-600 dark:border-zinc-700 dark:hover:border-violet-500/50 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                    >
                      <Download className="size-3.5 shrink-0" />
                      <span className="font-medium">SVG</span>
                    </Button>
                  </div>

                  {/* Copy Image */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-full gap-2 border-zinc-200 text-xs transition-all hover:border-emerald-500/50 hover:bg-emerald-50 hover:text-emerald-600 dark:border-zinc-700 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                    onClick={onCopyImage}
                  >
                    <Copy className="size-3.5" />
                    <span className="font-medium">Copy to Clipboard</span>
                  </Button>

                  {/* Draw.io Export */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-full gap-2 border-zinc-200 text-xs transition-all hover:border-blue-500/50 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-700 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                    onClick={onOpenDrawio}
                  >
                    <ExternalLink className="size-3.5" />
                    <span className="font-medium">Open in draw.io</span>
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}
