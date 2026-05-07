from datetime import datetime
from sqlalchemy import Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Venda(Base):
    __tablename__ = "tab_venda"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[int] = mapped_column(Integer, ForeignKey("tab_usuario.id", ondelete="CASCADE"), nullable=False)
    id_planta: Mapped[int] = mapped_column(Integer, ForeignKey("tab_planta.id", ondelete="CASCADE"), nullable=False)
    quantidade: Mapped[int] = mapped_column(Integer, nullable=False)
    valor_recebido: Mapped[float] = mapped_column(Float, nullable=False)
    data_da_compra: Mapped[datetime | None] = mapped_column(DateTime)

    planta: Mapped["Planta"] = relationship()
    itens: Mapped[list["VendaItem"]] = relationship(back_populates="venda", cascade="all, delete-orphan")


class VendaItem(Base):
    __tablename__ = "tab_venda_item"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_venda: Mapped[int] = mapped_column(Integer, ForeignKey("tab_venda.id", ondelete="CASCADE"), nullable=False)
    id_plantio: Mapped[int] = mapped_column(Integer, ForeignKey("tab_plantio.id", ondelete="CASCADE"), nullable=False)
    quantidade: Mapped[int] = mapped_column(Integer, nullable=False)

    venda: Mapped["Venda"] = relationship(back_populates="itens")
    plantio: Mapped["Plantio"] = relationship()
