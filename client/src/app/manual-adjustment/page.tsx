"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowDown, ArrowUp, Check, Loader2, MinusCircle, PlusCircle, Save, Search } from "lucide-react"
import { type Product, products as initialProducts } from "@/data/products"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ManualAdjustmentPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [adjustments, setAdjustments] = useState<Record<string, number>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle stock adjustment
  const handleAdjustment = (productId: string, amount: number) => {
    const currentAdjustment = adjustments[productId] || 0
    const newAdjustment = currentAdjustment + amount

    // Find the product to check if the adjustment would result in negative stock
    const product = products.find((p) => p.id === productId)
    if (product && product.stockLevel + newAdjustment < 0) {
      // Don't allow negative stock
      return
    }

    setAdjustments({
      ...adjustments,
      [productId]: newAdjustment,
    })
  }

  // Get the adjusted stock level for a product
  const getAdjustedStock = (product: Product) => {
    const adjustment = adjustments[product.id] || 0
    return product.stockLevel + adjustment
  }

  // Check if a product has any adjustments
  const hasAdjustment = (productId: string) => {
    return adjustments[productId] !== undefined && adjustments[productId] !== 0
  }

  // Save adjustments
  const saveAdjustments = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      // Update product stock levels
      const updatedProducts = products.map((product) => {
        const adjustment = adjustments[product.id] || 0
        if (adjustment !== 0) {
          return {
            ...product,
            stockLevel: product.stockLevel + adjustment,
          }
        }
        return product
      })

      setProducts(updatedProducts)
      setAdjustments({})
      setIsSaving(false)
      setIsSaved(true)

      // Reset saved status after 3 seconds
      setTimeout(() => {
        setIsSaved(false)
      }, 3000)
    }, 1000)
  }

  // Check if there are any adjustments to save
  const hasAdjustments = Object.values(adjustments).some((adj) => adj !== 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manual Adjustment</h1>
        <p className="text-muted-foreground">Adjust inventory levels manually for stock reconciliation</p>
      </div>

      {isSaved && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900">
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Stock levels updated</AlertTitle>
          <AlertDescription>Your inventory adjustments have been saved successfully.</AlertDescription>
        </Alert>
      )}

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
          <CardDescription>Increase or decrease stock levels for inventory reconciliation</CardDescription>
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
                const adjustment = adjustments[product.id] || 0
                const newStock = getAdjustedStock(product)
                const isLowStock = newStock <= product.reorderPoint

                return (
                  <TableRow key={product.id} className={hasAdjustment(product.id) ? "bg-muted/50" : ""}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{product.stockLevel}</TableCell>
                    <TableCell className="text-center">
                      {adjustment !== 0 && (
                        <Badge variant={adjustment > 0 ? "default" : "destructive"} className="gap-1">
                          {adjustment > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
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
                        <Button variant="outline" size="icon" onClick={() => handleAdjustment(product.id, -1)}>
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleAdjustment(product.id, 1)}>
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
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {Object.keys(adjustments).length} products with pending adjustments
          </p>
          <Button onClick={saveAdjustments} disabled={!hasAdjustments || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Adjustments
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
