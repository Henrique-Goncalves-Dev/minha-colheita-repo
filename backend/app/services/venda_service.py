from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.plantio import Planta, Plantio
from app.models.venda import Venda, VendaItem
from app.schemas.venda import (
    VendaCreate,
    VendaUpdate,
    VendaResponse,
    GastoPorSemente,
    ResumoFinanceiro,
    EstoqueItem,
    EstimativaLucro,
)
from app.services.plantio_service import _get_or_create_planta


def _to_response(venda: Venda) -> VendaResponse:
    return VendaResponse(
        id=venda.id,
        nome_semente=venda.planta.nome_planta,
        quantidade=venda.quantidade,
        valor_recebido=venda.valor_recebido,
        data_da_compra=venda.data_da_compra,
    )


async def _estoque_disponivel(db: AsyncSession, usuario_id: int, id_planta: int) -> int:
    result = await db.execute(
        select(func.coalesce(func.sum(Plantio.quantidade), 0))
        .where(Plantio.id_usuario == usuario_id, Plantio.id_planta == id_planta)
    )
    return int(result.scalar_one())


async def _plantios_fifo(db: AsyncSession, usuario_id: int, id_planta: int) -> list[Plantio]:
    """Retorna plantios com saldo > 0, ordenados por data e id (FIFO)."""
    result = await db.execute(
        select(Plantio)
        .where(
            Plantio.id_usuario == usuario_id,
            Plantio.id_planta == id_planta,
            Plantio.quantidade > 0,
        )
        .order_by(Plantio.data_plantacao.asc().nulls_last(), Plantio.id.asc())
    )
    return list(result.scalars().all())


async def _debitar_fifo(
    db: AsyncSession, usuario_id: int, id_planta: int, quantidade: int
) -> list[VendaItem]:
    """Subtrai `quantidade` do estoque seguindo FIFO. Cria VendaItem (sem id_venda ainda)."""
    plantios = await _plantios_fifo(db, usuario_id, id_planta)
    itens: list[VendaItem] = []
    restante = quantidade
    for p in plantios:
        if restante <= 0:
            break
        usar = min(p.quantidade, restante)
        p.quantidade -= usar
        restante -= usar
        itens.append(VendaItem(id_plantio=p.id, quantidade=usar))
    if restante > 0:
        raise ValueError(f"Estoque insuficiente. Faltam {restante} unidades.")
    return itens


async def _estornar_itens(db: AsyncSession, venda: Venda) -> None:
    """Devolve a quantidade de cada VendaItem ao plantio correspondente."""
    for item in venda.itens:
        plantio = await db.get(Plantio, item.id_plantio)
        if plantio is not None:
            plantio.quantidade += item.quantidade
        await db.delete(item)
    await db.flush()
    venda.itens = []


async def criar_venda(db: AsyncSession, usuario_id: int, dados: VendaCreate) -> VendaResponse:
    planta = await _get_or_create_planta(db, dados.nome_semente)
    disponivel = await _estoque_disponivel(db, usuario_id, planta.id)
    if dados.quantidade > disponivel:
        raise ValueError(f"Estoque insuficiente. Disponível: {disponivel}")

    itens = await _debitar_fifo(db, usuario_id, planta.id, dados.quantidade)

    venda = Venda(
        id_usuario=usuario_id,
        id_planta=planta.id,
        quantidade=dados.quantidade,
        valor_recebido=dados.valor_recebido,
        data_da_compra=dados.data_da_compra,
        itens=itens,
    )
    db.add(venda)
    await db.commit()
    await db.refresh(venda, ["planta"])
    return _to_response(venda)


async def listar_vendas(db: AsyncSession, usuario_id: int) -> list[VendaResponse]:
    result = await db.execute(
        select(Venda)
        .options(selectinload(Venda.planta))
        .where(Venda.id_usuario == usuario_id)
        .order_by(Venda.data_da_compra.desc().nulls_last(), Venda.id.desc())
    )
    return [_to_response(v) for v in result.scalars().all()]


async def buscar_venda(db: AsyncSession, venda_id: int, usuario_id: int) -> Venda | None:
    result = await db.execute(
        select(Venda)
        .options(selectinload(Venda.planta), selectinload(Venda.itens))
        .where(Venda.id == venda_id, Venda.id_usuario == usuario_id)
    )
    return result.scalar_one_or_none()


async def atualizar_venda(
    db: AsyncSession, venda_id: int, usuario_id: int, dados: VendaUpdate
) -> VendaResponse | None:
    venda = await buscar_venda(db, venda_id, usuario_id)
    if not venda:
        return None

    if dados.quantidade is not None and dados.quantidade != venda.quantidade:
        await _estornar_itens(db, venda)
        disponivel = await _estoque_disponivel(db, usuario_id, venda.id_planta)
        if dados.quantidade > disponivel:
            await db.rollback()
            raise ValueError(f"Estoque insuficiente. Disponível: {disponivel}")
        novos_itens = await _debitar_fifo(db, usuario_id, venda.id_planta, dados.quantidade)
        for item in novos_itens:
            item.id_venda = venda.id
            db.add(item)
        venda.quantidade = dados.quantidade

    if dados.valor_recebido is not None:
        venda.valor_recebido = dados.valor_recebido
    if dados.data_da_compra is not None:
        venda.data_da_compra = dados.data_da_compra

    await db.commit()
    await db.refresh(venda, ["planta"])
    return _to_response(venda)


