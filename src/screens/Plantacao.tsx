import { Plus, ChevronRight } from "lucide-react";
import { Card, HeaderBar, Pill, SectionLabel, colors } from "../agro-ui";

export function Plantacao({ 
  sementes, 
  onBack, 
  onSpeak, 
  onAddNovo,
  onOpenDetails
}: { 
  sementes: any[]; 
  onBack: () => void; 
  onSpeak: (t: string) => void;
  onAddNovo: () => void;
  onOpenDetails: (semente: any) => void;
}) {
  const speakAll = () => {
    const text = sementes.map((s) =>
      s.ready ? `${s.name} pronto para colher` : `${s.name}, colheita em ${s.days} dias`
    ).join(". ");
    onSpeak(text);
  };

  return (
    <div className="min-h-full" style={{ background: colors.cream }}>
      <HeaderBar
        title="Plantação"
        subtitle={`${sementes.length} sementes cadastradas`}
        onBack={onBack}
        onVoice={speakAll}
      />

      <div className="p-4 space-y-4">
        {/* Summary */}
        <Card style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }} elevated>
          <div
            className="flex items-center justify-center"
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${colors.wash} 0%, #DCEEDC 100%)`,
              border: `1px solid ${colors.border}`,
              fontSize: 30,
            }}
          >
            🌿
          </div>
          <div className="flex-1">
            <p style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 800, letterSpacing: 0.3 }}>
              PRÓXIMA COLHEITA
            </p>
            <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 18 }}>
              Alface · em 12 dias
            </p>
          </div>
          <Pill tone="green">{sementes.filter(s => !s.ready).length} ativas</Pill>
        </Card>

        <SectionLabel>Sementes cadastradas</SectionLabel>

        <div className="space-y-3">
          {sementes.map((s) => (
            <div 
              key={s.name} 
              onClick={() => onOpenDetails(s)} 
              className="cursor-pointer active:scale-[0.98] transition-transform block"
            >
              <Card style={{ padding: 12 }}>
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 14,
                      background: s.bg,
                      fontSize: 32,
                      boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.04)",
                    }}
                  >
                    {s.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontFamily: "Nunito",
                        fontWeight: 900,
                        fontSize: 17,
                        color: colors.ink,
                        letterSpacing: -0.2,
                      }}
                    >
                      {s.name}
                    </p>
                    <p style={{ color: colors.earthSoft, fontSize: 12, fontWeight: 800 }}>
                      {s.ready ? "Pronto para colher" : `Plantado em ${s.planted} · ~${s.days} dias`}
                    </p>
                    {!s.ready && (
                      <div
                        style={{
                          marginTop: 6,
                          height: 5,
                          background: colors.wash,
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(15, 100 - s.days)}%`,
                            height: "100%",
                            background: s.accent,
                            borderRadius: 999,
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {s.ready ? <Pill tone="gold">✅ Pronto</Pill> : <Pill tone="neutral">{s.days}d</Pill>}
                  <ChevronRight size={20} color={colors.earthSoft} strokeWidth={2.4} />
                </div>
              </Card>
            </div>
          ))}
        </div>

        <button type="button"
          onClick={onAddNovo}
          className="w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{
            marginTop: 4,
            background: `linear-gradient(180deg, ${colors.earth} 0%, #5F3F25 100%)`,
            color: colors.white,
            height: 52,
            borderRadius: 12,
            fontFamily: "Nunito",
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: 0.3,
            boxShadow: "0 6px 14px rgba(122,82,48,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          <Plus size={18} strokeWidth={2.8} />
          ADICIONAR SEMENTE
        </button>
      </div>
    </div>
  );
}