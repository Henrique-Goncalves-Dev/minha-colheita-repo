import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Sprout, ShoppingBag, DollarSign, LogOut, Heart } from 'lucide-react';
import { getPerfil, logout, type ApiError, type PerfilResponse } from '../services/api';

function mascararTelefone(t: string): string {
  if (t.length === 11) return `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}`;
  if (t.length === 10) return `(${t.slice(0, 2)}) ${t.slice(2, 6)}-${t.slice(6)}`;
  return t;
}

function formatarBRL(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function PerfilScreen() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<PerfilResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    getPerfil()
      .then((dados) => { if (ativo) setPerfil(dados); })
      .catch((err) => {
        const apiErr = err as ApiError;
        if (apiErr.status === 401) { navigate('/'); return; }
        if (ativo) setErro('Não foi possível carregar seu perfil.');
      })
      .finally(() => { if (ativo) setLoading(false); });
    return () => { ativo = false; };
  }, [navigate]);

  function sair() {
    logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-[#EEF2F0] flex flex-col pt-12 px-6 pb-10">
      <div className="relative flex justify-center items-center mb-8 w-full max-w-sm mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 bg-[#E3E8E5] p-3 rounded-full active:bg-gray-300"
        >
          <ArrowLeft size={24} className="text-[#345348]" />
        </button>
        <div className="flex items-center gap-2 text-[#345348] font-semibold text-lg">
          <Heart size={24} />
          <span>Perfil</span>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col gap-5">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#345348] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && erro && <p className="text-red-500 text-center">{erro}</p>}

        {!loading && !erro && perfil && (
          <>
            <div className="bg-[#345348] rounded-2xl p-6 flex flex-col items-center gap-3 text-white">
              <div className="bg-white/20 p-5 rounded-full">
                <User size={48} color="white" />
              </div>
              <span className="text-2xl font-semibold">{perfil.nome}</span>
            </div>

            <InfoCard icon={<Phone size={22} />} label="Telefone" valor={mascararTelefone(perfil.telefone)} />
            <InfoCard
              icon={<Sprout size={22} />}
              label="Sementes plantadas"
              valor={`${perfil.total_sementes_plantadas} (${perfil.total_plantios} plantio${perfil.total_plantios === 1 ? '' : 's'})`}
            />
            <InfoCard
              icon={<ShoppingBag size={22} />}
              label="Vendas registradas"
              valor={String(perfil.total_vendas)}
            />
            <InfoCard
              icon={<DollarSign size={22} />}
              label="Total arrecadado"
              valor={formatarBRL(perfil.total_arrecadado)}
            />

            <button
              onClick={sair}
              className="w-full mt-4 bg-red-50 text-red-600 rounded-2xl py-4 text-lg font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <LogOut size={22} />
              Sair
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, valor }: { icon: React.ReactNode; label: string; valor: string }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-[#D1D5DB] p-4 flex items-center gap-3">
      <div className="bg-[#658B7D] p-2 rounded-full text-white">{icon}</div>
      <div className="flex flex-col flex-1">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="text-[#345348] font-semibold text-lg">{valor}</span>
      </div>
    </div>
  );
}
