export type ExportFormat = "svg" | "png"
export type ExportQuality = "x1" | "x2" | "x3" | "custom"

interface ExportOptions {
  format: ExportFormat
  scale: number
  filename?: string
  darkMode?: boolean
}

const BACKGROUND_COLORS = {
  light: "#ffffff",
  dark: "#18181b", // zinc-900
} as const

interface SvgDimensions {
  width: number
  height: number
}

/**
 * Extracts SVG content from a container element
 */
export function getSvgFromContainer(container: HTMLElement): SVGSVGElement | null {
  return container.querySelector("svg")
}

/**
 * Gets the actual dimensions of an SVG element
 */
function getSvgDimensions(svg: SVGSVGElement): SvgDimensions {
  // Try viewBox first (most reliable for Mermaid diagrams)
  const viewBox = svg.getAttribute("viewBox")
  if (viewBox) {
    const parts = viewBox.split(/\s+|,/).map(Number)
    if (parts.length === 4 && !parts.some(isNaN)) {
      return { width: parts[2], height: parts[3] }
    }
  }

  // Try getBoundingClientRect for rendered size
  const rect = svg.getBoundingClientRect()
  if (rect.width > 0 && rect.height > 0) {
    return { width: rect.width, height: rect.height }
  }

  // Try getBBox for content bounds
  try {
    const bbox = svg.getBBox()
    if (bbox.width > 0 && bbox.height > 0) {
      return { width: bbox.width, height: bbox.height }
    }
  } catch {
    // getBBox can throw if SVG is not rendered
  }

  // Try explicit width/height attributes (parse numeric value)
  const widthAttr = svg.getAttribute("width")
  const heightAttr = svg.getAttribute("height")
  if (widthAttr && heightAttr) {
    const width = parseFloat(widthAttr)
    const height = parseFloat(heightAttr)
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      return { width, height }
    }
  }

  // Fallback to reasonable defaults
  return { width: 800, height: 600 }
}

/**
 * Clones and prepares SVG for export with proper styling
 */
function prepareSvgForExport(svg: SVGSVGElement): { svg: SVGSVGElement; dimensions: SvgDimensions } {
  const clone = svg.cloneNode(true) as SVGSVGElement
  const dimensions = getSvgDimensions(svg)

  // Set explicit numeric dimensions
  clone.setAttribute("width", dimensions.width.toString())
  clone.setAttribute("height", dimensions.height.toString())

  // Ensure viewBox is set
  if (!clone.getAttribute("viewBox")) {
    clone.setAttribute("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
  }

  // Add required namespaces
  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  }
  if (!clone.getAttribute("xmlns:xlink")) {
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink")
  }

  return { svg: clone, dimensions }
}

/**
 * Converts SVG element to a base64 data URL (avoids CORS tainted canvas issues)
 */
function svgToBase64DataUrl(svg: SVGSVGElement): string {
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svg)
  const base64 = btoa(unescape(encodeURIComponent(svgString)))
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Converts SVG element to a URL-encoded data URL (for SVG download)
 */
function svgToDataUrl(svg: SVGSVGElement): string {
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svg)
  const encoded = encodeURIComponent(svgString)
  return `data:image/svg+xml;charset=utf-8,${encoded}`
}

/**
 * Downloads a file from a data URL or blob
 */
function downloadFile(data: string | Blob, filename: string): void {
  const link = document.createElement("a")
  link.download = filename

  if (typeof data === "string") {
    link.href = data
  } else {
    link.href = URL.createObjectURL(data)
  }

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  if (typeof data !== "string") {
    URL.revokeObjectURL(link.href)
  }
}

/**
 * Exports SVG as a downloadable SVG file
 */
export function exportAsSvg(svg: SVGSVGElement, filename = "diagram.svg"): void {
  const { svg: preparedSvg } = prepareSvgForExport(svg)
  const dataUrl = svgToDataUrl(preparedSvg)
  downloadFile(dataUrl, filename)
}

