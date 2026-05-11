from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.usuario import Usuario, RolUsuario
from app.models.colaborador import Colaborador, Disponibilidad
from app.models.resena import Resena
from app.schemas.colaborador import (
    ColaboradorListItem,
    ColaboradorOut,
    ColaboradorUpdateInput,
    DisponibilidadInput,
    DisponibilidadOut,
    ResenaOut,
)
from app.dependencies import get_current_user, require_role

router = APIRouter(prefix="/api/colaboradores", tags=["Colaboradores"])


def _build_colaborador_out(col: Colaborador) -> ColaboradorOut:
    """Convierte un ORM Colaborador al schema de salida con reseñas."""
    resenas_out = []
    for r in col.resenas:
        resenas_out.append(
            ResenaOut(
                id=r.id,
                autor_nombre=r.autor.nombre if r.autor else "Anónimo",
                calificacion=float(r.calificacion),
                comentario=r.comentario,
                fecha=r.created_at.strftime("%d %b %Y"),
            )
        )
    return ColaboradorOut(
        id=col.id,
        nombre=col.usuario.nombre,
        especialidad=col.especialidad,
        bio=col.bio,
        tarifa_hora=float(col.tarifa_hora),
        avatar_url=col.avatar_url,
        calificacion_promedio=float(col.calificacion_promedio),
        servicios_completados=col.servicios_completados,
        resenas=resenas_out,
    )


@router.get("/", response_model=list[ColaboradorListItem])
def listar_colaboradores(
    especialidad: Optional[str] = Query(None, description="Filtrar por especialidad"),
    fecha: Optional[date] = Query(None, description="Filtrar por fecha disponible"),
    min_calificacion: Optional[float] = Query(None, ge=0, le=5),
    db: Session = Depends(get_db),
):
    """Lista colaboradores activos con filtros opcionales. Ruta pública."""
    query = (
        db.query(Colaborador)
        .join(Colaborador.usuario)
        .filter(Usuario.activo == True)
        .options(joinedload(Colaborador.usuario))
    )

    if especialidad:
        query = query.filter(
            Colaborador.especialidad.ilike(f"%{especialidad}%")
        )
    if min_calificacion is not None:
        query = query.filter(Colaborador.calificacion_promedio >= min_calificacion)
    if fecha:
        query = query.join(Colaborador.disponibilidades).filter(
            Disponibilidad.fecha == fecha,
            Disponibilidad.disponible == True,
        )

    colaboradores = query.all()
    return [
        ColaboradorListItem(
            id=c.id,
            nombre=c.usuario.nombre,
            especialidad=c.especialidad,
            calificacion_promedio=float(c.calificacion_promedio),
            servicios_completados=c.servicios_completados,
            tarifa_hora=float(c.tarifa_hora),
            avatar_url=c.avatar_url,
        )
        for c in colaboradores
    ]


@router.get("/{colaborador_id}", response_model=ColaboradorOut)
def obtener_colaborador(colaborador_id: int, db: Session = Depends(get_db)):
    """Detalle de un colaborador con sus reseñas. Ruta pública."""
    col = (
        db.query(Colaborador)
        .options(
            joinedload(Colaborador.usuario),
            joinedload(Colaborador.resenas).joinedload(Resena.autor),
        )
        .filter(Colaborador.id == colaborador_id)
        .first()
    )
    if not col:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Colaborador no encontrado.")
    return _build_colaborador_out(col)


@router.put("/{colaborador_id}", response_model=ColaboradorOut)
def actualizar_colaborador(
    colaborador_id: int,
    body: ColaboradorUpdateInput,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Actualiza el perfil del colaborador. Solo el propio colaborador o admin."""
    col = db.query(Colaborador).filter(Colaborador.id == colaborador_id).first()
    if not col:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Colaborador no encontrado.")

    if current_user.id != col.usuario_id and current_user.rol != RolUsuario.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sin permiso.")

    if body.especialidad is not None:
        col.especialidad = body.especialidad
    if body.bio is not None:
        col.bio = body.bio
    if body.tarifa_hora is not None:
        col.tarifa_hora = body.tarifa_hora
    if body.avatar_url is not None:
        col.avatar_url = body.avatar_url

    db.commit()
    db.refresh(col)
    return _build_colaborador_out(col)


@router.get("/{colaborador_id}/disponibilidad", response_model=list[DisponibilidadOut])
def obtener_disponibilidad(colaborador_id: int, db: Session = Depends(get_db)):
    """Lista los slots de disponibilidad de un colaborador."""
    col = db.query(Colaborador).filter(Colaborador.id == colaborador_id).first()
    if not col:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Colaborador no encontrado.")
    return col.disponibilidades


@router.post(
    "/{colaborador_id}/disponibilidad",
    response_model=DisponibilidadOut,
    status_code=status.HTTP_201_CREATED,
)
def agregar_disponibilidad(
    colaborador_id: int,
    body: DisponibilidadInput,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Agrega un slot de disponibilidad. Solo el propio colaborador."""
    col = db.query(Colaborador).filter(Colaborador.id == colaborador_id).first()
    if not col:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Colaborador no encontrado.")
    if current_user.id != col.usuario_id and current_user.rol != RolUsuario.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sin permiso.")

    slot = Disponibilidad(
        colaborador_id=colaborador_id,
        fecha=body.fecha,
        hora_inicio=body.hora_inicio,
        hora_fin=body.hora_fin,
        disponible=body.disponible,
    )
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot
