from datetime import datetime
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, field_validator


class TarefaCreate(BaseModel):
    emoji: str = "🛠️"
    titulo: str
    quando: str | None = None

    @field_validator("titulo")
    @classmethod
    def titulo_nao_vazio(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Título da tarefa não pode ser vazio")
        return v


class TarefaUpdate(BaseModel):
    emoji: str | None = None
    titulo: str | None = None
    quando: str | None = None
    concluida: bool | None = None


class TarefaResponse(BaseModel):
    id: int
    emoji: str
    titulo: str
    quando: str | None
    concluida: bool
    criado_em: datetime

    model_config = {"from_attributes": True}
