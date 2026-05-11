from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.usuario import Usuario, RolUsuario
from app.models.reserva import Reserva, EstadoReserva
from app.schemas.usuario import UsuarioOut, UsuarioUpdateInput, UsuarioEstadoInput
from app.dependencies import get_current_user, require_role

router = APIRouter(prefix="/api/usuarios", tags=["Usuarios"])


@router.get("/", response_model=list[UsuarioOut])
def listar_usuarios(
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_role(RolUsuario.admin)),
):
    """Lista todos los usuarios. Solo Admin."""
    return db.query(Usuario).all()


@router.get("/{usuario_id}", response_model=UsuarioOut)
def obtener_usuario(
    usuario_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Obtiene el perfil de un usuario. Solo el propio o admin."""
    if current_user.id != usuario_id and current_user.rol != RolUsuario.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sin permiso.")

    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
    return usuario


@router.put("/{usuario_id}", response_model=UsuarioOut)
def actualizar_usuario(
    usuario_id: int,
    body: UsuarioUpdateInput,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Actualiza el perfil propio."""
    if current_user.id != usuario_id and current_user.rol != RolUsuario.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sin permiso.")

    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")

    if body.nombre is not None:
        usuario.nombre = body.nombre
    if body.telefono is not None:
        usuario.telefono = body.telefono

    db.commit()
    db.refresh(usuario)
    return usuario


@router.patch("/{usuario_id}/estado", response_model=UsuarioOut)
def cambiar_estado_usuario(
    usuario_id: int,
    body: UsuarioEstadoInput,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_role(RolUsuario.admin)),
):
    """
    Habilita o inhabilita una cuenta de usuario.
    Si se intenta inhabilitar un colaborador con reservas activas, se bloquea (RF-03).
    """
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")

    # Protección de integridad: no inhabilitar colaborador con reservas activas
    if not body.activo and usuario.rol == RolUsuario.colaborador and usuario.colaborador:
        reservas_activas = (
            db.query(Reserva)
            .filter(
                Reserva.colaborador_id == usuario.colaborador.id,
                Reserva.estado.in_([EstadoReserva.confirmada, EstadoReserva.en_curso]),
            )
            .count()
        )
        if reservas_activas > 0:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    f"El colaborador tiene {reservas_activas} reserva(s) activa(s). "
                    "Reasigna o cancela esas reservas antes de inhabilitar la cuenta."
                ),
            )

    usuario.activo = body.activo
    db.commit()
    db.refresh(usuario)
    return usuario
