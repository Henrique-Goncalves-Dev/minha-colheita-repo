import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, ArrowRight } from 'lucide-react';
import { AudioButton } from '../components/AudioButton';
import { CustomInput } from '../components/CustomInput';

export function IdentificationScreen() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  const telefoneLimpo = telefone.replace(/\D/g, '');
  const valido = nome.trim().length > 0 && telefoneLimpo.length >= 10;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valido) return;
    navigate('/pin', { state: { nome: nome.trim(), telefone: telefoneLimpo } });
  }

  return (
    <div className="min-h-screen bg-[#EEF2F0] flex flex-col items-center pt-20 px-6">

      <div className="bg-[#345348] rounded-full w-32 h-32 flex items-center justify-center mb-6 shadow-md">
        <User size={64} color="white" />
      </div>

      <AudioButton variant="pill" className="mb-12" />

      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <CustomInput
          label="Nome"
          placeholder="Seu nome..."
          icon={<User size={20} />}
          value={nome}
          onChange={setNome}
        />
        <CustomInput
          label="Telefone"
          placeholder="(00) 00000-0000"
          type="tel"
          icon={<Phone size={20} />}
          value={telefone}
          onChange={setTelefone}
        />

        <button
          type="submit"
          disabled={!valido}
          className={`w-full rounded-2xl py-4 mt-4 flex justify-center active:scale-95 transition-all ${
            valido ? 'bg-[#345348] text-white' : 'bg-[#CFD1CF] text-white cursor-not-allowed'
          }`}
        >
          <ArrowRight size={32} />
        </button>
      </form>
    </div>
  );
}
