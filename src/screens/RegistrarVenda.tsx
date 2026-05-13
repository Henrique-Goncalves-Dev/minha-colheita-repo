import { useState, useEffect } from "react";
import { ArrowLeft, Volume2, Check, ShoppingCart, Scale, Coins, Calendar, ChevronDown, Loader2 } from "lucide-react";
import { Card, colors } from "../agro-ui";
import { listarEstoque, registrarVenda, type EstoqueItem, type ApiError } from "../services/api";

export function RegistrarVenda({
  onBack,
  onSave,
  onSpeak,
}: {
  onBack: () => void;
  onSave: () => Promise<void>;
  onSpeak: (text: string) => void;
}) {
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [sementeSelecionada, setSementeSelecionada] = useState<EstoqueItem | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");
  const [dataVenda, setDataVenda] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [loadingEstoque, setLoadingEstoque] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    listarEstoque()
      .then((items) => {
        setEstoque(items);
        if (items.length > 0) setSementeSelecionada(items[0]);
      })
      .catch(() => {
        onSpeak("Erro ao carregar estoque");
      })
      .finally(() => setLoadingEstoque(false));
  }, []);

  const handleSave = async () => {
    if (!sementeSelecionada) {
      setErro("Selecione uma semente");
      onSpeak("Por favor, selecione uma semente.");
      return;
    }

    const qtd = parseInt(quantidade) || 0;
    const val = parseFloat(valor.replace(",", ".")) || 0;

    if (qtd <= 0) {
      setErro("Quantidade deve ser maior que zero");
      onSpeak("Informe a quantidade.");
      return;
    }

    if (qtd > sementeSelecionada.total_disponivel) {
      setErro(`Estoque insuficiente. Disponível: ${sementeSelecionada.total_disponivel}`);
      onSpeak(`Estoque insuficiente. Você tem apenas ${sementeSelecionada.total_disponivel} unidades.`);
      return;
    }

    if (val <= 0) {
      setErro("Informe o valor recebido");
      onSpeak("Informe quanto recebeu.");
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      await registrarVenda({
        nome_semente: sementeSelecionada.nome_semente,
        quantidade: qtd,
        valor_recebido: val,
        data_da_compra: dataVenda ? new Date(dataVenda).toISOString() : null,
      });
      onSpeak("Venda registrada com sucesso!");
      await onSave();
    } catch (e) {
      const err = e as ApiError;
      setErro(err.detail || "Erro ao registrar venda");
      onSpeak(err.detail || "Erro ao registrar a venda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: colors.cream }}>
      <div className="flex items-center justify-between p-4 bg-white" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <button type="button" onClick={onBack} style={{ color: colors.earth }} className="p-2 -ml-2 active:scale-95">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 18, color: colors.ink }}>
          Registrar Venda
        </h1>
        <button type="button"
          onClick={() => onSpeak("Selecione a semente que vendeu, a quantidade, e quanto recebeu.")}
          className="p-2 -mr-2 bg-[#E8A020] rounded-full active:scale-95 shadow-md flex items-center justify-center animate-pulse"
          style={{ width: 44, height: 44, color: "white" }}
        >
          <Volume2 size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {loadingEstoque ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} color={colors.field} className="animate-spin" />
          </div>
        ) : estoque.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div
              className="mx-auto flex items-center justify-center mb-4"
              style={{ width: 80, height: 80, borderRadius: 999, background: colors.wash, fontSize: 40 }}
            >
              📦
            </div>
            <p style={{ fontFamily: "Nunito", fontWeight: 900, color: colors.ink, fontSize: 20 }}>
              Estoque vazio
            </p>
            <p style={{ color: colors.earthSoft, fontSize: 14, fontWeight: 800, marginTop: 8 }}>
              Registre plantações primeiro para poder vender.
            </p>
          </div>
        ) : (
          <>
            {/* Seed selector */}
            <Card style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: colors.wash, display: "flex", alignItems: "center", justifyContent: "center", color: colors.earth }}>
                <ShoppingCart size={24} />
              </div>
              <div className="flex-1 relative">
                <label style={{ fontSize: 12, fontWeight: 800, color: colors.earthSoft, textTransform: "uppercase" }}>
                  QUAL SEMENTE?
                </label>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full flex items-center justify-between"
                  style={{ fontSize: 18, fontWeight: 800, color: colors.ink, background: "transparent", textAlign: "left" }}
                >
                  <span>{sementeSelecionada?.nome_semente || "Selecione..."}</span>
                  <ChevronDown size={20} color={colors.earthSoft} />
                </button>
                {showDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: -12,
                      right: -12,
                      background: colors.white,
                      borderRadius: 12,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                      zIndex: 10,
                      overflow: "hidden",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {estoque.map((item) => (
                      <button
                        key={item.id_planta}
                        type="button"
                        onClick={() => {
                          setSementeSelecionada(item);
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                        style={{
                          borderBottom: `1px solid ${colors.borderSoft}`,
                          fontSize: 15,
                          fontWeight: 800,
                          color: colors.ink,
                          textAlign: "left",
                        }}
                      >
                        <span>🌱 {item.nome_semente}</span>
                        <span style={{ color: colors.earthSoft, fontSize: 12 }}>
                          {item.total_disponivel} un
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {sementeSelecionada && (
              <p style={{ color: colors.field, fontSize: 12, fontWeight: 800, textAlign: "center" }}>
                Estoque disponível: {sementeSelecionada.total_disponivel} unidades
              </p>
            )}

            {/* Quantity */}
            <Card style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: colors.wash, display: "flex", alignItems: "center", justifyContent: "center", color: colors.earth }}>
                <Scale size={24} />
              </div>
              <div className="flex-1">
                <label style={{ fontSize: 12, fontWeight: 800, color: colors.earthSoft, textTransform: "uppercase" }}>
                  QUANTIDADE
                </label>
                <input
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  style={{ width: "100%", border: "none", outline: "none", fontSize: 18, fontWeight: 800, color: colors.ink, background: "transparent" }}
                  placeholder="Ex: 30"
                />
              </div>
            </Card>

            {/* Value */}
            <Card style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: colors.wash, display: "flex", alignItems: "center", justifyContent: "center", color: colors.earth }}>
                <Coins size={24} />
              </div>
              <div className="flex-1">
                <label style={{ fontSize: 12, fontWeight: 800, color: colors.earthSoft, textTransform: "uppercase" }}>
                  VALOR RECEBIDO (R$)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  style={{ width: "100%", border: "none", outline: "none", fontSize: 18, fontWeight: 800, color: colors.ink, background: "transparent" }}
                  placeholder="Ex: 1500"
                />
              </div>
            </Card>

            {/* Date */}
            <Card style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: colors.wash, display: "flex", alignItems: "center", justifyContent: "center", color: colors.earth }}>
                <Calendar size={24} />
              </div>
              <div className="flex-1">
                <label style={{ fontSize: 12, fontWeight: 800, color: colors.earthSoft, textTransform: "uppercase" }}>
                  DATA DA VENDA
                </label>
                <input
                  type="date"
                  value={dataVenda}
                  onChange={(e) => setDataVenda(e.target.value)}
                  style={{ width: "100%", border: "none", outline: "none", fontSize: 18, fontWeight: 800, color: colors.ink, background: "transparent" }}
                />
              </div>
            </Card>

            {erro && (
              <p style={{ color: colors.alert, fontSize: 13, fontWeight: 800, textAlign: "center" }}>
                {erro}
              </p>
            )}
          </>
        )}
      </div>

      {estoque.length > 0 && (
        <div className="p-4 bg-white" style={{ borderTop: `1px solid ${colors.border}` }}>
          <button type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{
              background: `linear-gradient(180deg, ${colors.gold} 0%, ${colors.goldDeep} 100%)`,
              color: colors.white,
              height: 56,
              borderRadius: 14,
              fontFamily: "Nunito",
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: 0.3,
              boxShadow: "0 6px 14px rgba(232,160,32,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} strokeWidth={3} />}
            {loading ? "REGISTRANDO..." : "REGISTRAR VENDA"}
          </button>
        </div>
      )}
    </div>
  );
}
