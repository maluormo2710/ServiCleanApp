from pydantic import BaseModel, EmailStr, field_validator
from app.models.usuario import RolUsuario


class RegistroInput(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    telefono: str | None = None
    rol: RolUsuario = RolUsuario.cliente

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres.")
        return v

    @field_validator("nombre")
    @classmethod
    def nombre_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío.")
        return v.strip()


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    rol: RolUsuario
    nombre: str
    usuario_id: int
