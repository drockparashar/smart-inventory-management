"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { products } from "@/data/products"

// Group products by category and calculate total stock for each
const getCategoryData = () => {
  const categoryMap = products.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = 0
      }
      acc[product.category] += product.stockLevel
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
}

const data = getCategoryData()

// Colors for the pie chart
const COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#8b5cf6", "#ec4899"]

export default function InventoryOverview() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} units`, "Stock"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
