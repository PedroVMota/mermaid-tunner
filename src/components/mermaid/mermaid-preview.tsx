"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import mermaid from "mermaid"

interface MermaidPreviewProps {
  code: string
  className?: string
}

function getIsDarkMode(): boolean {
  if (typeof window === "undefined") return true
  return document.documentElement.classList.contains("dark")
}

export function MermaidPreview({ code, className }: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(true)
  const renderIdRef = useRef(0)

  useEffect(() => {
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
    renderDiagram()
  }, [renderDiagram])

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
      ref={containerRef}
      className={className}
    />
  )
}
