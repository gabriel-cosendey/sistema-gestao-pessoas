const API_URL = import.meta.env.VITE_API_URL ?? "https://sistema-gestao-pessoas-1.onrender.com";

function getAuthToken() {
  return localStorage.getItem("authToken");
}

function buildHeaders(isJson = true) {
  const headers: Record<string, string> = {};
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(options.body !== undefined),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = (payload as any).error?.message || response.statusText;
    throw new Error(message);
  }

  return payload as T;
}

export async function apiGet<T>(path: string) {
  return request<T>(path, { method: "GET" });
}

export async function apiPost<T>(path: string, body: unknown) {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export async function apiPut<T>(path: string, body: unknown) {
  return request<T>(path, { method: "PUT", body: JSON.stringify(body) });
}

export async function apiDelete<T>(path: string) {
  return request<T>(path, { method: "DELETE" });
}
