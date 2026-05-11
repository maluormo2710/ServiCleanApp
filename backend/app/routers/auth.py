from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.usuario import Usuario, RolUsuario
from app.models.colaborador import Colaborador
from app.schemas.auth import RegistroInput, LoginInput, TokenResponse
from app.schemas.usuario import UsuarioOut
from app.utils.security import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])


@router.post("/registro", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def registro(body: RegistroInput, db: Session = Depends(get_db)):
    """Registra un nuevo usuario (cliente o colaborador)."""
    # Verificar email duplicado
    existe = db.query(Usuario).filter(Usuario.email == body.email).first()
    if existe:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta registrada con ese correo electrónico.",
        )

    nuevo_usuario = Usuario(
        nombre=body.nombre,
        email=body.email,
        password_hash=hash_password(body.password),
        telefono=body.telefono,
        rol=body.rol,
    )
    db.add(nuevo_usuario)
    db.flush()  # Genera el ID sin hacer commit aún

    # Si es colaborador, crear perfil de colaborador vacío
    if body.rol == RolUsuario.colaborador:
        perfil = Colaborador(
            usuario_id=nuevo_usuario.id,
            especialidad="Sin especificar",
            tarifa_hora=0,
        )
        db.add(perfil)

    db.commit()
    db.refresh(nuevo_usuario)

    token = create_access_token(data={"sub": nuevo_usuario.id, "rol": nuevo_usuario.rol})
    return TokenResponse(
        access_token=token,
        rol=nuevo_usuario.rol,
        nombre=nuevo_usuario.nombre,
        usuario_id=nuevo_usuario.id,
    )


@router.post("/login", response_model=TokenResponse)
def login(body: LoginInput, db: Session = Depends(get_db)):
    """
    Autentica al usuario. Retorna JWT en caso de éxito.
    El mensaje de error es genérico (no revela si fue el email o la contraseña — RF-04).
    """
    GENERIC_ERROR = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Correo o contraseña incorrectos.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    usuario = db.query(Usuario).filter(Usuario.email == body.email).first()
    if not usuario:
        raise GENERIC_ERROR
    if not verify_password(body.password, usuario.password_hash):
        raise GENERIC_ERROR
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tu cuenta ha sido deshabilitada. Contacta al soporte.",
        )

    token = create_access_token(data={"sub": usuario.id, "rol": usuario.rol})
    return TokenResponse(
        access_token=token,
        rol=usuario.rol,
        nombre=usuario.nombre,
        usuario_id=usuario.id,
    )


@router.get("/me", response_model=UsuarioOut)
def get_me(current_user: Usuario = Depends(get_current_user)):
    """Retorna los datos del usuario autenticado."""
    return current_user
