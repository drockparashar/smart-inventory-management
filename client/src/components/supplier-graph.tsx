"use client"

import { useEffect, useRef, useState } from "react"
import { ForceGraph2D } from "react-force-graph"
import { suppliers } from "@/data/suppliers"
import { products } from "@/data/products"

interface Node {
  id: string
  name: string
  type: "supplier" | "product"
  val: number
  color?: string
}

interface Link {
  source: string
  target: string
  value: number
}

export default function SupplierGraph() {
  const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] })
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Prepare graph data
  useEffect(() => {
    // Create nodes for suppliers and products
    const nodes: Node[] = [
      ...suppliers.map((s) => ({
        id: s.id,
        name: s.name,
        type: "supplier" as const,
        val: 20,
        color: s.reliability === "high" ? "#16a34a" : s.reliability === "medium" ? "#d97706" : "#dc2626",
      })),
      ...products.map((p) => ({
        id: p.id,
        name: p.name,
        type: "product" as const,
        val: 10,
        color: "#2563eb",
      })),
    ]

    // Create links between suppliers and products
    const links: Link[] = products.map((p) => ({
      source: p.supplierId,
      target: p.id,
      value: 1,
    }))

    setGraphData({ nodes, links })
  }, [])

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  return (
    <div ref={containerRef} className="h-full w-full">
      {graphData.nodes.length > 0 && (
        <ForceGraph2D
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          nodeLabel={(node: any) => `${node.name} (${node.type})`}
          nodeColor={(node: any) => node.color}
          linkWidth={2}
          linkColor={() => "#999"}
          cooldownTicks={100}
          onNodeHover={(node: any) => {
            document.body.style.cursor = node ? "pointer" : "default"
          }}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name
            const fontSize = 12 / globalScale
            ctx.font = `${fontSize}px Sans-Serif`
            const textWidth = ctx.measureText(label).width
            const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2)

            ctx.fillStyle = node.color
            ctx.beginPath()
            ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false)
            ctx.fill()

            ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y + node.val + 2, bckgDimensions[0], bckgDimensions[1])

            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillStyle = "#000"
            ctx.fillText(label, node.x, node.y + node.val + 2 + bckgDimensions[1] / 2)
          }}
        />
      )}
    </div>
  )
}
