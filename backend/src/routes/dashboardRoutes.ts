import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController";
import { authMiddleware } from "../middleware/authMiddleware";

const dashboardRoutes = Router();

dashboardRoutes.get("/dashboard", authMiddleware, dashboardController.getDashboard);

export { dashboardRoutes };
