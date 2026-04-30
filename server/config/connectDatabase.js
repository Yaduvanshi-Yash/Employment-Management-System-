import mongoose from "mongoose";
import { setMongoEnabled } from "./databaseState.js";

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === "production";

  if (!mongoUri) {
    if (isProduction) {
      throw new Error(
        "MONGODB_URI is required in production. Refusing to start with the local file store.",
      );
    }

    console.log("MONGODB_URI not provided. Server will continue with the local file store.");
    setMongoEnabled(false);
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || "ems",
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed. Check MONGODB_URI, MONGODB_DB_NAME, and Atlas network access.",
    );
    throw error;
  }

  setMongoEnabled(true);
  console.log(`MongoDB connected to database "${mongoose.connection.name}".`);
  return true;
};
