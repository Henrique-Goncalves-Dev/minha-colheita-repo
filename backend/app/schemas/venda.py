from datetime import datetime
from pydantic import BaseModel, field_validator


class VendaCreate(BaseModel):
    nome_semente: str
    quantidade: int
    valor_recebido: float
    data_da_compra: datetime | None = None

    @field_validator("nome_semente")
    @classmethod
    def nome_nao_vazio(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Nome da semente não pode ser vazio")
        return v

    @field_validator("quantidade")
    @classmethod
    def quantidade_positiva(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("Quantidade deve ser maior que zero")
        return v

    @field_validator("valor_recebido")
    @classmethod
    def valor_nao_negativo(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Valor recebido não pode ser negativo")
        return v


class VendaUpdate(BaseModel):
    quantidade: int | None = None
    valor_recebido: float | None = None
    data_da_compra: datetime | None = None

    @field_validator("quantidade")
    @classmethod
    def quantidade_positiva(cls, v: int | None) -> int | None:
        if v is not None and v <= 0:
            raise ValueError("Quantidade deve ser maior que zero")
        return v

    @field_validator("valor_recebido")
    @classmethod
    def valor_nao_negativo(cls, v: float | None) -> float | None:
        if v is not None and v < 0:
            raise ValueError("Valor recebido não pode ser negativo")
        return v


class VendaResponse(BaseModel):
    id: int
    nome_semente: str
    quantidade: int
    valor_recebido: float
    data_da_compra: datetime | None

    model_config = {"from_attributes": True}


class GastoPorSemente(BaseModel):
    nome_semente: str
    id_planta: int
    quantidade_plantada: int
    custo_total: float


class ResumoFinanceiro(BaseModel):
    gastos_por_semente: list[GastoPorSemente]
    ultima_venda: VendaResponse | None
    vendas: list[VendaResponse]


class EstoqueItem(BaseModel):
    id_planta: int
    nome_semente: str
    total_disponivel: int


class EstimativaLucro(BaseModel):
    nome_semente: str
    quantidade: int
    custo_estimado: float
    receita_estimada: float | None
    lucro_estimado: float | None
    sem_historico: bool
