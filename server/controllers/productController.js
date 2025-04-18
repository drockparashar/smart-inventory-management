const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  const products = await Product.find().populate("supplierId");
  res.json(products);
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

exports.adjustStock = async (req, res) => {
  const { productId } = req.params;
  const { delta } = req.body;
  const product = await Product.findById(productId);
  if (product) {
    product.stockLevel += delta;
    await product.save();
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
};
