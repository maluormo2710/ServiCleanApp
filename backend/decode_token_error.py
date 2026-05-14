from app.utils.security import settings
from jose import jwt, JWTError
import sys

token = sys.argv[1]
try:
    payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    print("Success:", payload)
except Exception as e:
    print("Error type:", type(e))
    print("Error:", e)
