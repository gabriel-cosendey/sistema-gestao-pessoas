import { Router } from "express";
import { pessoaController } from "../controllers/pessoaController";
import { authMiddleware, ensureRole } from "../middleware/authMiddleware";

const pessoaRoutes = Router();

pessoaRoutes.use(authMiddleware);

pessoaRoutes.post("/pessoas", ensureRole(["admin", "rh"]), pessoaController.create);
pessoaRoutes.get("/pessoas", pessoaController.getAll);
pessoaRoutes.get("/pessoas/:id", pessoaController.getById);
pessoaRoutes.put("/pessoas/:id", ensureRole(["admin", "rh"]), pessoaController.update);
pessoaRoutes.delete("/pessoas/:id", ensureRole(["admin"]), pessoaController.remove);

export { pessoaRoutes };