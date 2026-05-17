import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository";
import { CreateUserData, UpdateUserData } from "../types/user";

const SALT_ROUNDS = 10;

function validarUsuario(data: CreateUserData | UpdateUserData) {
  if ("nome" in data && (!data.nome || data.nome.trim() === "")) {
    throw { statusCode: 400, code: "VALIDATION_ERROR", message: "O nome é obrigatório" };
  }

  if ("email" in data && data.email && !data.email.includes("@")) {
    throw { statusCode: 400, code: "VALIDATION_ERROR", message: "Email inválido" };
  }
}

async function createUser(data: CreateUserData) {
  validarUsuario(data);
  const existing = await userRepository.findByEmail(data.email);
  if (existing) {
    throw { statusCode: 400, code: "USER_EXISTS", message: "Já existe um usuário com esse email" };
  }

  const hashedPassword = await bcrypt.hash(data.senha, SALT_ROUNDS);
  return userRepository.create(data, hashedPassword);
}

async function getAllUsers() {
  return userRepository.findAll();
}

async function getUserById(id: number) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw { statusCode: 404, code: "NOT_FOUND", message: "Usuário não encontrado" };
  }
  return user;
}

async function updateUser(id: number, data: UpdateUserData) {
  validarUsuario(data);

  const hashedPassword = data.senha ? await bcrypt.hash(data.senha, SALT_ROUNDS) : undefined;

  return userRepository.update(id, data, hashedPassword);
}

async function deleteUser(id: number) {
  await getUserById(id);
  await userRepository.remove(id);
}

async function countUsers() {
  return userRepository.countUsers();
}

export const userService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  countUsers,
};
