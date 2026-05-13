from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, get_current_user
from app.models.plantio import Plantio
from app.models.usuario import Usuario
from app.models.venda import Venda
from app.schemas.usuario import LoginRequest, PerfilResponse, RegistroRequest, Token, UsuarioResponse
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
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
    if not verify_pin(dados.pin, usuario.pin):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="PIN incorreto")
    return Token(access_token=create_access_token(usuario.id))


@router.get("/me", response_model=PerfilResponse)
async def me(
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    plantio_agg = await db.execute(
        select(
            func.count(Plantio.id),
            func.coalesce(func.sum(Plantio.quantidade), 0),
        ).where(Plantio.id_usuario == usuario.id)
    )
    total_plantios, total_sementes = plantio_agg.one()

    venda_agg = await db.execute(
        select(
            func.count(Venda.id),
            func.coalesce(func.sum(Venda.valor_recebido), 0.0),
        ).where(Venda.id_usuario == usuario.id)
    )
    total_vendas, total_arrecadado = venda_agg.one()

    return PerfilResponse(
        id=usuario.id,
        nome=usuario.nome,
        telefone=usuario.telefone,
        total_plantios=int(total_plantios or 0),
        total_sementes_plantadas=int(total_sementes or 0),
        total_vendas=int(total_vendas or 0),
        total_arrecadado=float(total_arrecadado or 0.0),
    )
