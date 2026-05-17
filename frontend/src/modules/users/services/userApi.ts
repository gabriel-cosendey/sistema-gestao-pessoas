import type { CreateUserData, UpdateUserData, User } from "../../../types/user";
import { apiGet, apiPost, apiPut, apiDelete } from "../../../lib/api";

export async function getUsers() {
  return apiGet<User[]>("/usuarios");
}

export async function createUser(data: CreateUserData) {
  return apiPost<User>("/usuarios", data);
}

export async function updateUser(id: number, data: UpdateUserData) {
  return apiPut<User>(`/usuarios/${id}`, data);
}

export async function removeUser(id: number) {
  return apiDelete<void>(`/usuarios/${id}`);
}
