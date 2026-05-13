from datetime import datetime
from pydantic import BaseModel, field_validator


class PlantioCreate(BaseModel):
    nome_semente: str
    data_plantacao: datetime | None = None
    quantidade: int
    custo: float

    @field_validator("quantidade")
    @classmethod
    def quantidade_positiva(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("Quantidade deve ser maior que zero")
        return v

    @field_validator("custo")
    @classmethod
    def custo_nao_negativo(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Custo não pode ser negativo")
        return v

    @field_validator("nome_semente")
    @classmethod
    def nome_nao_vazio(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Nome da semente não pode ser vazio")
        return v


class PlantioUpdate(BaseModel):
    nome_semente: str | None = None
    data_plantacao: datetime | None = None
    quantidade: int | None = None
    custo: float | None = None

    @field_validator("quantidade")
    @classmethod
    def quantidade_positiva(cls, v: int | None) -> int | None:
        if v is not None and v <= 0:
            raise ValueError("Quantidade deve ser maior que zero")
        return v

    @field_validator("custo")
    @classmethod
    def custo_nao_negativo(cls, v: float | None) -> float | None:
        if v is not None and v < 0:
            raise ValueError("Custo não pode ser negativo")
        return v


class PlantioResponse(BaseModel):
    id: int
    nome_semente: str
    data_plantacao: datetime | None
    quantidade: int
    custo: float

    model_config = {"from_attributes": True}
