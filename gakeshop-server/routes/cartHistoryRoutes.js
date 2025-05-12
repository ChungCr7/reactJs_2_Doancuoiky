// routes/cartHistoryRoutes.js
const express = require("express");
const { getCartHistory } = require("../controllers/cartHistoryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCartHistory);

module.exports = router;
