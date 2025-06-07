const Event = require("../models/Event");
const User = require("../models/User");
const emailService = require("../services/emailService");

// GET /api/events - Fetch all events (public access)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("userId", "name email")
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/events - Create a new event (authenticated)
exports.createEvent = async (req, res) => {
  try {
    const { title, location, date, description } = req.body;

    // Validate required fields
    if (!title || !location || !date || !description) {
      return res.status(400).json({
        message: "All fields (title, location, date, description) are required",
      });
    }

    const event = new Event({
      title,
      location,
      date: new Date(date),
      description,
      userId: req.user.userId, // From auth middleware
    });

    await event.save();

    // Get user details for email
    const user = await User.findById(req.user.userId);

    // Send confirmation email
    try {
      await emailService.sendEventConfirmation(user, event);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't return the error to client as the event was created successfully
    }

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/my-events - Fetch events created by logged-in user (authenticated)
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.userId }).sort({
      date: 1,
    });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
