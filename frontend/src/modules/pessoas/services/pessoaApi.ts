import type { Pessoa, CreatePessoaData, UpdatePessoaData } from "../types/pessoa";
import { apiGet, apiPost, apiPut, apiDelete } from "../../../lib/api";

async function getAll(nome?: string, cargo?: string): Promise<Pessoa[]> {
  const params = new URLSearchParams();
  if (nome) params.append("nome", nome);
  if (cargo) params.append("cargo", cargo);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiGet<Pessoa[]>(`/pessoas${query}`);
}

async function getById(id: number): Promise<Pessoa> {
  return apiGet<Pessoa>(`/pessoas/${id}`);
}

async function create(data: CreatePessoaData): Promise<Pessoa> {
  return apiPost<Pessoa>("/pessoas", data);
}

async function update(id: number, data: UpdatePessoaData): Promise<Pessoa> {
  return apiPut<Pessoa>(`/pessoas/${id}`, data);
}

async function remove(id: number): Promise<void> {
  return apiDelete<void>(`/pessoas/${id}`);
}

export const pessoaApi = {
  getAll,
  getById,
  create,
  update,
  remove,
};