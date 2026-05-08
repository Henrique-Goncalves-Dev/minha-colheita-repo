import React from "react";
import { Calendar, Package, Wallet, CheckCircle } from "lucide-react";
import { Card, HeaderBar, Pill, SectionLabel, colors } from "../agro-ui";

export function DetalheColheita({ 
  semente, 
  onBack, 
  onSpeak 
}: { 
  semente: any; 
  onBack: () => void; 
  onSpeak: (t: string) => void; 
}) {
  if (!semente) return null;

  const quantidade = semente.quantidadeReal || "Não informado";
  const custo = semente.custoReal ? `R$ ${semente.custoReal}` : "R$ 0,00";

  return (
    <div className="min-h-full flex flex-col" style={{ background: colors.cream, paddingBottom: 24 }}>
      <HeaderBar
        title="Histórico"
        subtitle="Colheita Finalizada"
        onBack={onBack}
        onVoice={() =>
          onSpeak(
            `Histórico de ${semente.name}. Plantado em ${semente.planted} e colhido com sucesso em ${semente.dataColheita}. Você plantou ${quantidade} e gastou ${custo}.`
          )
        }
      />

      <div className="p-4 space-y-4">
        {/* Hero card com a foto */}
        <div
          style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 14px 30px rgba(15,51,16,0.18)",
            height: 200,
            backgroundImage: `url('https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=900&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
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
              <Pill tone="gold" style={{ background: "#E8A020", color: "white", border: "none" }}>
                🏆 Colhido
              </Pill>
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
                {semente.emoji}
              </div>
            </div>
            <div>
              <p style={{ opacity: 0.85, fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>
                Fruto colhido
              </p>
              <p style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 32, letterSpacing: -0.5 }}>
                {semente.name}
              </p>
            </div>
          </div>
        </div>

        {/* Card de Conclusão */}
        <Card style={{ padding: 16, background: "#E0F2D9", border: "1px solid #C4E6B3" }} elevated>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ background: colors.field, padding: 8, borderRadius: 12, color: "white" }}>
                <CheckCircle size={24} strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.forestDeep, fontSize: 16 }}>
                  Colheita Registrada
                </p>
                <p style={{ color: colors.earth, fontSize: 13, fontWeight: 800 }}>
                  Em {semente.dataColheita}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <SectionLabel>Detalhes do registro</SectionLabel>

        <div className="grid grid-cols-2 gap-3">
          <InfoCard icon={<Calendar size={20} color={colors.field} />} label="Quando plantou" value={semente.planted} />
          <InfoCard icon={<Package size={20} color={colors.field} />} label="Quanto plantou" value={quantidade} />
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
              CUSTO TOTAL
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
              {custo}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card style={{ padding: 14, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
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
      <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 15, marginTop: 2 }}>
        {value}
      </p>
    </Card>
  );
}