import React, { useState, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays,
  Target
} from "lucide-react";
import { Card, HeaderBar, SectionLabel, colors } from "../agro-ui";

const MESES_NOME = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// Função para extrair apenas números de um texto (Ex: "50 reais" -> 50)
function extrairValor(texto: string | undefined): number {
  if (!texto) return 0;
  const apenasNumeros = texto.toString().replace(/[^\d,.-]/g, "").replace(",", ".");
  return parseFloat(apenasNumeros) || 0;
}

// Formatar para moeda (Ex: 2500 -> R$ 2.500)
function formatarMoeda(valor: number): string {
  return `R$ ${valor.toLocaleString("pt-BR")}`;
}

export function Renda({
  sementes,
  onBack,
  onSpeak,
}: {
  sementes: any[];
  onBack: () => void;
  onSpeak: (t: string) => void;
}) {
  const hoje = new Date();
  
  // Estados para controlar o mês e o ano que estamos visualizando
  const [mesAtualIndex, setMesAtualIndex] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

  // Função para buscar os gastos de um mês e ano específicos
  const getGasto = (mes: number, ano: number) => {
    let total = 0;
    sementes.forEach((s) => {
      if (s.planted) {
        const partes = s.planted.split(" ");
        if (partes.length >= 2) {
          const nomeMes = partes[1].substring(0, 3).toLowerCase();
          const indexMes = MESES_NOME.findIndex((m) => m.toLowerCase() === nomeMes);
          
          // Se a data não tiver ano (Ex: "12 Mar"), assume que é o ano atual real. 
          // Se tiver (Ex: "12 Mar 2026"), ele pega o ano correto.
          let anoSemente = hoje.getFullYear();
          if (partes.length >= 3 && !isNaN(parseInt(partes[2]))) {
            anoSemente = parseInt(partes[2]);
          }

          if (indexMes === mes && anoSemente === ano) {
            total += extrairValor(s.custoReal);
          }
        }
      }
    });
    return total;
  };

  // 1. Pegar os dados do mês e ano selecionados
  const gastoNumero = getGasto(mesAtualIndex, anoAtual);
  // Simulando a venda como o dobro do gasto + 20%
  const vendaNumero = gastoNumero > 0 ? gastoNumero * 2.2 : 0;
  const lucroNumero = vendaNumero - gastoNumero;

  const gasto = formatarMoeda(gastoNumero);
  const venda = formatarMoeda(vendaNumero);
  const lucro = formatarMoeda(lucroNumero);

  // 2. Montar os dados do gráfico (Mês atual e os 4 anteriores, respeitando virada de ano)
  const chartData = useMemo(() => {
    const ultimos5 = [];
    for (let i = 4; i >= 0; i--) {
      let m = mesAtualIndex - i;
      let a = anoAtual;
      if (m < 0) {
        m += 12;
        a -= 1; // Volta um ano se o mês for menor que Janeiro
      }
      ultimos5.push({
        m: MESES_NOME[m],
        v: getGasto(m, a),
        current: i === 0, // O último item é o mês selecionado
      });
    }
    return ultimos5;
  }, [mesAtualIndex, anoAtual, sementes]);

  const maxChartValue = Math.max(...chartData.map((x) => x.v), 100);

  // Navegação entre os meses
  const mudarMes = (direcao: number) => {
    let novoMes = mesAtualIndex + direcao;
    let novoAno = anoAtual;

    if (novoMes > 11) {
      novoMes = 0;
      novoAno += 1; // Virou o ano para frente
    } else if (novoMes < 0) {
      novoMes = 11;
      novoAno -= 1; // Virou o ano para trás
    }
    
    setMesAtualIndex(novoMes);
    setAnoAtual(novoAno);
  };

  // Voltar rapidamente para a data de hoje
  const irParaHoje = () => {
    setMesAtualIndex(hoje.getMonth());
    setAnoAtual(hoje.getFullYear());
    onSpeak("Voltando para o mês atual.");
  };

  // Verifica se o usuário não está no mês atual para mostrar o botão de voltar
  const estaNoMesDiferente = mesAtualIndex !== hoje.getMonth() || anoAtual !== hoje.getFullYear();

  const explicarTela = () => {
    const nomeMes = MESES_NOME[mesAtualIndex];
    if (gastoNumero === 0) {
      onSpeak(`No mês de ${nomeMes} de ${anoAtual}, você ainda não registrou nenhum gasto com plantação.`);
    } else {
      onSpeak(
        `Resumo de ${nomeMes} de ${anoAtual}. Você gastou ${gasto}. A estimativa de venda é de ${venda}, gerando um lucro estimado de ${lucro}.`
      );
    }
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: colors.cream }}>
      <div className="flex items-center justify-between p-4 bg-white" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <button type="button" onClick={onBack} style={{ color: colors.earth }} className="p-2 -ml-2 active:scale-95">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <div className="text-center">
          <h1 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 18, color: colors.ink }}>
            Renda
          </h1>
          <p style={{ color: colors.earthSoft, fontSize: 12, fontWeight: 800 }}>Resumo financeiro</p>
        </div>
        <button type="button"
          onClick={explicarTela}
          className="p-2 -mr-2 bg-[#E8A020] rounded-full active:scale-95 shadow-md flex items-center justify-center animate-pulse"
          style={{ width: 44, height: 44, color: "white" }}
        >
          <Volume2 size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Seletor de Mês e Ano */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-2 shadow-sm border border-[#EBEBEB]">
          <button type="button" onClick={() => mudarMes(-1)} className="p-2 active:scale-90" style={{ color: colors.earth }}>
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          
          <div className="flex flex-col items-center">
            <p style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 18, color: colors.ink }}>
              {MESES_NOME[mesAtualIndex]}
            </p>
            <div className="flex items-center gap-1" style={{ color: colors.earthSoft, fontSize: 12, fontWeight: 800 }}>
              <CalendarDays size={14} strokeWidth={2.5} />
              <span>{anoAtual}</span>
            </div>
          </div>

          <button type="button" onClick={() => mudarMes(1)} className="p-2 active:scale-90" style={{ color: colors.earth }}>
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Botão de atalho para voltar ao mês atual */}
        {estaNoMesDiferente && (
          <button type="button" 
            onClick={irParaHoje}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl active:scale-95 transition-all"
            style={{ background: "#E0F2D9", color: "#3D8B3D", fontWeight: 800, fontSize: 13 }}
          >
            <Target size={16} strokeWidth={2.5} />
            VOLTAR PARA MÊS ATUAL
          </button>
        )}

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
              fontSize: 36,
              letterSpacing: -1,
              lineHeight: 1,
              position: "relative",
            }}
          >
            {lucro}
          </p>
          <div className="flex items-center gap-1 mt-2 relative">
            <TrendingUp size={16} strokeWidth={2.8} />
            <p style={{ fontWeight: 800, fontSize: 12 }}>Visualizando: {MESES_NOME[mesAtualIndex]} {anoAtual}</p>
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
            <SectionLabel>Gastos recentes</SectionLabel>
            <p style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 800 }}>Histórico</p>
          </div>
          <div className="flex items-end justify-between gap-2" style={{ height: 150 }}>
            {chartData.map((mo, index) => {
              const h = (mo.v / maxChartValue) * 120;
              return (
                <div key={`${mo.m}-${index}`} className="flex flex-col items-center flex-1">
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: mo.current ? colors.goldDeep : colors.earthSoft,
                      marginBottom: 4,
                    }}
                  >
                    R${mo.v}
                  </p>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 32,
                      height: Math.max(h, 4), // Mínimo de 4px para sempre aparecer a barrinha
                      background: mo.current
                        ? `linear-gradient(180deg, ${colors.gold} 0%, ${colors.goldDeep} 100%)`
                        : `linear-gradient(180deg, ${colors.light} 0%, ${colors.field} 100%)`,
                      borderRadius: "10px 10px 4px 4px",
                      boxShadow: mo.current ? "0 4px 10px rgba(232,160,32,0.4)" : "none",
                      transition: "height 0.3s ease",
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
      <p style={{ fontFamily: "Nunito", fontWeight: 900, color: fg, fontSize: 18, letterSpacing: -0.3 }}>
        {value}
      </p>
    </Card>
  );
}