import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";

export async function authorizeAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
    if (userFound.role !== "admin") {
      return res.status(403).json({
        message: "Usuario no autorizado.",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor.",
    });
  }
}
