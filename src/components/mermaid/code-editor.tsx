"use client"

import { useEffect, useState } from "react"
import Editor, { type OnMount } from "@monaco-editor/react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function CodeEditor({ value, onChange, className }: CodeEditorProps) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    checkTheme()

    const handleThemeChange = () => {
      checkTheme()
    }

    window.addEventListener("theme-change", handleThemeChange)
    return () => window.removeEventListener("theme-change", handleThemeChange)
  }, [])

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Register Mermaid language
    monaco.languages.register({ id: "mermaid" })

    // Define Mermaid syntax highlighting
    monaco.languages.setMonarchTokensProvider("mermaid", {
      keywords: [
        "graph", "flowchart", "sequenceDiagram", "classDiagram", "stateDiagram",
        "erDiagram", "gantt", "pie", "gitGraph", "mindmap", "timeline",
        "quadrantChart", "sankey", "journey", "block", "packet", "architecture",
        "TD", "TB", "BT", "RL", "LR",
        "participant", "actor", "activate", "deactivate", "Note", "loop", "alt", "else", "opt", "par", "and", "critical", "break",
        "class", "title", "section", "state", "note", "direction",
        "commit", "branch", "checkout", "merge",
        "dateFormat", "axisFormat", "excludes", "includes",
        "subgraph", "end"
      ],
      operators: ["-->", "---", "-.->", "==>", "~~~", "->", "--", "-.-", "==", ":::", "%%"],
      symbols: /[=><!~?:&|+\-*\/\^%]+/,

      tokenizer: {
        root: [
          // Comments
          [/%%.*$/, "comment"],
          // Keywords
          [/\b(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap|timeline|quadrantChart|sankey|journey|block|packet|architecture)\b/, "keyword"],
          [/\b(TD|TB|BT|RL|LR)\b/, "keyword"],
          [/\b(participant|actor|activate|deactivate|Note|loop|alt|else|opt|par|and|critical|break)\b/, "keyword"],
          [/\b(class|title|section|state|note|direction)\b/, "keyword"],
          [/\b(subgraph|end)\b/, "keyword"],
          [/\b(commit|branch|checkout|merge)\b/, "keyword"],
          [/\b(dateFormat|axisFormat|excludes|includes)\b/, "keyword"],
          // Arrows and operators
          [/-->|---|-\.->|==>|~~~|->|--|==|:::/, "operator"],
          // Node IDs and labels
          [/\[[^\]]+\]/, "string"],
          [/\([^)]+\)/, "string"],
          [/\{[^}]+\}/, "string"],
          [/\(\([^)]+\)\)/, "string"],
          [/\[\[[^\]]+\]\]/, "string"],
          // Strings
          [/"[^"]*"/, "string"],
          [/'[^']*'/, "string"],
          // Numbers
          [/\d+/, "number"],
          // Identifiers
          [/[a-zA-Z_]\w*/, "identifier"],
        ],
      },
    })

    // Set editor options
    editor.updateOptions({
      fontSize: 13,
      lineHeight: 20,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      automaticLayout: true,
      padding: { top: 12, bottom: 12 },
      lineNumbers: "on",
      folding: false,
      glyphMargin: true,
      lineDecorationsWidth: 8,
      lineNumbersMinChars: 2,
      renderLineHighlight: "line",
      scrollbar: {
        vertical: "auto",
        horizontal: "hidden",
        verticalScrollbarSize: 8,
      },
    })
  }

  return (
    <div className={className}>
      <Editor
        height="100%"
        language="mermaid"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        theme={isDark ? "vs-dark" : "light"}
        onMount={handleEditorMount}
        options={{
          fontSize: 13,
          lineHeight: 20,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          lineNumbers: "on",
          folding: false,
          glyphMargin: true,
          lineDecorationsWidth: 8,
          lineNumbersMinChars: 2,
          renderLineHighlight: "line",
        }}
        loading={
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Loading editor...
          </div>
        }
      />
    </div>
  )
}
