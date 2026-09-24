import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("MongoDB falló");
    throw error;
  }
}
