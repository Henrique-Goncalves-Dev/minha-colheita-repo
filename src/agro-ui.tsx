import type { ReactNode } from 'react';
import { ArrowLeft, Mic, Volume2 } from "lucide-react";

export const colors = {
  forest: "#1A4A1A",
  forestDeep: "#0F3310",
  field: "#2D7A2D",
  fieldDark: "#225C22",
  light: "#52B152",
  wash: "#F0FAF0",
  gold: "#E8A020",
  goldDeep: "#C8821A",
  goldLight: "#FDF3E0",
  earth: "#7A5230",
  earthSoft: "#8E6B4A",
  cream: "#FAF8F3",
  white: "#FFFFFF",
  alert: "#D63C3C",
  border: "#D9EBD9",
  borderSoft: "#E9F2E9",
  ink: "#11270F",
  inkSoft: "#3D5238",
  statusBar: "#0D2B0D",
};

export function VoiceFab({ onClick, label = "Ouvir" }: { onClick?: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center active:scale-95 transition-transform"
      style={{
        width: 44,
        height: 44,
        borderRadius: 999,
        background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDeep} 100%)`,
        color: colors.white,
        boxShadow: "0 6px 14px rgba(232,160,32,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
      }}
    >
      <Mic size={20} strokeWidth={2.5} />
    </button>
  );
}

export function HeaderBar({
  title,
  subtitle,
  onBack,
  onVoice,
  variant = "solid",
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onVoice?: () => void;
  variant?: "solid" | "transparent";
}) {
  const bg =
    variant === "solid"
      ? `linear-gradient(180deg, ${colors.forest} 0%, ${colors.forestDeep} 100%)`
      : "transparent";
  return (
    <div>
      <div style={{ height: 20, background: variant === "solid" ? colors.statusBar : "transparent" }} />
      <div
        className="flex items-center justify-between px-4"
        style={{ minHeight: 56, background: bg, color: colors.white }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Voltar"
              className="flex items-center justify-center active:scale-95 transition-transform"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
          )}
          <div className="min-w-0">
            <h1
              style={{
                fontFamily: "Nunito",
                fontWeight: 900,
                fontSize: 19,
                letterSpacing: -0.2,
                margin: 0,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: 12, opacity: 0.75, fontWeight: 700 }}>{subtitle}</p>
            )}
          </div>
        </div>
        {onVoice && <VoiceFab onClick={onVoice} />}
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  fullWidth = true,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 active:scale-[0.98] transition-transform ${fullWidth ? "w-full" : ""}`}
      style={{
        background: `linear-gradient(180deg, ${colors.field} 0%, ${colors.fieldDark} 100%)`,
        color: colors.white,
        height: 52,
        padding: "0 18px",
        borderRadius: 12,
        fontFamily: "Nunito",
        fontWeight: 900,
        fontSize: 15,
        letterSpacing: 0.2,
        boxShadow: "0 6px 14px rgba(45,122,45,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
      }}
    >
      <span>{children}</span>
      {icon}
    </button>
  );
}

export function VoiceButtonLarge({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      style={{
        background: `linear-gradient(180deg, ${colors.gold} 0%, ${colors.goldDeep} 100%)`,
        color: colors.white,
        height: 52,
        borderRadius: 12,
        fontFamily: "Nunito",
        fontWeight: 900,
        fontSize: 14,
        letterSpacing: 0.6,
        boxShadow: "0 6px 14px rgba(232,160,32,0.4), inset 0 1px 0 rgba(255,255,255,0.22)",
      }}
    >
      <Mic size={18} strokeWidth={2.5} />
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, icon }: { children: ReactNode; onClick?: () => void; icon?: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 w-full active:scale-[0.98] transition-transform"
      style={{
        background: colors.wash,
        color: colors.field,
        border: `1.5px solid ${colors.border}`,
        height: 52,
        padding: "0 16px",
        borderRadius: 12,
        fontFamily: "Nunito",
        fontWeight: 900,
        fontSize: 14,
      }}
    >
      {icon}
      {children}
    </button>
  );
}


export function Card({
  children,
  style,
  className, 
  onClick,
  elevated = false,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string; 
  onClick?: () => void;
  elevated?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={className} 
      style={{
        background: colors.white,
        border: `1px solid ${colors.borderSoft}`,
        borderRadius: 16,
        boxShadow: elevated
          ? "0 8px 24px rgba(15, 51, 16, 0.08), 0 2px 4px rgba(15, 51, 16, 0.04)"
          : "0 1px 2px rgba(15, 51, 16, 0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "gold",
  style, // <-- 1. Adicionamos o style aqui
}: {
  children: React.ReactNode;
  tone?: "gold" | "green" | "red" | "neutral";
  style?: React.CSSProperties; // <-- 2. Tipamos ele aqui
}) {
  const tones = {
    gold: { bg: colors.goldLight, border: colors.gold, fg: colors.goldDeep },
    green: { bg: colors.wash, border: colors.light, fg: colors.field },
    red: { bg: "#FDECEC", border: colors.alert, fg: colors.alert },
    neutral: { bg: colors.cream, border: colors.border, fg: colors.earth },
  }[tone];
  
  return (
    <span
      style={{
        background: tones.bg,
        border: `1px solid ${tones.border}`,
        color: tones.fg,
        borderRadius: 999,
        padding: "5px 11px",
        fontFamily: "Nunito",
        fontWeight: 900,
        fontSize: 12,
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        ...style, // <-- 3. E aplicamos ele aqui no final para sobrescrever o padrão!
      }}
    >
      {children}
    </span>
  );
}

export function VoiceBanner({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 active:opacity-90"
      style={{
        background: `linear-gradient(90deg, ${colors.gold} 0%, ${colors.goldDeep} 100%)`,
        color: colors.white,
        padding: "10px 16px",
        fontFamily: "Nunito",
        fontWeight: 900,
        fontSize: 13,
        letterSpacing: 0.3,
      }}
    >
      <Volume2 size={16} strokeWidth={2.5} />
      <span>Toque para ouvir esta tela</span>
    </button>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        color: colors.field,
        fontFamily: "Nunito",
        fontWeight: 900,
        fontSize: 11,
        letterSpacing: 1.4,
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}
