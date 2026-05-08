import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { Card, HeaderBar, SectionLabel, colors } from "../agro-ui";

const MONTHS = [
  { m: "Jan", v: 320 },
  { m: "Fev", v: 410 },
  { m: "Mar", v: 280 },
  { m: "Abr", v: 520 },
  { m: "Mai", v: 850, current: true },
];

export function Renda({ onBack, onSpeak }: { onBack: () => void; onSpeak: (t: string) => void }) {
  const gasto = "R$ 2.380";
  const venda = "R$ 5.200";
  const lucro = "R$ 2.820";
  const max = Math.max(...MONTHS.map((x) => x.v));

  return (
    <div className="min-h-full" style={{ background: colors.cream }}>
      <HeaderBar
        title="Renda"
        subtitle="Resumo financeiro"
        onBack={onBack}
        onVoice={() =>
          onSpeak(
            `Você gastou ${gasto}. A estimativa de venda é ${venda}. Seu lucro estimado é de ${lucro}.`
          )
        }
      />

      <div className="p-4 space-y-4">
        {/* Big lucro card */}
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDeep} 100%)`,
            color: colors.white,
            borderRadius: 20,
            padding: 20,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 14px 30px rgba(232,160,32,0.35)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -20,
              width: 140,
              height: 140,
              borderRadius: 999,
              background: "rgba(255,255,255,0.18)",
              filter: "blur(20px)",
            }}
          />
          <div className="flex items-center gap-2 mb-2 relative">
            <Star size={18} strokeWidth={2.8} fill="white" />
            <p style={{ fontWeight: 900, fontSize: 13, letterSpacing: 0.4, textTransform: "uppercase" }}>
              Lucro estimado
            </p>
          </div>
          <p
            style={{
              fontFamily: "Nunito",
              fontWeight: 900,
              fontSize: 40,
              letterSpacing: -1,
              lineHeight: 1,
              position: "relative",
            }}
          >
            {lucro}
          </p>
          <div className="flex items-center gap-1 mt-2 relative">
            <TrendingUp size={16} strokeWidth={2.8} />
            <p style={{ fontWeight: 800, fontSize: 12 }}>+18% vs. mês passado</p>
          </div>
        </div>

        {/* Gasto / venda */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryTile
            icon={<TrendingDown size={20} color={colors.alert} strokeWidth={2.5} />}
            label="Total gasto"
            value={gasto}
            tone="red"
          />
          <SummaryTile
            icon={<TrendingUp size={20} color={colors.field} strokeWidth={2.5} />}
            label="Estimativa venda"
            value={venda}
            tone="green"
          />
        </div>

        {/* Chart */}
        <Card style={{ padding: 18 }} elevated>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>Gastos por mês</SectionLabel>
            <p style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 800 }}>2026</p>
          </div>
          <div className="flex items-end justify-between gap-2" style={{ height: 150 }}>
            {MONTHS.map((mo) => {
              const h = (mo.v / max) * 120;
              return (
                <div key={mo.m} className="flex flex-col items-center flex-1">
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: mo.current ? colors.goldDeep : colors.earthSoft,
                      marginBottom: 4,
                    }}
                  >
                    {mo.v}
                  </p>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 32,
                      height: h,
                      background: mo.current
                        ? `linear-gradient(180deg, ${colors.gold} 0%, ${colors.goldDeep} 100%)`
                        : `linear-gradient(180deg, ${colors.light} 0%, ${colors.field} 100%)`,
                      borderRadius: "10px 10px 4px 4px",
                      boxShadow: mo.current ? "0 4px 10px rgba(232,160,32,0.4)" : "none",
                    }}
                  />
                  <p
                    style={{
                      marginTop: 8,
                      fontSize: 11,
                      fontWeight: 900,
                      color: mo.current ? colors.goldDeep : colors.earthSoft,
                    }}
                  >
                    {mo.m}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SummaryTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "red" | "green";
}) {
  const fg = tone === "red" ? colors.alert : colors.field;
  return (
    <Card style={{ padding: 14 }}>
      <div
        className="flex items-center justify-center mb-2"
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: tone === "red" ? "#FDECEC" : colors.wash,
          border: `1px solid ${tone === "red" ? "#F8D5D5" : colors.border}`,
        }}
      >
        {icon}
      </div>
      <p style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 800, letterSpacing: 0.3 }}>
        {label.toUpperCase()}
      </p>
      <p style={{ fontFamily: "Nunito", fontWeight: 900, color: fg, fontSize: 20, letterSpacing: -0.3 }}>
        {value}
      </p>
    </Card>
  );
}
