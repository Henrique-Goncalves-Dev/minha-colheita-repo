# pyrefly: ignore [missing-import]
from sqlalchemy import select
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.tarefa import Tarefa
from app.schemas.tarefa import TarefaCreate, TarefaUpdate, TarefaResponse


async def criar_tarefa(db: AsyncSession, usuario_id: int, dados: TarefaCreate) -> TarefaResponse:
    tarefa = Tarefa(
        id_usuario=usuario_id,
        emoji=dados.emoji,
        titulo=dados.titulo,
        quando=dados.quando,
    )
    db.add(tarefa)
    await db.commit()
    await db.refresh(tarefa)
    return TarefaResponse.model_validate(tarefa)


async def listar_tarefas(db: AsyncSession, usuario_id: int) -> list[TarefaResponse]:
    result = await db.execute(
        select(Tarefa)
        .where(Tarefa.id_usuario == usuario_id)
        .order_by(Tarefa.concluida.asc(), Tarefa.criado_em.desc())
    )
    return [TarefaResponse.model_validate(t) for t in result.scalars().all()]


async def atualizar_tarefa(
    db: AsyncSession, tarefa_id: int, usuario_id: int, dados: TarefaUpdate
) -> TarefaResponse | None:
    result = await db.execute(
        select(Tarefa).where(Tarefa.id == tarefa_id, Tarefa.id_usuario == usuario_id)
    )
    tarefa = result.scalar_one_or_none()
    if not tarefa:
        return None

    if dados.emoji is not None:
        tarefa.emoji = dados.emoji
    if dados.titulo is not None:
        tarefa.titulo = dados.titulo
    if dados.quando is not None:
        tarefa.quando = dados.quando
    if dados.concluida is not None:
        tarefa.concluida = dados.concluida

    await db.commit()
    await db.refresh(tarefa)
    return TarefaResponse.model_validate(tarefa)


async def toggle_tarefa(db: AsyncSession, tarefa_id: int, usuario_id: int) -> TarefaResponse | None:
    result = await db.execute(
        select(Tarefa).where(Tarefa.id == tarefa_id, Tarefa.id_usuario == usuario_id)
    )
    tarefa = result.scalar_one_or_none()
    if not tarefa:
        return None
    tarefa.concluida = not tarefa.concluida
    await db.commit()
    await db.refresh(tarefa)
    return TarefaResponse.model_validate(tarefa)


async def excluir_tarefa(db: AsyncSession, tarefa_id: int, usuario_id: int) -> bool:
    result = await db.execute(
        select(Tarefa).where(Tarefa.id == tarefa_id, Tarefa.id_usuario == usuario_id)
    )
    tarefa = result.scalar_one_or_none()
    if not tarefa:
        return False
    await db.delete(tarefa)
    await db.commit()
    return True
