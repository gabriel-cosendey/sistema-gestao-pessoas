import { getDatabase } from "../database/connection";
import { CreateUserData, UpdateUserData, User } from "../types/user";

async function create(data: CreateUserData, hashedPassword: string) {
  const db = getDatabase();

  const result = await db.run(
    `INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`,
    data.nome,
    data.email,
    hashedPassword,
    data.role
  );

  return db.get<User>("SELECT id, nome, email, role, last_login, created_at, updated_at FROM usuarios WHERE id = ?", result.lastInsertRowid);
}

async function findAll() {
  const db = getDatabase();
  return db.all<Pick<User, "id" | "nome" | "email" | "role" | "last_login" | "created_at" | "updated_at">[]>(
    "SELECT id, nome, email, role, last_login, created_at, updated_at FROM usuarios ORDER BY nome ASC"
  );
}

async function findById(id: number) {
  const db = getDatabase();
  return db.get<User>("SELECT id, nome, email, role, last_login, created_at, updated_at FROM usuarios WHERE id = ?", id);
}

async function findByEmail(email: string) {
  const db = getDatabase();
  return db.get<User & { senha: string }>("SELECT * FROM usuarios WHERE email = ?", email);
}

async function update(id: number, data: UpdateUserData, hashedPassword?: string) {
  const db = getDatabase();

  await db.run(
    `UPDATE usuarios SET
      nome = COALESCE(?, nome),
      email = COALESCE(?, email),
      senha = COALESCE(?, senha),
      role = COALESCE(?, role),
      updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [data.nome, data.email, hashedPassword ?? null, data.role, id]
  );

  return findById(id);
}

async function remove(id: number) {
  const db = getDatabase();
  await db.run("DELETE FROM usuarios WHERE id = ?", id);
}

async function updateLastLogin(id: number) {
  const db = getDatabase();
  await db.run("UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE id = ?", id);
}

async function countUsers() {
  const db = getDatabase();
  const row = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM usuarios");
  return row?.count ?? 0;
}

export const userRepository = {
  create,
  findAll,
  findById,
  findByEmail,
  update,
  remove,
  updateLastLogin,
  countUsers,
};
