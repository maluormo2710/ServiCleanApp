/**
 * api.ts — Servicio centralizado para consumir la ServiClean API
 *
 * Uso:
 *   import { api } from './services/api';
 *   const colaboradores = await api.colaboradores.listar();
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── Tipos de respuesta ────────────────────────────────────────────────────

export type Rol = "admin" | "colaborador" | "cliente";

export interface TokenResponse {
  access_token: string;
  token_type: string;
  rol: Rol;
  nombre: string;
  usuario_id: number;
}

export interface UsuarioOut {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  rol: Rol;
  activo: boolean;
  created_at: string;
}

export interface ColaboradorListItem {
  id: number;
  nombre: string;
  especialidad: string;
  calificacion_promedio: number;
  servicios_completados: number;
  tarifa_hora: number;
  avatar_url?: string;
}

export interface ResenaOut {
  id: number;
  reserva_id?: number;
  autor_nombre: string;   // used in both ColaboradorOut.resenas and standalone
  calificacion: number;
  comentario?: string;
  fecha?: string;         // field in ColaboradorOut.resenas schema
  created_at?: string;    // field in standalone resena schema
}

export interface ColaboradorOut extends ColaboradorListItem {
  bio?: string;
  resenas: ResenaOut[];
}

export interface ReservaOut {
  id: number;
  fecha: string;
  hora: string;
  tipo_servicio: string;
  direccion: string;
  duracion_horas: number;
  precio: number;
  estado: "Pendiente" | "Confirmada" | "En Curso" | "Finalizado" | "Cancelado";
  tareas?: string[];
  comentarios_cliente?: string;
  created_at: string;
  colaborador_nombre: string;
  colaborador_avatar?: string;
  cliente_nombre: string;
  tiene_resena: boolean;
}

export interface NotificacionOut {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: "reserva" | "recordatorio" | "pago" | "promo";
  leida: boolean;
  created_at: string;
}

export interface MetricasOut {
  total_reservas_mes: number;
  reservas_completadas_mes: number;
  usuarios_activos: number;
  promedio_calificacion_global: number;
  ingresos_retenidos: number;
}

// ─── Auth helpers ──────────────────────────────────────────────────────────

const TOKEN_KEY = "serviclean_token";
const USER_KEY = "serviclean_user";

export const authStorage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getUser: (): TokenResponse | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: TokenResponse) =>
    localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ─── Fetcher base ──────────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { auth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (auth) {
    const token = authStorage.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    const message = data?.detail || `Error ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

// ─── Módulos de la API ─────────────────────────────────────────────────────

export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────
  auth: {
    login: (email: string, password: string): Promise<TokenResponse> =>
      apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        auth: false,
      }),

    registro: (body: {
      nombre: string;
      email: string;
      password: string;
      telefono?: string;
      rol?: Rol;
    }): Promise<TokenResponse> =>
      apiFetch("/api/auth/registro", {
        method: "POST",
        body: JSON.stringify(body),
        auth: false,
      }),

    me: (): Promise<UsuarioOut> => apiFetch("/api/auth/me"),
  },

  // ── Colaboradores ─────────────────────────────────────────────────────
  colaboradores: {
    listar: (params?: {
      especialidad?: string;
      fecha?: string;
      min_calificacion?: number;
    }): Promise<ColaboradorListItem[]> => {
      const qs = new URLSearchParams();
      if (params?.especialidad) qs.set("especialidad", params.especialidad);
      if (params?.fecha) qs.set("fecha", params.fecha);
      if (params?.min_calificacion != null)
        qs.set("min_calificacion", String(params.min_calificacion));
      const query = qs.toString() ? `?${qs}` : "";
      return apiFetch(`/api/colaboradores${query}`, { auth: false });
    },

    obtener: (id: number): Promise<ColaboradorOut> =>
      apiFetch(`/api/colaboradores/${id}`, { auth: false }),
  },

  // ── Reservas ──────────────────────────────────────────────────────────
  reservas: {
    crear: (body: {
      colaborador_id: number;
      fecha: string;
      hora: string;
      tipo_servicio: string;
      direccion: string;
      duracion_horas?: number;
      precio: number;
      tareas?: string[];
      comentarios_cliente?: string;
    }): Promise<ReservaOut> =>
      apiFetch("/api/reservas", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    misReservas: (): Promise<ReservaOut[]> =>
      apiFetch("/api/reservas/mis-reservas"),

    obtener: (id: number): Promise<ReservaOut> =>
      apiFetch(`/api/reservas/${id}`),

    cambiarEstado: (
      id: number,
      estado: ReservaOut["estado"]
    ): Promise<ReservaOut> =>
      apiFetch(`/api/reservas/${id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
      }),

    cancelar: (id: number): Promise<void> =>
      apiFetch(`/api/reservas/${id}`, { method: "DELETE" }),
  },

  // ── Reseñas ───────────────────────────────────────────────────────────
  resenas: {
    crear: (body: {
      reserva_id: number;
      calificacion: number;
      comentario?: string;
    }): Promise<ResenaOut> =>
      apiFetch("/api/resenas", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    deColaborador: (colaboradorId: number): Promise<ResenaOut[]> =>
      apiFetch(`/api/resenas/colaborador/${colaboradorId}`, { auth: false }),
  },

  // ── Notificaciones ────────────────────────────────────────────────────
  notificaciones: {
    listar: (): Promise<NotificacionOut[]> => apiFetch("/api/notificaciones"),

    marcarLeida: (id: number): Promise<NotificacionOut> =>
      apiFetch(`/api/notificaciones/${id}/leer`, { method: "PATCH" }),

    marcarTodasLeidas: (): Promise<void> =>
      apiFetch("/api/notificaciones/leer-todas", { method: "PATCH" }),
  },

  // ── Admin ─────────────────────────────────────────────────────────────
  admin: {
    metricas: (): Promise<MetricasOut> => apiFetch("/api/admin/metricas"),

    topColaboradores: (limit?: number): Promise<ColaboradorListItem[]> => {
      const q = limit ? `?limit=${limit}` : "";
      return apiFetch(`/api/admin/top-colaboradores${q}`);
    },

    reservas: (): Promise<ReservaOut[]> => apiFetch("/api/admin/reservas"),

    usuarios: (): Promise<UsuarioOut[]> => apiFetch("/api/admin/usuarios"),

    cambiarEstadoUsuario: (
      id: number,
      activo: boolean
    ): Promise<UsuarioOut> =>
      apiFetch(`/api/usuarios/${id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ activo }),
      }),
  },

  // ── Usuarios ──────────────────────────────────────────────────────────
  usuarios: {
    actualizar: (
      id: number,
      body: { nombre?: string; telefono?: string }
    ): Promise<UsuarioOut> =>
      apiFetch(`/api/usuarios/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
  },
};
