const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const auth = require("../middleware/authMiddleware");

// Public route - no authentication required
router.get("/", eventController.getAllEvents);

// Protected routes - authentication required
router.post("/", auth, eventController.createEvent);
router.get("/my-events", auth, eventController.getMyEvents);

module.exports = router;
