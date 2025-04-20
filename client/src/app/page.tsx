"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Package, Truck } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

// Define types for the state variables
interface Product {
  id: string
  name: string
  sku: string
  stockLevel: number
  reorderPoint: number
  category: string
  supplierId: string
}

interface Supplier {
  id: string
  name: string
}

interface Constraints {
  warehouseCapacity: number
}

interface ReorderRecommendation {
  productId: string
  productName: string
  sku: string
  reorderQty: number
  supplier: string
}

export default function Dashboard() {
  // State to hold dynamic data
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [constraints, setConstraints] = useState<Constraints | null>(null)
  const [recommendations, setRecommendations] = useState<ReorderRecommendation[]>([])

  // Fetching data on component mount
  useEffect(() => {
    async function fetchData() {
      const [prodRes, supRes, consRes, recRes] = await Promise.all([
        fetch("http://localhost:5000/api/products").then(res => res.json()),
        fetch("http://localhost:5000/api/suppliers").then(res => res.json()),
        fetch("http://localhost:5000/api/constraints").then(res => res.json()),
        fetch("http://localhost:5000/api/ai/recommendations").then(res => res.json())
      ])
      setProducts(prodRes as Product[])
      setSuppliers(supRes as Supplier[])
      setConstraints(consRes as Constraints)
      setRecommendations(recRes.recommendations as ReorderRecommendation[])
      console.log(prodRes, supRes, consRes, recRes)
    }

    fetchData()
  }, [])

  // Guard rendering until data is loaded
  if (!constraints || products.length === 0 || suppliers.length === 0) {
    return <div>Loading dashboard...</div>
  }

  // Calculate metrics
  const totalStock = products.reduce((sum, p) => sum + p.stockLevel, 0)
  const lowStockItems = products.filter((p) => p.stockLevel <= p.reorderPoint).length
  const warehouseUtilization = Math.round((totalStock / constraints.warehouseCapacity) * 100)

  // Data for Pie chart showing low stock vs normal stock
  const stockData = [
    { name: 'Low Stock', value: lowStockItems },
    { name: 'Normal Stock', value: products.length - lowStockItems }
  ]

  // Data for Bar chart showing stock levels by category
  const categoryData = products.reduce((acc, product) => {
    const category = product.category
    if (!acc[category]) acc[category] = 0
    acc[category] += product.stockLevel
    return acc
  }, {})

  const categoryChartData = Object.keys(categoryData).map(category => ({
    name: category,
    stockLevel: categoryData[category]
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your inventory management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {products.reduce((acc, p) => acc.add(p.category), new Set<string>()).size} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items below reorder point</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warehouse Utilization</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouseUtilization}%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-secondary">
              <div
                className={`h-2 rounded-full ${warehouseUtilization > 80 ? "bg-red-500" : "bg-blue-500"}`}
                style={{ width: `${warehouseUtilization}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Active supplier relationships</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Low Stock Distribution</CardTitle>
            <CardDescription>Visualize the low stock vs normal stock</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#FF8042" : "#0088FE"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Stock Levels by Category</CardTitle>
            <CardDescription>Bar chart of stock levels across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stockLevel" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-8 mb-4">AI Reorder Recommendations</h2>
        <div className="space-y-3">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <Alert key={rec.productId}>
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertTitle className="flex items-center gap-2">
                  {rec.productName} ({rec.sku})
                  <Badge variant="outline" className="ml-2">
                    Recommended: {rec.reorderQty} units
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  Supplier: <b>{rec.supplier}</b>
                </AlertDescription>
              </Alert>
            ))
          ) : (
            <Alert>
              <AlertTitle>No reorder recommendations at this time</AlertTitle>
              <AlertDescription>Your inventory is optimal</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
      
    </div>
  )
}
