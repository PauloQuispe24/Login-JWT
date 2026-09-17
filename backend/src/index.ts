import express from "express";
import { connectDB } from "./config/db.js";
import { validateRegister, validateLogin } from "./validators/auth.js";
import { User } from "./models/User.js";
import { hashPassword, comparePassword } from "./utils/password.js";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend funcionando",
  });
});

app.post("/auth/register", async (req, res) => {
  const validation = validateRegister(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      message: validation.message,
    });
  }
  const { email, password } = validation.data;
  try {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(409).json({
        message: "El email ya está registrado",
      });
    }
    const passwordHash = await hashPassword(password);
    const newUser = await User.create({
      email,
      passwordHash,
    });
    return res.status(201).json({
      message: "El usuario ha sido registrado de forma exitosa.",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor.",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  const validation = validateLogin(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      message: validation.message,
    });
  }
  const { email, password } = validation.data;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(401).json({
        message: "Email o contraseña son incorrectos.",
      });
    }
    const passwordsCompare = await comparePassword(
      password,
      userExist.passwordHash,
    );
    if (!passwordsCompare) {
      return res.status(401).json({
        message: "Email o contraseña son incorrectos.",
      });
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET no está definido.");
    }
    const newToken = jwt.sign(
      {
        sub: userExist._id.toString(),
        role: userExist.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    return res.status(200).json({
      message: "Login realizado de forma exitosa.",
      token: newToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor.",
    });
  }
});

async function startServer() {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("Nuestro Backend está funcionando en el puerto 3000.");
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();
