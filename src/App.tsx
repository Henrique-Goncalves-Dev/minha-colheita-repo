import { useState } from "react";
import { Login } from "./screens/Login";
import { Dashboard, type ScreenKey } from "./screens/Dashboard";
import { Plantio } from "./screens/Plantio";
import { Plantacao } from "./screens/Plantacao";
import { Renda } from "./screens/Renda";
import { Clima } from "./screens/Clima";
import { Tarefas } from "./screens/Tarefas";
import { Perfil } from "./screens/Perfil";

type Route = "login" | "menu" | ScreenKey;

const USER = "João";

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
  const back = () => setRoute("menu");

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
        return <Plantio onBack={back} onSpeak={speak} />;
      case "plantacao":
        return <Plantacao onBack={back} onSpeak={speak} />;
      case "renda":
        return <Renda onBack={back} onSpeak={speak} />;
      case "clima":
        return <Clima onBack={back} onSpeak={speak} />;
      case "tarefas":
        return <Tarefas onBack={back} onSpeak={speak} />;
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
          overflow: "hidden",
        }}
      >
        {screen}
      </div>
    </div>
  );
}
