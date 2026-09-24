import { Router } from "express";
import { validateRegister, validateLogin } from "../validators/auth.js";
import { User } from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { env } from "../config/env.js";

const router = Router();

router.post("/register", async (req, res) => {
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
        id: newUser._id.toString(),
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

router.post("/login", async (req, res) => {
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
    const newToken = jwt.sign(
      {
        sub: userExist._id.toString(),
      },
      env.JWT_SECRET,
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

router.get("/me", authenticateToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Usuario no autenticado.",
    });
  }
  try {
    const userFound = await User.findById(req.user.id);
    if (!userFound) {
      return res.status(401).json({
        message: "Usuario no encontrado.",
      });
    }
    return res.status(200).json({
      message: "Tienes acceso a una ruta protegida.",
      user: {
        id: userFound._id.toString(),
        email: userFound.email,
        role: userFound.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor.",
    });
  }
});

export const authRouter = router;