/**
 * Exports SVG as a PNG with specified scale
 */
export async function exportAsPng(
  svg: SVGSVGElement,
  scale: number,
  darkMode: boolean,
  filename = "diagram.png"
): Promise<void> {
  const { svg: preparedSvg, dimensions } = prepareSvgForExport(svg)
  const { width, height } = dimensions

  // Create scaled canvas
  const canvas = document.createElement("canvas")
  const scaledWidth = Math.ceil(width * scale)
  const scaledHeight = Math.ceil(height * scale)
  canvas.width = scaledWidth
  canvas.height = scaledHeight

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Failed to get canvas context")
  }

  // Enable high quality rendering
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"

  // Create image from SVG using base64 data URL (avoids CORS tainted canvas)
  const img = new Image()
  img.crossOrigin = "anonymous"
  const dataUrl = svgToBase64DataUrl(preparedSvg)

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Fill with background color based on theme
      ctx.fillStyle = darkMode ? BACKGROUND_COLORS.dark : BACKGROUND_COLORS.light
      ctx.fillRect(0, 0, scaledWidth, scaledHeight)

      // Draw the SVG scaled to canvas size
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight)

      // Convert to blob and download
      canvas.toBlob(
        (blob) => {
          if (blob) {
            downloadFile(blob, filename)
            resolve()
          } else {
            reject(new Error("Failed to create PNG blob"))
          }
        },
        "image/png",
        1.0
      )
    }

    img.onerror = () => {
      reject(new Error("Failed to load SVG for PNG export"))
    }

    img.src = dataUrl
  })
}

/**
 * Main export function that handles both formats
 */
export async function exportDiagram(
  container: HTMLElement,
  options: ExportOptions
): Promise<void> {
  const svg = getSvgFromContainer(container)

  if (!svg) {
    throw new Error("No diagram found to export")
  }

  const timestamp = new Date().toISOString().slice(0, 10)
  const baseFilename = options.filename || `mermaid-diagram-${timestamp}`
  const darkMode = options.darkMode ?? false

  if (options.format === "svg") {
    exportAsSvg(svg, `${baseFilename}.svg`)
  } else {
    await exportAsPng(svg, options.scale, darkMode, `${baseFilename}.png`)
  }
}

/**
 * Gets the scale value from quality preset
 */
export function getScaleFromQuality(quality: ExportQuality, customScale?: number): number {
  switch (quality) {
    case "x1":
      return 1
    case "x2":
      return 2
    case "x3":
      return 3
    case "custom":
      return customScale ?? 1
    default:
      return 1
  }
}

/**
 * Copies the diagram as a PNG image to clipboard
 */
export async function copyDiagramToClipboard(
  container: HTMLElement,
  scale: number = 2,
  darkMode: boolean = false
): Promise<void> {
  const svg = getSvgFromContainer(container)
  if (!svg) {
    throw new Error("No diagram found to copy")
  }

  const { svg: preparedSvg, dimensions } = prepareSvgForExport(svg)
  const { width, height } = dimensions

  const canvas = document.createElement("canvas")
  canvas.width = Math.ceil(width * scale)
  canvas.height = Math.ceil(height * scale)

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Failed to get canvas context")
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"

  const img = new Image()
  img.crossOrigin = "anonymous"
  const dataUrl = svgToBase64DataUrl(preparedSvg)

  return new Promise((resolve, reject) => {
    img.onload = async () => {
      ctx.fillStyle = darkMode ? BACKGROUND_COLORS.dark : BACKGROUND_COLORS.light
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      try {
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob(res, "image/png")
        )
        if (!blob) throw new Error("Failed to create blob")

        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ])
        resolve()
      } catch (err) {
        reject(err)
      }
    }

    img.onerror = () => reject(new Error("Failed to load SVG"))
    img.src = dataUrl
  })
}
