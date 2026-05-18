export type Role = "admin" | "rh";

export type User = {
  id: number;
  nome: string;
  email: string;
  role: Role;
  ativo: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
};

export type CreateUserData = {
  nome: string;
  email: string;
  senha: string;
  role: Role;
  ativo?: boolean;
};

export type UpdateUserData = {
  nome?: string;
  email?: string;
  senha?: string;
  role?: Role;
  ativo?: boolean;
};

export type LoginData = {
  email: string;
  senha: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
