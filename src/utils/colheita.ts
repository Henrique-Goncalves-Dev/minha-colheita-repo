const DIAS_MIN = 60;
const DIAS_MAX = 180;

function hashNome(nome: string): number {
  const normalizado = nome.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalizado.length; i++) {
    hash = (hash * 31 + normalizado.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function tempoColheitaEstimadoDias(nomeSemente: string): number {
  const faixa = DIAS_MAX - DIAS_MIN + 1;
  return DIAS_MIN + (hashNome(nomeSemente) % faixa);
}

export function dataColheitaEstimada(
  dataPlantacao: string | null,
  nomeSemente: string,
): Date | null {
  if (!dataPlantacao) return null;
  const base = new Date(dataPlantacao);
  if (Number.isNaN(base.getTime())) return null;
  const dias = tempoColheitaEstimadoDias(nomeSemente);
  const colheita = new Date(base);
  colheita.setDate(colheita.getDate() + dias);
  return colheita;
}

export function diasRestantes(dataColheita: Date): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(dataColheita);
  alvo.setHours(0, 0, 0, 0);
  const ms = alvo.getTime() - hoje.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}
