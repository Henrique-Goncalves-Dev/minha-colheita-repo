import { useState, useEffect } from "react";
import { AlertTriangle, Droplets, MapPin, Loader2 } from "lucide-react";
import { Card, HeaderBar, SectionLabel, colors } from "../agro-ui";
import { getClima, type ClimaResponse } from "../services/api";

export function Clima({ onBack, onSpeak }: { onBack: () => void; onSpeak: (t: string) => void }) {
  const [clima, setClima] = useState<ClimaResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClima()
      .then(setClima)
      .catch(() => onSpeak("Erro ao carregar dados climáticos"))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !clima) {
    return (
      <div className="min-h-full" style={{ background: colors.cream }}>
        <HeaderBar title="Clima" subtitle="Previsão da semana" onBack={onBack} />
        <div className="flex-1 flex items-center justify-center" style={{ minHeight: 300 }}>
          <Loader2 size={32} color={colors.field} className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full" style={{ background: colors.cream }}>
      <HeaderBar
        title="Clima"
        subtitle="Previsão da semana"
        onBack={onBack}
        onVoice={() =>
          onSpeak(
            `Hoje ${clima.temperatura}, ${clima.descricao}. ${clima.alerta ? `Atenção: ${clima.alerta}` : ""} Umidade do solo ${clima.umidade_solo}%, ${clima.umidade_solo_status}.`
          )
        }
      />

      <div className="p-4 space-y-4">
        {/* Hero */}
        <div
          style={{
            background: `linear-gradient(135deg, #4FA85F 0%, ${colors.field} 50%, ${colors.forest} 100%)`,
            color: colors.white,
            borderRadius: 20,
            padding: 20,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 14px 30px rgba(15,51,16,0.25)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -30,
              width: 200,
              height: 200,
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              filter: "blur(30px)",
            }}
          />
          <div className="flex items-center justify-between relative">
            <div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} strokeWidth={2.5} />
                <p style={{ fontSize: 12, fontWeight: 800, opacity: 0.9 }}>{clima.cidade}</p>
              </div>
              <p
                style={{
                  fontFamily: "Nunito",
                  fontWeight: 900,
                  fontSize: 56,
                  letterSpacing: -2,
                  lineHeight: 1,
                  marginTop: 4,
                }}
              >
                {clima.temperatura}
              </p>
              <p style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>{clima.descricao}</p>
              <p style={{ fontSize: 12, opacity: 0.85, fontWeight: 700, marginTop: 2 }}>Máx {clima.temp_max} · Mín {clima.temp_min}</p>
            </div>
            <span style={{ fontSize: 96, lineHeight: 1, filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.25))" }}>
              {clima.emoji}
            </span>
          </div>
        </div>

        {/* Forecast */}
        <Card style={{ padding: 14 }} elevated>
          <SectionLabel>Próximos dias</SectionLabel>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {clima.previsao.map((f) => (
              <div
                key={f.dia}
                className="flex flex-col items-center"
                style={{
                  background: colors.cream,
                  borderRadius: 14,
                  padding: "10px 4px",
                  border: `1px solid ${colors.borderSoft}`,
                }}
              >
                <p style={{ fontWeight: 900, color: colors.earth, fontSize: 12 }}>{f.dia}</p>
                <span style={{ fontSize: 30, marginTop: 6 }}>{f.emoji}</span>
                <p
                  style={{
                    fontFamily: "Nunito",
                    fontWeight: 900,
                    color: colors.ink,
                    fontSize: 15,
                    marginTop: 6,
                  }}
                >
                  {f.temp_max}
                </p>
                <p style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 800 }}>{f.temp_min}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Alert */}
        {clima.alerta && (
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.goldLight} 0%, #FBE4B0 100%)`,
              border: `1.5px solid ${colors.gold}`,
              borderRadius: 16,
              padding: 14,
              display: "flex",
              gap: 12,
              alignItems: "center",
              boxShadow: "0 4px 14px rgba(232,160,32,0.18)",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: colors.gold,
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={22} color={colors.white} strokeWidth={2.5} />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "Nunito",
                  fontWeight: 900,
                  color: colors.goldDeep,
                  fontSize: 14,
                  letterSpacing: 0.2,
                }}
              >
                Alerta
              </p>
              <p style={{ color: colors.earth, fontWeight: 700, fontSize: 13, marginTop: 2 }}>
                {clima.alerta}
              </p>
            </div>
          </div>
        )}

        {/* Soil humidity */}
        <Card style={{ padding: 16 }}>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "#E0F0FA",
                border: "1px solid #B8DDF0",
              }}
            >
              <Droplets size={24} color="#3A7AA8" strokeWidth={2.4} />
            </div>
            <div className="flex-1">
              <p style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 800, letterSpacing: 0.3 }}>
                UMIDADE DO SOLO
              </p>
              <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 18 }}>
                {clima.umidade_solo}% — {clima.umidade_solo_status}
              </p>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              height: 10,
              background: colors.wash,
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${clima.umidade_solo}%`,
                height: "100%",
                background: "linear-gradient(90deg, #6BBDE8 0%, #3A7AA8 100%)",
                borderRadius: 999,
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
