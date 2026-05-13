from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Usuario(Base):
    __tablename__ = "tab_usuario"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nome: Mapped[str] = mapped_column(String(100), nullable=False)
    telefone: Mapped[str] = mapped_column(String(11), nullable=False, unique=True)
    pin: Mapped[str] = mapped_column(String(255), nullable=False)

    plantios: Mapped[list["Plantio"]] = relationship(back_populates="usuario", cascade="all, delete-orphan")
