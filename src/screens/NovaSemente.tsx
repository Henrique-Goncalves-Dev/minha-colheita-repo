import React, { useState, useEffect } from "react";
import { Mic, Volume2, ArrowLeft, Check, Sprout, Calendar, Scale, Coins } from "lucide-react";
import { Card, HeaderBar, colors } from "../agro-ui"; // Ajuste o caminho se necessário

// Animação de piscar usando Tailwind
const pulseStyle = "animate-pulse ring-4 ring-[#E8A020] ring-opacity-50 transition-all";

export function NovaSemente({ 
  onBack, 
  onSave, 
  onSpeak 
}: { 
  onBack: () => void; 
  onSave: (semente: any) => void; 
  onSpeak: (text: string) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    plantedDate: new Date().toISOString().split("T")[0], // Pega o dia de hoje no formato YYYY-MM-DD
    quantity: "",
    cost: "",
  });

  const [campoExplicacao, setCampoExplicacao] = useState<string | null>(null);
  const [gravando, setGravando] = useState<string | null>(null);

  // Função para o tutorial de voz geral
  const explicarFormulario = () => {
    // Aqui você chama a sua função nativa/TTS de voz
    onSpeak("Vamos registrar sua plantação. Primeiro, diga qual semente plantou. Depois, o dia. Em seguida, a quantidade. E por último, quanto gastou. Aperte o microfone ao lado de cada um para falar.");
    
    // Lógica simples para fazer os campos piscarem em sequência (simulando o tempo da fala)
    setCampoExplicacao("name");
    setTimeout(() => setCampoExplicacao("plantedDate"), 4000);
    setTimeout(() => setCampoExplicacao("quantity"), 8000);
    setTimeout(() => setCampoExplicacao("cost"), 12000);
    setTimeout(() => setCampoExplicacao(null), 16000);
  };

  // Simulação da integração com a IA de transcrição de voz
  const iniciarGravacao = (campo: keyof typeof formData, nomeAmigavel: string) => {
    setGravando(campo);
    onSpeak(`Fale ${nomeAmigavel} agora...`);
    
    // AQUI ENTRA A SUA LÓGICA DE IA (Ex: Web Speech API, Whisper, etc.)
    // Vamos simular uma resposta após 3 segundos para demonstração:
    setTimeout(() => {
      let textoSimulado = "";
      if (campo === "name") textoSimulado = "Milho safrinha";
      if (campo === "quantity") textoSimulado = "10 quilos";
      if (campo === "cost") textoSimulado = "50 reais";
      
      if (textoSimulado) {
        setFormData(prev => ({ ...prev, [campo]: textoSimulado }));
        onSpeak(`Entendido: ${textoSimulado}`);
      }
      setGravando(null);
    }, 3000);
  };

  const handleSave = () => {
    if (!formData.name) {
      onSpeak("Por favor, diga o nome da semente antes de salvar.");
      return;
    }
    // Cria o objeto no formato que a tela Plantacao espera
    const novaSemente = {
      emoji: "🌱", // Emoji padrão, você pode usar uma IA para classificar o emoji baseado no nome
      name: formData.name,
      days: 90, // Estimativa padrão
      ready: false,
      bg: "#E0F2D9",
      accent: "#52B152",
      planted: new Date(formData.plantedDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', ''),
      quantidadeReal: formData.quantity,
      custoReal: formData.cost
    };
    onSpeak("Semente salva com sucesso!");
    onSave(novaSemente);
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

      {/* Botão de Microfone */}
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
            boxShadow: gravando === id ? "0 0 15px rgba(214,60,60,0.5)" : "none"
          }}
        >
          <Mic size={24} strokeWidth={2.5} className={gravando === id ? "animate-bounce" : ""} />
        </button>
      )}
    </Card>
  );

  return (
    <div className="min-h-full flex flex-col" style={{ background: colors.cream }}>
      {/* Cabeçalho Customizado com botão de tutorial em destaque */}
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
        {renderField("cost", "Quanto gastou?", <Coins size={24} />)}
      </div>

      <div className="p-4 bg-white" style={{ borderTop: `1px solid ${colors.border}` }}>
        <button type="button"
          onClick={handleSave}
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
          }}
        >
          <Check size={24} strokeWidth={3} />
          SALVAR PLANTAÇÃO
        </button>
      </div>
    </div>
  );
}