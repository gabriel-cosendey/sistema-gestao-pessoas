export type Role = "admin" | "rh";

export type User = {
  id: number;
  nome: string;
  email: string;
  role: Role;
  last_login?: string;
  created_at: string;
  updated_at: string;
};

export type CreateUserData = {
  nome: string;
  email: string;
  senha: string;
  role: Role;
};

export type UpdateUserData = {
  nome?: string;
  email?: string;
  senha?: string;
  role?: Role;
};

export type LoginData = {
  email: string;
  senha: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
