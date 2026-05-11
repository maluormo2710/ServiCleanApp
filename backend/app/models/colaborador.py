from sqlalchemy import (
    Column, Integer, String, Text, Numeric, ForeignKey, Date, Time, Boolean
)
from sqlalchemy.orm import relationship
from app.database import Base


class Colaborador(Base):
    __tablename__ = "colaboradores"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)
    especialidad = Column(String(150), nullable=False)
    bio = Column(Text, nullable=True)
    tarifa_hora = Column(Numeric(10, 2), nullable=False, default=0)
    avatar_url = Column(String(255), nullable=True)
    servicios_completados = Column(Integer, default=0, nullable=False)
    calificacion_promedio = Column(Numeric(3, 2), default=0.0, nullable=False)

    # Relaciones
    usuario = relationship("Usuario", back_populates="colaborador")
    disponibilidades = relationship("Disponibilidad", back_populates="colaborador")
    reservas = relationship(
        "Reserva", foreign_keys="Reserva.colaborador_id", back_populates="colaborador"
    )
    resenas = relationship(
        "Resena", foreign_keys="Resena.colaborador_id", back_populates="colaborador"
    )


class Disponibilidad(Base):
    __tablename__ = "disponibilidades"

    id = Column(Integer, primary_key=True, index=True)
    colaborador_id = Column(Integer, ForeignKey("colaboradores.id"), nullable=False)
    fecha = Column(Date, nullable=False)
    hora_inicio = Column(Time, nullable=False)
    hora_fin = Column(Time, nullable=False)
    disponible = Column(Boolean, default=True, nullable=False)

    # Relación
    colaborador = relationship("Colaborador", back_populates="disponibilidades")
