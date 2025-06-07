const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
const User = require("../models/User");
const Event = require("../models/Event");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/appdev2-final-exam";
const DEFAULT_PASSWORD = "secret123";
const SALT_ROUNDS = 10;
const NUM_USERS = 5;
const NUM_EVENTS = 10;

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log("Cleared existing data...");

    // Create users with hashed passwords
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    const users = Array.from({ length: NUM_USERS }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: hashedPassword,
    }));

    const createdUsers = await User.insertMany(users);
    console.log(`Created ${NUM_USERS} users...`);

    // Create events linked to random users
    const events = Array.from({ length: NUM_EVENTS }, () => {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const startDate = faker.date.future();

      return {
        title: faker.word.words(3),
        location: faker.location.city(),
        date: startDate,
        description: faker.lorem.paragraph(),
        userId: randomUser._id,
      };
    });

    await Event.insertMany(events);
    console.log(`Created ${NUM_EVENTS} events...`);

    console.log("Database seeded successfully!");
    console.log("\nTest User Credentials:");
    console.log(`Email: ${users[0].email}`);
    console.log(`Password: ${DEFAULT_PASSWORD}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