async def excluir_venda(db: AsyncSession, venda_id: int, usuario_id: int) -> bool:
    venda = await buscar_venda(db, venda_id, usuario_id)
    if not venda:
        return False
    await _estornar_itens(db, venda)
    await db.delete(venda)
    await db.commit()
    return True


async def ultima_venda(db: AsyncSession, usuario_id: int) -> VendaResponse | None:
    result = await db.execute(
        select(Venda)
        .options(selectinload(Venda.planta))
        .where(Venda.id_usuario == usuario_id)
        .order_by(Venda.data_da_compra.desc().nulls_last(), Venda.id.desc())
        .limit(1)
    )
    venda = result.scalar_one_or_none()
    return _to_response(venda) if venda else None


async def gastos_por_semente(db: AsyncSession, usuario_id: int) -> list[GastoPorSemente]:
    result = await db.execute(
        select(
            Planta.id,
            Planta.nome_planta,
            func.sum(Plantio.quantidade).label("qtd"),
            func.sum(Plantio.custo).label("custo"),
        )
        .join(Plantio, Plantio.id_planta == Planta.id)
        .where(Plantio.id_usuario == usuario_id)
        .group_by(Planta.id, Planta.nome_planta)
        .order_by(Planta.nome_planta.asc())
    )
    return [
        GastoPorSemente(
            id_planta=row.id,
            nome_semente=row.nome_planta,
            quantidade_plantada=int(row.qtd or 0),
            custo_total=float(row.custo or 0.0),
        )
        for row in result.all()
    ]


async def resumo_financeiro(db: AsyncSession, usuario_id: int) -> ResumoFinanceiro:
    return ResumoFinanceiro(
        gastos_por_semente=await gastos_por_semente(db, usuario_id),
        ultima_venda=await ultima_venda(db, usuario_id),
        vendas=await listar_vendas(db, usuario_id),
    )


async def estoque(db: AsyncSession, usuario_id: int) -> list[EstoqueItem]:
    result = await db.execute(
        select(
            Planta.id,
            Planta.nome_planta,
            func.sum(Plantio.quantidade).label("disponivel"),
        )
        .join(Plantio, Plantio.id_planta == Planta.id)
        .where(Plantio.id_usuario == usuario_id)
        .group_by(Planta.id, Planta.nome_planta)
        .having(func.sum(Plantio.quantidade) > 0)
        .order_by(Planta.nome_planta.asc())
    )
    return [
        EstoqueItem(
            id_planta=row.id,
            nome_semente=row.nome_planta,
            total_disponivel=int(row.disponivel or 0),
        )
        for row in result.all()
    ]


async def estimativa_lucro(
    db: AsyncSession, usuario_id: int, id_planta: int, quantidade: int
) -> EstimativaLucro | None:
    planta = await db.get(Planta, id_planta)
    if not planta:
        return None

    plantio_agg = await db.execute(
        select(
            func.coalesce(func.sum(Plantio.custo), 0.0).label("custo"),
            func.coalesce(func.sum(Plantio.quantidade), 0).label("qtd"),
        ).where(Plantio.id_usuario == usuario_id, Plantio.id_planta == id_planta)
    )
    p_row = plantio_agg.one()
    custo_unit = (float(p_row.custo) / int(p_row.qtd)) if int(p_row.qtd) > 0 else 0.0
    custo_estimado = round(custo_unit * quantidade, 2)

    venda_agg = await db.execute(
        select(
            func.coalesce(func.sum(Venda.valor_recebido), 0.0).label("valor"),
            func.coalesce(func.sum(Venda.quantidade), 0).label("qtd"),
        ).where(Venda.id_usuario == usuario_id, Venda.id_planta == id_planta)
    )
    v_row = venda_agg.one()
    qtd_vendida = int(v_row.qtd)
    if qtd_vendida == 0:
        return EstimativaLucro(
            nome_semente=planta.nome_planta,
            quantidade=quantidade,
            custo_estimado=custo_estimado,
            receita_estimada=None,
            lucro_estimado=None,
            sem_historico=True,
        )

    preco_unit = float(v_row.valor) / qtd_vendida
    receita = round(preco_unit * quantidade, 2)
    return EstimativaLucro(
        nome_semente=planta.nome_planta,
        quantidade=quantidade,
        custo_estimado=custo_estimado,
        receita_estimada=receita,
        lucro_estimado=round(receita - custo_estimado, 2),
        sem_historico=False,
    )
