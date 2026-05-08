type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type RecognitionCtor = new () => Recognition;

function getCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function isSTTAvailable(): boolean {
  return getCtor() !== null;
}

export type STTErrorCode = 'unsupported' | 'not-allowed' | 'no-speech' | 'aborted' | 'network' | 'unknown';

export class STTError extends Error {
  code: STTErrorCode;
  constructor(code: STTErrorCode, message?: string) {
    super(message || code);
    this.code = code;
  }
}

export interface ListenOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
}

export function listen(opts: ListenOptions = {}): Promise<string> {
  const Ctor = getCtor();
  if (!Ctor) return Promise.reject(new STTError('unsupported', 'SpeechRecognition não disponível neste navegador'));

  return new Promise<string>((resolve, reject) => {
    const rec = new Ctor();
    rec.lang = 'pt-BR';
    rec.interimResults = false;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    let settled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = null;
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      if (opts.signal) opts.signal.removeEventListener('abort', onAbort);
    };

    const finishOk = (text: string) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(text);
    };

    const finishErr = (err: STTError) => {
      if (settled) return;
      settled = true;
      cleanup();
      try { rec.abort(); } catch { /* ignore */ }
      reject(err);
    };

    const onAbort = () => finishErr(new STTError('aborted', 'Cancelado pelo usuário'));

    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript ?? '';
      finishOk(transcript.trim());
    };

    rec.onerror = (e) => {
      const code =
        e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'not-allowed'
        : e.error === 'no-speech' ? 'no-speech'
        : e.error === 'aborted' ? 'aborted'
        : e.error === 'network' ? 'network'
        : 'unknown';
      finishErr(new STTError(code, e.error));
    };

    rec.onend = () => {
      if (!settled) finishErr(new STTError('no-speech', 'Nenhuma fala detectada'));
    };

    if (opts.signal) {
      if (opts.signal.aborted) return onAbort();
      opts.signal.addEventListener('abort', onAbort);
    }

    if (opts.timeoutMs) {
      timeoutId = setTimeout(() => {
        try { rec.stop(); } catch { /* ignore */ }
      }, opts.timeoutMs);
    }

    try {
      rec.start();
    } catch (err) {
      finishErr(new STTError('unknown', String(err)));
    }
  });
}
