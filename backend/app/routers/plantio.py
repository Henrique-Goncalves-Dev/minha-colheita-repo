from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, get_current_user
from app.models.usuario import Usuario
from app.schemas.plantio import PlantioCreate, PlantioUpdate, PlantioResponse
from app.services import plantio_service
from app.services.plantio_service import _to_response

router = APIRouter(prefix="/plantios", tags=["plantios"])


@router.post("", response_model=PlantioResponse, status_code=status.HTTP_201_CREATED)
async def criar(
    dados: PlantioCreate,
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    return await plantio_service.criar_plantio(db, usuario.id, dados)


@router.get("", response_model=list[PlantioResponse])
async def listar(
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    return await plantio_service.listar_plantios(db, usuario.id)


@router.get("/{plantio_id}", response_model=PlantioResponse)
async def buscar(
    plantio_id: int,
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    plantio = await plantio_service.buscar_plantio(db, plantio_id, usuario.id)
    if not plantio:
        raise HTTPException(status_code=404, detail="Plantio não encontrado")
    return _to_response(plantio)


@router.put("/{plantio_id}", response_model=PlantioResponse)
async def atualizar(
    plantio_id: int,
    dados: PlantioUpdate,
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    plantio = await plantio_service.atualizar_plantio(db, plantio_id, usuario.id, dados)
    if not plantio:
        raise HTTPException(status_code=404, detail="Plantio não encontrado")
    return plantio


@router.delete("/{plantio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def excluir(
    plantio_id: int,
    db: AsyncSession = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    removido = await plantio_service.excluir_plantio(db, plantio_id, usuario.id)
    if not removido:
        raise HTTPException(status_code=404, detail="Plantio não encontrado")
