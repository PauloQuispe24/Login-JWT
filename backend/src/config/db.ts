import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect("mongodb://mongodb:27017/login_jwt");
        console.log("MongoDB conectado");
    }
    catch (error) {
        console.error("MongoDB falló");
        throw error;
    }
}
