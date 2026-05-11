from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, usuarios, colaboradores, reservas, resenas, notificaciones, admin

app = FastAPI(
    title="ServiClean API",
    description="Backend para la plataforma de servicios domésticos ServiClean S.A.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(colaboradores.router)
app.include_router(reservas.router)
app.include_router(resenas.router)
app.include_router(notificaciones.router)
app.include_router(admin.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "app": "ServiClean API", "version": "1.0.0"}
