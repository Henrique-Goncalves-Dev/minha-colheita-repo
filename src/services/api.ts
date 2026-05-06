const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

export interface ApiError {
  status: number;
  detail: string;
}

function saveToken(token: string): void {
  localStorage.setItem('mc_token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('mc_token');
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw { status: res.status, detail: body.detail } as ApiError;
  }
  return res.json() as Promise<T>;
}

export async function registrar(nome: string, telefone: string, pin: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, telefone, pin }),
  });
  await handleResponse(res);
}

export async function entrar(telefone: string, pin: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telefone, pin }),
  });
  const data = await handleResponse<{ access_token: string }>(res);
  saveToken(data.access_token);
}
