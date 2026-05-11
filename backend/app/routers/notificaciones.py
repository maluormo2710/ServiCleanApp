from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.usuario import Usuario
from app.models.notificacion import Notificacion
from app.schemas.notificacion import NotificacionOut
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/notificaciones", tags=["Notificaciones"])


@router.get("/", response_model=list[NotificacionOut])
def listar_notificaciones(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Lista las notificaciones del usuario autenticado, más recientes primero."""
    return (
        db.query(Notificacion)
        .filter(Notificacion.usuario_id == current_user.id)
        .order_by(Notificacion.created_at.desc())
        .all()
    )


@router.patch("/{notificacion_id}/leer", response_model=NotificacionOut)
def marcar_leida(
    notificacion_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Marca una notificación como leída."""
    notif = (
        db.query(Notificacion)
        .filter(
            Notificacion.id == notificacion_id,
            Notificacion.usuario_id == current_user.id,
        )
        .first()
    )
    if not notif:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Notificación no encontrada.")
    notif.leida = True
    db.commit()
    db.refresh(notif)
    return notif


@router.patch("/leer-todas", status_code=status.HTTP_204_NO_CONTENT)
def marcar_todas_leidas(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Marca todas las notificaciones del usuario como leídas."""
    db.query(Notificacion).filter(
        Notificacion.usuario_id == current_user.id,
        Notificacion.leida == False,
    ).update({"leida": True})
    db.commit()
