import { Router } from "express";
import { authController } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const authRoutes = Router();

authRoutes.post("/auth/login", authController.login);
authRoutes.get("/auth/me", authMiddleware, authController.me);

export { authRoutes };
