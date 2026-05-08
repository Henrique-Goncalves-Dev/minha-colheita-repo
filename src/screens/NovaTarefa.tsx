import React, { useState } from "react";
import { Mic, Volume2, ArrowLeft, Check, Type, Calendar } from "lucide-react";
import { Card, colors } from "../agro-ui";

const pulseStyle = "animate-pulse ring-4 ring-[#E8A020] ring-opacity-50 transition-all";

// Lista de ícones rápidos para o usuário escolher
const EMOJIS = ["💧", "🚜", "🌾", "🐔", "🐄", "🍅", "🪓", "🍎", "🛠️", "🧹"];

export function NovaTarefa({ 
  onBack, 
  onSave, 
  onSpeak 
}: { 
  onBack: () => void; 
  onSave: (tarefa: any) => void; 
  onSpeak: (text: string) => void;
}) {
  const [formData, setFormData] = useState({
    emoji: "🛠️",
    title: "",
    when: "",
  });

  const [campoExplicacao, setCampoExplicacao] = useState<string | null>(null);
  const [gravando, setGravando] = useState<string | null>(null);

  const explicarFormulario = () => {
    onSpeak("Vamos adicionar uma tarefa. Primeiro, escolha o desenho. Depois, diga qual é a tarefa. E por último, para quando é. Aperte o microfone para falar.");
    
    setCampoExplicacao("emoji");
    setTimeout(() => setCampoExplicacao("title"), 4000);
    setTimeout(() => setCampoExplicacao("when"), 8000);
    setTimeout(() => setCampoExplicacao(null), 12000);
  };

  const iniciarGravacao = (campo: keyof typeof formData, nomeAmigavel: string) => {
    setGravando(campo);
    onSpeak(`Fale ${nomeAmigavel} agora...`);
    
    // Simulação da IA retornando o texto após 3 segundos
    setTimeout(() => {
      let textoSimulado = "";
      if (campo === "title") textoSimulado = "Arrumar a cerca";
      if (campo === "when") textoSimulado = "Amanhã cedo";
      
      if (textoSimulado) {
        setFormData(prev => ({ ...prev, [campo]: textoSimulado }));
        onSpeak(`Entendido: ${textoSimulado}`);
      }
      setGravando(null);
    }, 3000);
  };

  const handleSave = () => {
    if (!formData.title) {
      onSpeak("Por favor, diga qual é a tarefa antes de salvar.");
      return;
    }
    
    const novaTarefa = {
      id: Date.now(), // Gera um ID único
      emoji: formData.emoji,
      title: formData.title,
      when: formData.when || "Sem data",
      done: false,
      tone: formData.when.toLowerCase().includes("hoje") ? "today" : "soon"
    };
    
    onSpeak("Tarefa adicionada com sucesso!");
    onSave(novaTarefa);
  };

  const renderField = (
    id: keyof typeof formData,
    label: string,
    icon: React.ReactNode,
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
          type="text"
          value={formData[id]}
          onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
          style={{ width: "100%", border: "none", outline: "none", fontSize: 18, fontWeight: 800, color: colors.ink, background: "transparent" }}
          placeholder="Toque para digitar..."
        />
      </div>

      <button
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
    </Card>
  );

  return (
    <div className="min-h-full flex flex-col" style={{ background: colors.cream }}>
      <div className="flex items-center justify-between p-4 bg-white" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <button onClick={onBack} style={{ color: colors.earth }} className="p-2 -ml-2 active:scale-95">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 18, color: colors.ink }}>
          Nova Tarefa
        </h1>
        <button 
          onClick={explicarFormulario} 
          className="p-2 -mr-2 bg-[#E8A020] rounded-full active:scale-95 shadow-md flex items-center justify-center animate-pulse"
          style={{ width: 44, height: 44, color: "white" }}
        >
          <Volume2 size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        
        {/* Seletor de Emoji */}
        <div className={campoExplicacao === "emoji" ? pulseStyle : ""}>
          <label style={{ fontSize: 12, fontWeight: 800, color: colors.earthSoft, textTransform: "uppercase", marginLeft: 4, display: "block", marginBottom: 8 }}>
            Escolha um ícone
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setFormData({ ...formData, emoji })}
                style={{
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                  fontSize: 28,
                  borderRadius: 16,
                  background: formData.emoji === emoji ? colors.wash : colors.white,
                  border: `2px solid ${formData.emoji === emoji ? colors.field : colors.borderSoft}`,
                  boxShadow: formData.emoji === emoji ? "0 4px 12px rgba(82,177,82,0.2)" : "none",
                  transition: "all 0.2s"
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {renderField("title", "O que precisa fazer?", <Type size={24} />)}
        {renderField("when", "Para quando?", <Calendar size={24} />)}
      </div>

      <div className="p-4 bg-white" style={{ borderTop: `1px solid ${colors.border}` }}>
        <button
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
          SALVAR TAREFA
        </button>
      </div>
    </div>
  );
}