import mongoose from "mongoose";
const MONGO_URL = process.env.MONGO_URL as string;
if (!MONGO_URL) {
  throw new Error("❌ MONGO_URL is not defined in environment variables.");
}
export const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};
