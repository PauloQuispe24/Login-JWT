import express from "express";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin.js";
import { env } from "./config/env.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend funcionando",
  });
});

app.use("/auth", authRouter);

app.use("/admin", adminRouter);

async function startServer() {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`Nuestro Backend está funcionando en el puerto ${env.PORT}.`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();
