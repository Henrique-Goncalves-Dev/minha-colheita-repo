import { Delete, Check } from 'lucide-react';

interface PinPadProps {
  onNumberPress: (num: number) => void;
  onDeletePress: () => void;
  onConfirmPress: () => void;
}

export function PinPad({ onNumberPress, onDeletePress, onConfirmPress }: PinPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
      {numbers.map((num) => (
        <button
          key={num}
          onClick={() => onNumberPress(num)}
          className="bg-[#486b5f] text-white text-3xl font-medium h-20 rounded-xl active:bg-[#345348] transition-colors shadow-sm"
        >
          {num}
        </button>
      ))}
      
      {/* Botão Apagar */}
      <button 
        onClick={onDeletePress}
        className="bg-[#F9313A] text-white flex justify-center items-center h-20 rounded-xl active:bg-red-700 transition-colors shadow-sm"
      >
        <Delete size={32} />
      </button>

      {/* Botão Zero */}
      <button
        onClick={() => onNumberPress(0)}
        className="bg-[#486b5f] text-white text-3xl font-medium h-20 rounded-xl active:bg-[#345348] transition-colors shadow-sm"
      >
        0
      </button>

      {/* Botão Confirmar */}
      <button 
        onClick={onConfirmPress}
        className="bg-[#CFD1CF] text-gray-500 flex justify-center items-center h-20 rounded-xl active:bg-gray-400 transition-colors shadow-sm"
      >
        <Check size={40} />
      </button>
    </div>
  );
}