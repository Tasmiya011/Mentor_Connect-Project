import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const resetPasswords = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const users = await User.find();

    for (let user of users) {
      const hashed = await bcrypt.hash("1234", 10);
      user.password = hashed;
      await user.save();
      console.log(`Password reset for: ${user.email}`);
    }

    console.log("All passwords reset to 1234");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

resetPasswords();
