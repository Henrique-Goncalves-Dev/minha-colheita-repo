import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TreePine, Sprout, CalendarDays, Clock } from 'lucide-react';
import { listarPlantios, type ApiError, type PlantioResponse } from '../services/api';
import {
  tempoColheitaEstimadoDias,
  dataColheitaEstimada,
  diasRestantes,
} from '../utils/colheita';

function formatarData(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR');
}

export function PlantacaoScreen() {
  const navigate = useNavigate();
  const [plantios, setPlantios] = useState<PlantioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    listarPlantios()
      .then((dados) => {
        if (ativo) setPlantios(dados);
      })
      .catch((err) => {
        const apiErr = err as ApiError;
        if (apiErr.status === 401) {
          navigate('/');
          return;
        }
        if (ativo) setErro('Não foi possível carregar suas plantações.');
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, [navigate]);

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
          <TreePine size={24} />
          <span>Plantação</span>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#345348] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && erro && (
          <p className="text-red-500 text-center text-base mt-8">{erro}</p>
        )}

        {!loading && !erro && plantios.length === 0 && (
          <div className="flex flex-col items-center gap-5 mt-8">
            <Sprout size={56} className="text-[#658B7D]" />
            <p className="text-[#345348] text-lg text-center">
              Você ainda não cadastrou nenhuma semente.
            </p>
            <button
              onClick={() => navigate('/plantio')}
              className="w-full bg-[#345348] text-white rounded-2xl py-4 text-lg font-medium active:scale-95 transition-transform"
            >
              Cadastrar plantio
            </button>
          </div>
        )}

        {!loading && !erro && plantios.map((p) => {
          const dias = tempoColheitaEstimadoDias(p.nome_semente);
          const colheita = dataColheitaEstimada(p.data_plantacao, p.nome_semente);
          const restantes = colheita ? diasRestantes(colheita) : null;

          let statusTexto: string;
          let statusCor: string;
          if (restantes === null) {
            statusTexto = `Colheita em ~${dias} dias`;
            statusCor = 'text-[#4A6F62]';
          } else if (restantes <= 0) {
            statusTexto = 'Pronto para colher!';
            statusCor = 'text-[#2D6A53] font-semibold';
          } else {
            statusTexto = `Faltam ${restantes} dia${restantes === 1 ? '' : 's'}`;
            statusCor = 'text-[#4A6F62]';
          }

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border-2 border-[#D1D5DB] p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#345348] p-2 rounded-full">
                  <Sprout size={24} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#345348] text-xl font-semibold capitalize">
                    {p.nome_semente}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {p.quantidade} semente{p.quantidade === 1 ? '' : 's'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-base">
                <CalendarDays size={18} className="text-[#658B7D]" />
                <span>Plantado em: {formatarData(p.data_plantacao)}</span>
              </div>

              <div className="flex items-center gap-2 text-base">
                <Clock size={18} className="text-[#658B7D]" />
                <span className={statusCor}>
                  {statusTexto}
                  {colheita && ` (${formatarData(colheita.toISOString())})`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
