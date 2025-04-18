const Product = require("../models/Product");
const Constraint = require("../models/Constraint");

exports.getReorderRecommendations = async (req, res) => {
  try {
    const constraints = await Constraint.findOne();
    if (!constraints) return res.status(404).json({ error: "Constraints not set" });

    const products = await Product.find().populate("supplierId");
    const recommendations = [];

    const {
      warehouseCapacity,
      defaultReorderQty,
      safetyStockPercentage,
    } = constraints;

    // Calculate current total stock
    let totalStock = products.reduce((sum, p) => sum + p.stockLevel, 0);

    // Sort products by lowest stockLevel first (Heuristic: MRV)
    const sortedProducts = products
      .filter(p => p.stockLevel < p.reorderPoint)
      .sort((a, b) => a.stockLevel - b.stockLevel);

    for (const product of sortedProducts) {
      const safetyStock = Math.ceil((product.reorderPoint * safetyStockPercentage) / 100);
      const reorderQty = Math.max(defaultReorderQty, safetyStock);

      if (totalStock + reorderQty <= warehouseCapacity) {
        recommendations.push({
          productId: product._id,
          productName: product.name,
          sku: product.sku,
          currentStock: product.stockLevel,
          reorderQty,
          supplier: product.supplierId?.name || "Unknown",
        });

        totalStock += reorderQty; // Forward checking
      }
    }

    res.json({ recommendations });
  } catch (err) {
    console.error("AI Logic Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
