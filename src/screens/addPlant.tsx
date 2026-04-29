import { useNavigate } from "react-router-dom";
import { Volume2, Plus } from "lucide-react";

export function AddPlantScreen() {
  const navigate = useNavigate();
  const green = "#35504A";

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      u.rate = 0.8;
      speechSynthesis.speak(u);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen relative pb-28 px-6 items-center justify-center"
      style={{
        background: "linear-gradient(to bottom, #e8efed, #f5f8f7)",
      }}
    >
      {/* Componente Central */}
      <div className="flex flex-col gap-2 items-center">
        {/* Ícone de Áudio */}
        <button
          onClick={() => speak("Adicionar novo plantio")}
          className="active:scale-95 transition-all p-2"
        >
          <Volume2 className="w-8 h-8" style={{ color: green }} />
        </button>

        {/* Caixa Tracejada */}
        <button
          onClick={() => {
            // Aqui entrará a navegação para a próxima tela no futuro
            speak("Indo para o formulário de novo plantio.");
          }}
          className="w-48 h-48 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all hover:bg-white/30"
          style={{ borderColor: green, color: green }}
        >
          <span className="text-2xl font-medium">Novo</span>
          <Plus className="w-12 h-12" strokeWidth={2.5} />
        </button>
      </div>

      {/* Botão Voltar Fixo na Base */}
      <div className="absolute bottom-8 left-0 w-full px-6">
        <button
          onClick={() => navigate(-1)} // Volta para a tela anterior
          className="w-full py-5 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 text-white font-bold text-lg tracking-wider"
          style={{ background: `linear-gradient(to right, ${green}, #4a6e65)` }}
        >
          VOLTAR
        </button>
      </div>
    </div>
  );
}