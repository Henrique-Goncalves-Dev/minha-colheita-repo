import { useState } from "react";
import { ArrowRight, Phone, User, ChevronLeft, Sprout, Loader2 } from "lucide-react";
import { colors, PrimaryButton, VoiceButtonLarge } from "../agro-ui";
import { entrar, registrar, type ApiError } from "../services/api";

type Step = "identify" | "pin";

export function Login({ onEnter }: { onEnter: () => void }) {
  const [step, setStep] = useState<Step>("identify");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  };

  const avancarParaPin = () => {
    if (!nome.trim()) {
      setErro("Digite seu nome");
      speak("Por favor, digite seu nome");
      return;
    }
    const tel = telefone.replace(/\D/g, "");
    if (tel.length < 10 || tel.length > 11) {
      setErro("Telefone deve ter 10 ou 11 dígitos");
      speak("Telefone deve ter 10 ou 11 dígitos");
      return;
    }
    setErro(null);
    setStep("pin");
    speak("Agora, digite seu PIN de 4 números");
  };

  const confirmarPin = async (pinAlvo: string) => {
    const tel = telefone.replace(/\D/g, "");
    if (pinAlvo.length !== 4 || !/^\d{4}$/.test(pinAlvo)) {
      setErro("PIN deve ter 4 dígitos");
      speak("O PIN deve ter 4 números");
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      await entrar(tel, pinAlvo);
      speak(`Bem-vindo de volta, ${nome}!`);
      onEnter();
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 404) {
        try {
          await registrar(nome.trim(), tel, pinAlvo);
          await entrar(tel, pinAlvo);
          speak(`Conta criada com sucesso! Bem-vindo, ${nome}!`);
          onEnter();
        } catch (regErr) {
          const re = regErr as ApiError;
          setErro(re.detail || "Erro ao criar conta");
          speak(re.detail || "Erro ao criar conta");
        }
      } else if (err.status === 401) {
        setErro("PIN incorreto");
        setPin("");
        speak("PIN incorreto. Tente novamente.");
      } else {
        setErro(err.detail || "Erro de conexão");
        speak("Erro de conexão com o servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        confirmarPin(newPin);
      }
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
    setErro(null);
  };

  return (
    <div
      className="min-h-full flex flex-col relative overflow-hidden"
      style={{
        background: `radial-gradient(120% 60% at 50% 0%, #3A9E3A 0%, ${colors.forest} 55%, ${colors.forestDeep} 100%)`,
      }}
    >
      <div style={{ height: 20, background: colors.statusBar }} />

      <div
        style={{
          position: "absolute",
          top: -60,
          right: -40,
          width: 220,
          height: 220,
          borderRadius: 999,
          background: "rgba(232,160,32,0.18)",
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 120,
          left: -60,
          width: 180,
          height: 180,
          borderRadius: 999,
          background: "rgba(82,177,82,0.25)",
          filter: "blur(40px)",
        }}
      />

      <div className="flex flex-col items-center pt-10 pb-6 px-6 relative">
        <div
          className="flex items-center justify-center"
          style={{
            width: 78,
            height: 78,
            borderRadius: 22,
            background: `linear-gradient(135deg, #FFFFFF 0%, #E8F5E8 100%)`,
            boxShadow:
              "0 10px 28px rgba(0,0,0,0.3), inset 0 -3px 0 rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          <Sprout size={42} color={colors.field} strokeWidth={2.5} />
        </div>
        <h1
          style={{
            fontFamily: "Nunito",
            fontWeight: 900,
            fontSize: 30,
            letterSpacing: -0.5,
            color: colors.white,
            marginTop: 16,
          }}
        >
          AgroGestão
        </h1>
        <p style={{ color: "#C7E8C7", fontSize: 13, marginTop: 4, fontWeight: 700 }}>
          Seu campo, bem organizado
        </p>
      </div>

      <div className="flex-1 px-5 pb-8 relative">
        <div
          style={{
            background: colors.white,
            borderRadius: 24,
            padding: 24,
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          {step === "identify" ? (
            <IdentifyStep
              nome={nome}
              setNome={setNome}
              telefone={telefone}
              setTelefone={setTelefone}
              erro={erro}
              onNext={avancarParaPin}
              onSpeak={() => speak("Digite seu nome e telefone para entrar")}
            />
          ) : (
            <PinStep
              nome={nome}
              pin={pin}
              erro={erro}
              loading={loading}
              onDigit={handlePinDigit}
              onDelete={handlePinDelete}
              onBack={() => { setStep("identify"); setPin(""); setErro(null); }}
            />
          )}
        </div>
        <p style={{ textAlign: "center", color: "#A8D5A8", fontSize: 11, fontWeight: 700, marginTop: 18 }}>
          v1.0 · feito para o campo brasileiro
        </p>
      </div>
    </div>
  );
}

function IdentifyStep({
  nome,
  setNome,
  telefone,
  setTelefone,
  erro,
  onNext,
  onSpeak,
}: {
  nome: string;
  setNome: (v: string) => void;
  telefone: string;
  setTelefone: (v: string) => void;
  erro: string | null;
  onNext: () => void;
  onSpeak: () => void;
}) {
  return (
    <>
      <h2 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 22, color: colors.ink, marginBottom: 4, letterSpacing: -0.3 }}>
        Bem-vindo!
      </h2>
      <p style={{ color: colors.earthSoft, fontSize: 13, fontWeight: 700, marginBottom: 18 }}>
        Digite seu nome e telefone para entrar
      </p>
      <Field
        icon={<User size={20} strokeWidth={2.2} />}
        label="Seu nome"
        value={nome}
        onChange={setNome}
        placeholder="Ex: João Silva"
      />
      <Field
        icon={<Phone size={20} strokeWidth={2.2} />}
        label="Telefone"
        type="tel"
        value={telefone}
        onChange={setTelefone}
        placeholder="(00) 00000-0000"
      />
      {erro && (
        <p style={{ color: colors.alert, fontSize: 13, fontWeight: 800, marginBottom: 8 }}>
          {erro}
        </p>
      )}
      <div className="mt-2">
        <PrimaryButton onClick={onNext} icon={<ArrowRight size={18} strokeWidth={2.5} />}>
          CONTINUAR
        </PrimaryButton>
      </div>
      <div className="my-3 flex items-center gap-3">
        <div style={{ flex: 1, height: 1, background: colors.border }} />
        <span style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 900, letterSpacing: 1 }}>OU</span>
        <div style={{ flex: 1, height: 1, background: colors.border }} />
      </div>
      <VoiceButtonLarge onClick={onSpeak}>ENTRAR POR VOZ</VoiceButtonLarge>
    </>
  );
}

