import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Numeric, ForeignKey,
    Date, Time, DateTime, JSON, Enum as SAEnum
)
from sqlalchemy.orm import relationship
from app.database import Base


class EstadoReserva(str, enum.Enum):
    pendiente = "Pendiente"
    confirmada = "Confirmada"
    en_curso = "En Curso"
    finalizado = "Finalizado"
    cancelado = "Cancelado"


class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    colaborador_id = Column(Integer, ForeignKey("colaboradores.id"), nullable=False)
    fecha = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    tipo_servicio = Column(String(100), nullable=False)
    direccion = Column(String(255), nullable=False)
    duracion_horas = Column(Numeric(4, 1), nullable=False, default=2.0)
    precio = Column(Numeric(10, 2), nullable=False)
    estado = Column(
        SAEnum(EstadoReserva),
        nullable=False,
        default=EstadoReserva.pendiente
    )
    tareas = Column(JSON, nullable=True)           # Lista de strings
    comentarios_cliente = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relaciones
    cliente = relationship(
        "Usuario", foreign_keys=[cliente_id], back_populates="reservas_cliente"
    )
    colaborador = relationship(
        "Colaborador", foreign_keys=[colaborador_id], back_populates="reservas"
    )
    resena = relationship("Resena", back_populates="reserva", uselist=False)
