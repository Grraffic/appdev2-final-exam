const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Authentication route
router.post("/signin", authController.signin);

module.exports = router;
