export type Pessoa = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  cargo?: string;
  data_nascimento?: string;
  created_at: string;
  updated_at: string;
};

export type CreatePessoaData = {
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  cargo?: string;
  data_nascimento?: string;
};

export type UpdatePessoaData = {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  cargo?: string;
  data_nascimento?: string;
};