from pydantic import BaseModel, field_validator


class RegistroRequest(BaseModel):
    nome: str
    telefone: str
    pin: str

    @field_validator("pin")
    @classmethod
    def pin_valido(cls, v: str) -> str:
        if not v.isdigit() or len(v) != 4:
            raise ValueError("PIN deve ter exatamente 4 dígitos numéricos")
        return v

    @field_validator("telefone")
    @classmethod
    def telefone_valido(cls, v: str) -> str:
        if not v.isdigit() or len(v) not in (10, 11):
            raise ValueError("Telefone deve ter 10 ou 11 dígitos numéricos")
        return v


class LoginRequest(BaseModel):
    telefone: str
    pin: str

    @field_validator("pin")
    @classmethod
    def pin_valido(cls, v: str) -> str:
        if not v.isdigit() or len(v) != 4:
            raise ValueError("PIN deve ter exatamente 4 dígitos numéricos")
        return v


class UsuarioResponse(BaseModel):
    id: int
    nome: str
    telefone: str

    model_config = {"from_attributes": True}


class PerfilResponse(BaseModel):
    id: int
    nome: str
    telefone: str
    total_plantios: int
    total_sementes_plantadas: int
    total_vendas: int
    total_arrecadado: float


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
