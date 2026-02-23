"use client"

import { useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { GripVertical } from "lucide-react"

interface ResizableHandleProps {
  onResize: (delta: number) => void
  className?: string
}

export function ResizableHandle({ onResize, className }: ResizableHandleProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    let lastX = 0

    const handleMouseMove = (e: MouseEvent) => {
      if (lastX !== 0) {
        const delta = e.clientX - lastX
        onResize(delta)
      }
      lastX = e.clientX
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      lastX = 0
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, onResize])

  return (
    <div
      className={cn(
        "group relative flex w-1.5 shrink-0 cursor-col-resize select-none items-center justify-center",
        "bg-zinc-200 transition-colors hover:bg-pink-400 dark:bg-zinc-800 dark:hover:bg-pink-500",
        isDragging && "bg-pink-500 dark:bg-pink-500",
        className
      )}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute inset-y-0 -left-1 -right-1" />
      <GripVertical
        className={cn(
          "size-3 text-zinc-400 transition-colors group-hover:text-white",
          isDragging && "text-white"
        )}
      />
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
      )}
    </div>
  )
}
