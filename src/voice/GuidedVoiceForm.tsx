import { useEffect } from 'react';
import { Mic, Volume2, RotateCcw, X, AlertTriangle, Loader2 } from 'lucide-react';
import { useVoiceFlow, type FlowAnswers } from './useVoiceFlow';
import type { VoiceStep } from './voiceFlow';

interface GuidedVoiceFormProps {
  steps: VoiceStep[];
  title: string;
  summaryLabel?: (field: string, value: string | number) => string;
  onComplete: (answers: FlowAnswers) => void;
  onCancel: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  idle: 'Preparando...',
  speaking: 'Falando...',
  listening: 'Escutando...',
  confirming: 'Confirme: sim ou não?',
  done: 'Concluído',
  cancelled: 'Cancelado',
  error: 'Erro',
};

export function GuidedVoiceForm({
  steps,
  title,
  summaryLabel,
  onComplete,
  onCancel,
}: GuidedVoiceFormProps) {
  const flow = useVoiceFlow({ steps, onComplete, onCancel, summaryLabel });

  useEffect(() => {
    flow.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isListening = flow.status === 'listening' || flow.status === 'confirming';
  const isSpeaking = flow.status === 'speaking';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="bg-[#EEF2F0] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#345348]">{title}</h2>
          <button
            onClick={flow.cancel}
            className="bg-[#E3E8E5] p-2 rounded-full active:bg-gray-300"
            aria-label="Fechar"
          >
            <X size={20} className="text-[#345348]" />
          </button>
        </div>

        {flow.status !== 'error' && flow.supported && (
          <>
            <div className="text-sm text-[#4A6F62]">
              Pergunta {Math.min(flow.stepIndex + 1, steps.length)} de {steps.length}
            </div>

            <div className="bg-white rounded-2xl p-5 min-h-[120px] flex items-center">
              <p className="text-[#345348] text-lg leading-snug">{flow.currentQuestion || 'Aguarde...'}</p>
            </div>

            <div className="flex items-center justify-center gap-3 py-2">
              <div
                className={`rounded-full p-4 transition-colors ${
                  isListening
                    ? 'bg-red-500'
                    : isSpeaking
                    ? 'bg-[#345348]'
                    : 'bg-[#658B7D]'
                }`}
              >
                {isListening ? (
                  <Mic size={32} color="white" />
                ) : isSpeaking ? (
                  <Volume2 size={32} color="white" />
                ) : (
                  <Loader2 size={32} color="white" className="animate-spin" />
                )}
              </div>
              <span className="text-[#345348] font-medium">{STATUS_LABEL[flow.status] ?? ''}</span>
            </div>

            {flow.lastHeard && (
              <div className="text-sm text-[#4A6F62] text-center italic">
                Última fala ouvida: "{flow.lastHeard}"
              </div>
            )}

            <button
              onClick={flow.repeat}
              className="w-full bg-[#E3E8E5] text-[#345348] rounded-2xl py-3 text-base font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <RotateCcw size={20} />
              Repetir pergunta
            </button>
          </>
        )}

        {(flow.status === 'error' || !flow.supported) && (
          <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 items-center text-center">
            <AlertTriangle size={36} className="text-red-500" />
            <p className="text-[#345348] text-base">
              {flow.errorMessage ||
                'Voz não suportada neste navegador. Use o teclado para preencher os campos.'}
            </p>
          </div>
        )}

        <button
          onClick={flow.cancel}
          className="w-full bg-[#345348] text-white rounded-2xl py-4 text-lg font-medium active:scale-95 transition-transform"
        >
          Cancelar e usar teclado
        </button>
      </div>
    </div>
  );
}
