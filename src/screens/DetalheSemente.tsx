import React from "react";
import { ArrowLeft, Volume2, TrendingUp, Calendar, Package, Wallet, CheckCircle } from "lucide-react";
import { Card, colors } from "../agro-ui";

export function DetalheSemente({
  semente,
  onBack,
  onSpeak,
  onHarvest,
}: {
  semente: any;
  onBack: () => void;
  onSpeak: (t: string) => void;
  onHarvest: (semente: any) => void;
}) {
  // Se por acaso a tela carregar sem semente, volta.
  if (!semente) return null;

  const porcentagem = Math.max(15, 100 - semente.days);
  const quantidade = semente.quantidadeReal || "Não informado";
  const custo = semente.custoReal ? `R$ ${semente.custoReal}` : "R$ 0,00";

  const explicarTela = () => {
    let texto = `Detalhes do plantio de ${semente.name}. `;
    if (semente.ready) {
      texto += "A plantação está pronta para colher! Aperte o botão verde no final da tela para confirmar a colheita. ";
    } else {
      texto += `Em crescimento. Faltam aproximadamente ${semente.days} dias. `;
    }
    texto += `Você plantou em ${semente.planted}. Quantidade: ${quantidade}. Custo: ${custo}.`;
    onSpeak(texto);
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: colors.cream, paddingBottom: 24 }}>
      {/* Cabeçalho com Imagem de Fundo */}
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
        {/* Barra de Navegação Superior */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full flex items-center justify-center active:scale-95"
            style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(4px)" }}
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <button
            onClick={explicarTela}
            className="p-2 -mr-2 bg-[#E8A020] rounded-full active:scale-95 shadow-md flex items-center justify-center animate-pulse"
            style={{ width: 44, height: 44, color: "white" }}
          >
            <Volume2 size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Informações Principais da Semente */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.9)",
              border: `1.5px solid ${semente.ready ? colors.field : "#E8A020"}`,
              color: semente.ready ? colors.field : "#C48000",
              fontWeight: 900,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {semente.ready ? "✅ Pronto" : "🌾 Em crescimento"}
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
            {semente.emoji}
          </div>
        </div>

        <div className="text-center relative z-10 mt-4">
          <p style={{ color: "#A3D9A3", fontSize: 11, fontWeight: 900, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Semente Plantada
          </p>
          <h1 style={{ fontFamily: "serif", fontWeight: 900, fontSize: 36, color: "white", marginTop: 4 }}>
            {semente.name}
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-6 relative z-20">
        {/* Card de Progresso */}
        <Card style={{ padding: 16 }} elevated>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2" style={{ color: colors.ink, fontWeight: 900 }}>
              <TrendingUp size={20} color={colors.field} strokeWidth={2.5} />
              Progresso até a colheita
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
              {semente.ready ? "100%" : `${porcentagem}%`}
            </div>
          </div>

          <div style={{ height: 10, background: colors.wash, borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
            <div
              style={{
                width: semente.ready ? "100%" : `${porcentagem}%`,
                height: "100%",
                background: semente.ready ? colors.field : colors.field,
                borderRadius: 999,
              }}
            />
          </div>

          <p style={{ textAlign: "center", color: colors.earth, fontSize: 13, fontWeight: 800 }}>
            {semente.ready ? "Pronto para colher!" : (
              <>Faltam aproximadamente <span style={{ color: colors.ink }}>{semente.days} dias</span></>
            )}
          </p>
        </Card>

        <div className="text-center mt-6 mb-2">
          <p style={{ color: colors.earthSoft, fontSize: 12, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase" }}>
            Detalhes do Plantio
          </p>
        </div>

        {/* Grid de Detalhes: Data e Quantidade */}
        <div className="grid grid-cols-2 gap-3">
          <Card style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.wash, display: "flex", alignItems: "center", justifyContent: "center", color: colors.field, marginBottom: 12, border: `1px solid ${colors.border}` }}>
              <Calendar size={20} strokeWidth={2.5} />
            </div>
            <p style={{ color: colors.earth, fontSize: 11, fontWeight: 900, letterSpacing: 0.5, marginBottom: 4 }}>
              QUANDO PLANTOU
            </p>
            <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 15 }}>
              {semente.planted}
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
              {quantidade}
            </p>
          </Card>
        </div>

        {/* Card de Custo */}
        <Card style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#FDECEC", display: "flex", alignItems: "center", justifyContent: "center", color: colors.alert, marginBottom: 12, border: `1px solid #F8D5D5` }}>
            <Wallet size={24} strokeWidth={2.5} />
          </div>
          <p style={{ color: colors.earth, fontSize: 11, fontWeight: 900, letterSpacing: 0.5, marginBottom: 4 }}>
            QUANTO GASTOU
          </p>
          <p style={{ fontFamily: "serif", fontWeight: 900, color: colors.alert, fontSize: 24 }}>
            {custo}
          </p>
        </Card>

        {/* BOTÃO DE COLHER */}
        {semente.ready && (
          <button
            onClick={() => onHarvest(semente)}
            className="w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform mt-4"
            style={{
              background: `linear-gradient(180deg, #52B152 0%, #3D8B3D 100%)`,
              color: colors.white,
              height: 60,
              borderRadius: 16,
              fontFamily: "Nunito",
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: 0.3,
              boxShadow: "0 8px 20px rgba(82,177,82,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <CheckCircle size={24} strokeWidth={2.5} />
            CONFIRMAR COLHEITA
          </button>
        )}
      </div>
    </div>
  );
}