import { Request, Response } from "express";
import { authService } from "../services/authService";
import { AuthRequest } from "../middleware/authMiddleware";

async function login(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;
    const result = await authService.login(email, senha);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(error.statusCode || 401).json({
      error: { code: error.code || "AUTH_ERROR", message: error.message },
    });
  }
}

async function me(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Usuário não autenticado" } });
  }

  return res.status(200).json({ user: req.user });
}

export const authController = {
  login,
  me,
};
