import jwt from "jsonwebtoken";
import { Role } from "../types/user";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const TOKEN_EXPIRATION = "8h";

export type AuthTokenPayload = {
  id: number;
  email: string;
  role: Role;
};

export function signToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}
