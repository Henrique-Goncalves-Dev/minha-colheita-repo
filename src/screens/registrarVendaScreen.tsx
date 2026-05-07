import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, CheckCircle } from 'lucide-react';
import {
  listarEstoque,
  registrarVenda,
  type ApiError,
  type EstoqueItem,
} from '../services/api';

export function RegistrarVendaScreen() {
  const navigate = useNavigate();
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [carregandoEstoque, setCarregandoEstoque] = useState(true);
  const [idPlanta, setIdPlanta] = useState<string>('');
  const [quantidade, setQuantidade] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    let ativo = true;
    listarEstoque()
      .then((dados) => {
        if (!ativo) return;
        setEstoque(dados);
        if (dados.length > 0) setIdPlanta(String(dados[0].id_planta));
      })
      .catch((err) => {
        const apiErr = err as ApiError;
        if (apiErr.status === 401) navigate('/');
      })
      .finally(() => { if (ativo) setCarregandoEstoque(false); });
    return () => { ativo = false; };
  }, [navigate]);

  const itemSelecionado = estoque.find((e) => String(e.id_planta) === idPlanta);
  const disponivel = itemSelecionado?.total_disponivel ?? 0;
  const qtdNum = Number(quantidade);
  const valorNum = Number(valor);
  const qtdValida = qtdNum > 0 && qtdNum <= disponivel;
  const valido = !!itemSelecionado && qtdValida && valorNum >= 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valido || loading || !itemSelecionado) return;
    setLoading(true);
    setErro('');
    try {
      await registrarVenda({
        nome_semente: itemSelecionado.nome_semente,
        quantidade: qtdNum,
        valor_recebido: valorNum,
        data_da_compra: data ? new Date(data).toISOString() : null,
      });
      setSucesso(true);
    } catch (err) {
      const apiErr = err as ApiError;
      setErro(apiErr.detail || 'Erro ao registrar venda.');
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
        <p className="text-[#345348] text-2xl font-semibold text-center">Venda registrada!</p>
        <button
          onClick={() => navigate('/renda')}
          className="w-full max-w-sm bg-[#345348] text-white rounded-2xl py-4 text-lg font-medium active:scale-95 transition-transform"
        >
          Voltar para Renda
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
          <DollarSign size={24} />
          <span>Registrar venda</span>
        </div>
      </div>

      {carregandoEstoque ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#345348] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : estoque.length === 0 ? (
        <div className="w-full max-w-sm mx-auto text-center text-[#345348] mt-8 flex flex-col gap-4">
          <p className="text-lg">Você não tem sementes em estoque para vender.</p>
          <button
            onClick={() => navigate('/plantio')}
            className="w-full bg-[#345348] text-white rounded-2xl py-4 text-lg font-medium active:scale-95 transition-transform"
          >
            Cadastrar plantio
          </button>
        </div>
      ) : (
        <form className="w-full max-w-sm mx-auto flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-[#345348] font-medium">Semente</label>
            <select
              value={idPlanta}
              onChange={(e) => setIdPlanta(e.target.value)}
              className="w-full p-4 text-lg border-2 border-[#D1D5DB] rounded-2xl bg-white focus:outline-none focus:border-[#345348] capitalize"
            >
              {estoque.map((e) => (
                <option key={e.id_planta} value={e.id_planta}>
                  {e.nome_semente} (disponível: {e.total_disponivel})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#345348] font-medium">Quantidade vendida</label>
            <input
              type="number"
              min="1"
              max={disponivel}
              placeholder={`Máx: ${disponivel}`}
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full p-4 text-lg border-2 border-[#D1D5DB] rounded-2xl bg-white focus:outline-none focus:border-[#345348] placeholder-gray-400"
            />
            {quantidade && qtdNum > disponivel && (
              <p className="text-red-500 text-sm">Você só tem {disponivel} disponível.</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#345348] font-medium">Valor recebido (R$)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex: 250.00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full p-4 text-lg border-2 border-[#D1D5DB] rounded-2xl bg-white focus:outline-none focus:border-[#345348] placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#345348] font-medium">Data da venda</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full p-4 text-lg border-2 border-[#D1D5DB] rounded-2xl bg-white focus:outline-none focus:border-[#345348] text-gray-700"
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
              'Registrar venda'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
