"""
seed.py — Datos iniciales para ServiClean
Ejecutar: python seed.py (desde la carpeta backend/)

Crea:
  - 1 usuario Admin
  - 1 usuario Cliente de prueba
  - 7 Colaboradores (los mismos del prototipo frontend)
"""
import sys
import os

# Forzar UTF-8 en la salida estándar (necesario en Windows para emojis)
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")
if sys.stderr.encoding != "utf-8":
    sys.stderr.reconfigure(encoding="utf-8")

# Asegurar que la raíz del backend esté en el path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import Base, engine, SessionLocal
from app.models import (
    Usuario, RolUsuario,
    Colaborador,
    Resena,
)
from app.utils.security import hash_password

# ─── Crear todas las tablas ───────────────────────────────────────────────────
print("⚙️  Creando tablas en la base de datos...")
Base.metadata.create_all(bind=engine)
print("✅ Tablas creadas.")

db = SessionLocal()

try:
    # ─── Limpiar datos previos (para re-ejecución segura) ─────────────────────
    db.query(Resena).delete()
    db.query(Colaborador).delete()
    db.query(Usuario).delete()
    db.commit()
    print("🗑️  Datos anteriores eliminados.")

    # ─── Admin ────────────────────────────────────────────────────────────────
    admin = Usuario(
        nombre="Administrador ServiClean",
        email="admin@serviclean.com",
        password_hash=hash_password("Admin1234!"),
        telefono="+57 300 000 0000",
        rol=RolUsuario.admin,
    )
    db.add(admin)

    # ─── Cliente de prueba ────────────────────────────────────────────────────
    cliente = Usuario(
        nombre="Juan Pérez",
        email="cliente@serviclean.com",
        password_hash=hash_password("Cliente1234!"),
        telefono="+57 310 111 2222",
        rol=RolUsuario.cliente,
    )
    db.add(cliente)
    db.flush()

    # ─── Colaboradores (datos del frontend data.ts) ───────────────────────────
    colaboradores_data = [
        {
            "nombre": "Elena Valdez",
            "email": "elena@serviclean.com",
            "especialidad": "Especialista en Fibras Delicadas",
            "bio": "Especializada en el método de organización minimalista. Transforma espacios caóticos en santuarios de paz visual.",
            "tarifa_hora": 55.0,
            "avatar_url": "https://i.pravatar.cc/150?u=elena",
            "servicios_completados": 128,
            "calificacion_promedio": 4.9,
        },
        {
            "nombre": "Carlos Gómez",
            "email": "carlos@serviclean.com",
            "especialidad": "Limpieza Post-Construcción",
            "bio": "Experto en remover polvo fino y residuos de obra. Deja tu nuevo espacio listo para habitar sin rastro de construcción.",
            "tarifa_hora": 65.0,
            "avatar_url": "https://i.pravatar.cc/150?u=carlos",
            "servicios_completados": 85,
            "calificacion_promedio": 4.7,
        },
        {
            "nombre": "Sofía Chen",
            "email": "sofia@serviclean.com",
            "especialidad": "Desinfección Profunda y Sostenible",
            "bio": "Utiliza exclusivamente productos orgánicos de grado hospitalario, garantizando un ambiente inmaculado y libre de tóxicos.",
            "tarifa_hora": 40.0,
            "avatar_url": "https://i.pravatar.cc/150?u=sofia",
            "servicios_completados": 210,
            "calificacion_promedio": 4.8,
        },
        {
            "nombre": "Ana Martínez",
            "email": "ana@serviclean.com",
            "especialidad": "Organización de Espacios",
            "bio": "Certificada en métodos de organización profesional. Optimiza cada rincón de tu hogar para máxima funcionalidad y estética.",
            "tarifa_hora": 50.0,
            "avatar_url": "https://i.pravatar.cc/150?u=ana",
            "servicios_completados": 340,
            "calificacion_promedio": 4.9,
        },
        {
            "nombre": "Diego Silva",
            "email": "diego@serviclean.com",
            "especialidad": "Mantenimiento de Exteriores y Terrazas",
            "bio": "Especialista en limpieza de fachadas, terrazas y mobiliario exterior. Devuelve la vida a tus espacios al aire libre.",
            "tarifa_hora": 45.0,
            "avatar_url": "https://i.pravatar.cc/150?u=diego",
            "servicios_completados": 92,
            "calificacion_promedio": 4.6,
        },
        {
            "nombre": "Laura Ríos",
            "email": "laura@serviclean.com",
            "especialidad": "Cuidado de Superficies Premium",
            "bio": "Experta en el tratamiento y cuidado de mármol, granito y maderas finas. Protege tu inversión con limpieza especializada.",
            "tarifa_hora": 70.0,
            "avatar_url": "https://i.pravatar.cc/150?u=laura",
            "servicios_completados": 156,
            "calificacion_promedio": 5.0,
        },
        {
            "nombre": "Miguel Torres",
            "email": "miguel@serviclean.com",
            "especialidad": "Limpieza Express y Eventos",
            "bio": "Rápido, eficiente y detallista. Ideal para dejar tu casa impecable antes o después de una reunión importante.",
            "tarifa_hora": 35.0,
            "avatar_url": "https://i.pravatar.cc/150?u=miguel",
            "servicios_completados": 420,
            "calificacion_promedio": 4.7,
        },
    ]

    for data in colaboradores_data:
        usuario = Usuario(
            nombre=data["nombre"],
            email=data["email"],
            password_hash=hash_password("Colab1234!"),
            rol=RolUsuario.colaborador,
        )
        db.add(usuario)
        db.flush()

        perfil = Colaborador(
            usuario_id=usuario.id,
            especialidad=data["especialidad"],
            bio=data["bio"],
            tarifa_hora=data["tarifa_hora"],
            avatar_url=data["avatar_url"],
            servicios_completados=data["servicios_completados"],
            calificacion_promedio=data["calificacion_promedio"],
        )
        db.add(perfil)
        print(f"  ✔ Colaborador creado: {data['nombre']}")

    db.commit()
    print("\n🎉 Seed completado exitosamente.")
    print("\n📋 Credenciales de prueba:")
    print("   Admin      → admin@serviclean.com      / Admin1234!")
    print("   Cliente    → cliente@serviclean.com    / Cliente1234!")
    print("   Colaborador → elena@serviclean.com     / Colab1234!")
    print("   (Todos los colaboradores usan la contraseña: Colab1234!)")

except Exception as e:
    db.rollback()
    print(f"❌ Error durante el seed: {e}")
    raise
finally:
    db.close()
