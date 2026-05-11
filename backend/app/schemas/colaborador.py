from datetime import date, time
from pydantic import BaseModel, field_validator
from typing import Optional


class ResenaOut(BaseModel):
    id: int
    autor_nombre: str
    calificacion: float
    comentario: str | None
    fecha: str

    model_config = {"from_attributes": True}


class ColaboradorBase(BaseModel):
    especialidad: str
    bio: str | None = None
    tarifa_hora: float
    avatar_url: str | None = None


class ColaboradorOut(ColaboradorBase):
    id: int
    nombre: str
    calificacion_promedio: float
    servicios_completados: int
    resenas: list[ResenaOut] = []

    model_config = {"from_attributes": True}


class ColaboradorListItem(BaseModel):
    id: int
    nombre: str
    especialidad: str
    calificacion_promedio: float
    servicios_completados: int
    tarifa_hora: float
    avatar_url: str | None

    model_config = {"from_attributes": True}


class ColaboradorUpdateInput(BaseModel):
    especialidad: str | None = None
    bio: str | None = None
    tarifa_hora: float | None = None
    avatar_url: str | None = None


class DisponibilidadInput(BaseModel):
    fecha: date
    hora_inicio: time
    hora_fin: time
    disponible: bool = True


class DisponibilidadOut(DisponibilidadInput):
    id: int
    colaborador_id: int

    model_config = {"from_attributes": True}
