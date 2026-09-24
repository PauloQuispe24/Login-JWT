import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

interface AuthPayload extends jwt.JwtPayload {
  sub: string;
}

function isAuthPayload(payload: jwt.JwtPayload): payload is AuthPayload {
  if (typeof payload.sub !== "string") {
    return false;
  }
  return true;
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({
      message: "La petición de autorización no ha sido enviada.",
    });
  }
  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Formato de autorización inválida.",
    });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "El token no ha sido enviado.",
    });
  }
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === "string") {
      return res.status(401).json({
        message: "La estructura del token no es válida.",
      });
    }
    if (!isAuthPayload(decoded)) {
      return res.status(401).json({
        message: "La estructura del token no es válida.",
      });
    }
    req.user = {
      id: decoded.sub,
    };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "El token no es válido.",
    });
  }
}

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
