import { Volume2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface ActionCardProps {
  title: string;
  icon: ReactNode;
  bgColor?: string;
}

export function ActionCard({ title, icon, bgColor = 'bg-[#345348]' }: ActionCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[#2C4A40] text-sm font-medium ml-1">
        <Volume2 size={16} />
        <span>{title}</span>
      </div>
      <button type="button" className={`${bgColor} flex items-center justify-center rounded-3xl aspect-square shadow-sm active:scale-95 transition-transform text-white`}>
        {icon}
      </button>
    </div>
  );
}