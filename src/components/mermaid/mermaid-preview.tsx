"use client"

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react"
import mermaid from "mermaid"
import { cn } from "@/lib/utils"

interface MermaidPreviewProps {
  code: string
  className?: string
}

export interface MermaidPreviewHandle {
  getContainer: () => HTMLDivElement | null
  isDarkMode: () => boolean
  zoomIn: () => void
  zoomOut: () => void
  fitToScreen: () => void
  getZoom: () => number
  setZoom: (scale: number) => void
}

function getIsDarkMode(): boolean {
  if (typeof window === "undefined") return true
  return document.documentElement.classList.contains("dark")
}

const MIN_ZOOM = 0.25
const MAX_ZOOM = 4
const ZOOM_STEP = 0.25

export const MermaidPreview = forwardRef<MermaidPreviewHandle, MermaidPreviewProps>(
  function MermaidPreview({ code, className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [isDark, setIsDark] = useState(true)
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isPanning, setIsPanning] = useState(false)
    const [panStart, setPanStart] = useState({ x: 0, y: 0 })
    const renderIdRef = useRef(0)

    const handleZoomIn = useCallback(() => {
      setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM))
    }, [])

    const handleZoomOut = useCallback(() => {
      setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM))
    }, [])

    const handleFitToScreen = useCallback(() => {
      if (!wrapperRef.current || !containerRef.current) {
        setZoom(1)
        setPan({ x: 0, y: 0 })
        return
      }

      const svg = containerRef.current.querySelector("svg")
      if (!svg) {
        setZoom(1)
        setPan({ x: 0, y: 0 })
        return
      }

      const wrapperRect = wrapperRef.current.getBoundingClientRect()
      const svgRect = svg.getBoundingClientRect()

      // Get actual SVG dimensions (unscaled)
      const svgWidth = svgRect.width / zoom
      const svgHeight = svgRect.height / zoom

      // Calculate scale to fit container (no padding)
      const scaleX = wrapperRect.width / svgWidth
      const scaleY = wrapperRect.height / svgHeight
      const newZoom = Math.min(scaleX, scaleY, MAX_ZOOM)

      setZoom(Math.max(newZoom, MIN_ZOOM))
      setPan({ x: 0, y: 0 })
    }, [zoom])

    useImperativeHandle(ref, () => ({
      getContainer: () => containerRef.current,
      isDarkMode: () => isDark,
      zoomIn: handleZoomIn,
      zoomOut: handleZoomOut,
      fitToScreen: handleFitToScreen,
      getZoom: () => zoom,
      setZoom: (scale: number) => setZoom(Math.min(Math.max(scale, MIN_ZOOM), MAX_ZOOM)),
    }), [isDark, zoom, handleZoomIn, handleZoomOut, handleFitToScreen])

    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Sync with external store (DOM class)
      setIsDark(getIsDarkMode())

      const handleThemeChange = () => {
        setIsDark(getIsDarkMode())
      }

      window.addEventListener("theme-change", handleThemeChange)
      return () => window.removeEventListener("theme-change", handleThemeChange)
    }, [])

    const renderDiagram = useCallback(async () => {
      if (!containerRef.current || !code.trim()) {
        return
      }

      setError(null)
      renderIdRef.current += 1
      const currentRenderId = `mermaid-diagram-${renderIdRef.current}`

      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
        securityLevel: "strict",
      })

      try {
        const { svg } = await mermaid.render(currentRenderId, code)
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to render diagram"
        setError(errorMessage)
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
        }
      }
    }, [code, isDark])

    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Async render with error state
      renderDiagram()
    }, [renderDiagram])

    // Handle mouse wheel zoom
    const handleWheel = useCallback((e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
        setZoom((prev) => Math.min(Math.max(prev + delta, MIN_ZOOM), MAX_ZOOM))
      }
    }, [])

    // Handle pan start
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        e.preventDefault()
        setIsPanning(true)
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      }
    }, [pan])

    // Handle pan move
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (isPanning) {
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        })
      }
    }, [isPanning, panStart])

    // Handle pan end
    const handleMouseUp = useCallback(() => {
      setIsPanning(false)
    }, [])

    if (error) {
      return (
        <div className={className}>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            <p className="font-medium">Syntax Error</p>
            <pre className="mt-2 overflow-auto text-sm">{error}</pre>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={wrapperRef}
        className={cn(
          "flex h-full w-full items-center justify-center overflow-hidden",
          isPanning && "cursor-grabbing",
          className
        )}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={containerRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isPanning ? "none" : "transform 0.1s ease-out",
          }}
        />
      </div>
    )
  }
)
