const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_FILE || path.resolve(__dirname, '..', 'src', 'database', 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir banco de dados:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run("UPDATE usuarios SET role = 'rh' WHERE role = 'user'", function (err) {
    if (err) {
      console.error('Erro ao atualizar roles:', err.message);
      process.exit(1);
    }
    console.log(`Linhas atualizadas: ${this.changes}`);

    // opcional: mostrar contagens
    db.get("SELECT COUNT(*) as c FROM usuarios WHERE role = 'rh'", (err2, row) => {
      if (!err2) console.log('Total users with role rh:', row.c);
      db.close();
    });
  });
});
