from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import LoginRequest, RegistroRequest, Token, UsuarioResponse
from app.services.auth_service import (
    create_access_token,
    get_usuario_by_telefone,
    hash_pin,
    verify_pin,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/registro", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def registro(dados: RegistroRequest, db: AsyncSession = Depends(get_db)):
    existente = await get_usuario_by_telefone(db, dados.telefone)
    if existente:
        raise HTTPException(status_code=400, detail="Telefone já cadastrado")

    usuario = Usuario(
        nome=dados.nome.strip(),
        telefone=dados.telefone,
        pin=hash_pin(dados.pin),
    )
    db.add(usuario)
    await db.commit()
    await db.refresh(usuario)
    return usuario


@router.post("/login", response_model=Token)
async def login(dados: LoginRequest, db: AsyncSession = Depends(get_db)):
    usuario = await get_usuario_by_telefone(db, dados.telefone)
    if not usuario or not verify_pin(dados.pin, usuario.pin):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Telefone ou PIN incorretos",
        )
    return Token(access_token=create_access_token(usuario.id))
