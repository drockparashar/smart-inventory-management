const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");

router.get("/", controller.getAllProducts);
router.put("/:id", controller.updateProduct);
router.patch("/adjust/:productId", controller.adjustStock);

module.exports = router;
