const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config();

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin12345";

// Seed function
const seedAdmin = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully.");

    const existingAdmin = await User.findOne({ username: ADMIN_USERNAME });

    if (existingAdmin) {
      console.log("Admin user already exists. No action taken.");
      return;
    }

    console.log("Admin user not found. Creating a new one...");
    const adminUser = new User({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    });

    await adminUser.save();

    console.log("----------------------------------------------------");
    console.log("Admin user created successfully!");
    console.log(`Username: ${ADMIN_USERNAME}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log("You can now use these credentials to log in.");
    console.log("----------------------------------------------------");
  } catch (error) {
    console.error("Error during admin user seeding:", error);
  } finally {
    console.log("Disconnecting from database...");
    await mongoose.disconnect();
    console.log("Database disconnected.");
  }
};

seedAdmin();
