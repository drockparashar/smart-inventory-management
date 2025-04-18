"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { products } from "@/data/products"

// Generate forecast data based on current stock levels
const generateForecastData = () => {
  // Start with current stock levels
  const initialStock = products.reduce((sum, p) => sum + p.stockLevel, 0)

  // Generate 30 days of forecast data
  return Array.from({ length: 30 }, (_, i) => {
    // Simulate daily consumption (random between 2-5% of current stock)
    const dailyConsumption = Math.floor(initialStock * (0.02 + Math.random() * 0.03))

    // Simulate reorders (random chance of receiving new stock)
    const reorderReceived = i % 7 === 0 ? Math.floor(Math.random() * 50) + 20 : 0

    return {
      day: i + 1,
      stock: Math.max(0, initialStock - dailyConsumption * i + (i > 0 ? reorderReceived : 0)),
      reorder: reorderReceived > 0 ? reorderReceived : undefined,
    }
  })
}

const data = generateForecastData()

export default function InventoryChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" label={{ value: "Days", position: "insideBottomRight", offset: -10 }} />
        <YAxis label={{ value: "Stock Level", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="stock" stroke="#2563eb" activeDot={{ r: 8 }} name="Projected Stock" />
        <Line type="monotone" dataKey="reorder" stroke="#16a34a" strokeDasharray="5 5" name="Reorder Received" />
      </LineChart>
    </ResponsiveContainer>
  )
}
