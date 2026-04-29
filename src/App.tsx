import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";


import { NameScreen } from "./screens/identificationScreen";
import { PinScreen } from "./screens/pinScreen";
import { HomeScreen } from "./screens/homeScreen";
import { AddPlantScreen } from "./screens/addPlant";

// Criamos esse componente interno para podermos usar o `useNavigate`
function AppRoutes() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <NameScreen
            onNext={(name) => {
              setUserName(name);
              navigate("/pin"); // Vai para a tela de PIN
            }}
          />
        }
      />
      
      <Route
        path="/pin"
        element={
          <PinScreen
            userName={userName}
            onBack={() => navigate(-1)} // Volta para a tela anterior
            onComplete={() => navigate("/dashboard")} // Vai para a Home
          />
        }
      />
      
      <Route
        path="/dashboard"
        element={<HomeScreen userName={userName} />}
      />

      <Route
        path="/add-plant"
        element={<AddPlantScreen />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    // O seu fundo bonito que centraliza a tela do celular
    <div 
      className="min-h-screen flex items-center justify-center" 
      style={{ background: "linear-gradient(to bottom, #d4deda, #e8efed)" }}
    >
      {/* O seu contêiner que simula a tela do celular */}
      <div className="w-full max-w-[430px] min-h-screen bg-white relative overflow-hidden shadow-2xl">
        {/* O Router precisa ficar em volta de tudo que vai navegar */}
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </div>
    </div>
  );
}