"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, GitBranch, Users, Database, Workflow, Zap, Code2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const diagramTypes = [
  {
    name: "Flowchart",
    icon: Workflow,
    code: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]`,
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Sequence",
    icon: Users,
    code: `sequenceDiagram
    Alice->>Bob: Hello!
    Bob-->>Alice: Hi there!
    Alice->>Bob: How are you?`,
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Class",
    icon: Database,
    code: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal: +int age
    Animal: +move()`,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Git Graph",
    icon: GitBranch,
    code: `gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop`,
    color: "from-emerald-500 to-teal-500",
  },
]

const floatingSnippets = [
  { code: "graph LR", x: 15, y: 20, delay: 0 },
  { code: "A --> B", x: 75, y: 15, delay: 0.5 },
  { code: "sequenceDiagram", x: 10, y: 70, delay: 1 },
  { code: "Alice->>Bob", x: 80, y: 75, delay: 1.5 },
  { code: "classDiagram", x: 5, y: 45, delay: 2 },
  { code: "commit", x: 85, y: 45, delay: 2.5 },
]

function FloatingCode({ code, x, y, delay }: { code: string; x: number; y: number; delay: number }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        "absolute font-mono text-xs text-pink-400/40 transition-all duration-1000 select-none pointer-events-none",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {code}
    </div>
  )
}

function DiagramCard({ name, icon: Icon, code, color, index }: typeof diagramTypes[0] & { index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300",
        "hover:border-pink-500/50 hover:bg-white/10 hover:scale-[1.02]"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient glow on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300 bg-gradient-to-br",
          color,
          hovered && "opacity-10"
        )}
      />

      <div className="relative z-10">
        <div className={cn("inline-flex rounded-lg bg-gradient-to-br p-2.5 mb-4", color)}>
          <Icon className="size-5 text-white" />
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>

        {/* Code preview */}
        <pre className="text-xs text-zinc-400 font-mono bg-black/30 rounded-lg p-3 overflow-hidden">
          <code className="line-clamp-4">{code}</code>
        </pre>
      </div>

      {/* Animated border */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r transition-all duration-500",
          color,
          hovered ? "w-full" : "w-0"
        )}
      />
    </div>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a1a]">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(233,69,96,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(233,69,96,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(233,69,96,0.15)_0%,transparent_70%)]" />

      {/* Floating code snippets */}
      {mounted && floatingSnippets.map((snippet, i) => (
        <FloatingCode key={i} {...snippet} />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Hero section */}
        <div
          className={cn(
            "flex flex-col items-center text-center max-w-4xl mx-auto transition-all duration-1000",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm mb-8">
            <Sparkles className="size-4" />
            <span>Code to Visuals, Instantly</span>
          </div>

          {/* Logo/Icon */}
          <div className="relative mb-8">
            <div className="absolute inset-0 blur-3xl bg-pink-500/30 rounded-full scale-150" />
            <div className="relative size-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-pink-500/25">
              <Code2 className="size-10 text-white" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">Diagram</span>
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 bg-clip-text text-transparent">
              Tuner
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
            Turn simple text into stunning diagrams. Flowcharts, sequences,
            classes, and more with instant preview.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 px-8 py-6 text-lg rounded-xl shadow-lg shadow-pink-500/25 transition-all hover:shadow-xl hover:shadow-pink-500/30 hover:scale-105"
            >
              <Link href="/editor" className="flex items-center gap-2">
                Open Editor
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </div>

          {/* Features highlight */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-500 mb-20">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-pink-500" />
              <span>Instant Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-pink-500" />
              <span>Export PNG/SVG</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-pink-500" />
              <span>Dark Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-pink-500" />
              <span>No Account Needed</span>
            </div>
          </div>
        </div>

        {/* Diagram types grid */}
        <div
          className={cn(
            "w-full max-w-5xl mx-auto transition-all duration-1000 delay-300",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            Supported Diagram Types
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {diagramTypes.map((type, i) => (
              <DiagramCard key={type.name} {...type} index={i} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-zinc-600 text-sm">
          <p>Open source diagram editor</p>
        </footer>
      </div>
    </div>
  )
}
