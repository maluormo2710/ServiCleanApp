from datetime import date, time, datetime
from typing import Optional
from pydantic import BaseModel, field_validator
from app.models.reserva import EstadoReserva


class ReservaCreateInput(BaseModel):
    colaborador_id: int
    fecha: date
    hora: time
    tipo_servicio: str
    direccion: str
    duracion_horas: float = 2.0
    precio: float
    tareas: list[str] = []
    comentarios_cliente: str | None = None

    @field_validator("precio")
    @classmethod
    def precio_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("El precio debe ser mayor a 0.")
        return v

    @field_validator("duracion_horas")
    @classmethod
    def duracion_valid(cls, v: float) -> float:
        if v <= 0 or v > 12:
            raise ValueError("La duración debe estar entre 0 y 12 horas.")
        return v


class ReservaOut(BaseModel):
    id: int
    fecha: date
    hora: time
    tipo_servicio: str
    direccion: str
    duracion_horas: float
    precio: float
    estado: EstadoReserva
    tareas: list[str] | None
    comentarios_cliente: str | None
    created_at: datetime

    # Info denormalizada para el frontend
    colaborador_nombre: str
    colaborador_avatar: str | None
    cliente_nombre: str
    tiene_resena: bool = False

    model_config = {"from_attributes": True}


class ReservaEstadoInput(BaseModel):
    estado: EstadoReserva
