from datetime import datetime
from pydantic import BaseModel, field_validator


class ResenaCreateInput(BaseModel):
    reserva_id: int
    calificacion: float
    comentario: str | None = None

    @field_validator("calificacion")
    @classmethod
    def calificacion_range(cls, v: float) -> float:
        if not (1.0 <= v <= 5.0):
            raise ValueError("La calificación debe estar entre 1 y 5.")
        return round(v, 1)


class ResenaOut(BaseModel):
    id: int
    reserva_id: int
    autor_nombre: str
    calificacion: float
    comentario: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
