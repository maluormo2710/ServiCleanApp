from datetime import datetime
from sqlalchemy import Column, Integer, Text, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


class Resena(Base):
    __tablename__ = "resenas"

    id = Column(Integer, primary_key=True, index=True)
    reserva_id = Column(
        Integer, ForeignKey("reservas.id"), unique=True, nullable=False
    )
    autor_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    colaborador_id = Column(Integer, ForeignKey("colaboradores.id"), nullable=False)
    calificacion = Column(Numeric(2, 1), nullable=False)  # 1.0 – 5.0
    comentario = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relaciones
    reserva = relationship("Reserva", back_populates="resena")
    autor = relationship(
        "Usuario", foreign_keys=[autor_id], back_populates="resenas"
    )
    colaborador = relationship(
        "Colaborador", foreign_keys=[colaborador_id], back_populates="resenas"
    )
