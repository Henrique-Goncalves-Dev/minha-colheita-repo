import { useState } from "react";
import { Volume2, ArrowLeft, Check, Delete } from "lucide-react";

interface PinScreenProps {
  userName: string;
  onBack: () => void;
  onComplete: () => void;
}

export function PinScreen({ userName, onBack, onComplete }: PinScreenProps) {
  const [pin, setPin] = useState("");

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      u.rate = 0.8;
      speechSynthesis.speak(u);
    }
  };

  const addDigit = (d: string) => {
    if (pin.length < 4) setPin(pin + d);
  };
  const removeDigit = () => setPin(pin.slice(0, -1));
  const handleConfirm = () => {
    if (pin.length === 4) onComplete();
    else speak("Digite 4 números para criar sua senha.");
  };

  const green = "#35504A";
  const greenLight = "#4a6e65";

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-8 gap-5" style={{ background: "linear-gradient(to bottom, #e8efed, #f5f8f7)" }}>
      {/* Back */}
      <button
        onClick={onBack}
        className="self-start rounded-full p-3 active:scale-95 transition-all"
        style={{ backgroundColor: "#d4deda" }}
      >
        <ArrowLeft className="w-7 h-7" style={{ color: green }} />
      </button>

      {/* Speaker */}
      <button
        onClick={() => speak(`Olá ${userName}. Escolha 4 números para criar sua senha. Depois aperte o botão verde.`)}
        className="rounded-full p-5 shadow-md active:scale-95 transition-all"
        style={{ backgroundColor: green }}
      >
        <Volume2 className="w-10 h-10 text-white" />
      </button>

      {/* PIN dots */}
      <div className="flex gap-5 my-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-16 h-16 rounded-full border-4 transition-all duration-300"
            style={{
              backgroundColor: i < pin.length ? green : "white",
              borderColor: i < pin.length ? green : "#35504A40",
              transform: i < pin.length ? "scale(1.1)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => addDigit(String(n))}
            className="text-white text-3xl h-16 rounded-2xl active:scale-90 transition-all shadow-md hover:brightness-110"
            style={{ backgroundColor: greenLight }}
          >
            {n}
          </button>
        ))}

        <button
          onClick={removeDigit}
          className="bg-red-500 text-white h-16 rounded-2xl active:scale-90 transition-all shadow-md flex items-center justify-center hover:brightness-110"
        >
          <Delete className="w-8 h-8" />
        </button>

        <button
          onClick={() => addDigit("0")}
          className="text-white text-3xl h-16 rounded-2xl active:scale-90 transition-all shadow-md hover:brightness-110"
          style={{ backgroundColor: greenLight }}
        >
          0
        </button>

        <button
          onClick={handleConfirm}
          className="h-16 rounded-2xl active:scale-90 transition-all shadow-md flex items-center justify-center hover:brightness-110"
          style={{
            backgroundColor: pin.length === 4 ? "#2d8a4e" : "#ccc",
            color: pin.length === 4 ? "white" : "#999",
          }}
        >
          <Check className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
