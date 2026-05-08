import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Card, HeaderBar, PrimaryButton, Pill, SectionLabel, colors } from "../agro-ui";

type Task = { id: number; emoji: string; title: string; when: string; done: boolean; tone: "today" | "soon" };

const INITIAL: Task[] = [
  { id: 1, emoji: "💧", title: "Regar o milho", when: "Hoje, manhã", done: false, tone: "today" },
  { id: 2, emoji: "🌾", title: "Colher tomate", when: "Hoje, tarde", done: false, tone: "today" },
  { id: 3, emoji: "🐔", title: "Alimentar galinhas", when: "Amanhã", done: true, tone: "soon" },
  { id: 4, emoji: "🚜", title: "Arar terreno novo", when: "Sexta-feira", done: false, tone: "soon" },
];

export function Tarefas({ onBack, onSpeak }: { onBack: () => void; onSpeak: (t: string) => void }) {
  const [tasks, setTasks] = useState(INITIAL);

  const toggle = (id: number) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const speakAll = () =>
    onSpeak(tasks.map((t) => `${t.title}, ${t.when}, ${t.done ? "feito" : "pendente"}`).join(". "));

  const pending = tasks.filter((t) => !t.done).length;
  const total = tasks.length;
  const pct = Math.round(((total - pending) / total) * 100);

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

        {tasks.map((t) => (
          <button
            key={t.id}
            onClick={() => toggle(t.id)}
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
            onClick={() => onSpeak("Adicionar nova tarefa")}
            icon={<Plus size={18} strokeWidth={2.8} />}
          >
            Adicionar tarefa
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
