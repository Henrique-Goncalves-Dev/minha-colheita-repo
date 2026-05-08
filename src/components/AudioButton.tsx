import { Volume2 } from 'lucide-react';

interface AudioButtonProps {
  variant?: 'pill' | 'circle';
  text?: string;
  onClick?: () => void;
  className?: string;
}

export function AudioButton({ variant = 'circle', text, onClick, className = '' }: AudioButtonProps) {
  const isPill = variant === 'pill';

  return (
    <button type="button"
      onClick={onClick}
      className={`flex items-center justify-center bg-[#345348] text-white transition-transform active:scale-95 shadow-md ${
        isPill ? 'rounded-full px-6 py-3 gap-3' : 'rounded-full w-14 h-14'
      } ${className}`}
    >
      <Volume2 size={isPill ? 28 : 24} strokeWidth={2.5} />
      {isPill && text && (
        <span className="text-xl font-medium tracking-wide">||| {text}</span> // Simulando o ícone de onda sonora
      )}
    </button>
  );
}