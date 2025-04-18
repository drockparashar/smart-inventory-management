const express = require("express");
const router = express.Router();
const controller = require("../controllers/constraintController");

router.get("/", controller.getConstraints);
router.put("/", controller.updateConstraints);

module.exports = router;
