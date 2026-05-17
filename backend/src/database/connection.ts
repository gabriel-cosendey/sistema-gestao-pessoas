import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import bcrypt from "bcrypt";

let db: Database<sqlite3.Database, sqlite3.Statement>;

async function initializeDatabase() {
  const databaseFile =
    process.env.DATABASE_FILE || "./src/database/database.sqlite";

  db = await open({
    filename: databaseFile,
    driver: sqlite3.Database,
  });

  const schemaPath = path.resolve(__dirname, "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  await db.exec(schema);
  await ensureAdminUser();

  console.log("Banco de dados inicializado com sucesso");
}

async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await db.get("SELECT id FROM usuarios WHERE email = ?", adminEmail);
  if (!existing) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await db.run(
      `INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`,
      ["Administrador", adminEmail, hashedPassword, "admin"]
    );
    console.log(`Usuário admin criado: ${adminEmail}`);
  }
}

function getDatabase() {
  if (!db) {
    throw new Error("Banco de dados não inicializado");
  }
  return db;
}

export { initializeDatabase, getDatabase };