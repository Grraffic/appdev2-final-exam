const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

const users = [
  {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  },
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
  },
];

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/appdev2-final-exam"
  )
  .then(async () => {
    try {
      // Clear existing users
      await User.deleteMany({});

      // Hash passwords and create users
      const hashedUsers = await Promise.all(
        users.map(async (user) => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(user.password, salt);
          return {
            ...user,
            password: hashedPassword,
          };
        })
      );

      // Insert users
      await User.insertMany(hashedUsers);
      console.log("Users seeded successfully!");
      process.exit(0);
    } catch (error) {
      console.error("Error seeding users:", error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
