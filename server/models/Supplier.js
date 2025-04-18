const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: String,
  leadTime: Number,
  reliability: String,
});

module.exports = mongoose.model("Supplier", supplierSchema);
