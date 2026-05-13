import { Plus, ChevronRight } from "lucide-react";
import { Card, HeaderBar, Pill, SectionLabel, colors } from "../agro-ui";
import type { PlantioResponse } from "../services/api";

export function Plantacao({
  plantios,
  onBack,
  onSpeak,
  onAddNovo,
  onOpenDetails,
}: {
  plantios: PlantioResponse[];
  onBack: () => void;
  onSpeak: (t: string) => void;
  onAddNovo: () => void;
  onOpenDetails: (plantio: PlantioResponse) => void;
}) {
  const speakAll = () => {
    if (plantios.length === 0) {
      onSpeak("Nenhuma plantação registrada ainda. Toque no botão para adicionar.");
      return;
    }
    const text = plantios.map((p) => `${p.nome_semente}, ${p.quantidade} unidades`).join(". ");
    onSpeak(`Você tem ${plantios.length} plantações: ${text}`);
  };

  // Find the plantio with the most recent date
  const proximaColheita = plantios.length > 0
    ? plantios.reduce((a, b) => {
        if (!a.data_plantacao) return b;
        if (!b.data_plantacao) return a;
        return new Date(a.data_plantacao) > new Date(b.data_plantacao) ? a : b;
      })
    : null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Sem data";
    return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
  };

  const SEED_COLORS: Record<string, { bg: string; accent: string; emoji: string }> = {
    milho: { bg: "#FFF4D6", accent: "#E8A020", emoji: "🌽" },
    feijão: { bg: "#F0E0CC", accent: "#7A5230", emoji: "🫘" },
    feijao: { bg: "#F0E0CC", accent: "#7A5230", emoji: "🫘" },
    tomate: { bg: "#FFE0DD", accent: "#D63C3C", emoji: "🍅" },
    alface: { bg: "#E0F2D9", accent: "#52B152", emoji: "🥬" },
    cenoura: { bg: "#FFE3CC", accent: "#E8A020", emoji: "🥕" },
    soja: { bg: "#FFF8E0", accent: "#C8821A", emoji: "🌾" },
    arroz: { bg: "#F5F5E0", accent: "#8E6B4A", emoji: "🌾" },
    café: { bg: "#F0E0CC", accent: "#5F3F25", emoji: "☕" },
    cafe: { bg: "#F0E0CC", accent: "#5F3F25", emoji: "☕" },
    mandioca: { bg: "#FFF4D6", accent: "#7A5230", emoji: "🥔" },
  };

  const getSeedStyle = (name: string) => {
    const key = name.toLowerCase().trim();
    return SEED_COLORS[key] || { bg: "#E0F2D9", accent: "#52B152", emoji: "🌱" };
  };

  return (
    <div className="min-h-full" style={{ background: colors.cream }}>
      <HeaderBar
        title="Plantação"
        subtitle={`${plantios.length} sementes cadastradas`}
        onBack={onBack}
        onVoice={speakAll}
      />

      <div className="p-4 space-y-4">
        {/* Summary */}
        {proximaColheita && (
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
              {getSeedStyle(proximaColheita.nome_semente).emoji}
            </div>
            <div className="flex-1">
              <p style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 800, letterSpacing: 0.3 }}>
                ÚLTIMO PLANTIO
              </p>
              <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 18 }}>
                {proximaColheita.nome_semente} · {proximaColheita.quantidade}un
              </p>
            </div>
            <Pill tone="green">{plantios.length} ativas</Pill>
          </Card>
        )}

        {plantios.length === 0 && (
          <div className="text-center py-12 px-4">
            <div
              className="mx-auto flex items-center justify-center mb-4"
              style={{ width: 80, height: 80, borderRadius: 999, background: colors.wash, fontSize: 40 }}
            >
              🌱
            </div>
            <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 20 }}>
              Nenhuma plantação
            </p>
            <p style={{ color: colors.earthSoft, fontSize: 14, fontWeight: 800, marginTop: 8 }}>
              Toque no botão abaixo para registrar sua primeira plantação.
            </p>
          </div>
        )}

        {plantios.length > 0 && <SectionLabel>Sementes cadastradas</SectionLabel>}

        <div className="space-y-3">
          {plantios.map((p) => {
            const style = getSeedStyle(p.nome_semente);
            return (
              <div
                key={p.id}
                onClick={() => onOpenDetails(p)}
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
                        background: style.bg,
                        fontSize: 32,
                        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.04)",
                      }}
                    >
                      {style.emoji}
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
                        {p.nome_semente}
                      </p>
                      <p style={{ color: colors.earthSoft, fontSize: 12, fontWeight: 800 }}>
                        {formatDate(p.data_plantacao)} · {p.quantidade} un · R$ {p.custo.toFixed(0)}
                      </p>
                    </div>
                    <Pill tone="neutral">{p.quantidade}</Pill>
                    <ChevronRight size={20} color={colors.earthSoft} strokeWidth={2.4} />
                  </div>
                </Card>
              </div>
            );
          })}
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