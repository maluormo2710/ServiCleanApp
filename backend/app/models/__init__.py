# Importar todos los modelos aquí para que Alembic los detecte automáticamente
from app.models.usuario import Usuario, RolUsuario
from app.models.colaborador import Colaborador, Disponibilidad
from app.models.reserva import Reserva, EstadoReserva
from app.models.resena import Resena
from app.models.notificacion import Notificacion, TipoNotificacion
from app.models.direccion import Direccion

__all__ = [
    "Usuario",
    "RolUsuario",
    "Colaborador",
    "Disponibilidad",
    "Reserva",
    "EstadoReserva",
    "Resena",
    "Notificacion",
    "TipoNotificacion",
    "Direccion",
]
