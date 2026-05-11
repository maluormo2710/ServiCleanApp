from datetime import datetime, date
from sqlalchemy.orm import Session
from sqlalchemy import func

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.database import get_db
from app.models.usuario import Usuario, RolUsuario
from app.models.colaborador import Colaborador
from app.models.reserva import Reserva, EstadoReserva
from app.models.resena import Resena
from app.schemas.reserva import ReservaOut
from app.schemas.usuario import UsuarioOut
from app.dependencies import require_role
from app.routers.reservas import _build_reserva_out
from sqlalchemy.orm import joinedload

router = APIRouter(prefix="/api/admin", tags=["Admin"])


class MetricasOut(BaseModel):
    total_reservas_mes: int
    reservas_completadas_mes: int
    usuarios_activos: int
    promedio_calificacion_global: float
    ingresos_retenidos: float


class TopColaboradorOut(BaseModel):
    id: int
    nombre: str
    avatar_url: str | None
    reservas_completadas: int
    calificacion_promedio: float


@router.get("/metricas", response_model=MetricasOut)
def obtener_metricas(
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_role(RolUsuario.admin)),
):
    """KPIs del mes actual para el dashboard de administrador. RF-08."""
    ahora = datetime.utcnow()
    inicio_mes = date(ahora.year, ahora.month, 1)

    total_mes = (
        db.query(func.count(Reserva.id))
        .filter(Reserva.fecha >= inicio_mes)
        .scalar() or 0
    )
    completadas_mes = (
        db.query(func.count(Reserva.id))
        .filter(Reserva.fecha >= inicio_mes, Reserva.estado == EstadoReserva.finalizado)
        .scalar() or 0
    )
    usuarios_activos = (
        db.query(func.count(Usuario.id))
        .filter(Usuario.activo == True)
        .scalar() or 0
    )
    promedio_global = (
        db.query(func.avg(Resena.calificacion)).scalar() or 0.0
    )
    ingresos = (
        db.query(func.sum(Reserva.precio))
        .filter(
            Reserva.estado.in_([EstadoReserva.confirmada, EstadoReserva.en_curso])
        )
        .scalar() or 0.0
    )

    return MetricasOut(
        total_reservas_mes=total_mes,
        reservas_completadas_mes=completadas_mes,
        usuarios_activos=usuarios_activos,
        promedio_calificacion_global=round(float(promedio_global), 2),
        ingresos_retenidos=round(float(ingresos), 2),
    )


@router.get("/top-colaboradores", response_model=list[TopColaboradorOut])
def top_colaboradores(
    limit: int = 5,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_role(RolUsuario.admin)),
):
    """Ranking de colaboradores por servicios completados y calificación. RF-08."""
    colaboradores = (
        db.query(Colaborador)
        .options(joinedload(Colaborador.usuario))
        .order_by(
            Colaborador.servicios_completados.desc(),
            Colaborador.calificacion_promedio.desc(),
        )
        .limit(limit)
        .all()
    )
    return [
        TopColaboradorOut(
            id=c.id,
            nombre=c.usuario.nombre,
            avatar_url=c.avatar_url,
            reservas_completadas=c.servicios_completados,
            calificacion_promedio=float(c.calificacion_promedio),
        )
        for c in colaboradores
    ]


@router.get("/reservas", response_model=list[ReservaOut])
def todas_las_reservas(
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_role(RolUsuario.admin)),
):
    """Todas las reservas con detalle completo. RF-08."""
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


@router.get("/usuarios", response_model=list[UsuarioOut])
def todos_los_usuarios(
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_role(RolUsuario.admin)),
):
    """Lista completa de usuarios para gestión."""
    return db.query(Usuario).order_by(Usuario.created_at.desc()).all()
