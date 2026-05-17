import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { pessoaRepository } from "../repositories/pessoaRepository";
import { userService } from "../services/userService";

async function getDashboard(req: AuthRequest, res: Response) {
  try {
    const totalPessoas = await pessoaRepository.countPeople();
    const totalUsuarios = await userService.countUsers();
    // traz mais itens e filtra apenas cargos RH e Admin
    const todasRecentes = await pessoaRepository.findLatest(10);
    let recentes = (todasRecentes || []).map((p: any) => ({ id: p.id, nome: p.nome, cargo: p.cargo, email: p.email }));

    // Ajuste de visibilidade baseado na role do requisitante:
    const requesterRole = req.user?.role;
    if (requesterRole === "admin") {
      // Admin vê apenas últimas pessoas com cargo RH ou Admin
      recentes = recentes.filter((p: any) => {
        const cargo = (p.cargo || "").toString().toLowerCase();
        return cargo === "rh" || cargo === "admin";
      });
    } else if (requesterRole === "rh") {
      // RH vê as últimas pessoas em geral, mas não vê e-mail de quem for Admin
      recentes = recentes.map((p: any) => {
        const cargo = (p.cargo || "").toString().toLowerCase();
        if (cargo === "admin") {
          return { id: p.id, nome: p.nome, cargo: p.cargo, email: null };
        }
        return p;
      });
    }

    const pessoasRecentes = recentes.slice(0, 5);

    return res.status(200).json({
      totalPessoas,
      totalUsuarios,
      pessoasRecentes,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
}

export const dashboardController = {
  getDashboard,
};
