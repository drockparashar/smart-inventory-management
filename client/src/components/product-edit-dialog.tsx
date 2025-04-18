"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/data/products"
import { suppliers } from "@/data/suppliers"

interface ProductEditDialogProps {
  product: Product
  onSave: (product: Product) => void
  onCancel: () => void
}

export default function ProductEditDialog({ product, onSave, onCancel }: ProductEditDialogProps) {
  const [editedProduct, setEditedProduct] = useState<Product>({ ...product })

  const handleChange = (field: keyof Product, value: any) => {
    setEditedProduct({
      ...editedProduct,
      [field]: value,
    })
  }

  const handleNumberChange = (field: keyof Product, value: string) => {
    const numValue = value === "" ? 0 : Number.parseInt(value, 10)
    if (!isNaN(numValue)) {
      handleChange(field, numValue)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Make changes to the product information.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={editedProduct.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right">
              SKU
            </Label>
            <Input
              id="sku"
              value={editedProduct.sku}
              onChange={(e) => handleChange("sku", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={editedProduct.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stockLevel" className="text-right">
              Stock Level
            </Label>
            <Input
              id="stockLevel"
              type="number"
              value={editedProduct.stockLevel}
              onChange={(e) => handleNumberChange("stockLevel", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reorderPoint" className="text-right">
              Reorder Point
            </Label>
            <Input
              id="reorderPoint"
              type="number"
              value={editedProduct.reorderPoint}
              onChange={(e) => handleNumberChange("reorderPoint", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reorderQty" className="text-right">
              Reorder Qty
            </Label>
            <Input
              id="reorderQty"
              type="number"
              value={editedProduct.reorderQty}
              onChange={(e) => handleNumberChange("reorderQty", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="leadTime" className="text-right">
              Lead Time (days)
            </Label>
            <Input
              id="leadTime"
              type="number"
              value={editedProduct.leadTime}
              onChange={(e) => handleNumberChange("leadTime", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">
              Supplier
            </Label>
            <Select value={editedProduct.supplierId} onValueChange={(value) => handleChange("supplierId", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editedProduct)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
