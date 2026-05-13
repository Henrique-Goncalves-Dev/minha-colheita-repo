from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.plantio import Planta, Plantio
from app.schemas.plantio import PlantioCreate, PlantioUpdate, PlantioResponse


async def _get_or_create_planta(db: AsyncSession, nome: str) -> Planta:
    result = await db.execute(
        select(Planta).where(func.lower(Planta.nome_planta) == nome.lower())
    )
    planta = result.scalar_one_or_none()
    if not planta:
        planta = Planta(nome_planta=nome)
        db.add(planta)
        await db.flush()
    return planta


def _to_response(plantio: Plantio) -> PlantioResponse:
    return PlantioResponse(
        id=plantio.id,
        nome_semente=plantio.planta.nome_planta,
        data_plantacao=plantio.data_plantacao,
        quantidade=plantio.quantidade,
        custo=plantio.custo,
    )


async def criar_plantio(db: AsyncSession, usuario_id: int, dados: PlantioCreate) -> PlantioResponse:
    planta = await _get_or_create_planta(db, dados.nome_semente)
    plantio = Plantio(
        id_planta=planta.id,
        id_usuario=usuario_id,
        quantidade=dados.quantidade,
        custo=dados.custo,
        data_plantacao=dados.data_plantacao,
    )
    db.add(plantio)
    await db.commit()
    await db.refresh(plantio)
    await db.refresh(plantio, ["planta"])
    return _to_response(plantio)


async def listar_plantios(db: AsyncSession, usuario_id: int) -> list[PlantioResponse]:
    result = await db.execute(
        select(Plantio)
        .options(selectinload(Plantio.planta))
        .where(Plantio.id_usuario == usuario_id)
    )
    return [_to_response(p) for p in result.scalars().all()]


async def buscar_plantio(db: AsyncSession, plantio_id: int, usuario_id: int) -> Plantio | None:
    result = await db.execute(
        select(Plantio)
        .options(selectinload(Plantio.planta))
        .where(Plantio.id == plantio_id, Plantio.id_usuario == usuario_id)
    )
    return result.scalar_one_or_none()


async def atualizar_plantio(
    db: AsyncSession, plantio_id: int, usuario_id: int, dados: PlantioUpdate
) -> PlantioResponse | None:
    plantio = await buscar_plantio(db, plantio_id, usuario_id)
    if not plantio:
        return None

    if dados.nome_semente is not None:
        planta = await _get_or_create_planta(db, dados.nome_semente)
        plantio.id_planta = planta.id
        plantio.planta = planta

    if dados.quantidade is not None:
        plantio.quantidade = dados.quantidade
    if dados.custo is not None:
        plantio.custo = dados.custo
    if dados.data_plantacao is not None:
        plantio.data_plantacao = dados.data_plantacao

    await db.commit()
    await db.refresh(plantio)
    return _to_response(plantio)


async def excluir_plantio(db: AsyncSession, plantio_id: int, usuario_id: int) -> bool:
    plantio = await buscar_plantio(db, plantio_id, usuario_id)
    if not plantio:
        return False
    await db.delete(plantio)
    await db.commit()
    return True
