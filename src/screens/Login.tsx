import { useState } from "react";
import { ArrowRight, Lock, MapPin, Phone, IdCard, User, ChevronLeft, Sprout } from "lucide-react";
import { colors, PrimaryButton, VoiceButtonLarge } from "../agro-ui";

type Mode = "login" | "signup" | "forgot";

export function Login({ onEnter }: { onEnter: () => void }) {
  const [mode, setMode] = useState<Mode>("login");

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div
      className="min-h-full flex flex-col relative overflow-hidden"
      style={{
        background: `radial-gradient(120% 60% at 50% 0%, #3A9E3A 0%, ${colors.forest} 55%, ${colors.forestDeep} 100%)`,
      }}
    >
      <div style={{ height: 20, background: colors.statusBar }} />

      {/* Decorative blobs */}
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
          {mode === "login" && (
            <LoginForm
              onEnter={onEnter}
              onSpeak={() => speak("Toque para entrar com sua voz")}
              onSignup={() => setMode("signup")}
              onForgot={() => setMode("forgot")}
            />
          )}
          {mode === "signup" && <SignupForm onBack={() => setMode("login")} onEnter={onEnter} onSpeak={speak} />}
          {mode === "forgot" && <ForgotForm onBack={() => setMode("login")} onSpeak={speak} />}
        </div>
        <p style={{ textAlign: "center", color: "#A8D5A8", fontSize: 11, fontWeight: 700, marginTop: 18 }}>
          v1.0 · feito para o campo brasileiro
        </p>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  type = "text",
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  type?: string;
  placeholder?: string;
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
          className="flex-1 outline-none bg-transparent"
          style={{ fontFamily: "Nunito", fontWeight: 700, color: colors.ink, fontSize: 15 }}
        />
      </div>
    </label>
  );
}

function LoginForm({
  onEnter,
  onSpeak,
  onSignup,
  onForgot,
}: {
  onEnter: () => void;
  onSpeak: () => void;
  onSignup: () => void;
  onForgot: () => void;
}) {
  return (
    <>
      <h2 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 22, color: colors.ink, marginBottom: 4, letterSpacing: -0.3 }}>
        Entrar na sua conta
      </h2>
      <p style={{ color: colors.earthSoft, fontSize: 13, fontWeight: 700, marginBottom: 18 }}>
        Bem-vindo de volta
      </p>
      <Field icon={<Phone size={20} strokeWidth={2.2} />} label="Telefone ou CPF" placeholder="(00) 00000-0000" />
      <Field icon={<Lock size={20} strokeWidth={2.2} />} label="Senha" type="password" placeholder="••••••" />
      <div className="mt-2">
        <PrimaryButton onClick={onEnter} icon={<ArrowRight size={18} strokeWidth={2.5} />}>
          ENTRAR
        </PrimaryButton>
      </div>
      <div className="my-3 flex items-center gap-3">
        <div style={{ flex: 1, height: 1, background: colors.border }} />
        <span style={{ color: colors.earthSoft, fontSize: 11, fontWeight: 900, letterSpacing: 1 }}>OU</span>
        <div style={{ flex: 1, height: 1, background: colors.border }} />
      </div>
      <VoiceButtonLarge onClick={onSpeak}>ENTRAR POR VOZ</VoiceButtonLarge>
      <div className="flex justify-between mt-5">
        <button type="button" onClick={onSignup} style={{ color: colors.field, fontWeight: 900, fontSize: 13 }}>
          Criar conta
        </button>
        <button type="button" onClick={onForgot} style={{ color: colors.earth, fontWeight: 900, fontSize: 13 }}>
          Esqueci a senha
        </button>
      </div>
    </>
  );
}

function SignupForm({
  onBack,
  onEnter,
  onSpeak,
}: {
  onBack: () => void;
  onEnter: () => void;
  onSpeak: (t: string) => void;
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
        Criar minha conta
      </h2>
      <p style={{ color: colors.earthSoft, fontSize: 13, fontWeight: 700, marginBottom: 18 }}>
        Vamos preparar seu cadastro
      </p>
      <Field icon={<User size={20} strokeWidth={2.2} />} label="Nome completo" />
      <Field icon={<Phone size={20} strokeWidth={2.2} />} label="Telefone" />
      <Field icon={<IdCard size={20} strokeWidth={2.2} />} label="CPF" />
      <Field icon={<MapPin size={20} strokeWidth={2.2} />} label="Cidade / Estado" />
      <Field icon={<Lock size={20} strokeWidth={2.2} />} label="Senha" type="password" />
      <div className="mt-2">
        <PrimaryButton onClick={onEnter}>CRIAR MINHA CONTA</PrimaryButton>
      </div>
      <div className="mt-3">
        <VoiceButtonLarge onClick={() => onSpeak("Preencher cadastro por voz")}>PREENCHER POR VOZ</VoiceButtonLarge>
      </div>
    </>
  );
}

function ForgotForm({ onBack, onSpeak }: { onBack: () => void; onSpeak: (t: string) => void }) {
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
        Esqueci a senha
      </h2>
      <p style={{ color: colors.earthSoft, fontSize: 13, fontWeight: 700, marginBottom: 18 }}>
        Vamos enviar um código para você
      </p>
      <Field icon={<Phone size={20} strokeWidth={2.2} />} label="Telefone ou CPF cadastrado" />
      <div className="mt-2">
        <PrimaryButton onClick={() => onSpeak("Código enviado")}>ENVIAR CÓDIGO</PrimaryButton>
      </div>
      <div className="mt-3">
        <VoiceButtonLarge onClick={() => onSpeak("Falar meu número")}>FALAR MEU NÚMERO</VoiceButtonLarge>
      </div>
    </>
  );
}
