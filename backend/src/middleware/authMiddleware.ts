import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthTokenPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: AuthTokenPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Token não fornecido" } });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyToken(token);
    return next();
  } catch (error: any) {
    return res.status(401).json({ error: { code: "INVALID_TOKEN", message: "Token inválido" } });
  }
}

export function ensureRole(roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Acesso não autorizado" } });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "Permissão insuficiente" } });
    }

    return next();
  };
}
