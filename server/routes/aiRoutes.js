const express = require("express");
const router = express.Router();
const controller = require("../controllers/aiController");

router.get("/recommendations", controller.getReorderRecommendations);

module.exports = router;
