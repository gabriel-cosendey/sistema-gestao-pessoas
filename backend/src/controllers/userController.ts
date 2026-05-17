import { Request, Response } from "express";
import { userService } from "../services/userService";

async function create(req: Request, res: Response) {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      error: { code: error.code || "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
}

async function getAll(req: Request, res: Response) {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
}

async function getById(req: Request, res: Response) {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      error: { code: error.code || "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
}

async function update(req: Request, res: Response) {
  try {
    const user = await userService.updateUser(Number(req.params.id), req.body);
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      error: { code: error.code || "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
}

async function remove(req: Request, res: Response) {
  try {
    await userService.deleteUser(Number(req.params.id));
    return res.status(204).send();
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      error: { code: error.code || "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
}

export const userController = {
  create,
  getAll,
  getById,
  update,
  remove,
};
