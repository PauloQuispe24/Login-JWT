import { Router } from "express";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();

router.get("/", authenticateToken, authorizeAdmin, (req, res) => {
  return res.status(200).json({
    message: "Tienes acceso a la ruta restringida.",
  });
});

export const adminRouter = router;
