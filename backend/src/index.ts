import express from "express";
import { connectDB } from "./config/db.js";

const app = express();

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Backend funcionando"
    });
});

async function startServer() {
    try {
        await connectDB();
        app.listen(3000, () => {
            console.log("Nuestro Backend está funcionando en el puerto 3000.");
        });
    }
    catch (error) {
        console.error(error);
    }
}

startServer();
