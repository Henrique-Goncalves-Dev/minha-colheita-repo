import { useState, useEffect, useCallback } from "react";
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
import { HistoricoPlantio } from "./screens/HistoricoPlantio";
import { RegistrarVenda } from "./screens/RegistrarVenda";
import {
  getToken,
  getPerfil,
  listarPlantios,
  listarVendas,
  listarTarefas,
  logout as apiLogout,
  type PerfilResponse,
  type PlantioResponse,
  type VendaResponse,
  type TarefaResponse,
} from "./services/api";

type Route =
  | "login"
  | "menu"
  | "nova_semente"
  | "nova_tarefa"
  | "detalhes_semente"
  | "detalhe_colheita"
  | "registrar_venda"
  | ScreenKey;

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
  const [perfil, setPerfil] = useState<PerfilResponse | null>(null);
  const [plantios, setPlantios] = useState<PlantioResponse[]>([]);
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [tarefas, setTarefas] = useState<TarefaResponse[]>([]);
  const [plantioSelecionado, setPlantioSelecionado] = useState<PlantioResponse | null>(null);
  const [vendaSelecionada, setVendaSelecionada] = useState<VendaResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all data from backend
  const carregarDados = useCallback(async () => {
    try {
      const [p, pl, v, t] = await Promise.all([
        getPerfil(),
        listarPlantios(),
        listarVendas(),
        listarTarefas(),
      ]);
      setPerfil(p);
      setPlantios(pl);
      setVendas(v);
      setTarefas(t);
    } catch {
      // Token inválido ou expirado
      apiLogout();
      setRoute("login");
    }
  }, []);

  // Check token on startup
  useEffect(() => {
    const token = getToken();
    if (token) {
      carregarDados().then(() => {
        setRoute("menu");
      }).catch(() => {
        setRoute("login");
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [carregarDados]);

  const handleLogin = async () => {
    await carregarDados();
    setRoute("menu");
  };

  const handleLogout = () => {
    apiLogout();
    setPerfil(null);
    setPlantios([]);
    setVendas([]);
    setTarefas([]);
    setRoute("login");
  };

  const back = () => setRoute("menu");

  // After creating/updating data, reload everything
  const recarregar = async () => {
    await carregarDados();
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0D2B0D",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Nunito, 'Nunito Sans', system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", color: "#FFFFFF" }}>
          <div className="animate-spin" style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "#52B152", borderRadius: 999, margin: "0 auto 16px" }} />
          <p style={{ fontWeight: 700, fontSize: 14, opacity: 0.7 }}>Carregando...</p>
        </div>
      </div>
    );
  }

  const screen = (() => {
    switch (route) {
      case "login":
        return <Login onEnter={handleLogin} />;
      case "menu":
        return (
          <Dashboard
            perfil={perfil}
            plantios={plantios}
            tarefas={tarefas}
            onOpen={(s) => setRoute(s)}
            onSpeak={() => speak(`Bom dia ${perfil?.nome || ""}. Toque em qualquer botão para abrir.`)}
          />
        );
      case "plantio":
        return (
          <HistoricoPlantio
            vendas={vendas}
            onBack={back}
            onSpeak={speak}
            onOpenDetails={(venda) => {
              setVendaSelecionada(venda);
              setRoute("detalhe_colheita");
            }}
          />
        );
      case "plantacao":
        return (
          <Plantacao
            plantios={plantios}
            onBack={back}
            onSpeak={speak}
            onAddNovo={() => setRoute("nova_semente")}
            onOpenDetails={(plantio) => {
              setPlantioSelecionado(plantio);
              setRoute("detalhes_semente");
            }}
          />
        );
      case "nova_semente":
        return (
          <NovaSemente
            onBack={() => setRoute("plantacao")}
            onSave={async () => {
              await recarregar();
              setRoute("plantacao");
            }}
            onSpeak={speak}
          />
        );
      case "detalhes_semente":
        return (
          <DetalheSemente
            plantio={plantioSelecionado}
            onBack={() => setRoute("plantacao")}
            onSpeak={speak}
            onSell={() => setRoute("registrar_venda")}
          />
        );
      case "detalhe_colheita":
        return (
          <DetalheColheita
            venda={vendaSelecionada}
            onBack={() => setRoute("plantio")}
            onSpeak={speak}
          />
        );
      case "renda":
        return (
          <Renda
            onBack={back}
            onSpeak={speak}
            onRegistrarVenda={() => setRoute("registrar_venda")}
          />
        );
      case "registrar_venda":
        return (
          <RegistrarVenda
            onBack={() => setRoute("renda")}
            onSave={async () => {
              await recarregar();
              setRoute("renda");
            }}
            onSpeak={speak}
          />
        );
      case "clima":
        return <Clima onBack={back} onSpeak={speak} />;
      case "tarefas":
        return (
          <Tarefas
            tarefas={tarefas}
            onReload={recarregar}
            onBack={back}
            onSpeak={speak}
            onAddNovo={() => setRoute("nova_tarefa")}
          />
        );
      case "nova_tarefa":
        return (
          <NovaTarefa
            onBack={() => setRoute("tarefas")}
            onSave={async () => {
              await recarregar();
              setRoute("tarefas");
            }}
            onSpeak={speak}
          />
        );
      case "perfil":
        return <Perfil perfil={perfil} onBack={back} onSpeak={speak} onLogout={handleLogout} />;
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
