import type { LoginData, AuthResponse } from "../../types/user";
import { apiPost, apiGet } from "../../lib/api";

export async function loginRequest(loginData: LoginData): Promise<AuthResponse> {
  return apiPost("/auth/login", loginData);
}

export async function getCurrentUser(): Promise<{ user: AuthResponse["user"] }> {
  return apiGet("/auth/me");
}
