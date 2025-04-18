"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { type Constraints, constraints as initialConstraints } from "@/data/constraints"
import { Check, Info, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ConstraintsPage() {
  const [constraints, setConstraints] = useState<Constraints>({ ...initialConstraints })
  const [isSaved, setIsSaved] = useState(false)

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

  const handleSave = () => {
    // In a real app, this would call an API endpoint
    // PUT /api/constraints with the constraints object
    console.log("Saving constraints:", constraints)
    setIsSaved(true)

    // Reset the saved status after 3 seconds
    setTimeout(() => {
      setIsSaved(false)
    }, 3000)
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
              <p className="text-sm text-muted-foreground">Maximum number of items your warehouse can store</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
              <Input
                id="minStockLevel"
                type="number"
                value={constraints.minStockLevel}
                onChange={(e) => handleNumberChange("minStockLevel", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Absolute minimum stock level for any product</p>
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
              <p className="text-sm text-muted-foreground">
                Default quantity to order when a product reaches its reorder point
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLeadTimeDays">Maximum Lead Time (days)</Label>
              <Input
                id="maxLeadTimeDays"
                type="number"
                value={constraints.maxLeadTimeDays}
                onChange={(e) => handleNumberChange("maxLeadTimeDays", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Maximum acceptable lead time for suppliers</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="safetyStockPercentage">Safety Stock Percentage</Label>
                <span className="text-sm font-medium">{Math.round(constraints.safetyStockPercentage * 100)}%</span>
              </div>
              <Slider
                id="safetyStockPercentage"
                min={0}
                max={0.5}
                step={0.01}
                value={[constraints.safetyStockPercentage]}
                onValueChange={(value) => handleChange("safetyStockPercentage", value[0])}
              />
              <p className="text-sm text-muted-foreground">Additional buffer stock as a percentage of reorder point</p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="autoReorderEnabled"
                checked={constraints.autoReorderEnabled}
                onCheckedChange={(checked) => handleChange("autoReorderEnabled", checked)}
              />
              <Label htmlFor="autoReorderEnabled">Enable Automatic Reordering</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>About Constraints</AlertTitle>
        <AlertDescription>
          These settings affect how the system manages inventory and determines when to reorder products. Changes will
          take effect immediately for all future calculations.
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
