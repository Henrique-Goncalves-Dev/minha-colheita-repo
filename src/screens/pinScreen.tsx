import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AudioButton } from '../components/AudioButton';
import { PinPad } from '../components/PinPad';

export function PinScreen() {
  const navigate = useNavigate();
  const [pin, setPin] = useState<string>('');

  const handleNumber = (num: number) => {
    if (pin.length < 4) setPin(pin + num.toString());
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleConfirm = () => {
    if (pin.length === 4) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#EEF2F0] flex flex-col pt-12 px-6">
      {/* Header com voltar e áudio */}
      <div className="relative flex justify-center items-center mb-16 w-full max-w-sm mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-0 bg-[#E3E8E5] p-3 rounded-full active:bg-gray-300"
        >
          <ArrowLeft size={24} className="text-[#345348]" />
        </button>
        <AudioButton variant="circle" />
      </div>

      {/* Indicadores do PIN */}
      <div className="flex justify-center gap-4 mb-12">
        {[1, 2, 3, 4].map((index) => (
          <div 
            key={index} 
            className={`w-14 h-14 rounded-full border-4 ${
              pin.length >= index ? 'bg-[#345348] border-[#345348]' : 'bg-white border-[#D1D5DB]'
            } transition-colors duration-200`}
          />
        ))}
      </div>

      <PinPad 
        onNumberPress={handleNumber} 
        onDeletePress={handleDelete} 
        onConfirmPress={handleConfirm} 
      />
    </div>
  );
}