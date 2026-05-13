import { ArrowLeft, Volume2, TrendingUp, Calendar, Package, Wallet, ShoppingCart } from "lucide-react";
import { Card, colors } from "../agro-ui";
import type { PlantioResponse } from "../services/api";

export function DetalheSemente({
  plantio,
  onBack,
  onSpeak,
  onSell,
}: {
  plantio: PlantioResponse | null;
  onBack: () => void;
  onSpeak: (t: string) => void;
  onSell: () => void;
}) {
  if (!plantio) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Sem data";
    return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");
  };

  const explicarTela = () => {
    let texto = `Detalhes do plantio de ${plantio.nome_semente}. `;
    texto += `Quantidade: ${plantio.quantidade} unidades. `;
    texto += `Custo: R$ ${plantio.custo.toFixed(2)}. `;
    texto += `Plantado em ${formatDate(plantio.data_plantacao)}.`;
    onSpeak(texto);
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: colors.cream, paddingBottom: 24 }}>
      {/* Header with Background */}
      <div
        style={{
          position: "relative",
          padding: "20px 16px 30px",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          background: `linear-gradient(rgba(20, 50, 20, 0.4), rgba(10, 30, 10, 0.9)), url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center justify-between mb-8 relative z-10">
          <button type="button"
            onClick={onBack}
            className="p-2 -ml-2 rounded-full flex items-center justify-center active:scale-95"
            style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(4px)" }}
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <button type="button"
            onClick={explicarTela}
            className="p-2 -mr-2 bg-[#E8A020] rounded-full active:scale-95 shadow-md flex items-center justify-center animate-pulse"
            style={{ width: 44, height: 44, color: "white" }}
          >
            <Volume2 size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.9)",
              border: `1.5px solid ${colors.field}`,
              color: colors.field,
              fontWeight: 900,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            🌱 Em crescimento
          </div>
          <div
            className="flex items-center justify-center shadow-lg"
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              fontSize: 32,
            }}
          >
            🌱
          </div>
        </div>

        <div className="text-center relative z-10 mt-4">
          <p style={{ color: "#A3D9A3", fontSize: 11, fontWeight: 900, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Semente Plantada
          </p>
          <h1 style={{ fontFamily: "serif", fontWeight: 900, fontSize: 36, color: "white", marginTop: 4 }}>
            {plantio.nome_semente}
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-6 relative z-20">
        {/* Progress Card */}
        <Card style={{ padding: 16 }} elevated>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2" style={{ color: colors.ink, fontWeight: 900 }}>
              <TrendingUp size={20} color={colors.field} strokeWidth={2.5} />
              Informações do plantio
            </div>
            <div
              style={{
                border: `1px solid ${colors.field}`,
                color: colors.field,
                borderRadius: 999,
                padding: "2px 10px",
                fontWeight: 900,
                fontSize: 12,
              }}
            >
              {plantio.quantidade} un
            </div>
          </div>
          <p style={{ textAlign: "center", color: colors.earth, fontSize: 13, fontWeight: 800 }}>
            Estoque atual: <span style={{ color: colors.ink }}>{plantio.quantidade} unidades</span>
          </p>
        </Card>

        <div className="text-center mt-6 mb-2">
          <p style={{ color: colors.earthSoft, fontSize: 12, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase" }}>
            Detalhes do Plantio
          </p>
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.wash, display: "flex", alignItems: "center", justifyContent: "center", color: colors.field, marginBottom: 12, border: `1px solid ${colors.border}` }}>
              <Calendar size={20} strokeWidth={2.5} />
            </div>
            <p style={{ color: colors.earth, fontSize: 11, fontWeight: 900, letterSpacing: 0.5, marginBottom: 4 }}>
              QUANDO PLANTOU
            </p>
            <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 15 }}>
              {formatDate(plantio.data_plantacao)}
            </p>
          </Card>

          <Card style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.wash, display: "flex", alignItems: "center", justifyContent: "center", color: colors.field, marginBottom: 12, border: `1px solid ${colors.border}` }}>
              <Package size={20} strokeWidth={2.5} />
            </div>
            <p style={{ color: colors.earth, fontSize: 11, fontWeight: 900, letterSpacing: 0.5, marginBottom: 4 }}>
              QUANTO PLANTOU
            </p>
            <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 15 }}>
              {plantio.quantidade} unidades
            </p>
          </Card>
        </div>

        {/* Cost Card */}
        <Card style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#FDECEC", display: "flex", alignItems: "center", justifyContent: "center", color: colors.alert, marginBottom: 12, border: `1px solid #F8D5D5` }}>
            <Wallet size={24} strokeWidth={2.5} />
          </div>
          <p style={{ color: colors.earth, fontSize: 11, fontWeight: 900, letterSpacing: 0.5, marginBottom: 4 }}>
            QUANTO GASTOU
          </p>
          <p style={{ fontFamily: "serif", fontWeight: 900, color: colors.alert, fontSize: 24 }}>
            R$ {plantio.custo.toFixed(2)}
          </p>
        </Card>

        {/* Sell Button */}
        {plantio.quantidade > 0 && (
          <button type="button"
            onClick={onSell}
            className="w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform mt-4"
            style={{
              background: `linear-gradient(180deg, ${colors.gold} 0%, ${colors.goldDeep} 100%)`,
              color: colors.white,
              height: 60,
              borderRadius: 16,
              fontFamily: "Nunito",
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: 0.3,
              boxShadow: "0 8px 20px rgba(232,160,32,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <ShoppingCart size={24} strokeWidth={2.5} />
            REGISTRAR VENDA
          </button>
        )}
      </div>
    </div>
  );
}