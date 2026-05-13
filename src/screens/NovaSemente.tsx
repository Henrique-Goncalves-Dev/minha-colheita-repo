import React, { useState } from "react";
import { Mic, Volume2, ArrowLeft, Check, Sprout, Calendar, Scale, Coins, Loader2 } from "lucide-react";
import { Card, colors } from "../agro-ui";
import { criarPlantio, type ApiError } from "../services/api";

export function NovaSemente({
  onBack,
  onSave,
  onSpeak,
}: {
  onBack: () => void;
  onSave: () => Promise<void>;
  onSpeak: (text: string) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    plantedDate: new Date().toISOString().split("T")[0],
    quantity: "",
    cost: "",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [campoExplicacao, setCampoExplicacao] = useState<string | null>(null);
  const [gravando, setGravando] = useState<string | null>(null);

  const pulseStyle = "animate-pulse ring-4 ring-[#E8A020] ring-opacity-50 transition-all";

  const explicarFormulario = () => {
    onSpeak("Vamos registrar sua plantação. Primeiro, diga qual semente plantou. Depois, o dia. Em seguida, a quantidade. E por último, quanto gastou. Aperte o microfone ao lado de cada um para falar.");
    setCampoExplicacao("name");
    setTimeout(() => setCampoExplicacao("plantedDate"), 4000);
    setTimeout(() => setCampoExplicacao("quantity"), 8000);
    setTimeout(() => setCampoExplicacao("cost"), 12000);
    setTimeout(() => setCampoExplicacao(null), 16000);
  };

  const iniciarGravacao = (campo: keyof typeof formData, nomeAmigavel: string) => {
    setGravando(campo);
    onSpeak(`Fale ${nomeAmigavel} agora...`);
    setTimeout(() => {
      let textoSimulado = "";
      if (campo === "name") textoSimulado = "Milho safrinha";
      if (campo === "quantity") textoSimulado = "50";
      if (campo === "cost") textoSimulado = "850";
      if (textoSimulado) {
        setFormData(prev => ({ ...prev, [campo]: textoSimulado }));
        onSpeak(`Entendido: ${textoSimulado}`);
      }
      setGravando(null);
    }, 3000);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      onSpeak("Por favor, diga o nome da semente antes de salvar.");
      setErro("Nome da semente é obrigatório");
      return;
    }

    const quantidade = parseInt(formData.quantity) || 0;
    const custo = parseFloat(formData.cost.replace(",", ".")) || 0;

    if (quantidade <= 0) {
      onSpeak("Por favor, informe a quantidade.");
      setErro("Quantidade deve ser maior que zero");
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      await criarPlantio({
        nome_semente: formData.name.trim(),
        data_plantacao: formData.plantedDate ? new Date(formData.plantedDate).toISOString() : null,
        quantidade,
        custo,
      });
      onSpeak("Plantação registrada com sucesso!");
      await onSave();
    } catch (e) {
      const err = e as ApiError;
      setErro(err.detail || "Erro ao salvar");
      onSpeak(err.detail || "Erro ao salvar a plantação");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    id: keyof typeof formData,
    label: string,
    icon: React.ReactNode,
    type: string = "text"
  ) => (
    <Card
      style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}
      className={campoExplicacao === id ? pulseStyle : ""}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, background: colors.wash, display: "flex", alignItems: "center", justifyContent: "center", color: colors.earth }}>
        {icon}
      </div>
      <div className="flex-1">
        <label style={{ fontSize: 12, fontWeight: 800, color: colors.earthSoft, textTransform: "uppercase" }}>
          {label}
        </label>
        <input
          type={type}
          value={formData[id]}
          onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
          style={{ width: "100%", border: "none", outline: "none", fontSize: 18, fontWeight: 800, color: colors.ink, background: "transparent" }}
          placeholder="Toque para digitar..."
        />
      </div>
      {type !== "date" && (
        <button type="button"
          onClick={() => iniciarGravacao(id, label)}
          className={`flex items-center justify-center transition-all ${gravando === id ? 'scale-110' : ''}`}
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: gravando === id ? "#D63C3C" : colors.earth,
            color: colors.white,
            boxShadow: gravando === id ? "0 0 15px rgba(214,60,60,0.5)" : "none",
          }}
        >
          <Mic size={24} strokeWidth={2.5} className={gravando === id ? "animate-bounce" : ""} />
        </button>
      )}
    </Card>
  );

  return (
    <div className="min-h-full flex flex-col" style={{ background: colors.cream }}>
      <div className="flex items-center justify-between p-4 bg-white" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <button type="button" onClick={onBack} style={{ color: colors.earth }} className="p-2 -ml-2 active:scale-95">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 18, color: colors.ink }}>
          Nova Plantação
        </h1>
        <button type="button"
          onClick={explicarFormulario}
          className="p-2 -mr-2 bg-[#E8A020] rounded-full active:scale-95 shadow-md flex items-center justify-center animate-pulse"
          style={{ width: 44, height: 44, color: "white" }}
        >
          <Volume2 size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {renderField("name", "O que plantou?", <Sprout size={24} />)}
        {renderField("plantedDate", "Quando plantou?", <Calendar size={24} />, "date")}
        {renderField("quantity", "Qual a quantidade?", <Scale size={24} />)}
        {renderField("cost", "Quanto gastou? (R$)", <Coins size={24} />)}

        {erro && (
          <p style={{ color: colors.alert, fontSize: 13, fontWeight: 800, textAlign: "center" }}>
            {erro}
          </p>
        )}
      </div>

      <div className="p-4 bg-white" style={{ borderTop: `1px solid ${colors.border}` }}>
        <button type="button"
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{
            background: `linear-gradient(180deg, #52B152 0%, #3D8B3D 100%)`,
            color: colors.white,
            height: 56,
            borderRadius: 14,
            fontFamily: "Nunito",
            fontWeight: 900,
            fontSize: 16,
            letterSpacing: 0.3,
            boxShadow: "0 6px 14px rgba(82,177,82,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} strokeWidth={3} />}
          {loading ? "SALVANDO..." : "SALVAR PLANTAÇÃO"}
        </button>
      </div>
    </div>
  );
}