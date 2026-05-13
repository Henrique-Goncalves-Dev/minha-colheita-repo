const UNITS: Record<string, number> = {
  zero: 0, um: 1, uma: 1, dois: 2, duas: 2, tres: 3, três: 3,
  quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9,
  dez: 10, onze: 11, doze: 12, treze: 13, catorze: 14, quatorze: 14,
  quinze: 15, dezesseis: 16, dezessete: 17, dezoito: 18, dezenove: 19,
};

const TENS: Record<string, number> = {
  vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, cinquênta: 50,
  sessenta: 60, setenta: 70, oitenta: 80, noventa: 90,
};

const HUNDREDS: Record<string, number> = {
  cem: 100, cento: 100, duzentos: 200, trezentos: 300, quatrocentos: 400,
  quinhentos: 500, seiscentos: 600, setecentos: 700, oitocentos: 800, novecentos: 900,
};

const SCALE_THOUSAND = ['mil', 'mils'];

function stripDiacritics(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function tokensFromText(s: string): string[] {
  return stripDiacritics(s.toLowerCase())
    .replace(/[.,;:!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((t) => t && t !== 'e');
}

function parseSubThousand(tokens: string[]): { value: number; consumed: number } | null {
  let i = 0;
  let value = 0;
  let matched = false;

  if (tokens[i] && stripDiacritics(tokens[i]) in HUNDREDS) {
    value += HUNDREDS[stripDiacritics(tokens[i])];
    matched = true;
    i++;
  }
  if (tokens[i] && stripDiacritics(tokens[i]) in TENS) {
    value += TENS[stripDiacritics(tokens[i])];
    matched = true;
    i++;
  }
  if (tokens[i] && stripDiacritics(tokens[i]) in UNITS) {
    value += UNITS[stripDiacritics(tokens[i])];
    matched = true;
    i++;
  }
  return matched ? { value, consumed: i } : null;
}

function wordsToNumber(text: string): number | null {
  const tokens = tokensFromText(text);
  if (tokens.length === 0) return null;

  let total = 0;
  let i = 0;
  let anyMatch = false;

  const before = parseSubThousand(tokens.slice(i));
  if (before) {
    if (tokens[i + before.consumed] && SCALE_THOUSAND.includes(tokens[i + before.consumed])) {
      total += (before.value || 1) * 1000;
      i += before.consumed + 1;
      anyMatch = true;
    }
  } else if (tokens[i] && SCALE_THOUSAND.includes(tokens[i])) {
    total += 1000;
    i++;
    anyMatch = true;
  }

  const rest = parseSubThousand(tokens.slice(i));
  if (rest) {
    total += rest.value;
    i += rest.consumed;
    anyMatch = true;
  }

  return anyMatch ? total : null;
}

export function normalizeNumber(text: string): number | null {
  if (!text) return null;
  const cleaned = text.toLowerCase().replace(',', '.').trim();

  const digitMatch = cleaned.match(/-?\d+(\.\d+)?/);
  if (digitMatch) {
    const n = Number(digitMatch[0]);
    return Number.isFinite(n) ? n : null;
  }

  return wordsToNumber(cleaned);
}

export function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
}

export function normalizeYesNo(text: string): boolean | null {
  const t = stripDiacritics(text.toLowerCase().trim());
  if (!t) return null;
  const yes = ['sim', 'isso', 'isso mesmo', 'claro', 'correto', 'certo', 'positivo', 'pode', 'confirmo', 'confirma', 'ok', 'okay', 'tah', 'ta'];
  const no = ['nao', 'errado', 'negativo', 'incorreto', 'cancela', 'cancelar', 'refaz', 'refazer'];
  if (yes.some((w) => t === w || t.startsWith(w + ' '))) return true;
  if (no.some((w) => t === w || t.startsWith(w + ' '))) return false;
  return null;
}
