# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, get_current_user
from app.models.usuario import Usuario
from app.schemas.tarefa import TarefaCreate, TarefaUpdate, TarefaResponse
from app.services import tarefa_service

router = APIRouter(prefix="/tarefas", tags=["tarefas"])


@router.post("", response_model=TarefaResponse, status_code=status.HTTP_201_CREATED)
async def criar(
    dados: TarefaCreate,
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    return await tarefa_service.criar_tarefa(db, usuario.id, dados)


@router.get("", response_model=list[TarefaResponse])
async def listar(
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    return await tarefa_service.listar_tarefas(db, usuario.id)


@router.put("/{tarefa_id}", response_model=TarefaResponse)
async def atualizar(
    tarefa_id: int,
    dados: TarefaUpdate,
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    tarefa = await tarefa_service.atualizar_tarefa(db, tarefa_id, usuario.id, dados)
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return tarefa


@router.patch("/{tarefa_id}/toggle", response_model=TarefaResponse)
async def toggle(
    tarefa_id: int,
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    tarefa = await tarefa_service.toggle_tarefa(db, tarefa_id, usuario.id)
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return tarefa


@router.delete("/{tarefa_id}", status_code=status.HTTP_204_NO_CONTENT)
async def excluir(
    tarefa_id: int,
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    removido = await tarefa_service.excluir_tarefa(db, tarefa_id, usuario.id)
    if not removido:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
