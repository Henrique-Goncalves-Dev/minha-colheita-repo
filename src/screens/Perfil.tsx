import { Mic, Bell, Settings, LogOut, ChevronRight, MapPin, BadgeCheck } from "lucide-react";
import { HeaderBar, colors } from "../agro-ui";

const STATS = [
  { v: "3", label: "Plantios ativos" },
  { v: "12", label: "Colheitas feitas" },
  { v: "R$ 18k", label: "Renda no ano" },
];

const ACTIONS: { Icon: any; label: string }[] = [
  { Icon: Mic, label: "Configurar voz" },
  { Icon: Bell, label: "Notificações" },
  { Icon: Settings, label: "Configurações" },
];

export function Perfil({
  name,
  onBack,
  onSpeak,
  onLogout,
}: {
  name: string;
  onBack: () => void;
  onSpeak: (t: string) => void;
  onLogout: () => void;
}) {
  const place = "Goiânia, GO";
  return (
    <div className="min-h-full" style={{ background: colors.cream }}>
      <HeaderBar
        title="Perfil"
        subtitle="Sua conta"
        onBack={onBack}
        onVoice={() =>
          onSpeak(
            `${name}, de ${place}. Você tem 3 plantios ativos, 12 colheitas feitas e renda no ano de 18 mil reais.`
          )
        }
      />

      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(180deg, ${colors.forest} 0%, ${colors.forestDeep} 100%)`,
          color: colors.white,
          padding: "20px 16px 64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: 999,
            background: "rgba(232,160,32,0.18)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="flex items-center justify-center relative"
          style={{
            width: 100,
            height: 100,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${colors.goldLight} 0%, #F8DEA6 100%)`,
            border: `3px solid ${colors.gold}`,
            fontSize: 60,
            boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
          }}
        >
          👨‍🌾
        </div>
        <div className="flex items-center gap-1.5 mt-3 relative">
          <p style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 22, letterSpacing: -0.3 }}>{name}</p>
          <BadgeCheck size={20} color={colors.gold} fill={colors.goldLight} />
        </div>
        <div className="flex items-center gap-1 relative">
          <MapPin size={14} strokeWidth={2.5} />
          <p style={{ fontWeight: 800, fontSize: 13, opacity: 0.9 }}>{place}</p>
        </div>
      </div>

      <div className="p-4 space-y-4" style={{ marginTop: -44 }}>
        {/* Stats */}
        <div
          style={{
            background: colors.white,
            border: `1px solid ${colors.borderSoft}`,
            borderRadius: 18,
            padding: 14,
            boxShadow: "0 8px 24px rgba(15,51,16,0.1)",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Stat v={STATS[0].v} l={STATS[0].label} />
          <div style={{ width: 1, height: 36, background: colors.borderSoft }} />
          <Stat v={STATS[1].v} l={STATS[1].label} />
          <div style={{ width: 1, height: 36, background: colors.borderSoft }} />
          <Stat v={STATS[2].v} l={STATS[2].label} />
        </div>

        {/* Actions */}
        <div
          style={{
            background: colors.white,
            border: `1px solid ${colors.borderSoft}`,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 1px 2px rgba(15,51,16,0.04)",
          }}
        >
          {ACTIONS.map((a, i) => (
            <button
              key={a.label}
              onClick={() => onSpeak(a.label)}
              className="w-full flex items-center gap-3"
              style={{
                padding: "16px 14px",
                borderBottom: i < ACTIONS.length - 1 ? `1px solid ${colors.borderSoft}` : "none",
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: colors.wash,
                  border: `1px solid ${colors.border}`,
                  color: colors.field,
                }}
              >
                <a.Icon size={20} strokeWidth={2.4} />
              </div>
              <span
                style={{
                  fontFamily: "Nunito",
                  fontWeight: 900,
                  color: colors.ink,
                  flex: 1,
                  textAlign: "left",
                  fontSize: 15,
                }}
              >
                {a.label}
              </span>
              <ChevronRight size={20} color={colors.earthSoft} strokeWidth={2.4} />
            </button>
          ))}
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{
            background: colors.white,
            border: `1.5px solid #F8D5D5`,
            color: colors.alert,
            height: 52,
            borderRadius: 14,
            fontFamily: "Nunito",
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: 0.3,
          }}
        >
          <LogOut size={18} strokeWidth={2.5} />
          SAIR DA CONTA
        </button>
      </div>
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <p
        style={{
          fontFamily: "Nunito",
          fontWeight: 900,
          color: colors.field,
          fontSize: 22,
          letterSpacing: -0.5,
        }}
      >
        {v}
      </p>
      <p style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 800 }}>{l}</p>
    </div>
  );
}
