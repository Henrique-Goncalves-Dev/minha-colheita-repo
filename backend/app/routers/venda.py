from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, get_current_user
from app.models.usuario import Usuario
from app.schemas.venda import (
    VendaCreate,
    VendaUpdate,
    VendaResponse,
    ResumoFinanceiro,
    EstimativaLucro,
)
from app.services import venda_service

router = APIRouter(prefix="/vendas", tags=["vendas"])


@router.post("", response_model=VendaResponse, status_code=status.HTTP_201_CREATED)
async def criar(
    dados: VendaCreate,
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    try:
        return await venda_service.criar_venda(db, usuario.id, dados)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=list[VendaResponse])
async def listar(
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    return await venda_service.listar_vendas(db, usuario.id)


@router.get("/resumo", response_model=ResumoFinanceiro)
async def resumo(
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    return await venda_service.resumo_financeiro(db, usuario.id)


@router.get("/estimativa", response_model=EstimativaLucro)
async def estimativa(
    id_planta: int = Query(..., gt=0),
    quantidade: int = Query(..., gt=0),
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    resultado = await venda_service.estimativa_lucro(db, usuario.id, id_planta, quantidade)
    if not resultado:
        raise HTTPException(status_code=404, detail="Planta não encontrada")
    return resultado


@router.put("/{venda_id}", response_model=VendaResponse)
async def atualizar(
    venda_id: int,
    dados: VendaUpdate,
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    try:
        venda = await venda_service.atualizar_venda(db, venda_id, usuario.id, dados)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if not venda:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    return venda


@router.delete("/{venda_id}", status_code=status.HTTP_204_NO_CONTENT)
async def excluir(
    venda_id: int,
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    removido = await venda_service.excluir_venda(db, venda_id, usuario.id)
    if not removido:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
