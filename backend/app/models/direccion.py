from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Direccion(Base):
    __tablename__ = "direcciones"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    nombre_alias = Column(String(50), nullable=False)       # "Casa", "Oficina"
    direccion_completa = Column(String(255), nullable=False)

    # Relación
    usuario = relationship("Usuario", back_populates="direcciones")
