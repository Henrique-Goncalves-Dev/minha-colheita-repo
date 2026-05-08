import React from "react";
import { ChevronRight, Leaf } from "lucide-react";
import { Card, HeaderBar, Pill, colors } from "../agro-ui";

export function HistoricoPlantio({ 
  historico, 
  onBack, 
  onSpeak,
  onOpenDetails
}: { 
  historico: any[]; 
  onBack: () => void; 
  onSpeak: (t: string) => void;
  onOpenDetails: (semente: any) => void;
}) {
  const speakAll = () => {
    if (historico.length === 0) {
      onSpeak("Seu histórico está vazio. Nenhuma colheita foi feita ainda.");
      return;
    }
    const text = historico.map((s) => `${s.name} colhido em ${s.dataColheita}`).join(". ");
    onSpeak(`Você tem ${historico.length} colheitas registradas. ` + text);
  };

  return (
    <div className="min-h-full" style={{ background: colors.cream }}>
      <HeaderBar
        title="Histórico"
        subtitle={`${historico.length} colheitas`}
        onBack={onBack}
        onVoice={speakAll}
      />

      <div className="p-4 space-y-4">
        {historico.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div 
              className="mx-auto flex items-center justify-center mb-4"
              style={{ width: 80, height: 80, borderRadius: 999, background: colors.wash, color: colors.field }}
            >
              <Leaf size={40} strokeWidth={2} />
            </div>
            <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 20 }}>
              Nenhuma colheita ainda
            </p>
            <p style={{ color: colors.earthSoft, fontSize: 14, fontWeight: 800, marginTop: 8 }}>
              Quando você confirmar a colheita de uma plantação, ela aparecerá aqui no seu histórico.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {historico.map((s, index) => (
              <div 
                key={`${s.name}-${index}`} 
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
                        background: s.bg || "#E0F2D9",
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
                        Colhido em {s.dataColheita}
                      </p>
                    </div>
                    <Pill tone="gold" style={{ background: "#E8A020", color: "white", border: "none" }}>
                      🏆
                    </Pill>
                    <ChevronRight size={20} color={colors.earthSoft} strokeWidth={2.4} />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}