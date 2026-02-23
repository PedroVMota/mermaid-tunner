"use client"

import { Maximize2, Minimize2, ZoomIn, ZoomOut, Grid3X3, Sun, Moon, ScanSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PreviewControlsProps {
  onFitToScreen: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
  showGrid: boolean
  onToggleGrid: () => void
  isDark: boolean
  onToggleTheme: () => void
  version?: string
}

export function PreviewControls({
  onFitToScreen,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  isFullscreen,
  showGrid,
  onToggleGrid,
  isDark,
  onToggleTheme,
  version = "0.1.0",
}: PreviewControlsProps) {
  return (
    <>
      {/* Top-right: Zoom controls */}
      <div className="absolute right-3 top-3 flex gap-1 rounded-lg bg-white/80 p-1 shadow-sm backdrop-blur-sm dark:bg-zinc-800/80">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onFitToScreen}
          title="Fit to screen"
        >
          <ScanSearch className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onZoomIn}
          title="Zoom in"
        >
          <ZoomIn className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onZoomOut}
          title="Zoom out"
        >
          <ZoomOut className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="size-4" />
          ) : (
            <Maximize2 className="size-4" />
          )}
        </Button>
      </div>

      {/* Bottom-center: Grid */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-lg bg-white/80 p-1 shadow-sm backdrop-blur-sm dark:bg-zinc-800/80">
        <Button
          variant={showGrid ? "secondary" : "ghost"}
          size="icon"
          className={cn("size-7", showGrid && "bg-zinc-200 dark:bg-zinc-700")}
          onClick={onToggleGrid}
          title="Toggle grid"
        >
          <Grid3X3 className="size-4" />
        </Button>
      </div>

      {/* Bottom-right: Version + Theme */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-white/80 px-2 py-1 shadow-sm backdrop-blur-sm dark:bg-zinc-800/80">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">v{version}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onToggleTheme}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </>
  )
}
