export interface Constraints {
  warehouseCapacity: number
  defaultReorderQty: number
  safetyStockPercentage: number
  maxLeadTimeDays: number
  minStockLevel: number
  autoReorderEnabled: boolean
}

export const constraints: Constraints = {
  warehouseCapacity: 500,
  defaultReorderQty: 20,
  safetyStockPercentage: 0.15,
  maxLeadTimeDays: 10,
  minStockLevel: 5,
  autoReorderEnabled: true,
}
