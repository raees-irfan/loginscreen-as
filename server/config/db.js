const mongoose = require("mongoose");

const connectDB = async (uri) => {
  try {
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
    console.log("Database:", mongoose.connection.name);
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);

    if (err.message.includes("authentication failed")) {
      console.error(
        "Tip: Check your MongoDB username and password in .env file"
      );
      console.error(
        "Make sure there are NO angle brackets <> around credentials"
      );
    }
  }
};

module.exports = connectDB;
