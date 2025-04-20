"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Check, Info, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { type Constraints } from "@/types/constraints"

export default function ConstraintsPage() {
  const [constraints, setConstraints] = useState<Constraints>({
    warehouseCapacity: 0,
    defaultReorderQty: 0,
    safetyStockPercentage: 0,
  })
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const fetchConstraints = async () => {
      const res = await fetch("http://localhost:5000/api/constraints")
      const data = await res.json()
      setConstraints(data)
    }
    fetchConstraints()
  }, [])

  const handleChange = (field: keyof Constraints, value: any) => {
    setConstraints({
      ...constraints,
      [field]: value,
    })
    setIsSaved(false)
  }

  const handleNumberChange = (field: keyof Constraints, value: string) => {
    const numValue = value === "" ? 0 : Number.parseFloat(value)
    if (!isNaN(numValue)) {
      handleChange(field, numValue)
    }
  }

  const handleSave = async () => {
    const res = await fetch("http://localhost:5000/api/constraints", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(constraints),
    })
    if (res.ok) {
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Constraints</h1>
        <p className="text-muted-foreground">Configure inventory management constraints and thresholds</p>
      </div>

      {isSaved && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900">
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Changes saved successfully</AlertTitle>
          <AlertDescription>Your inventory constraints have been updated.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Settings</CardTitle>
            <CardDescription>Configure your warehouse capacity and storage constraints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="warehouseCapacity">Warehouse Capacity (units)</Label>
              <Input
                id="warehouseCapacity"
                type="number"
                value={constraints.warehouseCapacity}
                onChange={(e) => handleNumberChange("warehouseCapacity", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reorder Settings</CardTitle>
            <CardDescription>Configure automatic reordering behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultReorderQty">Default Reorder Quantity</Label>
              <Input
                id="defaultReorderQty"
                type="number"
                value={constraints.defaultReorderQty}
                onChange={(e) => handleNumberChange("defaultReorderQty", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="safetyStockPercentage">Safety Stock Percentage</Label>
                <span className="text-sm font-medium">{Math.round(constraints.safetyStockPercentage * 100)}%</span>
              </div>
              <Slider
                id="safetyStockPercentage"
                min={0}
                max={100}
                step={100}
                value={[constraints.safetyStockPercentage]}
                onValueChange={(value) => handleChange("safetyStockPercentage", value[0])}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>About Constraints</AlertTitle>
        <AlertDescription>
          These settings affect how the system manages inventory and determines when to reorder products.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
