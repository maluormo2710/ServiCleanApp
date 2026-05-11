from datetime import datetime
from pydantic import BaseModel
from app.models.notificacion import TipoNotificacion


class NotificacionOut(BaseModel):
    id: int
    titulo: str
    descripcion: str
    tipo: TipoNotificacion
    leida: bool
    created_at: datetime

    model_config = {"from_attributes": True}
