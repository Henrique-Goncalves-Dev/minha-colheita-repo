import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sprout, CheckCircle } from 'lucide-react';
import { criarPlantio, type ApiError } from '../services/api';

export function PlantioScreen() {
  const navigate = useNavigate();

  const [nomeSemente, setNomeSemente] = useState('');
  const [dataPlantacao, setDataPlantacao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [custo, setCusto] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const valido =
    nomeSemente.trim().length > 0 &&
    Number(quantidade) > 0 &&
    Number(custo) >= 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || loading) return;
    setLoading(true);
    setErro('');

    try {
      await criarPlantio({
        nome_semente: nomeSemente.trim(),
        data_plantacao: dataPlantacao ? new Date(dataPlantacao).toISOString() : null,
        quantidade: Number(quantidade),
        custo: Number(custo),
      });
      setSucesso(true);
    } catch (err) {
      const apiErr = err as ApiError;
      setErro(apiErr.status === 401 ? 'Sessão expirada. Faça login novamente.' : 'Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (sucesso) {
    return (
      <div className="min-h-screen bg-[#EEF2F0] flex flex-col items-center justify-center px-6 gap-6">
        <div className="bg-[#345348] rounded-full p-6">
          <CheckCircle size={64} color="white" />
        </div>
        <p className="text-[#345348] text-2xl font-semibold text-center">Plantio registrado!</p>
        <button
          onClick={() => { setSucesso(false); setNomeSemente(''); setDataPlantacao(''); setQuantidade(''); setCusto(''); }}
          className="w-full max-w-sm bg-[#345348] text-white rounded-2xl py-4 text-lg font-medium active:scale-95 transition-transform"
        >
          Novo plantio
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full max-w-sm bg-[#E3E8E5] text-[#345348] rounded-2xl py-4 text-lg font-medium active:scale-95 transition-transform"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF2F0] flex flex-col pt-12 px-6">
      <div className="relative flex justify-center items-center mb-10 w-full max-w-sm mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 bg-[#E3E8E5] p-3 rounded-full active:bg-gray-300"
        >
          <ArrowLeft size={24} className="text-[#345348]" />
        </button>
        <div className="flex items-center gap-2 text-[#345348] font-semibold text-lg">
          <Sprout size={24} />
          <span>Plantio</span>
        </div>
      </div>

      <form className="w-full max-w-sm mx-auto flex flex-col gap-5" onSubmit={handleSubmit}>

        <div className="flex flex-col gap-2">
          <label className="text-[#345348] font-medium">Nome da semente</label>
          <input
            type="text"
            placeholder="Ex: Milho, Soja..."
            value={nomeSemente}
            onChange={(e) => setNomeSemente(e.target.value)}
            className="w-full p-4 text-lg border-2 border-[#D1D5DB] rounded-2xl bg-white focus:outline-none focus:border-[#345348] placeholder-gray-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#345348] font-medium">Data do plantio</label>
          <input
            type="date"
            value={dataPlantacao}
            onChange={(e) => setDataPlantacao(e.target.value)}
            className="w-full p-4 text-lg border-2 border-[#D1D5DB] rounded-2xl bg-white focus:outline-none focus:border-[#345348] text-gray-700"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#345348] font-medium">Quantidade de sementes</label>
          <input
            type="number"
            placeholder="Ex: 200"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full p-4 text-lg border-2 border-[#D1D5DB] rounded-2xl bg-white focus:outline-none focus:border-[#345348] placeholder-gray-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#345348] font-medium">Custo total (R$)</label>
          <input
            type="number"
            placeholder="Ex: 150.00"
            min="0"
            step="0.01"
            value={custo}
            onChange={(e) => setCusto(e.target.value)}
            className="w-full p-4 text-lg border-2 border-[#D1D5DB] rounded-2xl bg-white focus:outline-none focus:border-[#345348] placeholder-gray-400"
          />
        </div>

        {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

        <button
          type="submit"
          disabled={!valido || loading}
          className={`w-full rounded-2xl py-4 mt-2 text-white text-lg font-medium flex items-center justify-center active:scale-95 transition-all ${
            valido && !loading ? 'bg-[#345348]' : 'bg-[#CFD1CF] cursor-not-allowed'
          }`}
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Registrar plantio'
          )}
        </button>
      </form>
    </div>
  );
}
