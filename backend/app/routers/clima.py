# pyrefly: ignore [missing-import]
from fastapi import APIRouter
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

router = APIRouter(prefix="/clima", tags=["clima"])


class PrevisaoDia(BaseModel):
    dia: str
    emoji: str
    temp_max: str
    temp_min: str


class ClimaResponse(BaseModel):
    cidade: str
    temperatura: str
    descricao: str
    temp_max: str
    temp_min: str
    emoji: str
    umidade_solo: int
    umidade_solo_status: str
    alerta: str | None
    previsao: list[PrevisaoDia]


@router.get("", response_model=ClimaResponse)
async def clima():
    """Retorna dados climáticos (mock estático por enquanto)."""
    return ClimaResponse(
        cidade="Goiânia, GO",
        temperatura="28°",
        descricao="Parcialmente nublado",
        temp_max="31°",
        temp_min="19°",
        emoji="🌤️",
        umidade_solo=68,
        umidade_solo_status="Boa para plantio",
        alerta="Chuva forte esperada na terça. Proteja suas sementes.",
        previsao=[
            PrevisaoDia(dia="Seg", emoji="☀️", temp_max="29°", temp_min="18°"),
            PrevisaoDia(dia="Ter", emoji="⛈️", temp_max="24°", temp_min="16°"),
            PrevisaoDia(dia="Qua", emoji="🌧️", temp_max="23°", temp_min="15°"),
            PrevisaoDia(dia="Qui", emoji="🌤️", temp_max="27°", temp_min="17°"),
        ],
    )
