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

// ─── Auth ────────────────────────────────────────────────

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

export interface PerfilResponse {
  id: number;
  nome: string;
  telefone: string;
  total_plantios: number;
  total_sementes_plantadas: number;
  total_vendas: number;
  total_arrecadado: number;
}

export async function getPerfil(): Promise<PerfilResponse> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<PerfilResponse>(res);
}

export function logout(): void {
  localStorage.removeItem('mc_token');
}

// ─── Plantio ─────────────────────────────────────────────

export interface PlantioPayload {
  nome_semente: string;
  data_plantacao: string | null;
  quantidade: number;
  custo: number;
}

export interface PlantioResponse {
  id: number;
  nome_semente: string;
  data_plantacao: string | null;
  quantidade: number;
  custo: number;
}

export async function criarPlantio(dados: PlantioPayload): Promise<PlantioResponse> {
  const res = await fetch(`${BASE_URL}/plantios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(dados),
  });
  return handleResponse<PlantioResponse>(res);
}

export async function listarPlantios(): Promise<PlantioResponse[]> {
  const res = await fetch(`${BASE_URL}/plantios`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<PlantioResponse[]>(res);
}

export interface PlantioUpdatePayload {
  nome_semente?: string;
  data_plantacao?: string | null;
  quantidade?: number;
  custo?: number;
}

export async function atualizarPlantio(id: number, dados: PlantioUpdatePayload): Promise<PlantioResponse> {
  const res = await fetch(`${BASE_URL}/plantios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(dados),
  });
  return handleResponse<PlantioResponse>(res);
}

export async function excluirPlantio(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/plantios/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw { status: res.status, detail: body.detail } as ApiError;
  }
}

export interface EstoqueItem {
  id_planta: number;
  nome_semente: string;
  total_disponivel: number;
}

export async function listarEstoque(): Promise<EstoqueItem[]> {
  const res = await fetch(`${BASE_URL}/plantios/estoque`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<EstoqueItem[]>(res);
}

// ─── Venda ───────────────────────────────────────────────

export interface VendaPayload {
  nome_semente: string;
  quantidade: number;
  valor_recebido: number;
  data_da_compra?: string | null;
}

export interface VendaResponse {
  id: number;
  nome_semente: string;
  quantidade: number;
  valor_recebido: number;
  data_da_compra: string | null;
}

export interface VendaUpdatePayload {
  quantidade?: number;
  valor_recebido?: number;
  data_da_compra?: string | null;
}

export interface GastoPorSemente {
  nome_semente: string;
  id_planta: number;
  quantidade_plantada: number;
  custo_total: number;
}

export interface ResumoFinanceiro {
  gastos_por_semente: GastoPorSemente[];
  ultima_venda: VendaResponse | null;
  vendas: VendaResponse[];
}

export interface EstimativaLucro {
  nome_semente: string;
  quantidade: number;
  custo_estimado: number;
  receita_estimada: number | null;
  lucro_estimado: number | null;
  sem_historico: boolean;
}

export async function registrarVenda(dados: VendaPayload): Promise<VendaResponse> {
  const res = await fetch(`${BASE_URL}/vendas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(dados),
  });
  return handleResponse<VendaResponse>(res);
}

export async function listarVendas(): Promise<VendaResponse[]> {
  const res = await fetch(`${BASE_URL}/vendas`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<VendaResponse[]>(res);
}

export async function getResumoFinanceiro(): Promise<ResumoFinanceiro> {
  const res = await fetch(`${BASE_URL}/vendas/resumo`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<ResumoFinanceiro>(res);
}

export async function getEstimativaLucro(idPlanta: number, quantidade: number): Promise<EstimativaLucro> {
  const params = new URLSearchParams({ id_planta: String(idPlanta), quantidade: String(quantidade) });
  const res = await fetch(`${BASE_URL}/vendas/estimativa?${params}`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<EstimativaLucro>(res);
}

export async function atualizarVenda(id: number, dados: VendaUpdatePayload): Promise<VendaResponse> {
  const res = await fetch(`${BASE_URL}/vendas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(dados),
  });
  return handleResponse<VendaResponse>(res);
}

export async function excluirVenda(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/vendas/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw { status: res.status, detail: body.detail } as ApiError;
  }
}

// ─── Tarefas ─────────────────────────────────────────────

export interface TarefaPayload {
  emoji?: string;
  titulo: string;
  quando?: string | null;
}

export interface TarefaResponse {
  id: number;
  emoji: string;
  titulo: string;
  quando: string | null;
  concluida: boolean;
  criado_em: string;
}

export interface TarefaUpdatePayload {
  emoji?: string;
  titulo?: string;
  quando?: string | null;
  concluida?: boolean;
}

export async function criarTarefa(dados: TarefaPayload): Promise<TarefaResponse> {
  const res = await fetch(`${BASE_URL}/tarefas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(dados),
  });
  return handleResponse<TarefaResponse>(res);
}

export async function listarTarefas(): Promise<TarefaResponse[]> {
  const res = await fetch(`${BASE_URL}/tarefas`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<TarefaResponse[]>(res);
}

export async function atualizarTarefa(id: number, dados: TarefaUpdatePayload): Promise<TarefaResponse> {
  const res = await fetch(`${BASE_URL}/tarefas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(dados),
  });
  return handleResponse<TarefaResponse>(res);
}

export async function toggleTarefa(id: number): Promise<TarefaResponse> {
  const res = await fetch(`${BASE_URL}/tarefas/${id}/toggle`, {
    method: 'PATCH',
    headers: { ...authHeaders() },
  });
  return handleResponse<TarefaResponse>(res);
}

export async function excluirTarefa(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tarefas/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw { status: res.status, detail: body.detail } as ApiError;
  }
}

// ─── Clima ───────────────────────────────────────────────

export interface PrevisaoDia {
  dia: string;
  emoji: string;
  temp_max: string;
  temp_min: string;
}

export interface ClimaResponse {
  cidade: string;
  temperatura: string;
  descricao: string;
  temp_max: string;
  temp_min: string;
  emoji: string;
  umidade_solo: number;
  umidade_solo_status: string;
  alerta: string | null;
  previsao: PrevisaoDia[];
}

export async function getClima(): Promise<ClimaResponse> {
  const res = await fetch(`${BASE_URL}/clima`, {
    headers: { ...authHeaders() },
  });
  return handleResponse<ClimaResponse>(res);
}
