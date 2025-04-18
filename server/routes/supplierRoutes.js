const express = require("express");
const router = express.Router();
const controller = require("../controllers/supplierController");

router.get("/", controller.getSuppliers);

module.exports = router;
