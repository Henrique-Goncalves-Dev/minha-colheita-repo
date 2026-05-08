import { Calendar, Package, Wallet, Plus, TrendingUp } from "lucide-react";
import { Card, HeaderBar, PrimaryButton, Pill, SectionLabel, colors } from "../agro-ui";
import { ImageWithFallback } from "../components/ImageWithFallback";

export function Plantio({ onBack, onSpeak }: { onBack: () => void; onSpeak: (t: string) => void }) {
  const data = {
    cultura: "Milho",
    emoji: "🌽",
    quando: "12 de Março, 2026",
    quanto: "30 sacos",
    gasto: "R$ 850,00",
    progresso: 62,
    diasRestantes: 28,
  };

  return (
    <div className="min-h-full" style={{ background: colors.cream }}>
      <HeaderBar
        title="Meu Plantio"
        subtitle="Cultura em andamento"
        onBack={onBack}
        onVoice={() =>
          onSpeak(
            `Você plantou ${data.cultura} no dia ${data.quando}, plantou ${data.quanto} e gastou ${data.gasto}.`
          )
        }
      />

      <div className="p-4 space-y-4">
        {/* Hero card with photo */}
        <div
          style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 14px 30px rgba(15,51,16,0.18)",
          }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1773171168524-230c8da06f45?auto=format&fit=crop&w=900&q=80"
            alt="Lavoura de milho"
            className="w-full"
            style={{ height: 180, objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, rgba(15,51,16,0.1) 0%, ${colors.forestDeep} 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: colors.white,
            }}
          >
            <div className="flex justify-between items-start">
              <Pill tone="gold">🌾 Em crescimento</Pill>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  fontSize: 32,
                }}
              >
                {data.emoji}
              </div>
            </div>
            <div>
              <p style={{ opacity: 0.85, fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>
                Semente plantada
              </p>
              <p style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 28, letterSpacing: -0.5 }}>
                {data.cultura}
              </p>
            </div>
          </div>
        </div>

        {/* Progress card */}
        <Card style={{ padding: 16 }} elevated>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} color={colors.field} strokeWidth={2.5} />
              <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 15 }}>
                Progresso até a colheita
              </p>
            </div>
            <Pill tone="green">{data.progresso}%</Pill>
          </div>
          <div style={{ height: 10, background: colors.wash, borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                width: `${data.progresso}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${colors.light} 0%, ${colors.field} 100%)`,
                borderRadius: 999,
              }}
            />
          </div>
          <p style={{ marginTop: 8, color: colors.earthSoft, fontSize: 12, fontWeight: 800 }}>
            Faltam aproximadamente <b style={{ color: colors.ink }}>{data.diasRestantes} dias</b>
          </p>
        </Card>

        <SectionLabel>Detalhes do plantio</SectionLabel>

        <div className="grid grid-cols-2 gap-3">
          <InfoCard icon={<Calendar size={20} color={colors.field} />} label="Quando plantou" value={data.quando} />
          <InfoCard icon={<Package size={20} color={colors.field} />} label="Quanto plantou" value={data.quanto} />
        </div>

        <Card style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }} elevated>
          <div
            className="flex items-center justify-center"
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "#FDECEC",
              border: `1px solid #F8D5D5`,
            }}
          >
            <Wallet size={24} color={colors.alert} strokeWidth={2.4} />
          </div>
          <div className="flex-1">
            <p style={{ color: colors.earthSoft, fontSize: 12, fontWeight: 800, letterSpacing: 0.3 }}>
              QUANTO GASTOU
            </p>
            <p
              style={{
                fontFamily: "Nunito",
                fontWeight: 900,
                color: colors.alert,
                fontSize: 24,
                letterSpacing: -0.5,
              }}
            >
              {data.gasto}
            </p>
          </div>
        </Card>

        <div className="pt-1 pb-2">
          <PrimaryButton
            onClick={() => onSpeak("Registrar novo plantio")}
            icon={<Plus size={18} strokeWidth={2.8} />}
          >
            Registrar novo plantio
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card style={{ padding: 14 }}>
      <div
        className="flex items-center justify-center mb-2"
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: colors.wash,
          border: `1px solid ${colors.border}`,
        }}
      >
        {icon}
      </div>
      <p style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 800, letterSpacing: 0.3 }}>
        {label.toUpperCase()}
      </p>
      <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 16, marginTop: 2 }}>
        {value}
      </p>
    </Card>
  );
}
