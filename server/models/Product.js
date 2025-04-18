const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  sku: String,
  category: String,
  stockLevel: Number,
  reorderPoint: Number,
  reorderQty: Number,
  leadTime: Number,
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }
});

module.exports = mongoose.model("Product", productSchema);
