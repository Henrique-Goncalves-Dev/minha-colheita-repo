import { useState } from "react";
import { Login } from "./screens/Login";
import { Dashboard, type ScreenKey } from "./screens/Dashboard";
import { Plantacao } from "./screens/Plantacao";
import { Renda } from "./screens/Renda";
import { Clima } from "./screens/Clima";
import { Tarefas } from "./screens/Tarefas";
import { Perfil } from "./screens/Perfil";
import { NovaSemente } from "./screens/NovaSemente";
import { NovaTarefa } from "./screens/NovaTarefa";
import { DetalheSemente } from "./screens/DetalheSemente";
import { DetalheColheita } from "./screens/DetalheColheita";
import { HistoricoPlantio } from "./screens/HistoricoPlantio"; // <-- Importamos a nova tela

type Route = "login" | "menu" | "nova_semente" | "nova_tarefa" | "detalhes_semente" | "detalhe_colheita" | ScreenKey;

const USER = "João";

const SEEDS_INICIAIS = [
  { emoji: "🌽", name: "Milho", days: 28, ready: false, bg: "#FFF4D6", accent: "#E8A020", planted: "12 Mar", quantidadeReal: "30 sacos", custoReal: "850" },
  { emoji: "🫘", name: "Feijão", days: 45, ready: false, bg: "#F0E0CC", accent: "#7A5230", planted: "02 Abr", quantidadeReal: "15 sacos", custoReal: "420" },
  { emoji: "🍅", name: "Tomate", days: 0, ready: true, bg: "#FFE0DD", accent: "#D63C3C", planted: "10 Jan", quantidadeReal: "50 mudas", custoReal: "300" },
  { emoji: "🥬", name: "Alface", days: 12, ready: false, bg: "#E0F2D9", accent: "#52B152", planted: "18 Abr", quantidadeReal: "100 mudas", custoReal: "150" },
  { emoji: "🥕", name: "Cenoura", days: 60, ready: false, bg: "#FFE3CC", accent: "#E8A020", planted: "20 Mar", quantidadeReal: "5 pacotes", custoReal: "90" },
];

const TAREFAS_INICIAIS = [
  { id: 1, emoji: "💧", title: "Regar o milho", when: "Hoje, manhã", done: false, tone: "today" },
  { id: 2, emoji: "🌾", title: "Colher tomate", when: "Hoje, tarde", done: false, tone: "today" },
  { id: 3, emoji: "🐔", title: "Alimentar galinhas", when: "Amanhã", done: true, tone: "soon" },
  { id: 4, emoji: "🚜", title: "Arar terreno novo", when: "Sexta-feira", done: false, tone: "soon" },
];

function speak(text: string) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pt-BR";
    u.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
}

export default function App() {
  const [route, setRoute] = useState<Route>("login");
  const [sementes, setSementes] = useState(SEEDS_INICIAIS);
  const [tarefas, setTarefas] = useState(TAREFAS_INICIAIS);
  const [historico, setHistorico] = useState<any[]>([]); 
  const [sementeSelecionada, setSementeSelecionada] = useState<any>(null);

  const back = () => setRoute("menu");

  const salvarNovaSemente = (novaSemente: any) => {
    setSementes([novaSemente, ...sementes]);
    setRoute("plantacao");
  };

  const salvarNovaTarefa = (novaTarefa: any) => {
    setTarefas([...tarefas, novaTarefa]);
    setRoute("tarefas");
  };

  const toggleTarefa = (id: number) => {
    setTarefas((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const realizarColheita = (sementeParaColher: any) => {
    setSementes(sementes.filter(s => s.name !== sementeParaColher.name));
    
    const sementeColhida = { 
      ...sementeParaColher, 
      dataColheita: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', ''),
      ready: true 
    };
    
    setHistorico([sementeColhida, ...historico]);
    speak(`Colheita de ${sementeColhida.name} registrada com sucesso!`);
    
    setSementeSelecionada(sementeColhida);
    setRoute("detalhe_colheita"); // <-- Corrigido: Aqui vai direto pro detalhe da semente colhida
  };

  const screen = (() => {
    switch (route) {
      case "login":
        return <Login onEnter={() => setRoute("menu")} />;
      case "menu":
        return (
          <Dashboard
            name={USER}
            onOpen={(s) => setRoute(s)}
            onSpeak={() => speak(`Bom dia ${USER}. Toque em qualquer botão para abrir.`)}
          />
        );
      case "plantio":
        // <-- A Rota do botão do menu agora mostra a LISTA do histórico!
        return (
          <HistoricoPlantio 
            historico={historico} 
            onBack={back} 
            onSpeak={speak} 
            onOpenDetails={(semente) => {
              setSementeSelecionada(semente);
              setRoute("detalhe_colheita");
            }}
          />
        );
      case "plantacao":
        return (
          <Plantacao 
            sementes={sementes} 
            onBack={back} 
            onSpeak={speak} 
            onAddNovo={() => setRoute("nova_semente")} 
            onOpenDetails={(semente) => {
              setSementeSelecionada(semente);
              setRoute("detalhes_semente");
            }}
          />
        );
      case "nova_semente":
        return (
          <NovaSemente 
            onBack={() => setRoute("plantacao")} 
            onSave={salvarNovaSemente} 
            onSpeak={speak} 
          />
        );
      case "detalhes_semente":
        return (
          <DetalheSemente 
            semente={sementeSelecionada} 
            onBack={() => setRoute("plantacao")} 
            onSpeak={speak} 
            onHarvest={realizarColheita} 
          />
        );
      case "detalhe_colheita":
        return (
          <DetalheColheita 
            semente={sementeSelecionada} 
            onBack={() => setRoute("plantio")} // <-- Ao voltar, vai pra lista de histórico
            onSpeak={speak} 
          />
        );
      case "renda":
        return <Renda sementes={sementes} onBack={back} onSpeak={speak} />;
      case "clima":
        return <Clima onBack={back} onSpeak={speak} />;
      case "tarefas":
        return (
          <Tarefas 
            tarefas={tarefas} 
            onToggle={toggleTarefa} 
            onBack={back} 
            onSpeak={speak} 
            onAddNovo={() => setRoute("nova_tarefa")} 
          />
        );
      case "nova_tarefa":
        return (
          <NovaTarefa 
            onBack={() => setRoute("tarefas")} 
            onSave={salvarNovaTarefa} 
            onSpeak={speak} 
          />
        );
      case "perfil":
        return <Perfil name={USER} onBack={back} onSpeak={speak} onLogout={() => setRoute("login")} />;
    }
  })();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D2B0D",
        display: "flex",
        justifyContent: "center",
        fontFamily: "Nunito, 'Nunito Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          minHeight: "100vh",
          background: "#FAF8F3",
          boxShadow: "0 0 40px rgba(0,0,0,0.25)",
          overflowX: "hidden",
        }}
      >
        {screen}
      </div>
    </div>
  );
}
