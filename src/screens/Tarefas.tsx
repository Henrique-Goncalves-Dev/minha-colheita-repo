import { Plus, Check } from "lucide-react";
import { Card, HeaderBar, PrimaryButton, Pill, SectionLabel, colors } from "../agro-ui";

export function Tarefas({ 
  tarefas, 
  onToggle, 
  onAddNovo, 
  onBack, 
  onSpeak 
}: { 
  tarefas: any[]; 
  onToggle: (id: number) => void;
  onAddNovo: () => void;
  onBack: () => void; 
  onSpeak: (t: string) => void;
}) {
  const speakAll = () =>
    onSpeak(tarefas.map((t) => `${t.title}, ${t.when}, ${t.done ? "feito" : "pendente"}`).join(". "));

  const pending = tarefas.filter((t) => !t.done).length;
  const total = tarefas.length;
  const pct = total === 0 ? 0 : Math.round(((total - pending) / total) * 100);

  return (
    <div className="min-h-full" style={{ background: colors.cream }}>
      <HeaderBar
        title="Tarefas"
        subtitle={`${pending} pendentes de ${total}`}
        onBack={onBack}
        onVoice={speakAll}
      />

      <div className="p-4 space-y-4">
        {/* Progress */}
        <Card style={{ padding: 16 }} elevated>
          <div className="flex items-center justify-between mb-2">
            <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 15 }}>
              Concluído hoje
            </p>
            <Pill tone="green">{pct}%</Pill>
          </div>
          <div style={{ height: 10, background: colors.wash, borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${colors.light} 0%, ${colors.field} 100%)`,
                borderRadius: 999,
                transition: "width 0.3s",
              }}
            />
          </div>
        </Card>

        <SectionLabel>Agenda do campo</SectionLabel>

        {tarefas.map((t) => (
          <button type="button"
            key={t.id}
            onClick={() => onToggle(t.id)}
            className="w-full flex items-center gap-3 active:scale-[0.99] transition-transform text-left"
            style={{
              background: colors.white,
              border: `1px solid ${t.done ? colors.borderSoft : colors.border}`,
              borderRadius: 16,
              padding: 14,
              opacity: t.done ? 0.65 : 1,
              boxShadow: "0 1px 2px rgba(15,51,16,0.04)",
            }}
          >
            <div
              className="flex items-center justify-center transition-colors"
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                border: `2px solid ${t.done ? colors.field : colors.border}`,
                background: t.done ? colors.field : colors.white,
                color: colors.white,
                flexShrink: 0,
              }}
            >
              {t.done && <Check size={18} strokeWidth={3} />}
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: colors.wash,
                border: `1px solid ${colors.border}`,
                fontSize: 26,
                flexShrink: 0,
              }}
            >
              {t.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p
                style={{
                  fontFamily: "Nunito",
                  fontWeight: 900,
                  color: colors.ink,
                  fontSize: 16,
                  textDecoration: t.done ? "line-through" : "none",
                  letterSpacing: -0.2,
                }}
              >
                {t.title}
              </p>
              <p style={{ color: colors.earthSoft, fontSize: 12, fontWeight: 800, marginTop: 2 }}>
                {t.when}
              </p>
            </div>
            {!t.done && (
              <Pill tone={t.tone === "today" ? "gold" : "neutral"}>
                {t.tone === "today" ? "Hoje" : "Em breve"}
              </Pill>
            )}
          </button>
        ))}

        <div className="pt-1 pb-2">
          <PrimaryButton
            onClick={onAddNovo}
            icon={<Plus size={18} strokeWidth={2.8} />}
          >
            Adicionar tarefa
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}