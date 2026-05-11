from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.usuario import Usuario, RolUsuario
from app.models.colaborador import Colaborador
from app.models.reserva import Reserva, EstadoReserva
from app.models.notificacion import Notificacion, TipoNotificacion
from app.schemas.reserva import ReservaCreateInput, ReservaOut, ReservaEstadoInput
from app.dependencies import get_current_user, require_role

router = APIRouter(prefix="/api/reservas", tags=["Reservas"])


def _build_reserva_out(r: Reserva) -> ReservaOut:
    return ReservaOut(
        id=r.id,
        fecha=r.fecha,
        hora=r.hora,
        tipo_servicio=r.tipo_servicio,
        direccion=r.direccion,
        duracion_horas=float(r.duracion_horas),
        precio=float(r.precio),
        estado=r.estado,
        tareas=r.tareas or [],
        comentarios_cliente=r.comentarios_cliente,
        created_at=r.created_at,
        colaborador_nombre=r.colaborador.usuario.nombre if r.colaborador and r.colaborador.usuario else "",
        colaborador_avatar=r.colaborador.avatar_url if r.colaborador else None,
        cliente_nombre=r.cliente.nombre if r.cliente else "",
        tiene_resena=r.resena is not None,
    )


@router.post("/", response_model=ReservaOut, status_code=status.HTTP_201_CREATED)
def crear_reserva(
    body: ReservaCreateInput,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_role(RolUsuario.cliente)),
):
    """Crea una nueva reserva. Solo clientes."""
    colaborador = db.query(Colaborador).filter(Colaborador.id == body.colaborador_id).first()
    if not colaborador:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Colaborador no encontrado.")

    reserva = Reserva(
        cliente_id=current_user.id,
        colaborador_id=body.colaborador_id,
        fecha=body.fecha,
        hora=body.hora,
        tipo_servicio=body.tipo_servicio,
        direccion=body.direccion,
        duracion_horas=body.duracion_horas,
        precio=body.precio,
        estado=EstadoReserva.confirmada,  # Se confirma directamente (pago simulado)
        tareas=body.tareas,
        comentarios_cliente=body.comentarios_cliente,
    )
    db.add(reserva)
    db.flush()

    # Notificación automática al cliente (RF-07)
    notif_cliente = Notificacion(
        usuario_id=current_user.id,
        titulo="¡Reserva Confirmada!",
        descripcion=(
            f"Tu servicio de {body.tipo_servicio} con {colaborador.usuario.nombre} "
            f"ha sido agendado para el {body.fecha} a las {body.hora}."
        ),
        tipo=TipoNotificacion.reserva,
    )
    # Notificación al colaborador (RF-07)
    notif_colaborador = Notificacion(
        usuario_id=colaborador.usuario_id,
        titulo="Nueva Reserva Asignada",
        descripcion=(
            f"Tienes una nueva reserva de {current_user.nombre} "
            f"el {body.fecha} a las {body.hora} en {body.direccion}."
        ),
        tipo=TipoNotificacion.reserva,
    )
    db.add(notif_cliente)
    db.add(notif_colaborador)
    db.commit()
    db.refresh(reserva)

    # Cargar relaciones para el response
    db.refresh(reserva)
    reserva = (
        db.query(Reserva)
        .options(
            joinedload(Reserva.colaborador).joinedload(Colaborador.usuario),
            joinedload(Reserva.cliente),
            joinedload(Reserva.resena),
        )
        .filter(Reserva.id == reserva.id)
        .first()
    )
    return _build_reserva_out(reserva)


