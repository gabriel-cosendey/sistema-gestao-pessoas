import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware, ensureRole } from "../middleware/authMiddleware";

const userRoutes = Router();

userRoutes.use(authMiddleware);
userRoutes.post("/usuarios", ensureRole(["admin"]), userController.create);
	userRoutes.get("/usuarios", ensureRole(["admin"]), userController.getAll);
	userRoutes.get("/usuarios/:id", ensureRole(["admin"]), userController.getById);
	userRoutes.post("/usuarios", ensureRole(["admin"]), userController.create);
	userRoutes.put("/usuarios/:id", ensureRole(["admin"]), userController.update);
	userRoutes.delete("/usuarios/:id", ensureRole(["admin"]), userController.remove);

export { userRoutes };
