import { useNavigate } from 'react-router-dom';
import { User, Sprout, TreePine, Star, DollarSign, Heart, Mic } from 'lucide-react';
import { AudioButton } from '../components/AudioButton';
import { ActionCard } from '../components/ActionCard';

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EEF2F0] flex flex-col relative pb-24">
      {/* Header */}
      <header className="flex justify-between items-center p-6 mb-2">
        <button className="bg-[#345348] p-3 rounded-full text-white">
          <User size={28} />
        </button>
        <AudioButton variant="circle" className="w-12 h-12" />
      </header>

      {/* Grid de Cards */}
      <div className="px-6 grid grid-cols-2 gap-x-4 gap-y-6 max-w-md mx-auto w-full">
        <ActionCard title="Plantio" icon={<Sprout size={48} />} bgColor="bg-[#345348]" onClick={() => navigate('/plantio')} />
        <ActionCard title="Plantação" icon={<TreePine size={48} />} bgColor="bg-[#4A6F62]" />
        
        <ActionCard title="Tempo de Plantação" icon={<Star size={48} />} bgColor="bg-[#658B7D]" />
        <ActionCard title="Renda" icon={<DollarSign size={48} />} bgColor="bg-[#3A7055]" />
        
        <ActionCard title="Perfil" icon={<Heart size={48} />} bgColor="bg-[#2D6A53]" />
        <ActionCard title="Em breve" icon={<User size={48} />} bgColor="bg-[#3A4A45]" />
      </div>

      {/* Botão Flutuante de Microfone */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <button className="bg-[#345348] text-white p-5 rounded-full shadow-lg pointer-events-auto active:scale-95 transition-transform">
          <Mic size={36} />
        </button>
      </div>
    </div>
  );
}