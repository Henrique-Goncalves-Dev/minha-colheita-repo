import { useNavigate } from 'react-router-dom';
import { User, Phone, ArrowRight } from 'lucide-react';
import { AudioButton } from '../components/AudioButton';
import { CustomInput } from '../components/CustomInput';

export function IdentificationScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EEF2F0] flex flex-col items-center pt-20 px-6">
      
      {/* Avatar Principal */}
      <div className="bg-[#345348] rounded-full w-32 h-32 flex items-center justify-center mb-6 shadow-md">
        <User size={64} color="white" />
      </div>

      <AudioButton variant="pill" className="mb-12" />

      <form className="w-full max-w-sm" onSubmit={(e) => { e.preventDefault(); navigate('/pin'); }}>
        <CustomInput 
          label="Nome" 
          placeholder="Seu nome..." 
          icon={<User size={20} />} 
        />
        <CustomInput 
          label="Telefone" 
          placeholder="(00) 00000-0000" 
          type="tel"
          icon={<Phone size={20} />} 
        />

        <button 
          type="submit" 
          className="w-full bg-[#CFD1CF] text-white rounded-2xl py-4 mt-4 flex justify-center active:scale-95 transition-transform"
        >
          <ArrowRight size={32} />
        </button>
      </form>
    </div>
  );
}