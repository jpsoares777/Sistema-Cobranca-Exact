const DB_KEY = "cobranca_db_v1";

export interface AppDB {
  lastDate: string;
  cobrados: number[];
  ausentes: number[];
  cobradosValores: { id: number; valor: number }[];
  registroPagamentos: Record<number, { id: number; data: string; parcela: number; valor: number; metodo: string }[]>;
  quitadosClientes: unknown[];
  ordemClientesIds: number[];
  cobradosExtras: unknown[];
  emprestimentos: unknown[];
  novosClientesIds: number[];
  renovacoesIds: number[];
  clientesAdicionaisHoje: unknown[];
  novosClientesOutras: unknown[];
  agendamentos: unknown[];
  despesas: unknown[];
  rendimentos: unknown[];
}

export function loadDB(): AppDB | null {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppDB;
  } catch {
    return null;
  }
}

export function saveDB(data: Partial<AppDB>) {
  try {
    const current = loadDB() ?? {};
    localStorage.setItem(DB_KEY, JSON.stringify({ ...current, ...data }));
  } catch {}
}

export function clearDB() {
  try {
    localStorage.removeItem(DB_KEY);
  } catch {}
}

export function getTodayStr() {
  return new Date().toLocaleDateString("pt-BR");
}
