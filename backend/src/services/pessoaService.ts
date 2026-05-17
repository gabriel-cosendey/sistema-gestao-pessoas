import { pessoaRepository } from "../repositories/pessoaRepository";
import { CreatePessoaData, UpdatePessoaData } from "../types/pessoa";

function validarCPF(cpf: string): boolean {
  const limpo = cpf.replace(/[^\d]/g, "");

  if (limpo.length !== 11) return false;
  if (/^(\d)\1+$/.test(limpo)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(limpo[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(limpo[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(limpo[10])) return false;

  return true;
}

function validarDados(data: CreatePessoaData) {
  if (!data.nome || data.nome.trim() === "") {
    throw { statusCode: 400, code: "VALIDATION_ERROR", message: "O nome é obrigatório" };
  }

  if (!data.cpf || data.cpf.trim() === "") {
    throw { statusCode: 400, code: "VALIDATION_ERROR", message: "O CPF é obrigatório" };
  }

  if (!validarCPF(data.cpf)) {
    throw { statusCode: 400, code: "VALIDATION_ERROR", message: "CPF inválido" };
  }

  if (!data.email || data.email.trim() === "") {
    throw { statusCode: 400, code: "VALIDATION_ERROR", message: "O email é obrigatório" };
  }
}

async function createPessoa(data: CreatePessoaData) {
  validarDados(data);
  return pessoaRepository.create(data);
}

async function getAllPessoas(nome?: string, cargo?: string) {
  return pessoaRepository.findAll(nome, cargo);
}

async function getPessoaById(id: number) {
  const pessoa = await pessoaRepository.findById(id);
  if (!pessoa) {
    throw { statusCode: 404, code: "NOT_FOUND", message: "Pessoa não encontrada" };
  }
  return pessoa;
}

async function updatePessoa(id: number, data: UpdatePessoaData) {
  await getPessoaById(id);
  return pessoaRepository.update(id, data);
}

async function deletePessoa(id: number) {
  await getPessoaById(id);
  await pessoaRepository.remove(id);
}

export const pessoaService = {
  createPessoa,
  getAllPessoas,
  getPessoaById,
  updatePessoa,
  deletePessoa,
};