// Set environment variables before any imports
process.env.MONGODB_URI = "mongodb+srv://mongo_db_user:iwtjG1sfpNL0KXGZ@resume-builder.ejvthzt.mongodb.net/?appName=resume-builder";

import bcrypt from "bcrypt";
import { connectDB } from "../src/lib/db.js";
import User from "../src/models/User.js";

async function createAdminUser() {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: "admin@resumebuilder.com" });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user
    const adminUser = new User({
      email: "admin@resumebuilder.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();

    console.log("Admin user created successfully!");
    console.log("Email: admin@resumebuilder.com");
    console.log("Password: admin123");
    console.log("Please change the password after first login!");

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();