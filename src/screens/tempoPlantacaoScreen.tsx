import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Sprout, Star, CalendarDays } from 'lucide-react';
import { listarPlantios, type ApiError, type PlantioResponse } from '../services/api';
import {
  tempoColheitaEstimadoDias,
  dataColheitaEstimada,
  diasRestantes,
} from '../utils/colheita';
import { AudioButton } from '../components/AudioButton';

interface SementeAgrupada {
  nome: string;
  totalQuantidade: number;
  proximaColheita: Date | null;
  diasEstimados: number;
}

function agrupar(plantios: PlantioResponse[]): SementeAgrupada[] {
  const mapa = new Map<string, SementeAgrupada>();
  for (const p of plantios) {
    const chave = p.nome_semente.toLowerCase();
    const colheita = dataColheitaEstimada(p.data_plantacao, p.nome_semente);
    const existente = mapa.get(chave);
    if (existente) {
      existente.totalQuantidade += p.quantidade;
      if (colheita && (!existente.proximaColheita || colheita < existente.proximaColheita)) {
        existente.proximaColheita = colheita;
      }
    } else {
      mapa.set(chave, {
        nome: p.nome_semente,
        totalQuantidade: p.quantidade,
        proximaColheita: colheita,
        diasEstimados: tempoColheitaEstimadoDias(p.nome_semente),
      });
    }
  }
  return Array.from(mapa.values()).sort((a, b) => a.nome.localeCompare(b.nome));
}

function formatarData(d: Date | null): string {
  if (!d) return '—';
  return d.toLocaleDateString('pt-BR');
}

export function TempoPlantacaoScreen() {
  const navigate = useNavigate();
  const [plantios, setPlantios] = useState<PlantioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    listarPlantios()
      .then((dados) => { if (ativo) setPlantios(dados); })
      .catch((err) => {
        const apiErr = err as ApiError;
        if (apiErr.status === 401) { navigate('/'); return; }
        if (ativo) setErro('Não foi possível carregar suas sementes.');
      })
      .finally(() => { if (ativo) setLoading(false); });
    return () => { ativo = false; };
  }, [navigate]);

  const agrupados = useMemo(() => agrupar(plantios), [plantios]);

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
          <Star size={24} />
          <span>Tempo de Plantação</span>
        </div>
        <div className="absolute right-0">
          <AudioButton variant="circle" className="w-10 h-10" />
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

        {!loading && !erro && agrupados.length === 0 && (
          <div className="flex flex-col items-center gap-5 mt-8">
            <Sprout size={56} className="text-[#658B7D]" />
            <p className="text-[#345348] text-lg text-center">
              Você ainda não cadastrou nenhuma semente.
            </p>
          </div>
        )}

        {!loading && !erro && agrupados.map((s) => {
          const restantes = s.proximaColheita ? diasRestantes(s.proximaColheita) : null;
          let destaque: { texto: string; cor: string };
          if (restantes === null) {
            destaque = { texto: `~${s.diasEstimados} dias até colher`, cor: 'text-[#4A6F62]' };
          } else if (restantes <= 0) {
            destaque = { texto: 'Pronto para colher!', cor: 'text-[#2D6A53]' };
          } else {
            destaque = {
              texto: `Faltam ${restantes} dia${restantes === 1 ? '' : 's'}`,
              cor: 'text-[#345348]',
            };
          }

          return (
            <div key={s.nome} className="bg-white rounded-2xl border-2 border-[#D1D5DB] p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-[#345348] p-2 rounded-full">
                  <Sprout size={24} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#345348] text-xl font-semibold capitalize">{s.nome}</span>
                  <span className="text-gray-500 text-sm">
                    {s.totalQuantidade} semente{s.totalQuantidade === 1 ? '' : 's'} no total
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-base">
                <Clock size={20} className="text-[#658B7D]" />
                <span className={`text-lg font-semibold ${destaque.cor}`}>{destaque.texto}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-base">
                <CalendarDays size={18} className="text-[#658B7D]" />
                <span>Colheita prevista: {formatarData(s.proximaColheita)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
