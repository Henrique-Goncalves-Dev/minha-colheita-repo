import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AudioButton } from '../components/AudioButton';
import { PinPad } from '../components/PinPad';
import { entrar, registrar, type ApiError } from '../services/api';

interface LocationState {
  nome: string;
  telefone: string;
}

export function PinScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nome, telefone } = (location.state as LocationState) ?? { nome: '', telefone: '' };

  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleNumber = (num: number) => {
    if (pin.length < 4 && !loading) setPin(pin + num.toString());
  };

  const handleDelete = () => {
    if (!loading) setPin(pin.slice(0, -1));
  };

  const handleConfirm = async () => {
    if (pin.length !== 4 || loading) return;
    setLoading(true);
    setErro('');

    try {
      await entrar(telefone, pin);
      navigate('/dashboard');
    } catch (err) {
      const apiErr = err as ApiError;

      if (apiErr.status === 404) {
        try {
          await registrar(nome, telefone, pin);
          await entrar(telefone, pin);
          navigate('/dashboard');
        } catch {
          setErro('Erro ao criar conta. Tente novamente.');
          setPin('');
        }
      } else if (apiErr.status === 401) {
        setErro('PIN incorreto. Tente novamente.');
        setPin('');
      } else {
        setErro('Erro de conexão. Verifique sua internet.');
        setPin('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF2F0] flex flex-col pt-12 px-6">
      <div className="relative flex justify-center items-center mb-16 w-full max-w-sm mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 bg-[#E3E8E5] p-3 rounded-full active:bg-gray-300"
        >
          <ArrowLeft size={24} className="text-[#345348]" />
        </button>
        <AudioButton variant="circle" />
      </div>

      <div className="flex justify-center gap-4 mb-4">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`w-14 h-14 rounded-full border-4 transition-colors duration-200 ${
              erro
                ? 'bg-red-100 border-red-400'
                : pin.length >= index
                ? 'bg-[#345348] border-[#345348]'
                : 'bg-white border-[#D1D5DB]'
            }`}
          />
        ))}
      </div>

      {erro ? (
        <p className="text-center text-red-500 text-sm mb-8">{erro}</p>
      ) : (
        <div className="mb-8 h-5" />
      )}

      {loading ? (
        <div className="flex justify-center mt-8">
          <div className="w-10 h-10 border-4 border-[#345348] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <PinPad
          onNumberPress={handleNumber}
          onDeletePress={handleDelete}
          onConfirmPress={handleConfirm}
        />
      )}
    </div>
  );
}
