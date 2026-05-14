from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.usuario import Usuario, RolUsuario
from app.utils.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Usuario:
    """
    Dependency que valida el JWT y retorna el usuario autenticado.
    Lanza 401 si el token es inválido o el usuario no existe / está inactivo.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    usuario = db.query(Usuario).filter(
        Usuario.id == int(user_id),
        Usuario.activo == True,
    ).first()

    if usuario is None:
        raise credentials_exception

    return usuario


def require_role(*roles: RolUsuario):
    """
    Dependency factory que exige que el usuario tenga uno de los roles indicados.
    Uso: Depends(require_role(RolUsuario.admin))
    """
    def _check(current_user: Usuario = Depends(get_current_user)) -> Usuario:
        if current_user.rol not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para realizar esta acción.",
            )
        return current_user
    return _check
