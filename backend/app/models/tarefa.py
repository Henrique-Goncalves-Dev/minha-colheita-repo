from app.models.usuario import Usuario
from datetime import datetime
# pyrefly: ignore [missing-import]
from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Tarefa(Base):
    __tablename__ = "tab_tarefa"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_usuario: Mapped[int] = mapped_column(Integer, ForeignKey("tab_usuario.id", ondelete="CASCADE"), nullable=False)
    emoji: Mapped[str] = mapped_column(String(10), default="🛠️")
    titulo: Mapped[str] = mapped_column(String(200), nullable=False)
    quando: Mapped[str | None] = mapped_column(String(100))
    concluida: Mapped[bool] = mapped_column(Boolean, default=False)
    criado_em: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    usuario: Mapped["Usuario"] = relationship()
