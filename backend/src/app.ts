import express from "express";
import cors from "cors";
import { pessoaRoutes } from "./routes/pessoaRoutes";
import { authRoutes } from "./routes/authRoutes";
import { userRoutes } from "./routes/userRoutes";
import { dashboardRoutes } from "./routes/dashboardRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(userRoutes);
app.use(dashboardRoutes);
app.use(pessoaRoutes);

export { app };