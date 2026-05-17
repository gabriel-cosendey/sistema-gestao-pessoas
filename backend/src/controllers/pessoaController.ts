import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { pessoaService } from "../services/pessoaService";

async function create(req: Request, res: Response) {
  try {
    const pessoa = await pessoaService.createPessoa(req.body);
    return res.status(201).json(pessoa);
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      error: { code: error.code || "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
}

async function getAll(req: AuthRequest, res: Response) {
  try {
    const { nome, cargo } = req.query;
    // if requester is RH, only show pessoas with cargo 'rh'
    const requesterRole = req.user?.role;
    const effectiveCargo = requesterRole === "rh" ? "rh" : (cargo as string | undefined);
    const pessoas = await pessoaService.getAllPessoas(nome as string | undefined, effectiveCargo);
    return res.status(200).json(pessoas);
  } catch (error: any) {
    return res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
}

async function getById(req: AuthRequest, res: Response) {
  try {
    const pessoa = await pessoaService.getPessoaById(Number(req.params.id));
    const requesterRole = req.user?.role;
    if (requesterRole === "rh") {
      const cargo = (pessoa.cargo || "").toString().toLowerCase();
      if (cargo !== "rh") {
        return res.status(403).json({ error: { code: "FORBIDDEN", message: "Permissão insuficiente" } });
      }
    }
    return res.status(200).json(pessoa);
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      error: { code: error.code || "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
}

async function update(req: Request, res: Response) {
  try {
    const pessoa = await pessoaService.updatePessoa(Number(req.params.id), req.body);
    return res.status(200).json(pessoa);
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      error: { code: error.code || "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
}

async function remove(req: Request, res: Response) {
  try {
    await pessoaService.deletePessoa(Number(req.params.id));
    return res.status(204).send();
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      error: { code: error.code || "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
}

export const pessoaController = {
  create,
  getAll,
  getById,
  update,
  remove,
};