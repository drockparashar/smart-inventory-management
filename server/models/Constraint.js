const mongoose = require("mongoose");

const constraintSchema = new mongoose.Schema({
  warehouseCapacity: Number,
  defaultReorderQty: Number,
  safetyStockPercentage: Number
});

module.exports = mongoose.model("Constraint", constraintSchema);
