import fs from "fs";
import path from "path";
import BetterSqlite3 from "better-sqlite3";
import bcrypt from "bcrypt";

type QueryDatabase = {
  exec: (sql: string) => void;
  run: (sql: string, ...params: any[]) => BetterSqlite3.RunResult;
  get: <T = any>(sql: string, ...params: any[]) => T | undefined;
  all: <T = any>(sql: string, ...params: any[]) => T[];
};

let db: BetterSqlite3.Database | null = null;
let queryDb: QueryDatabase | null = null;

function prepareParams(params?: any[]) {
  return params ?? [];
}

async function initializeDatabase() {
  const databaseFile =
    process.env.DATABASE_FILE || path.join(__dirname, "database.sqlite");

  fs.mkdirSync(path.dirname(databaseFile), { recursive: true });
  db = new BetterSqlite3(databaseFile);

  queryDb = {
    exec: (sql) => {
      if (!db) throw new Error("Banco de dados não inicializado");
      db.exec(sql);
    },
    run: (sql, ...params) => {
      if (!db) throw new Error("Banco de dados não inicializado");
      return db.prepare(sql).run(...params);
    },
    get: <T = any>(sql: string, ...params: any[]) => {
      if (!db) throw new Error("Banco de dados não inicializado");
      return db.prepare(sql).get(...params) as T | undefined;
    },
    all: <T = any>(sql: string, ...params: any[]) => {
      if (!db) throw new Error("Banco de dados não inicializado");
      return db.prepare(sql).all(...params) as T[];
    },
  };

  const schemaPath = path.resolve(__dirname, "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  queryDb.exec(schema);
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
  if (!queryDb) {
    throw new Error("Banco de dados não inicializado");
  }
  return queryDb;
}

export { initializeDatabase, getDatabase };