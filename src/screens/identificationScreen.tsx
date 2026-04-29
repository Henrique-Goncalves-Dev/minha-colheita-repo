import { useState } from "react";
import { Volume2, ArrowRight, User, Phone } from "lucide-react";

interface NameScreenProps {
  onNext: (name: string) => void;
}

export function NameScreen({ onNext }: NameScreenProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      u.rate = 0.8;
      speechSynthesis.speak(u);
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const isValid = name.trim().length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 gap-7" style={{ background: "linear-gradient(to bottom, #e8efed, #f5f8f7)" }}>
      {/* Avatar */}
      <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #35504A, #4a6e65)" }}>
        <User className="w-14 h-14 text-white" />
      </div>

      {/* Speaker */}
      <button
        onClick={() => speak("Digite seu nome no primeiro campo. Depois digite seu número de telefone. Aperte o botão verde para continuar.")}
        className="flex items-center gap-3 active:scale-95 transition-all rounded-full px-6 py-4 shadow-md"
        style={{ backgroundColor: "#35504A" }}
      >
        <Volume2 className="w-10 h-10 text-white" />
        <div className="flex gap-1">
          <span className="w-2 h-6 bg-white/70 rounded-full animate-pulse" />
          <span className="w-2 h-8 bg-white/70 rounded-full animate-pulse delay-75" />
          <span className="w-2 h-5 bg-white/70 rounded-full animate-pulse delay-150" />
          <span className="w-2 h-7 bg-white/70 rounded-full animate-pulse delay-100" />
        </div>
      </button>

      {/* Name input */}
      <div className="w-full">
        <div className="flex items-center gap-3 mb-2 px-1">
          <User className="w-5 h-5" style={{ color: "#35504A" }} />
          <span className="text-sm" style={{ color: "#35504A" }}>Nome</span>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome..."
          className="w-full text-center text-2xl py-5 px-6 rounded-2xl border-3 focus:outline-none bg-white transition-colors"
          style={{ borderColor: "#35504A40", color: "#35504A" }}
          onFocus={(e) => (e.target.style.borderColor = "#35504A")}
          onBlur={(e) => (e.target.style.borderColor = "#35504A40")}
        />
      </div>

      {/* Phone input */}
      <div className="w-full">
        <div className="flex items-center gap-3 mb-2 px-1">
          <Phone className="w-5 h-5" style={{ color: "#35504A" }} />
          <span className="text-sm" style={{ color: "#35504A" }}>Telefone</span>
        </div>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          placeholder="(00) 00000-0000"
          className="w-full text-center text-2xl py-5 px-6 rounded-2xl border-3 focus:outline-none bg-white transition-colors"
          style={{ borderColor: "#35504A40", color: "#35504A" }}
          onFocus={(e) => (e.target.style.borderColor = "#35504A")}
          onBlur={(e) => (e.target.style.borderColor = "#35504A40")}
        />
      </div>

      {/* Next button */}
      <button
        onClick={() => {
          if (isValid) onNext(name.trim());
          else speak("Por favor, digite seu nome primeiro.");
        }}
        disabled={!isValid}
        className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 text-white"
        style={{ background: isValid ? "linear-gradient(to right, #35504A, #4a6e65)" : "#ccc" }}
      >
        <ArrowRight className="w-10 h-10" />
      </button>
    </div>
  );
}