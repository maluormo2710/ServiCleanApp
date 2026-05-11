-- ================================================================
-- SERVICLEAN — Base de datos de gestión de reservas
-- Motor   : MySQL / MariaDB
-- Charset : utf8mb4 (soporte completo Unicode / emojis)
-- ================================================================

CREATE DATABASE IF NOT EXISTS serviclean
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE serviclean;

-- ----------------------------------------------------------------
-- TABLA: roles
-- Catálogo de los tres tipos de actor del sistema.
-- ----------------------------------------------------------------
CREATE TABLE roles (
  id          TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(30)      NOT NULL,
  descripcion VARCHAR(100),
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_nombre (nombre)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- TABLA: usuarios
-- Entidad base compartida por clientes, colaboradores y admins.
-- La contraseña NUNCA se guarda en texto plano (RNF-01).
-- ----------------------------------------------------------------
CREATE TABLE usuarios (
  id              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  rol_id          TINYINT UNSIGNED NOT NULL,
  nombre          VARCHAR(80)      NOT NULL,
  apellido        VARCHAR(80)      NOT NULL,
  correo          VARCHAR(150)     NOT NULL,
  contrasena_hash VARCHAR(255)     NOT NULL,   -- bcrypt / Argon2
  telefono        VARCHAR(20),
  foto_url        VARCHAR(500),
  activo          TINYINT(1)       NOT NULL DEFAULT 1,
  created_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                             ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_correo (correo),
  KEY fk_usuarios_rol (rol_id),
  CONSTRAINT fk_usuarios_rol
    FOREIGN KEY (rol_id) REFERENCES roles (id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- TABLA: colaboradores
-- Perfil extendido de las empleadas domésticas (HU03 / RF-03).
-- ----------------------------------------------------------------
CREATE TABLE colaboradores (
  id                   INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  usuario_id           INT UNSIGNED   NOT NULL,
  descripcion          TEXT,
  ciudad               VARCHAR(100),
  promedio_calificacion DECIMAL(3,2)  NOT NULL DEFAULT 0.00,
  total_servicios      INT UNSIGNED   NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_colaboradores_usuario (usuario_id),
  CONSTRAINT fk_colaboradores_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- TABLA: habilidades
-- Catálogo de competencias que puede tener una colaboradora.
-- ----------------------------------------------------------------
CREATE TABLE habilidades (
  id          SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(80)       NOT NULL,
  descripcion VARCHAR(200),
  PRIMARY KEY (id),
  UNIQUE KEY uq_habilidades_nombre (nombre)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- TABLA: colaborador_habilidades  (N:M)
-- Relaciona colaboradoras con sus habilidades (HU01 / RF-01).
-- ----------------------------------------------------------------
CREATE TABLE colaborador_habilidades (
  colaborador_id INT UNSIGNED      NOT NULL,
  habilidad_id   SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (colaborador_id, habilidad_id),
  CONSTRAINT fk_colhab_colaborador
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores (id),
  CONSTRAINT fk_colhab_habilidad
    FOREIGN KEY (habilidad_id)   REFERENCES habilidades (id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- TABLA: disponibilidad
-- Franjas horarias en que cada colaboradora puede ser reservada.
-- Soporta múltiples bloques por día (HU01 / RF-01 / CU-Busqueda).
-- ----------------------------------------------------------------
CREATE TABLE disponibilidad (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  colaborador_id INT UNSIGNED NOT NULL,
  dia_semana     ENUM('lunes','martes','miercoles','jueves',
                      'viernes','sabado','domingo') NOT NULL,
  hora_inicio    TIME         NOT NULL,
  hora_fin       TIME         NOT NULL,
  activo         TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY fk_disp_colaborador (colaborador_id),
  CONSTRAINT fk_disp_colaborador
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores (id),
  CONSTRAINT chk_disp_horas
    CHECK (hora_fin > hora_inicio)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- TABLA: reservas
-- Núcleo del sistema. Registra cada solicitud de servicio.
-- El estado sigue el ciclo: pendiente → confirmada →
--   en_progreso → finalizada  (o cancelada en cualquier paso).
-- ----------------------------------------------------------------
CREATE TABLE reservas (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  cliente_id         INT UNSIGNED NOT NULL,
  colaborador_id     INT UNSIGNED NOT NULL,
  fecha_servicio     DATE         NOT NULL,
  hora_inicio        TIME         NOT NULL,
  hora_fin           TIME         NOT NULL,
  direccion          VARCHAR(300) NOT NULL,
  notas              TEXT,
  estado             ENUM('pendiente','confirmada','en_progreso',
                          'finalizada','cancelada')
                                  NOT NULL DEFAULT 'pendiente',
  motivo_cancelacion VARCHAR(300),
  created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                           ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY fk_reservas_cliente     (cliente_id),
  KEY fk_reservas_colaborador (colaborador_id),
  KEY idx_reservas_fecha      (fecha_servicio),
  KEY idx_reservas_estado     (estado),
  CONSTRAINT fk_reservas_cliente
    FOREIGN KEY (cliente_id)     REFERENCES usuarios     (id),
  CONSTRAINT fk_reservas_colaborador
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores (id),
  CONSTRAINT chk_reservas_horas
    CHECK (hora_fin > hora_inicio)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- TABLA: pagos
-- Detalle completo de cada transacción (RF-09 / HU08).
-- Retiene fondos hasta que la reserva pasa a "finalizada".
-- NUNCA almacenar número de tarjeta completo ni CVV.
-- ----------------------------------------------------------------
CREATE TABLE pagos (
  id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  reserva_id          INT UNSIGNED    NOT NULL,
  monto               DECIMAL(12,2)   NOT NULL,
  moneda              CHAR(3)         NOT NULL DEFAULT 'COP',
  metodo_pago         ENUM('tarjeta_credito','tarjeta_debito',
                           'pse','nequi','daviplata') NOT NULL,
  estado              ENUM('retenido','capturado',
                           'reembolsado','fallido')
                                       NOT NULL DEFAULT 'retenido',
  -- Referencia segura de tarjeta (tokenización PCI-DSS)
  ultimos4_tarjeta    CHAR(4),
  marca_tarjeta       VARCHAR(20),        -- Visa, Mastercard, Amex…
  nombre_titular      VARCHAR(150),
  -- Trazabilidad con la pasarela (PayU, Stripe, Wompi…)
  referencia_externa  VARCHAR(200),       -- ID de la pasarela
  codigo_autorizacion VARCHAR(100),
  -- Fechas clave del ciclo de vida del pago
  fecha_transaccion   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_captura       TIMESTAMP       NULL,
  fecha_reembolso     TIMESTAMP       NULL,
  descripcion_fallo   VARCHAR(300),
  created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                               ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY fk_pagos_reserva        (reserva_id),
  KEY idx_pagos_estado        (estado),
  KEY idx_pagos_referencia    (referencia_externa),
  CONSTRAINT fk_pagos_reserva
    FOREIGN KEY (reserva_id) REFERENCES reservas (id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- TABLA: calificaciones
-- El cliente califica una reserva finalizada (HU02 / RF-02).
-- Una reserva solo puede recibir una calificación (UNIQUE).
-- ----------------------------------------------------------------
CREATE TABLE calificaciones (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  reserva_id     INT UNSIGNED NOT NULL,
  cliente_id     INT UNSIGNED NOT NULL,
  colaborador_id INT UNSIGNED NOT NULL,
  puntuacion     TINYINT UNSIGNED NOT NULL,   -- 1 a 5
  comentario     TEXT,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_calificaciones_reserva (reserva_id),
  KEY fk_cal_cliente     (cliente_id),
  KEY fk_cal_colaborador (colaborador_id),
  CONSTRAINT fk_cal_reserva
    FOREIGN KEY (reserva_id)     REFERENCES reservas      (id),
  CONSTRAINT fk_cal_cliente
    FOREIGN KEY (cliente_id)     REFERENCES usuarios      (id),
  CONSTRAINT fk_cal_colaborador
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores (id),
  CONSTRAINT chk_cal_puntuacion
    CHECK (puntuacion BETWEEN 1 AND 5)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- TABLA: notificaciones
-- Alertas push/in-app para clientes y colaboradoras (HU06 / RF-07).
-- ----------------------------------------------------------------
CREATE TABLE notificaciones (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id  INT UNSIGNED NOT NULL,
  reserva_id  INT UNSIGNED,                  -- nullable: algunas notif. son de sistema
  tipo        ENUM('confirmacion_reserva','recordatorio_24h',
                   'cancelacion','pago_retenido','pago_capturado',
                   'nueva_calificacion','sistema') NOT NULL,
  titulo      VARCHAR(150) NOT NULL,
  mensaje     TEXT         NOT NULL,
  leida       TINYINT(1)   NOT NULL DEFAULT 0,
  fecha_envio TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY fk_noti_usuario (usuario_id),
  KEY fk_noti_reserva (reserva_id),
  KEY idx_noti_leida  (leida),
  CONSTRAINT fk_noti_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
  CONSTRAINT fk_noti_reserva
    FOREIGN KEY (reserva_id) REFERENCES reservas (id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------
-- TABLA: reportes_cache
-- Snapshots pre-calculados para el panel de administradores
-- (HU07 / RF-08 / CU-Generacion-Reportes).
-- ----------------------------------------------------------------
CREATE TABLE reportes_cache (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  generado_por  INT UNSIGNED NOT NULL,
  tipo          ENUM('reservas_mensuales','top_colaboradoras',
                     'calificaciones_promedio','ingresos') NOT NULL,
  periodo_inicio DATE         NOT NULL,
  periodo_fin    DATE         NOT NULL,
  datos          JSON         NOT NULL,       -- resultado serializado
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY fk_rep_admin (generado_por),
  CONSTRAINT fk_rep_admin
    FOREIGN KEY (generado_por) REFERENCES usuarios (id)
) ENGINE=InnoDB;

-- ================================================================
-- DATOS SEMILLA
-- ================================================================

-- Roles del sistema (RF-04)
INSERT INTO roles (nombre, descripcion) VALUES
  ('admin',       'Administrador con acceso total al sistema'),
  ('colaborador', 'Empleada doméstica que ofrece sus servicios'),
  ('cliente',     'Usuario que contrata servicios domésticos');

-- Habilidades comunes (RF-01)
INSERT INTO habilidades (nombre) VALUES
  ('Limpieza general'),
  ('Limpieza profunda'),
  ('Planchado'),
  ('Cocina'),
  ('Cuidado de niños'),
  ('Cuidado de adultos mayores'),
  ('Lavado de ropa'),
  ('Organización del hogar');
  