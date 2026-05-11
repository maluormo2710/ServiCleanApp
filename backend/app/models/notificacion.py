import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, ForeignKey,
    DateTime, Enum as SAEnum
)
from sqlalchemy.orm import relationship
from app.database import Base


class TipoNotificacion(str, enum.Enum):
    reserva = "reserva"
    recordatorio = "recordatorio"
    pago = "pago"
    promo = "promo"


class Notificacion(Base):
    __tablename__ = "notificaciones"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    titulo = Column(String(150), nullable=False)
    descripcion = Column(Text, nullable=False)
    tipo = Column(SAEnum(TipoNotificacion), nullable=False, default=TipoNotificacion.reserva)
    leida = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relación
    usuario = relationship("Usuario", back_populates="notificaciones")
