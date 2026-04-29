import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, TreePine, Search } from "lucide-react";

// Lista expandida para testarmos a rolagem (scroll)
const mockPlantacoes = [
  { id: 1, nome: "Mandioca", data: "05/04", vazia: false },
  { id: 2, nome: "Milho", data: "12/04", vazia: false },
  { id: 3, nome: "Feijão", data: "20/03", vazia: false },
  { id: 4, nome: "Açaí", data: "10/01", vazia: false },
  { id: 5, nome: "Pimenta-do-reino", data: "15/02", vazia: false },
  { id: 6, nome: "Cacau", data: "08/03", vazia: false },
  { id: 7, nome: "Cupuaçu", data: "22/03", vazia: false },
  { id: 8, nome: "Vazio", vazia: true },
  { id: 9, nome: "Vazio", vazia: true },
];

export function PlantScreen() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
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

  // Lógica estratégica para filtrar a lista baseada no que o usuário digitou
  const plantacoesFiltradas = mockPlantacoes.filter((item) => {
    // Se a barra de pesquisa estiver vazia, mostra tudo
    if (busca.trim() === "") return true;
    
    // Se estiver pesquisando, não faz sentido mostrar os quadrados "Vazios"
    if (item.vazia) return false;

    // Filtra ignorando maiúsculas e minúsculas
    return item.nome.toLowerCase().includes(busca.toLowerCase());
  });

  return (
    <div
      // Trocamos min-h-screen por h-screen e adicionamos overflow-y-auto para habilitar o scroll
      className="flex flex-col h-screen relative pt-8 px-6 overflow-y-auto"
      style={{ background: "linear-gradient(to bottom, #e8efed, #f5f8f7)" }}
    >
      {/* Cabeçalho de Áudio */}
      <div className="flex justify-center mb-6 shrink-0">
        <button
          onClick={() => speak("Suas plantações cadastradas. Use a barra abaixo para pesquisar.")}
          className="active:scale-95 transition-all p-2 bg-white rounded-full shadow-sm"
        >
          <Volume2 className="w-8 h-8" style={{ color: green }} />
        </button>
      </div>

      <h2 className="text-xl font-bold text-center mb-6 shrink-0" style={{ color: green }}>
        Minhas Plantações
      </h2>

      {/* Barra de Pesquisa */}
      <div className="relative mb-6 shrink-0">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-6 h-6 opacity-50" style={{ color: green }} />
        </div>
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar plantação..."
          className="w-full text-lg py-4 pl-12 pr-4 rounded-2xl border-2 focus:outline-none bg-white transition-colors shadow-sm"
          style={{ borderColor: "#35504A40", color: green }}
          onFocus={(e) => (e.target.style.borderColor = green)}
          onBlur={(e) => (e.target.style.borderColor = "#35504A40")}
        />
      </div>

      {/* Grade de Plantações */}
      {/* pb-32 garante que o último item não fique escondido atrás do botão "VOLTAR" */}
      <div className="grid grid-cols-2 gap-4 pb-32">
        {plantacoesFiltradas.length > 0 ? (
          plantacoesFiltradas.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.vazia && speak(`Plantação de ${item.nome}, plantada em ${item.data}`)}
              className={`aspect-square border-4 rounded-3xl flex flex-col items-center justify-center p-2 shadow-sm active:scale-95 transition-all ${
                item.vazia ? "border-dashed bg-transparent" : "bg-white border-solid"
              }`}
              style={{ borderColor: green, color: green }}
            >
              {item.vazia ? (
                <span className="opacity-50 font-medium text-sm">Disponível</span>
              ) : (
                <>
                  <TreePine className="w-10 h-10 mb-2" />
                  <span className="font-bold text-sm text-center leading-tight">{item.nome}</span>
                  <span className="text-xs opacity-70 mt-1">{item.data}</span>
                </>
              )}
            </button>
          ))
        ) : (
          // Feedback visual caso a pesquisa não encontre nada
          <div className="col-span-2 text-center py-10 opacity-60" style={{ color: green }}>
            Nenhuma plantação encontrada com "{busca}".
          </div>
        )}
      </div>

      {/* Botão Voltar Fixo na Base */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-6 pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="w-full py-5 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 text-white font-bold text-lg tracking-wider pointer-events-auto"
          style={{ background: `linear-gradient(to right, ${green}, #4a6e65)` }}
        >
          VOLTAR
        </button>
      </div>
    </div>
  );
}