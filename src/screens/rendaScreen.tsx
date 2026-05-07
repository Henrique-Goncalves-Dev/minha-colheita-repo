import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  DollarSign,
  Sprout,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  Calculator,
} from 'lucide-react';
import {
  getResumoFinanceiro,
  getEstimativaLucro,
  atualizarVenda,
  excluirVenda,
  type ApiError,
  type ResumoFinanceiro,
  type VendaResponse,
  type EstimativaLucro,
  type GastoPorSemente,
} from '../services/api';
import { EditModal } from '../components/EditModal';

function formatarBRL(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
}

export function RendaScreen() {
  const navigate = useNavigate();
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [vendaEditando, setVendaEditando] = useState<VendaResponse | null>(null);

  // Estimativa
  const [estIdPlanta, setEstIdPlanta] = useState<string>('');
  const [estQuantidade, setEstQuantidade] = useState('');
  const [estimativa, setEstimativa] = useState<EstimativaLucro | null>(null);
  const [estLoading, setEstLoading] = useState(false);
  const [estErro, setEstErro] = useState('');

  async function carregar() {
    setLoading(true);
    try {
      const dados = await getResumoFinanceiro();
      setResumo(dados);
      if (dados.gastos_por_semente.length > 0 && !estIdPlanta) {
        setEstIdPlanta(String(dados.gastos_por_semente[0].id_planta));
      }
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.status === 401) { navigate('/'); return; }
      setErro('Não foi possível carregar suas finanças.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function calcularEstimativa() {
    setEstErro('');
    setEstimativa(null);
    const qtd = Number(estQuantidade);
    const id = Number(estIdPlanta);
    if (!id || qtd <= 0) {
      setEstErro('Selecione uma semente e informe uma quantidade válida.');
      return;
    }
    setEstLoading(true);
    try {
      const dados = await getEstimativaLucro(id, qtd);
      setEstimativa(dados);
    } catch (err) {
      const apiErr = err as ApiError;
      setEstErro(apiErr.detail || 'Erro ao calcular.');
    } finally {
      setEstLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#EEF2F0] flex flex-col pt-12 px-6 pb-28">
      <div className="relative flex justify-center items-center mb-8 w-full max-w-sm mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 bg-[#E3E8E5] p-3 rounded-full active:bg-gray-300"
        >
          <ArrowLeft size={24} className="text-[#345348]" />
        </button>
        <div className="flex items-center gap-2 text-[#345348] font-semibold text-lg">
          <DollarSign size={24} />
          <span>Renda</span>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col gap-6">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#345348] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && erro && <p className="text-red-500 text-center">{erro}</p>}

        {!loading && !erro && resumo && (
          <>
            <SecaoUltimaVenda venda={resumo.ultima_venda} />
            <SecaoGastos gastos={resumo.gastos_por_semente} />
            <SecaoEstimativa
              gastos={resumo.gastos_por_semente}
              idPlanta={estIdPlanta}
              setIdPlanta={setEstIdPlanta}
              quantidade={estQuantidade}
              setQuantidade={setEstQuantidade}
              estimativa={estimativa}
              loading={estLoading}
              erro={estErro}
              onCalcular={calcularEstimativa}
            />
            <SecaoVendas
              vendas={resumo.vendas}
              onEditar={setVendaEditando}
              onExcluir={async (id) => {
                if (!confirm('Excluir esta venda? O estoque será restaurado.')) return;
                await excluirVenda(id);
                await carregar();
              }}
            />
          </>
        )}
      </div>

      <button
        onClick={() => navigate('/renda/registrar')}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#345348] text-white px-6 py-4 rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
      >
        <Plus size={24} />
        <span className="font-medium">Registrar venda</span>
      </button>

      {vendaEditando && (
        <EditarVendaModal
          venda={vendaEditando}
          onClose={() => setVendaEditando(null)}
          onSalvo={async () => {
            setVendaEditando(null);
            await carregar();
          }}
        />
      )}
    </div>
  );
}

function SecaoUltimaVenda({ venda }: { venda: VendaResponse | null }) {
  return (
    <div className="bg-[#345348] rounded-2xl p-5 text-white flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <TrendingUp size={20} />
        <span className="font-semibold">Última venda</span>
      </div>
      {venda ? (
        <>
          <span className="text-3xl font-bold">{formatarBRL(venda.valor_recebido)}</span>
          <span className="text-sm capitalize">
            {venda.quantidade} de {venda.nome_semente} • {formatarData(venda.data_da_compra)}
          </span>
        </>
      ) : (
        <span className="text-sm text-white/80">Nenhuma venda registrada ainda.</span>
      )}
    </div>
  );
}

function SecaoGastos({ gastos }: { gastos: GastoPorSemente[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[#345348] font-semibold text-lg">Gastos por semente</h3>
      {gastos.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhum plantio cadastrado.</p>
      ) : (
        gastos.map((g) => (
          <div key={g.id_planta} className="bg-white rounded-2xl border-2 border-[#D1D5DB] p-4 flex items-center gap-3">
            <div className="bg-[#658B7D] p-2 rounded-full">
              <Sprout size={20} color="white" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[#345348] font-semibold capitalize">{g.nome_semente}</span>
              <span className="text-gray-500 text-sm">{g.quantidade_plantada} sementes</span>
            </div>
            <span className="text-[#345348] font-bold">{formatarBRL(g.custo_total)}</span>
          </div>
        ))
      )}
    </div>
  );
}

interface SecaoEstimativaProps {
  gastos: GastoPorSemente[];
  idPlanta: string;
  setIdPlanta: (v: string) => void;
  quantidade: string;
  setQuantidade: (v: string) => void;
  estimativa: EstimativaLucro | null;
  loading: boolean;
  erro: string;
  onCalcular: () => void;
}

function SecaoEstimativa(props: SecaoEstimativaProps) {
  const { gastos, idPlanta, setIdPlanta, quantidade, setQuantidade, estimativa, loading, erro, onCalcular } = props;
  return (
    <div className="bg-white rounded-2xl border-2 border-[#D1D5DB] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-[#345348]">
        <Calculator size={20} />
        <h3 className="font-semibold text-lg">Estimativa de lucro</h3>
      </div>

      {gastos.length === 0 ? (
        <p className="text-gray-500 text-sm">Cadastre um plantio para usar esta calculadora.</p>
      ) : (
        <>
          <select
            value={idPlanta}
            onChange={(e) => setIdPlanta(e.target.value)}
            className="w-full p-3 text-base border-2 border-[#D1D5DB] rounded-xl bg-white focus:outline-none focus:border-[#345348] capitalize"
          >
            {gastos.map((g) => (
              <option key={g.id_planta} value={g.id_planta}>{g.nome_semente}</option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full p-3 text-base border-2 border-[#D1D5DB] rounded-xl bg-white focus:outline-none focus:border-[#345348]"
          />
          <button
            onClick={onCalcular}
            disabled={loading}
            className="w-full bg-[#345348] text-white rounded-xl py-3 font-medium active:scale-95 transition-transform"
          >
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
          {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
          {estimativa && (
            <div className="bg-[#EEF2F0] rounded-xl p-3 flex flex-col gap-1 text-sm">
              <Linha label="Custo estimado" valor={formatarBRL(estimativa.custo_estimado)} />
              {estimativa.sem_historico ? (
                <p className="text-amber-700 text-xs">
                  Sem histórico de venda dessa semente. Registre uma venda para estimar receita e lucro.
                </p>
              ) : (
                <>
                  <Linha label="Receita estimada" valor={formatarBRL(estimativa.receita_estimada ?? 0)} />
                  <Linha
                    label="Lucro estimado"
                    valor={formatarBRL(estimativa.lucro_estimado ?? 0)}
                    destaque={(estimativa.lucro_estimado ?? 0) >= 0 ? 'text-[#2D6A53]' : 'text-red-600'}
                  />
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Linha({ label, valor, destaque }: { label: string; valor: string; destaque?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-700">{label}</span>
      <span className={`font-semibold ${destaque ?? 'text-[#345348]'}`}>{valor}</span>
    </div>
  );
}

interface SecaoVendasProps {
  vendas: VendaResponse[];
  onEditar: (v: VendaResponse) => void;
  onExcluir: (id: number) => void;
}

function SecaoVendas({ vendas, onEditar, onExcluir }: SecaoVendasProps) {
  if (vendas.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[#345348] font-semibold text-lg">Histórico de vendas</h3>
      {vendas.map((v) => (
        <div key={v.id} className="bg-white rounded-2xl border-2 border-[#D1D5DB] p-4 flex items-center gap-3">
          <div className="flex flex-col flex-1">
            <span className="text-[#345348] font-semibold capitalize">{v.nome_semente}</span>
            <span className="text-gray-500 text-sm">
              {v.quantidade} sementes • {formatarData(v.data_da_compra)}
            </span>
            <span className="text-[#2D6A53] font-bold">{formatarBRL(v.valor_recebido)}</span>
          </div>
          <button
            onClick={() => onEditar(v)}
            className="p-2 rounded-full bg-[#E3E8E5] active:bg-gray-300"
            aria-label="Editar venda"
          >
            <Pencil size={18} className="text-[#345348]" />
          </button>
          <button
            onClick={() => onExcluir(v.id)}
            className="p-2 rounded-full bg-red-50 active:bg-red-100"
            aria-label="Excluir venda"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      ))}
    </div>
  );
}

interface EditarVendaModalProps {
  venda: VendaResponse;
  onClose: () => void;
  onSalvo: () => void;
}

function EditarVendaModal({ venda, onClose, onSalvo }: EditarVendaModalProps) {
  const [quantidade, setQuantidade] = useState(String(venda.quantidade));
  const [valor, setValor] = useState(String(venda.valor_recebido));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  async function salvar() {
    setErro('');
    setSalvando(true);
    try {
      await atualizarVenda(venda.id, {
        quantidade: Number(quantidade),
        valor_recebido: Number(valor),
      });
      onSalvo();
    } catch (err) {
      const apiErr = err as ApiError;
      setErro(apiErr.detail || 'Erro ao salvar.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <EditModal open title={`Editar venda: ${venda.nome_semente}`} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <label className="text-[#345348] font-medium">Quantidade</label>
        <input
          type="number"
          min="1"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          className="w-full p-3 text-base border-2 border-[#D1D5DB] rounded-xl bg-white focus:outline-none focus:border-[#345348]"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[#345348] font-medium">Valor recebido (R$)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="w-full p-3 text-base border-2 border-[#D1D5DB] rounded-xl bg-white focus:outline-none focus:border-[#345348]"
        />
      </div>
      {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 bg-[#E3E8E5] text-[#345348] rounded-xl py-3 font-medium active:scale-95 transition-transform"
        >
          Cancelar
        </button>
        <button
          onClick={salvar}
          disabled={salvando}
          className="flex-1 bg-[#345348] text-white rounded-xl py-3 font-medium active:scale-95 transition-transform"
        >
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </EditModal>
  );
}