function PinStep({
  nome,
  pin,
  erro,
  loading,
  onDigit,
  onDelete,
  onBack,
}: {
  nome: string;
  pin: string;
  erro: string | null;
  loading: boolean;
  onDigit: (d: string) => void;
  onDelete: () => void;
  onBack: () => void;
}) {
  return (
    <>
      <button type="button"
        onClick={onBack}
        className="flex items-center gap-1 mb-2"
        style={{ color: colors.field, fontWeight: 900, fontSize: 13 }}
      >
        <ChevronLeft size={16} strokeWidth={2.5} /> Voltar
      </button>
      <h2 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 22, color: colors.ink, marginBottom: 4, letterSpacing: -0.3 }}>
        Olá, {nome.split(" ")[0]}!
      </h2>
      <p style={{ color: colors.earthSoft, fontSize: 13, fontWeight: 700, marginBottom: 18 }}>
        Digite seu PIN de 4 dígitos
      </p>

      <div className="flex justify-center gap-4 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              border: `2.5px solid ${erro ? colors.alert : pin.length > i ? colors.field : colors.border}`,
              background: pin.length > i
                ? erro ? "rgba(214,60,60,0.08)" : "rgba(45,122,45,0.08)"
                : colors.cream,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              transform: pin.length > i ? "scale(1.05)" : "scale(1)",
            }}
          >
            {pin.length > i && (
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: erro ? colors.alert : colors.field,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {erro && (
        <p style={{ color: colors.alert, fontSize: 13, fontWeight: 800, textAlign: "center", marginBottom: 12 }}>
          {erro}
        </p>
      )}

      {loading && (
        <div className="flex justify-center mb-4">
          <Loader2 size={28} color={colors.field} className="animate-spin" />
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((key) => {
          if (key === "") return <div key="empty" />;
          return (
            <button
              key={key}
              type="button"
              disabled={loading}
              onClick={() => key === "⌫" ? onDelete() : onDigit(key)}
              className="flex items-center justify-center active:scale-95 transition-transform"
              style={{
                height: 56,
                borderRadius: 14,
                background: key === "⌫" ? colors.cream : colors.white,
                border: `1px solid ${colors.borderSoft}`,
                fontFamily: "Nunito",
                fontWeight: 900,
                fontSize: key === "⌫" ? 20 : 22,
                color: colors.ink,
                opacity: loading ? 0.5 : 1,
              }}
            >
              {key}
            </button>
          );
        })}
      </div>

      <p style={{ textAlign: "center", color: colors.earthSoft, fontSize: 11, fontWeight: 700, marginTop: 14 }}>
        Primeiro acesso? A conta é criada automaticamente.
      </p>
    </>
  );
}

function Field({
  icon,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block mb-3">
      <span style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.inkSoft, fontSize: 12, letterSpacing: 0.3 }}>
        {label.toUpperCase()}
      </span>
      <div
        className="flex items-center gap-2 mt-1.5"
        style={{
          border: `1.5px solid ${colors.border}`,
          borderRadius: 12,
          padding: "0 14px",
          height: 52,
          background: colors.cream,
        }}
      >
        <span style={{ color: colors.field, display: "flex" }}>{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 outline-none bg-transparent"
          style={{ fontFamily: "Nunito", fontWeight: 700, color: colors.ink, fontSize: 15 }}
        />
      </div>
    </label>
  );
}