import { getDatabase } from "../database/connection";
import { CreateUserData, UpdateUserData, User } from "../types/user";

type DbUser = Omit<User, "ativo"> & { ativo: number };

function normalizeUser(user: DbUser | undefined): User | undefined {
  if (!user) return undefined;
  return {
    ...user,
    ativo: Boolean(user.ativo),
  };
}

async function create(data: CreateUserData, hashedPassword: string) {
  const db = getDatabase();

  const result = await db.run(
    `INSERT INTO usuarios (nome, email, senha, role, ativo) VALUES (?, ?, ?, ?, ?)`,
    data.nome,
    data.email,
    hashedPassword,
    data.role,
    data.ativo === false ? 0 : 1
  );

  return normalizeUser(
    db.get<DbUser>(
      "SELECT id, nome, email, role, ativo, last_login, created_at, updated_at FROM usuarios WHERE id = ?",
      result.lastInsertRowid
    )
  );
}

async function findAll() {
  const db = getDatabase();
  return db.all<DbUser>(
    "SELECT id, nome, email, role, ativo, last_login, created_at, updated_at FROM usuarios ORDER BY nome ASC"
  ).map(normalizeUser) as User[];
}

async function findById(id: number) {
  const db = getDatabase();
  return normalizeUser(
    db.get<DbUser>(
      "SELECT id, nome, email, role, ativo, last_login, created_at, updated_at FROM usuarios WHERE id = ?",
      id
    )
  );
}

type DbUserWithPassword = DbUser & { senha: string };

async function findByEmail(email: string) {
  const db = getDatabase();
  return db.get<DbUserWithPassword>("SELECT * FROM usuarios WHERE email = ?", email);
}

async function update(id: number, data: UpdateUserData, hashedPassword?: string) {
  const db = getDatabase();

  await db.run(
    `UPDATE usuarios SET
      nome = COALESCE(?, nome),
      email = COALESCE(?, email),
      senha = COALESCE(?, senha),
      role = COALESCE(?, role),
      ativo = COALESCE(?, ativo),
      updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      data.nome,
      data.email,
      hashedPassword ?? null,
      data.role,
      data.ativo === undefined ? null : data.ativo ? 1 : 0,
      id,
    ]
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
