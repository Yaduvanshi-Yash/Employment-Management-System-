import mongoose from "mongoose";
import { setMongoEnabled } from "./databaseState.js";

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log("MONGODB_URI not provided. Server will continue with the local file store.");
    setMongoEnabled(false);
    return false;
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME || "ems",
  });

  setMongoEnabled(true);
  console.log(`MongoDB connected to database "${mongoose.connection.name}".`);
  return true;
};
