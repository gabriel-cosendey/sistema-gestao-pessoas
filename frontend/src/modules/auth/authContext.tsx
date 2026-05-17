import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse, LoginData, User } from "../../types/user";
import { loginRequest } from "./authApi";

type AuthContextState = {
  user: User | null;
  token: string | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

function loadStoredAuth() {
  const raw = localStorage.getItem("authState");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
}

function storeAuth(state: AuthResponse | null) {
  if (state) {
    localStorage.setItem("authState", JSON.stringify(state));
    localStorage.setItem("authToken", state.token);
  } else {
    localStorage.removeItem("authState");
    localStorage.removeItem("authToken");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadStoredAuth();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
  }, []);

  const login = async (data: LoginData) => {
    const result = await loginRequest(data);
    setUser(result.user);
    setToken(result.token);
    storeAuth(result);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storeAuth(null);
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    const current = loadStoredAuth();
    if (current) {
      storeAuth({ ...current, user: updated });
    }
  };

  const value = useMemo(
    () => ({ user, token, login, logout, updateUser }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
