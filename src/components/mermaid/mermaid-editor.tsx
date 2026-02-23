"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MermaidPreview, type MermaidPreviewHandle } from "./mermaid-preview"
import { EditorSidebar } from "./editor-sidebar"
import { PreviewControls } from "./preview-controls"
import { ResizableHandle } from "@/components/ui/resizable-handle"
import { MERMAID_SAMPLES } from "@/lib/mermaid-samples"
import { cn } from "@/lib/utils"
import {
  exportDiagram,
  copyDiagramToClipboard,
  type ExportFormat,
} from "@/lib/export-utils"

const MIN_SIDEBAR_WIDTH = 280
const MAX_SIDEBAR_WIDTH = 600
const DEFAULT_SIDEBAR_WIDTH = 360

const DEFAULT_DIAGRAM = `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`

export function MermaidEditor() {
  const [code, setCode] = useState(DEFAULT_DIAGRAM)
  const [selectedSample, setSelectedSample] = useState<string | null>("Flowchart")
  const [showGrid, setShowGrid] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const previewRef = useRef<MermaidPreviewHandle>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  const handleResize = useCallback((delta: number) => {
    setSidebarWidth((prev) => {
      const newWidth = prev + delta
      return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, newWidth))
    })
  }, [])

  useEffect(() => {
    const checkTheme = () => {
      if (typeof window !== "undefined") {
        setIsDark(document.documentElement.classList.contains("dark"))
      }
    }

    checkTheme()

    const handleThemeChange = () => {
      checkTheme()
    }

    window.addEventListener("theme-change", handleThemeChange)
    return () => window.removeEventListener("theme-change", handleThemeChange)
  }, [])

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

  const handleExport = async (format: ExportFormat, scale: number = 2) => {
    const container = previewRef.current?.getContainer()
    if (!container) {
      return
    }

    try {
      const darkMode = previewRef.current?.isDarkMode() ?? false
      await exportDiagram(container, { format, scale, darkMode })
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const handleExportPng = (scale?: number) => {
    handleExport("png", scale ?? 2)
  }

  const handleExportSvg = () => {
    handleExport("svg", 1)
  }

  const handleCopyImage = async () => {
    const container = previewRef.current?.getContainer()
    if (!container) {
      return
    }

    try {
      const darkMode = previewRef.current?.isDarkMode() ?? false
      await copyDiagramToClipboard(container, 2, darkMode)
    } catch (error) {
      console.error("Copy image failed:", error)
    }
  }

  const handleToggleTheme = useCallback(() => {
    const html = document.documentElement
    const newIsDark = !html.classList.contains("dark")

    if (newIsDark) {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }

    setIsDark(newIsDark)
    window.dispatchEvent(new Event("theme-change"))
  }, [])

  const handleToggleFullscreen = useCallback(() => {
    if (!previewContainerRef.current) return

    if (!document.fullscreenElement) {
      previewContainerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Sidebar */}
      <EditorSidebar
        code={code}
        onCodeChange={handleCodeChange}
        onSampleSelect={handleSampleSelect}
        selectedSample={selectedSample}
        onExportPng={handleExportPng}
        onExportSvg={handleExportSvg}
        onCopyImage={handleCopyImage}
        style={{ width: sidebarWidth }}
        className="shrink-0"
      />

      {/* Resize Handle */}
      <ResizableHandle onResize={handleResize} />

      {/* Preview Panel */}
      <div
        ref={previewContainerRef}
        className={cn(
          "relative flex-1 bg-zinc-100 dark:bg-zinc-950",
          isFullscreen && "fixed inset-0 z-50"
        )}
      >
        <div
          className={cn(
            "h-full w-full overflow-hidden",
            showGrid && "bg-grid"
          )}
        >
          <MermaidPreview ref={previewRef} code={code} className="h-full w-full" />
        </div>

        <PreviewControls
          onFitToScreen={() => previewRef.current?.fitToScreen()}
          onZoomIn={() => previewRef.current?.zoomIn()}
          onZoomOut={() => previewRef.current?.zoomOut()}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
        />
      </div>
    </div>
  )
}
