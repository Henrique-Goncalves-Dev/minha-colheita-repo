from datetime import datetime
from sqlalchemy import Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Planta(Base):
    __tablename__ = "tab_planta"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nome_planta: Mapped[str] = mapped_column(String(100), nullable=False)
    descricao: Mapped[str | None] = mapped_column(String(500))

    plantios: Mapped[list["Plantio"]] = relationship(back_populates="planta", cascade="all, delete-orphan")


class Plantio(Base):
    __tablename__ = "tab_plantio"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_planta: Mapped[int] = mapped_column(Integer, ForeignKey("tab_planta.id", ondelete="CASCADE"), nullable=False)
    id_usuario: Mapped[int] = mapped_column(Integer, ForeignKey("tab_usuario.id", ondelete="CASCADE"), nullable=False)
    quantidade: Mapped[int] = mapped_column(Integer, nullable=False)
    custo: Mapped[float] = mapped_column(Float, nullable=False)
    data_plantacao: Mapped[datetime | None] = mapped_column(DateTime)

    planta: Mapped["Planta"] = relationship(back_populates="plantios")
    usuario: Mapped["Usuario"] = relationship(back_populates="plantios")
