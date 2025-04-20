"use client"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  Loader2,
  MinusCircle,
  PlusCircle,
  Save,
  Search,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

export type Product = {
  _id: string
  name: string
  sku: string
  category: string
  stockLevel: number
  reorderPoint: number
}

type CategoryData = {
  name: string
  value: number
}

type StockHistoryData = {
  date: string
  adjustment: number
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products", err))
  }, [])

  const filteredProducts = products.filter((product) =>
    [product.name, product.sku, product.category]
      .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Graph Data for Pie Chart (Stock Levels by Category)
  const categoryData: CategoryData[] = products.reduce((acc, product) => {
    const existingCategory = acc.find((cat) => cat.name === product.category)
    if (existingCategory) {
      existingCategory.value += product.stockLevel
    } else {
      acc.push({ name: product.category, value: product.stockLevel })
    }
    return acc
  }, [] as CategoryData[])

  // Graph Data for Line Chart (Stock Adjustment History)
  const stockHistoryData: StockHistoryData[] = products.map((product) => ({
    date: product.name, // Placeholder for date, you can change it to actual dates from your data if needed
    adjustment: product.stockLevel, // Placeholder for adjustment, you can adjust it based on history data
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of inventory and adjustments</p>
      </div>

      {/* Stock Levels by Category (Pie Chart) */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels by Category</CardTitle>
          <CardDescription>Visual representation of stock levels per category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value > 50 ? "#82ca9d" : "#ff8042"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>


      {/* Manual Adjustment Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Stock Adjustment</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            Increase or decrease stock levels for inventory reconciliation
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Current Stock</TableHead>
                <TableHead className="text-center">Adjustment</TableHead>
                <TableHead className="text-center">New Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const adjustment = 0 // Here you can calculate any adjustments
                const newStock = product.stockLevel + adjustment
                const isLowStock = newStock <= product.reorderPoint

                return (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{product.stockLevel}</TableCell>
                    <TableCell className="text-center">
                      {adjustment !== 0 && (
                        <Badge variant={adjustment > 0 ? "default" : "destructive"} className="gap-1">
                          {adjustment > 0 ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                          {Math.abs(adjustment)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span>{newStock}</span>
                        {isLowStock && <AlertCircle className="h-4 w-4 text-amber-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon">
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
