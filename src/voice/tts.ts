const synth: SpeechSynthesis | undefined =
  typeof window !== 'undefined' ? window.speechSynthesis : undefined;

export function isTTSAvailable(): boolean {
  return !!synth;
}

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!synth) return resolve([]);
    const list = synth.getVoices();
    if (list.length > 0) {
      voicesLoaded = true;
      return resolve(list);
    }
    const onChange = () => {
      voicesLoaded = true;
      synth.removeEventListener('voiceschanged', onChange);
      resolve(synth.getVoices());
    };
    synth.addEventListener('voiceschanged', onChange);
    setTimeout(() => {
      synth.removeEventListener('voiceschanged', onChange);
      resolve(synth.getVoices());
    }, 1500);
  });
}

async function pickPtVoice(): Promise<SpeechSynthesisVoice | null> {
  if (cachedVoice) return cachedVoice;
  const voices = voicesLoaded && synth ? synth.getVoices() : await loadVoices();
  const pt =
    voices.find((v) => /pt[-_]br/i.test(v.lang)) ||
    voices.find((v) => /^pt/i.test(v.lang)) ||
    null;
  cachedVoice = pt;
  return pt;
}

export function cancelSpeech(): void {
  if (synth && (synth.speaking || synth.pending)) synth.cancel();
}

export async function speak(text: string, opts?: { rate?: number }): Promise<void> {
  if (!synth || !text.trim()) return;
  cancelSpeech();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'pt-BR';
  utter.rate = opts?.rate ?? 0.9;
  utter.pitch = 1;
  const voice = await pickPtVoice();
  if (voice) utter.voice = voice;

  return new Promise<void>((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      resolve();
    };
    utter.onend = finish;
    utter.onerror = finish;
    synth.speak(utter);
  });
}
