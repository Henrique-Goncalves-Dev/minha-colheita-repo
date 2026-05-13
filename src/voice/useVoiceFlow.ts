import { useCallback, useEffect, useRef, useState } from 'react';
import { speak, cancelSpeech, isTTSAvailable } from './tts';
import { listen, isSTTAvailable, STTError } from './stt';
import { normalizeYesNo } from './normalizers';
import type { VoiceStep } from './voiceFlow';

export type FlowStatus =
  | 'idle'
  | 'speaking'
  | 'listening'
  | 'confirming'
  | 'done'
  | 'cancelled'
  | 'error';

export type FlowAnswers = Record<string, string | number>;

interface UseVoiceFlowOpts {
  steps: VoiceStep[];
  onComplete: (answers: FlowAnswers) => void;
  onCancel?: () => void;
  summaryLabel?: (field: string, value: string | number) => string;
}

export interface UseVoiceFlowState {
  status: FlowStatus;
  stepIndex: number;
  currentQuestion: string;
  lastHeard: string;
  answers: FlowAnswers;
  errorMessage: string;
  start: () => void;
  cancel: () => void;
  repeat: () => void;
  supported: boolean;
}

const LISTEN_TIMEOUT_MS = 10_000;

export function useVoiceFlow({
  steps,
  onComplete,
  onCancel,
  summaryLabel,
}: UseVoiceFlowOpts): UseVoiceFlowState {
  const [status, setStatus] = useState<FlowStatus>('idle');
  const [stepIndex, setStepIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [lastHeard, setLastHeard] = useState('');
  const [answers, setAnswers] = useState<FlowAnswers>({});
  const [errorMessage, setErrorMessage] = useState('');

  const abortRef = useRef<AbortController | null>(null);
  const cancelledRef = useRef(false);
  const supported = isTTSAvailable() && isSTTAvailable();

  const startFlow = useCallback(async () => {
    if (!supported) {
      setErrorMessage('Voz não suportada neste navegador. Use o teclado.');
      setStatus('error');
      return;
    }

    cancelledRef.current = false;
    setErrorMessage('');
    setLastHeard('');
    setAnswers({});

    const buildSummary = (final: FlowAnswers) => {
      const parts = steps.map((s) => {
        const v = final[s.field];
        return summaryLabel ? summaryLabel(s.field, v) : `${s.field}: ${v}`;
      });
      return `Você disse: ${parts.join(', ')}. Está correto? Diga sim ou não.`;
    };

    const listenOnce = async (): Promise<string | null> => {
      abortRef.current = new AbortController();
      try {
        return await listen({ timeoutMs: LISTEN_TIMEOUT_MS, signal: abortRef.current.signal });
      } catch (err) {
        if (err instanceof STTError) {
          if (err.code === 'aborted') {
            cancelledRef.current = true;
            return null;
          }
          if (err.code === 'no-speech') return '';
          if (err.code === 'not-allowed') {
            setErrorMessage('Permissão de microfone negada. Use o teclado.');
            setStatus('error');
            cancelledRef.current = true;
            return null;
          }
        }
        setErrorMessage(err instanceof Error ? err.message : 'Erro desconhecido');
        setStatus('error');
        cancelledRef.current = true;
        return null;
      }
    };

    while (!cancelledRef.current) {
      const collected: FlowAnswers = {};
      setAnswers({});

      let i = 0;
      while (i < steps.length && !cancelledRef.current) {
        const step = steps[i];
        setStepIndex(i);
        setCurrentQuestion(step.question);
        setStatus('speaking');
        await speak(step.question);
        if (cancelledRef.current) return;

        setStatus('listening');
        const raw = await listenOnce();
        if (cancelledRef.current) return;

        if (raw === '' || raw === null) {
          await speak('Não ouvi nada. Vou repetir a pergunta.');
          continue;
        }

        setLastHeard(raw);
        const parsed = step.parse(raw);
        if (parsed === null) {
          await speak(step.errorPrompt);
          continue;
        }

        collected[step.field] = parsed;
        setAnswers({ ...collected });
        i++;
      }

      if (cancelledRef.current) return;

      let confirmed: boolean | null = null;
      while (confirmed === null && !cancelledRef.current) {
        setStatus('speaking');
        const summary = buildSummary(collected);
        setCurrentQuestion(summary);
        await speak(summary);
        if (cancelledRef.current) return;

        setStatus('confirming');
        const reply = await listenOnce();
        if (cancelledRef.current) return;
        if (reply === '' || reply === null) {
          await speak('Não ouvi sua resposta. Diga sim ou não.');
          continue;
        }
        setLastHeard(reply);
        const yn = normalizeYesNo(reply);
        if (yn === null) {
          await speak('Não entendi. Por favor responda sim ou não.');
          continue;
        }
        confirmed = yn;
      }

      if (cancelledRef.current) return;

      if (confirmed === true) {
        setStatus('done');
        onComplete(collected);
        return;
      }

      await speak('Vamos refazer.');
    }
  }, [supported, steps, summaryLabel, onComplete]);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    cancelSpeech();
    abortRef.current?.abort();
    setStatus('cancelled');
    onCancel?.();
  }, [onCancel]);

  const repeat = useCallback(() => {
    if (status === 'listening' || status === 'confirming') {
      abortRef.current?.abort();
    } else {
      cancelSpeech();
    }
    void speak(currentQuestion);
  }, [status, currentQuestion]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      cancelSpeech();
      abortRef.current?.abort();
    };
  }, []);

  return {
    status,
    stepIndex,
    currentQuestion,
    lastHeard,
    answers,
    errorMessage,
    start: () => void startFlow(),
    cancel,
    repeat,
    supported,
  };
}
