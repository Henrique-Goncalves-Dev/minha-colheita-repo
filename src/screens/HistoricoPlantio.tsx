import { ChevronRight, Leaf } from "lucide-react";
import { Card, HeaderBar, Pill, colors } from "../agro-ui";
import type { VendaResponse } from "../services/api";

export function HistoricoPlantio({
  vendas,
  onBack,
  onSpeak,
  onOpenDetails,
}: {
  vendas: VendaResponse[];
  onBack: () => void;
  onSpeak: (t: string) => void;
  onOpenDetails: (venda: VendaResponse) => void;
}) {
  const speakAll = () => {
    if (vendas.length === 0) {
      onSpeak("Seu histórico está vazio. Nenhuma venda foi feita ainda.");
      return;
    }
    const text = vendas.map((v) => `${v.nome_semente}, ${v.quantidade} unidades por R$ ${v.valor_recebido.toFixed(0)}`).join(". ");
    onSpeak(`Você tem ${vendas.length} vendas registradas. ${text}`);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Sem data";
    return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
  };

  return (
    <div className="min-h-full" style={{ background: colors.cream }}>
      <HeaderBar
        title="Vendas"
        subtitle={`${vendas.length} registros`}
        onBack={onBack}
        onVoice={speakAll}
      />

      <div className="p-4 space-y-4">
        {vendas.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div
              className="mx-auto flex items-center justify-center mb-4"
              style={{ width: 80, height: 80, borderRadius: 999, background: colors.wash, color: colors.field }}
            >
              <Leaf size={40} strokeWidth={2} />
            </div>
            <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 20 }}>
              Nenhuma venda ainda
            </p>
            <p style={{ color: colors.earthSoft, fontSize: 14, fontWeight: 800, marginTop: 8 }}>
              Quando você registrar vendas, elas aparecerão aqui no seu histórico.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {vendas.map((v) => (
              <div
                key={v.id}
                onClick={() => onOpenDetails(v)}
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
                        background: "#E0F2D9",
                        fontSize: 32,
                        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.04)",
                      }}
                    >
                      🌾
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
                        {v.nome_semente}
                      </p>
                      <p style={{ color: colors.earthSoft, fontSize: 12, fontWeight: 800 }}>
                        {formatDate(v.data_da_compra)} · {v.quantidade} un · R$ {v.valor_recebido.toFixed(0)}
                      </p>
                    </div>
                    <Pill tone="gold">💰</Pill>
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