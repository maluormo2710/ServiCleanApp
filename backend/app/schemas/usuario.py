from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.usuario import RolUsuario


class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
    telefono: str | None = None
    rol: RolUsuario


class UsuarioOut(UsuarioBase):
    id: int
    activo: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UsuarioUpdateInput(BaseModel):
    nombre: str | None = None
    telefono: str | None = None


class UsuarioEstadoInput(BaseModel):
    activo: bool