@router.get("/mis-reservas", response_model=list[ReservaOut])
def mis_reservas(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Historial de reservas del usuario autenticado (cliente o colaborador)."""
    if current_user.rol == RolUsuario.cliente:
        reservas = (
            db.query(Reserva)
            .options(
                joinedload(Reserva.colaborador).joinedload(Colaborador.usuario),
                joinedload(Reserva.cliente),
                joinedload(Reserva.resena),
            )
            .filter(Reserva.cliente_id == current_user.id)
            .order_by(Reserva.fecha.desc())
            .all()
        )
    elif current_user.rol == RolUsuario.colaborador and current_user.colaborador:
        reservas = (
            db.query(Reserva)
            .options(
                joinedload(Reserva.colaborador).joinedload(Colaborador.usuario),
                joinedload(Reserva.cliente),
                joinedload(Reserva.resena),
            )
            .filter(Reserva.colaborador_id == current_user.colaborador.id)
            .order_by(Reserva.fecha.desc())
            .all()
        )
    else:
        reservas = []

    return [_build_reserva_out(r) for r in reservas]


@router.get("/", response_model=list[ReservaOut])
def listar_todas_reservas(
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_role(RolUsuario.admin)),
):
    """Lista todas las reservas. Solo admin."""
    reservas = (
        db.query(Reserva)
        .options(
            joinedload(Reserva.colaborador).joinedload(Colaborador.usuario),
            joinedload(Reserva.cliente),
            joinedload(Reserva.resena),
        )
        .order_by(Reserva.fecha.desc())
        .all()
    )
    return [_build_reserva_out(r) for r in reservas]


@router.get("/{reserva_id}", response_model=ReservaOut)
def obtener_reserva(
    reserva_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Detalle de una reserva."""
    reserva = (
        db.query(Reserva)
        .options(
            joinedload(Reserva.colaborador).joinedload(Colaborador.usuario),
            joinedload(Reserva.cliente),
            joinedload(Reserva.resena),
        )
        .filter(Reserva.id == reserva_id)
        .first()
    )
    if not reserva:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reserva no encontrada.")

    es_cliente = reserva.cliente_id == current_user.id
    es_colaborador = (
        current_user.colaborador and
        reserva.colaborador_id == current_user.colaborador.id
    )
    if not es_cliente and not es_colaborador and current_user.rol != RolUsuario.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sin permiso.")

    return _build_reserva_out(reserva)


@router.patch("/{reserva_id}/estado", response_model=ReservaOut)
def cambiar_estado_reserva(
    reserva_id: int,
    body: ReservaEstadoInput,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Cambia el estado de una reserva. Colaborador/Admin pueden finalizar; cliente puede cancelar."""
    reserva = (
        db.query(Reserva)
        .options(
            joinedload(Reserva.colaborador).joinedload(Colaborador.usuario),
            joinedload(Reserva.cliente),
            joinedload(Reserva.resena),
        )
        .filter(Reserva.id == reserva_id)
        .first()
    )
    if not reserva:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reserva no encontrada.")

    # Incrementar contador de servicios al finalizar
    if body.estado == EstadoReserva.finalizado and reserva.estado != EstadoReserva.finalizado:
        if reserva.colaborador:
            reserva.colaborador.servicios_completados += 1

        # Notificación de pago capturado (RF-09)
        notif = Notificacion(
            usuario_id=reserva.cliente_id,
            titulo="Servicio Finalizado",
            descripcion=(
                f"Tu servicio con {reserva.colaborador.usuario.nombre} ha finalizado. "
                "Recuerda dejar tu calificación."
            ),
            tipo=TipoNotificacion.pago,
        )
        db.add(notif)

    reserva.estado = body.estado
    db.commit()
    db.refresh(reserva)
    return _build_reserva_out(reserva)


@router.delete("/{reserva_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancelar_reserva(
    reserva_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Cancela (elimina lógicamente) una reserva."""
    reserva = db.query(Reserva).filter(Reserva.id == reserva_id).first()
    if not reserva:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reserva no encontrada.")
    if reserva.cliente_id != current_user.id and current_user.rol != RolUsuario.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sin permiso.")
    if reserva.estado == EstadoReserva.finalizado:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se puede cancelar una reserva ya finalizada.",
        )

    reserva.estado = EstadoReserva.cancelado
    db.commit()
