import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <main className="flex max-w-md flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Mermaid Diagram Editor
          </h1>
          <p className="text-lg text-muted-foreground">
            Create flowcharts, sequence diagrams, and more with live preview.
          </p>
        </div>

        <Button asChild size="lg">
          <Link href="/editor">Open Editor</Link>
        </Button>

        <div className="mt-8 grid gap-4 text-left">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base">Flowcharts</CardTitle>
              <CardDescription>
                Create process flows and decision trees
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base">Sequence Diagrams</CardTitle>
              <CardDescription>
                Visualize interactions between systems
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base">Class Diagrams</CardTitle>
              <CardDescription>
                Model object-oriented structures
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  )
}
