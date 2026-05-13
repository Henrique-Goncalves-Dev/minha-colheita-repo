import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Star,
  Volume2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Target,
  Plus,
  Loader2,
} from "lucide-react";
import { Card, HeaderBar, SectionLabel, colors } from "../agro-ui";
import { getResumoFinanceiro, type ResumoFinanceiro } from "../services/api";

const MESES_NOME = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function formatarMoeda(valor: number): string {
  return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function Renda({
  onBack,
  onSpeak,
  onRegistrarVenda,
}: {
  onBack: () => void;
  onSpeak: (t: string) => void;
  onRegistrarVenda: () => void;
}) {
  const hoje = new Date();
  const [mesAtualIndex, setMesAtualIndex] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResumoFinanceiro()
      .then(setResumo)
      .catch(() => onSpeak("Erro ao carregar dados financeiros"))
      .finally(() => setLoading(false));
  }, []);

  // Aggregate expenses by month from gastos_por_semente (plantios)
  const gastoTotal = resumo?.gastos_por_semente.reduce((acc, g) => acc + g.custo_total, 0) ?? 0;

  // Aggregate vendas by month
  const vendasPorMes = useMemo(() => {
    if (!resumo) return {};
    const map: Record<string, number> = {};
    resumo.vendas.forEach((v) => {
      if (v.data_da_compra) {
        const d = new Date(v.data_da_compra);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        map[key] = (map[key] || 0) + v.valor_recebido;
      }
    });
    return map;
  }, [resumo]);


  const totalVendas = resumo?.vendas.reduce((acc, v) => acc + v.valor_recebido, 0) ?? 0;
  const lucroEstimado = totalVendas - gastoTotal;

  // Chart data - last 5 months
  const chartData = useMemo(() => {
    const ultimos5 = [];
    for (let i = 4; i >= 0; i--) {
      let m = mesAtualIndex - i;
      let a = anoAtual;
      if (m < 0) {
        m += 12;
        a -= 1;
      }
      ultimos5.push({
        m: MESES_NOME[m],
        v: vendasPorMes[`${a}-${m}`] || 0,
        current: i === 0,
      });
    }
    return ultimos5;
  }, [mesAtualIndex, anoAtual, vendasPorMes]);

  const maxChartValue = Math.max(...chartData.map((x) => x.v), 100);

  const mudarMes = (direcao: number) => {
    let novoMes = mesAtualIndex + direcao;
    let novoAno = anoAtual;
    if (novoMes > 11) { novoMes = 0; novoAno += 1; }
    else if (novoMes < 0) { novoMes = 11; novoAno -= 1; }
    setMesAtualIndex(novoMes);
    setAnoAtual(novoAno);
  };

  const irParaHoje = () => {
    setMesAtualIndex(hoje.getMonth());
    setAnoAtual(hoje.getFullYear());
    onSpeak("Voltando para o mês atual.");
  };

  const estaNoMesDiferente = mesAtualIndex !== hoje.getMonth() || anoAtual !== hoje.getFullYear();

  const explicarTela = () => {
    if (loading) { onSpeak("Carregando dados..."); return; }
    if (totalVendas === 0 && gastoTotal === 0) {
      onSpeak(`Nenhuma movimentação registrada ainda.`);
    } else {
      onSpeak(
        `Resumo financeiro. Você gastou ${formatarMoeda(gastoTotal)} em plantações. Total de vendas: ${formatarMoeda(totalVendas)}. Lucro estimado: ${formatarMoeda(lucroEstimado)}.`
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-full flex flex-col" style={{ background: colors.cream }}>
        <HeaderBar title="Renda" subtitle="Resumo financeiro" onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} color={colors.field} className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col" style={{ background: colors.cream }}>
      <div className="flex items-center justify-between p-4 bg-white" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <button type="button" onClick={onBack} style={{ color: colors.earth }} className="p-2 -ml-2 active:scale-95">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <div className="text-center">
          <h1 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 18, color: colors.ink }}>Renda</h1>
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
        {/* Month selector */}
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

        {/* Big profit card */}
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
          <div style={{ position: "absolute", top: -30, right: -20, width: 140, height: 140, borderRadius: 999, background: "rgba(255,255,255,0.18)", filter: "blur(20px)" }} />
          <div className="flex items-center gap-2 mb-2 relative">
            <Star size={18} strokeWidth={2.8} fill="white" />
            <p style={{ fontWeight: 900, fontSize: 13, letterSpacing: 0.4, textTransform: "uppercase" }}>
              Lucro estimado
            </p>
          </div>
          <p style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 36, letterSpacing: -1, lineHeight: 1, position: "relative" }}>
            {formatarMoeda(lucroEstimado)}
          </p>
          <div className="flex items-center gap-1 mt-2 relative">
            <TrendingUp size={16} strokeWidth={2.8} />
            <p style={{ fontWeight: 800, fontSize: 12 }}>Total acumulado</p>
          </div>
        </div>

        {/* Expense / Revenue */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryTile
            icon={<TrendingDown size={20} color={colors.alert} strokeWidth={2.5} />}
            label="Total gasto"
            value={formatarMoeda(gastoTotal)}
            tone="red"
          />
          <SummaryTile
            icon={<TrendingUp size={20} color={colors.field} strokeWidth={2.5} />}
            label="Total vendas"
            value={formatarMoeda(totalVendas)}
            tone="green"
          />
        </div>

        {/* Chart */}
        <Card style={{ padding: 18 }} elevated>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>Vendas por mês</SectionLabel>
            <p style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 800 }}>Histórico</p>
          </div>
          <div className="flex items-end justify-between gap-2" style={{ height: 150 }}>
            {chartData.map((mo, index) => {
              const h = (mo.v / maxChartValue) * 120;
              return (
                <div key={`${mo.m}-${index}`} className="flex flex-col items-center flex-1">
                  <p style={{ fontSize: 10, fontWeight: 900, color: mo.current ? colors.goldDeep : colors.earthSoft, marginBottom: 4 }}>
                    {mo.v > 0 ? `R$${mo.v.toFixed(0)}` : "-"}
                  </p>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 32,
                      height: Math.max(h, 4),
                      background: mo.current
                        ? `linear-gradient(180deg, ${colors.gold} 0%, ${colors.goldDeep} 100%)`
                        : `linear-gradient(180deg, ${colors.light} 0%, ${colors.field} 100%)`,
                      borderRadius: "10px 10px 4px 4px",
                      boxShadow: mo.current ? "0 4px 10px rgba(232,160,32,0.4)" : "none",
                      transition: "height 0.3s ease",
                    }}
                  />
                  <p style={{ marginTop: 8, fontSize: 11, fontWeight: 900, color: mo.current ? colors.goldDeep : colors.earthSoft }}>
                    {mo.m}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Last sale */}
        {resumo?.ultima_venda && (
          <Card style={{ padding: 14 }} elevated>
            <SectionLabel>Última venda</SectionLabel>
            <div className="flex items-center gap-3 mt-3">
              <div style={{ width: 48, height: 48, borderRadius: 12, background: colors.wash, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                🌾
              </div>
              <div className="flex-1">
                <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 16 }}>
                  {resumo.ultima_venda.nome_semente}
                </p>
                <p style={{ color: colors.earthSoft, fontSize: 12, fontWeight: 800 }}>
                  {resumo.ultima_venda.quantidade} un · R$ {resumo.ultima_venda.valor_recebido.toFixed(0)}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Register sale button */}
        <button type="button"
          onClick={onRegistrarVenda}
          className="w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{
            background: `linear-gradient(180deg, ${colors.gold} 0%, ${colors.goldDeep} 100%)`,
            color: colors.white,
            height: 52,
            borderRadius: 12,
            fontFamily: "Nunito",
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: 0.3,
            boxShadow: "0 6px 14px rgba(232,160,32,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          <Plus size={18} strokeWidth={2.8} />
          REGISTRAR VENDA
        </button>
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