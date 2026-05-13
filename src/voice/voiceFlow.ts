import { normalizeNumber, normalizeText } from './normalizers';

export type StepType = 'text' | 'number';
export type StepValue = string | number;

export interface VoiceStep {
  field: string;
  question: string;
  type: StepType;
  parse: (raw: string) => StepValue | null;
  errorPrompt: string;
}

const numberStep = (field: string, question: string, errorPrompt: string): VoiceStep => ({
  field,
  question,
  type: 'number',
  parse: (raw) => {
    const n = normalizeNumber(raw);
    return n !== null && n >= 0 ? n : null;
  },
  errorPrompt,
});

const textStep = (field: string, question: string, errorPrompt: string): VoiceStep => ({
  field,
  question,
  type: 'text',
  parse: (raw) => {
    const t = normalizeText(raw);
    return t.length > 0 ? t : null;
  },
  errorPrompt,
});

export const plantioFlow: VoiceStep[] = [
  textStep(
    'nomeSemente',
    'Qual semente você quer cadastrar?',
    'Não consegui entender a semente. Vou perguntar de novo.',
  ),
  numberStep(
    'quantidade',
    'Qual a quantidade de sementes?',
    'Não consegui entender a quantidade. Diga apenas o número.',
  ),
  numberStep(
    'custo',
    'Qual foi o custo total em reais?',
    'Não consegui entender o custo. Diga apenas o valor em reais.',
  ),
];
