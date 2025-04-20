export type Product = {
    id: string
    name: string
    sku: string
    category: string
    stockLevel: number
    reorderPoint: number
    supplierId: string
    reorderQty: number // Quantity to reorder
    leadTime: number // Lead time in days
    price: number // Price of the product
    lastUpdated: string // Timestamp of the last update
}
