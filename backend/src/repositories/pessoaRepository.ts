import { getDatabase } from "../database/connection";
import { CreatePessoaData, UpdatePessoaData } from "../types/pessoa";

async function create(data: CreatePessoaData) {
  const db = getDatabase();

  const result = await db.run(
    `INSERT INTO pessoas (nome, cpf, email, telefone, cargo, data_nascimento)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.nome, data.cpf, data.email, data.telefone ?? "", data.cargo ?? "", data.data_nascimento ?? ""]
  );

  return db.get("SELECT * FROM pessoas WHERE id = ?", result.lastID);
}

async function findAll(nome?: string, cargo?: string) {
  const db = getDatabase();

  let query = "SELECT * FROM pessoas WHERE 1=1";
  const params: string[] = [];

  if (nome) {
    query += " AND nome LIKE ?";
    params.push(`%${nome}%`);
  }

  if (cargo) {
    query += " AND cargo LIKE ?";
    params.push(`%${cargo}%`);
  }

  query += " ORDER BY nome ASC";

  return db.all(query, params);
}

async function findById(id: number) {
  const db = getDatabase();
  return db.get("SELECT * FROM pessoas WHERE id = ?", id);
}

async function update(id: number, data: UpdatePessoaData) {
  const db = getDatabase();

  await db.run(
    `UPDATE pessoas SET
      nome = COALESCE(?, nome),
      cpf = COALESCE(?, cpf),
      email = COALESCE(?, email),
      telefone = COALESCE(?, telefone),
      cargo = COALESCE(?, cargo),
      data_nascimento = COALESCE(?, data_nascimento),
      updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [data.nome, data.cpf, data.email, data.telefone, data.cargo, data.data_nascimento, id]
  );

  return findById(id);
}

async function remove(id: number) {
  const db = getDatabase();
  await db.run("DELETE FROM pessoas WHERE id = ?", id);
}

async function countPeople() {
  const db = getDatabase();
  const row = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM pessoas");
  return row?.count ?? 0;
}

async function findLatest(limit = 5) {
  const db = getDatabase();
  return db.all("SELECT * FROM pessoas ORDER BY created_at DESC LIMIT ?", limit);
}

export const pessoaRepository = {
  create,
  findAll,
  findById,
  update,
  remove,
  countPeople,
  findLatest,
};