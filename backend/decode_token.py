from app.utils.security import decode_access_token
import sys

token = sys.argv[1]
print("Payload:", decode_access_token(token))
