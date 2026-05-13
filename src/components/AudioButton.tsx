import { Volume2 } from 'lucide-react';
import { speak, isTTSAvailable } from '../voice/tts';

interface AudioButtonProps {
  variant?: 'pill' | 'circle';
  text?: string;
  onClick?: () => void;
  className?: string;
  speakText?: string;
}

export function AudioButton({ variant = 'circle', text, onClick, className = '', speakText }: AudioButtonProps) {
  const isPill = variant === 'pill';

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    const toSay = speakText ?? text;
    if (toSay && isTTSAvailable()) {
      void speak(toSay);
    }
  };

  return (
    <button type="button"
      onClick={handleClick}
      className={`flex items-center justify-center bg-[#345348] text-white transition-transform active:scale-95 shadow-md ${
        isPill ? 'rounded-full px-6 py-3 gap-3' : 'rounded-full w-14 h-14'
      } ${className}`}
    >
      <Volume2 size={isPill ? 28 : 24} strokeWidth={2.5} />
      {isPill && text && (
        <span className="text-xl font-medium tracking-wide">||| {text}</span>
      )}
    </button>
  );
}
