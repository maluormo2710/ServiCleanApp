import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Enum as SAEnum
)
from sqlalchemy.orm import relationship
from app.database import Base


class RolUsuario(str, enum.Enum):
    admin = "admin"
    colaborador = "colaborador"
    cliente = "cliente"


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    telefono = Column(String(20), nullable=True)
    rol = Column(SAEnum(RolUsuario), nullable=False, default=RolUsuario.cliente)
    activo = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relaciones
    colaborador = relationship("Colaborador", back_populates="usuario", uselist=False)
    reservas_cliente = relationship(
        "Reserva", foreign_keys="Reserva.cliente_id", back_populates="cliente"
    )
    notificaciones = relationship("Notificacion", back_populates="usuario")
    direcciones = relationship("Direccion", back_populates="usuario")
    resenas = relationship("Resena", foreign_keys="Resena.autor_id", back_populates="autor")
