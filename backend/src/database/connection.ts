import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import bcrypt from "bcrypt";

let db: Database.Database | null = null;

async function initializeDatabase() {
  const databaseFile = process.env.DATABASE_FILE || "./src/database/database.sqlite";

  db = new Database(databaseFile);

  const schemaPath = path.resolve(__dirname, "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  db.exec(schema);
  await ensureAdminUser();

  console.log("Banco de dados inicializado com sucesso");
}

async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (!db) throw new Error("Banco de dados não inicializado");

  const row = db.prepare("SELECT id FROM usuarios WHERE email = ?").get(adminEmail);
  if (!row) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    db.prepare(
      `INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`
    ).run("Administrador", adminEmail, hashedPassword, "admin");
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