import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";
import { userRepository } from "../repositories/userRepository";

async function login(email: string, senha: string) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw { statusCode: 401, code: "INVALID_CREDENTIALS", message: "Email ou senha incorretos" };
  }

  const validPassword = await bcrypt.compare(senha, user.senha);
  if (!validPassword) {
    throw { statusCode: 401, code: "INVALID_CREDENTIALS", message: "Email ou senha incorretos" };
  }

  await userRepository.updateLastLogin(user.id);

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return {
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
}

export const authService = {
  login,
};
