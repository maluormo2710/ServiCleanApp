# ServiClean Backend — Guía de Setup

## Prerrequisitos completados
- Python 3.13.7
- Dependencias instaladas en `venv/`
- Código backend completo

---

## PASO 1 — Configurar MySQL Workbench

Al abrir MySQL Workbench, si no tienes una conexión:

1. Haz clic en el **"+"** junto a "MySQL Connections"
2. Configura:
   - **Connection Name:** `ServiClean Local`
   - **Hostname:** `127.0.0.1`
   - **Port:** `3306`
   - **Username:** `root`
   - **Password:** haz clic en `Store in Vault...` y escribe tu contraseña (si instalaste MySQL sin contraseña, déjalo vacío)
3. Haz clic en **Test Connection** → debe decir "Successfully made the MySQL connection"
4. Haz clic en **OK**

---

## PASO 2 — Crear la base de datos

Una vez conectado en MySQL Workbench, en el panel SQL ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS serviclean_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Haz clic en el rayo ⚡ (Execute) o presiona **Ctrl+Enter**.

---

## PASO 3 — Actualizar el .env

Abre `backend/.env` y actualiza con tu contraseña real:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_CONTRASEÑA_AQUI   ← cambia esto
DB_NAME=serviclean_db
```

> Si MySQL no tiene contraseña, déjalo: `DB_PASSWORD=`

---

## PASO 4 — Ejecutar el seed (crea tablas + datos iniciales)

Abre una terminal en la carpeta `backend/` y ejecuta:

```powershell
.\venv\Scripts\python seed.py
```

Si todo sale bien verás:
```
Creando tablas en la base de datos...
Tablas creadas.
Datos anteriores eliminados.
  Colaborador creado: Elena Valdez
  ... (7 colaboradores)
Seed completado exitosamente.

Credenciales de prueba:
   Admin      → admin@serviclean.com      / Admin1234!
   Cliente    → cliente@serviclean.com    / Cliente1234!
   Colaborador → elena@serviclean.com     / Colab1234!
```

---

## PASO 5 — Iniciar el servidor

```powershell
.\venv\Scripts\uvicorn app.main:app --reload --port 8000
```

El backend estará disponible en:
- **API:** http://localhost:8000
- **Swagger UI:** http://localhost:8000/docs  ← para probar todos los endpoints

---

## Estructura de carpetas creada

```
backend/
├── app/
│   ├── main.py              ← Punto de entrada FastAPI
│   ├── config.py            ← Configuración desde .env
│   ├── database.py          ← SQLAlchemy engine + session
│   ├── dependencies.py      ← get_current_user, require_role
│   ├── models/              ← Tablas de BD (ORM)
│   │   ├── usuario.py       ← Roles: admin, colaborador, cliente
│   │   ├── colaborador.py   ← Perfil + disponibilidad
│   │   ├── reserva.py       ← Reservas con estados
│   │   ├── resena.py        ← Calificaciones (1-5 estrellas)
│   │   ├── notificacion.py  ← Notificaciones push
│   │   └── direccion.py     ← Direcciones guardadas
│   ├── schemas/             ← Validación Pydantic (I/O)
│   ├── routers/             ← Endpoints agrupados
│   │   ├── auth.py          ← /api/auth/*
│   │   ├── usuarios.py      ← /api/usuarios/*
│   │   ├── colaboradores.py ← /api/colaboradores/*
│   │   ├── reservas.py      ← /api/reservas/*
│   │   ├── resenas.py       ← /api/resenas/*
│   │   ├── notificaciones.py← /api/notificaciones/*
│   │   └── admin.py         ← /api/admin/*
│   └── utils/
│       └── security.py      ← bcrypt + JWT
├── seed.py                  ← Datos iniciales
├── requirements.txt
└── .env                     ← Configuración local
```

---

## Endpoints disponibles (resumen)

| Módulo | Ruta base | Descripción |
|---|---|---|
| Auth | `/api/auth` | Registro, Login, /me |
| Usuarios | `/api/usuarios` | CRUD perfiles |
| Colaboradores | `/api/colaboradores` | Listado, detalle, disponibilidad |
| Reservas | `/api/reservas` | Crear, historial, estados |
| Reseñas | `/api/resenas` | Calificar servicios finalizados |
| Notificaciones | `/api/notificaciones` | Listar, marcar leídas |
| Admin | `/api/admin` | Métricas, rankings, gestión |
