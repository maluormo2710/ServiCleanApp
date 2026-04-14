export interface Colaborador {
  id: number;
  nombre: string;
  especialidad: string;
  calificacion: number;
  serviciosCompletados: number;
  tarifaHora: number;
  bio: string;
  avatarUrl: string;
}

export const dbColaboradores: Colaborador[] = [
  {
    id: 1,
    nombre: "Elena Valdez",
    especialidad: "Especialista en Fibras Delicadas",
    calificacion: 4.9,
    serviciosCompletados: 128,
    tarifaHora: 55,
    bio: "Especializada en el método de organización minimalista. Transforma espacios caóticos en santuarios de paz visual.",
    avatarUrl: "https://i.pravatar.cc/150?u=elena"
  },
  {
    id: 2,
    nombre: "Carlos Gómez",
    especialidad: "Limpieza Post-Construcción",
    calificacion: 4.7,
    serviciosCompletados: 85,
    tarifaHora: 65,
    bio: "Experto en remover polvo fino y residuos de obra. Deja tu nuevo espacio listo para habitar sin rastro de construcción.",
    avatarUrl: "https://i.pravatar.cc/150?u=carlos"
  },
  {
    id: 3,
    nombre: "Sofía Chen",
    especialidad: "Desinfección Profunda y Sostenible",
    calificacion: 4.8,
    serviciosCompletados: 210,
    tarifaHora: 40,
    bio: "Utiliza exclusivamente productos orgánicos de grado hospitalario, garantizando un ambiente inmaculado y libre de tóxicos.",
    avatarUrl: "https://i.pravatar.cc/150?u=sofia"
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    especialidad: "Organización de Espacios",
    calificacion: 4.9,
    serviciosCompletados: 340,
    tarifaHora: 50,
    bio: "Certificada en métodos de organización profesional. Optimiza cada rincón de tu hogar para máxima funcionalidad y estética.",
    avatarUrl: "https://i.pravatar.cc/150?u=ana"
  },
  {
    id: 5,
    nombre: "Diego Silva",
    especialidad: "Mantenimiento de Exteriores y Terrazas",
    calificacion: 4.6,
    serviciosCompletados: 92,
    tarifaHora: 45,
    bio: "Especialista en limpieza de fachadas, terrazas y mobiliario exterior. Devuelve la vida a tus espacios al aire libre.",
    avatarUrl: "https://i.pravatar.cc/150?u=diego"
  },
  {
    id: 6,
    nombre: "Laura Ríos",
    especialidad: "Cuidado de Superficies Premium",
    calificacion: 5.0,
    serviciosCompletados: 156,
    tarifaHora: 70,
    bio: "Experta en el tratamiento y cuidado de mármol, granito y maderas finas. Protege tu inversión con limpieza especializada.",
    avatarUrl: "https://i.pravatar.cc/150?u=laura"
  },
  {
    id: 7,
    nombre: "Miguel Torres",
    especialidad: "Limpieza Express y Eventos",
    calificacion: 4.7,
    serviciosCompletados: 420,
    tarifaHora: 35,
    bio: "Rápido, eficiente y detallista. Ideal para dejar tu casa impecable antes o después de una reunión importante.",
    avatarUrl: "https://i.pravatar.cc/150?u=miguel"
  }
];
