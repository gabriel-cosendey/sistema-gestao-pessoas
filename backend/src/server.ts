import dotenv from "dotenv";
import { app } from "./app";
import { initializeDatabase } from "./database/connection";

dotenv.config();

const PORT = process.env.PORT || 3333;

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
  }
}

startServer();