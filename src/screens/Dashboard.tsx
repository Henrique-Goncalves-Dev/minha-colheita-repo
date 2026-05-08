import { Sprout, Leaf, Wallet, CloudSun, ListChecks, UserRound, Volume2, Bell } from "lucide-react";
import { colors } from "../agro-ui";

export type ScreenKey = "plantio" | "plantacao" | "renda" | "clima" | "tarefas" | "perfil";

const TILES: {
  key: ScreenKey;
  emoji: string;
  label: string;
  hint: string;
  Icon: any;
  dot?: "green" | "gold";
}[] = [
  { key: "plantacao", emoji: "🌿", label: "Plantação", hint: "5 sementes", Icon: Leaf },
  { key: "plantio", emoji: "🌱", label: "Plantio", hint: "3 ativos", Icon: Sprout, dot: "green" },
  { key: "renda", emoji: "💰", label: "Renda", hint: "+R$ 2.820", Icon: Wallet, dot: "gold" },
  { key: "clima", emoji: "⛅", label: "Clima", hint: "28° hoje", Icon: CloudSun, dot: "gold" },
  { key: "tarefas", emoji: "📋", label: "Tarefas", hint: "3 pendentes", Icon: ListChecks, dot: "green" },
  { key: "perfil", emoji: "👤", label: "Perfil", hint: "Sua conta", Icon: UserRound },
];

export function Dashboard({
  name,
  onOpen,
  onSpeak,
}: {
  name: string;
  onOpen: (s: ScreenKey) => void;
  onSpeak: () => void;
}) {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className="min-h-full" style={{ background: colors.cream }}>
      <div style={{ height: 20, background: colors.statusBar }} />

      {/* Hero header */}
      <div
        style={{
          background: `linear-gradient(180deg, ${colors.forest} 0%, ${colors.forestDeep} 100%)`,
          color: colors.white,
          padding: "16px 16px 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -30,
            width: 180,
            height: 180,
            borderRadius: 999,
            background: "rgba(232,160,32,0.15)",
            filter: "blur(20px)",
          }}
        />
        <div className="flex items-center justify-between relative">
          <div className="min-w-0">
            <p style={{ fontSize: 12, opacity: 0.75, fontWeight: 700, textTransform: "capitalize" }}>{today}</p>
            <h1
              style={{
                fontFamily: "Nunito",
                fontWeight: 900,
                fontSize: 24,
                margin: "2px 0 0",
                letterSpacing: -0.4,
              }}
            >
              Bom dia, {name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Notificações"
              className="flex items-center justify-center relative"
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: colors.white,
              }}
            >
              <Bell size={18} strokeWidth={2.5} />
              <span
                style={{
                  position: "absolute",
                  top: 8,
                  right: 9,
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: colors.gold,
                  boxShadow: `0 0 0 2px ${colors.forestDeep}`,
                }}
              />
            </button>
            <div
              className="flex items-center justify-center"
              style={{
                width: 46,
                height: 46,
                borderRadius: 999,
                background: colors.goldLight,
                border: `2px solid ${colors.gold}`,
                fontSize: 24,
              }}
            >
              👨‍🌾
            </div>
          </div>
        </div>
      </div>

      {/* Voice CTA card overlapping */}
      <div className="px-4" style={{ marginTop: -42 }}>
        <button
          onClick={onSpeak}
          className="w-full flex items-center gap-3 active:scale-[0.99] transition-transform"
          style={{
            background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDeep} 100%)`,
            color: colors.white,
            borderRadius: 18,
            padding: "14px 16px",
            boxShadow: "0 14px 28px rgba(232,160,32,0.35), inset 0 1px 0 rgba(255,255,255,0.22)",
            textAlign: "left",
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "rgba(255,255,255,0.22)",
            }}
          >
            <Volume2 size={22} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 15 }}>Toque para ouvir o resumo</p>
            <p style={{ fontSize: 12, opacity: 0.92, fontWeight: 700 }}>Tudo do seu campo em voz alta</p>
          </div>
        </button>
      </div>

      {/* Quick stat strip */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-2">
        {[
          { v: "3", l: "Plantios" },
          { v: "5", l: "Sementes" },
          { v: "R$ 2.8k", l: "Lucro" },
        ].map((s) => (
          <div
            key={s.l}
            style={{
              background: colors.white,
              border: `1px solid ${colors.borderSoft}`,
              borderRadius: 14,
              padding: "12px 8px",
              textAlign: "center",
              boxShadow: "0 1px 2px rgba(15,51,16,0.04)",
            }}
          >
            <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.field, fontSize: 18 }}>{s.v}</p>
            <p style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 800 }}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Section */}
      <div className="px-4 mt-5">
        <p
          style={{
            color: colors.field,
            fontFamily: "Nunito",
            fontWeight: 900,
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          O que você quer fazer?
        </p>

        <div className="grid grid-cols-2 gap-3 pb-6">
          {TILES.map((t) => (
            <button
              key={t.key}
              onClick={() => onOpen(t.key)}
              className="relative flex flex-col items-start active:scale-[0.97] transition-transform overflow-hidden"
              style={{
                background: colors.white,
                border: `1px solid ${colors.borderSoft}`,
                borderRadius: 18,
                padding: 14,
                aspectRatio: "1 / 1.05",
                boxShadow: "0 4px 10px rgba(15,51,16,0.06)",
                textAlign: "left",
              }}
            >
              {/* Icon badge */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${colors.wash} 0%, #DCEEDC 100%)`,
                  border: `1px solid ${colors.border}`,
                  position: "relative",
                }}
              >
                <span style={{ fontSize: 30, lineHeight: 1 }}>{t.emoji}</span>
              </div>

              {t.dot && (
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: t.dot === "gold" ? colors.gold : colors.light,
                    boxShadow: `0 0 0 3px ${colors.white}, 0 0 0 4px ${
                      t.dot === "gold" ? "rgba(232,160,32,0.3)" : "rgba(82,177,82,0.3)"
                    }`,
                  }}
                />
              )}

              <div style={{ marginTop: "auto" }}>
                <p
                  style={{
                    fontFamily: "Nunito",
                    fontWeight: 900,
                    color: colors.ink,
                    fontSize: 18,
                    letterSpacing: -0.2,
                  }}
                >
                  {t.label}
                </p>
                <p style={{ color: colors.earthSoft, fontSize: 12, fontWeight: 800, marginTop: 2 }}>
                  {t.hint}
                </p>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: colors.wash,
                  border: `1px solid ${colors.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.field,
                  fontFamily: "Nunito",
                  fontWeight: 900,
                  fontSize: 16,
                }}
              >
                ›
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
