from sqlalchemy.orm import Session
from sqlalchemy import func

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_db
from app.models.usuario import Usuario, RolUsuario
from app.models.colaborador import Colaborador
from app.models.reserva import Reserva, EstadoReserva
from app.models.resena import Resena
from app.schemas.resena import ResenaCreateInput, ResenaOut
from app.dependencies import get_current_user, require_role

router = APIRouter(prefix="/api/resenas", tags=["Reseñas"])


def _recalcular_promedio(colaborador: Colaborador, db: Session):
    """Recalcula y guarda el promedio de calificación del colaborador."""
    resultado = (
        db.query(func.avg(Resena.calificacion))
        .filter(Resena.colaborador_id == colaborador.id)
        .scalar()
    )
    colaborador.calificacion_promedio = round(float(resultado or 0), 2)
    db.commit()


@router.post("/", response_model=ResenaOut, status_code=status.HTTP_201_CREATED)
def crear_resena(
    body: ResenaCreateInput,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_role(RolUsuario.cliente)),
):
    """
    Crea una reseña para una reserva finalizada.
    Solo el cliente que hizo la reserva puede calificar. RF-02.
    """
    reserva = db.query(Reserva).filter(Reserva.id == body.reserva_id).first()
    if not reserva:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reserva no encontrada.")
    if reserva.cliente_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Solo puedes calificar tus propias reservas.")
    if reserva.estado != EstadoReserva.finalizado:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Solo se pueden calificar reservas finalizadas.",
        )
    # Verificar que no tenga reseña previa
    existente = db.query(Resena).filter(Resena.reserva_id == body.reserva_id).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Esta reserva ya fue calificada.",
        )

    resena = Resena(
        reserva_id=body.reserva_id,
        autor_id=current_user.id,
        colaborador_id=reserva.colaborador_id,
        calificacion=body.calificacion,
        comentario=body.comentario,
    )
    db.add(resena)
    db.commit()
    db.refresh(resena)

    # Recalcular promedio del colaborador (RF-02)
    _recalcular_promedio(reserva.colaborador, db)

    return ResenaOut(
        id=resena.id,
        reserva_id=resena.reserva_id,
        autor_nombre=current_user.nombre,
        calificacion=float(resena.calificacion),
        comentario=resena.comentario,
        created_at=resena.created_at,
    )


@router.get("/colaborador/{colaborador_id}", response_model=list[ResenaOut])
def resenas_de_colaborador(colaborador_id: int, db: Session = Depends(get_db)):
    """Lista las reseñas de un colaborador. Ruta pública."""
    resenas = (
        db.query(Resena)
        .filter(Resena.colaborador_id == colaborador_id)
        .order_by(Resena.created_at.desc())
        .all()
    )
    return [
        ResenaOut(
            id=r.id,
            reserva_id=r.reserva_id,
            autor_nombre=r.autor.nombre if r.autor else "Anónimo",
            calificacion=float(r.calificacion),
            comentario=r.comentario,
            created_at=r.created_at,
        )
        for r in resenas
    ]
