const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");
const Supplier = require("./models/Supplier");
const Constraint = require("./models/Constraint");

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB connected");

  await Product.deleteMany();
  await Supplier.deleteMany();
  await Constraint.deleteMany();

  // Constraints
  const constraint = await Constraint.create({
    warehouseCapacity: 5000,
    defaultReorderQty: 100,
    safetyStockPercentage: 20,
  });

  // Suppliers
  const suppliers = await Supplier.insertMany([
    { name: "Alpha Supply Co", leadTime: 4, reliability: "High" },
    { name: "Beta Traders", leadTime: 6, reliability: "Medium" },
    { name: "Gamma Wholesale", leadTime: 5, reliability: "Low" },
  ]);

  // Products
  await Product.insertMany([
    {
      name: "Product A",
      sku: "A001",
      category: "Electronics",
      stockLevel: 120,
      reorderPoint: 200,
      reorderQty: 150,
      leadTime: 4,
      supplierId: suppliers[0]._id,
    },
    {
      name: "Product B",
      sku: "B002",
      category: "Furniture",
      stockLevel: 60,
      reorderPoint: 100,
      reorderQty: 120,
      leadTime: 5,
      supplierId: suppliers[1]._id,
    },
    {
      name: "Product C",
      sku: "C003",
      category: "Stationery",
      stockLevel: 40,
      reorderPoint: 80,
      reorderQty: 90,
      leadTime: 3,
      supplierId: suppliers[2]._id,
    },
    {
      name: "Product D",
      sku: "D004",
      category: "Food",
      stockLevel: 300,
      reorderPoint: 150,
      reorderQty: 100,
      leadTime: 2,
      supplierId: suppliers[0]._id,
    },
  ]);

  console.log("Database populated.");
  process.exit();
};

start();
