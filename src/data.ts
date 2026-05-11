export interface Resena {
  id: number;
  autor: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

export interface Colaborador {
  id: number;
  nombre: string;
  especialidad: string;
  calificacion: number;
  serviciosCompletados: number;
  tarifaHora: number;
  bio: string;
  avatarUrl: string;
  resenas?: Resena[];
  galeria?: string[];
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
    avatarUrl: "https://i.pravatar.cc/150?u=elena",
    resenas: [
      { id: 1, autor: "María P.", calificacion: 5, comentario: "Excelente trabajo, muy detallista y cuidadosa con mis muebles.", fecha: "Hace 2 días" },
      { id: 2, autor: "Juan C.", calificacion: 4.8, comentario: "Llegó puntual y dejó todo impecable. Muy recomendada.", fecha: "Hace 1 semana" }
    ],
    galeria: [
      "https://picsum.photos/seed/elena1/400/300",
      "https://picsum.photos/seed/elena2/400/300",
      "https://picsum.photos/seed/elena3/400/300",
      "https://picsum.photos/seed/elena4/400/300"
    ]
  },
  {
    id: 2,
    nombre: "Carlos Gómez",
    especialidad: "Limpieza Post-Construcción",
    calificacion: 4.7,
    serviciosCompletados: 85,
    tarifaHora: 65,
    bio: "Experto en remover polvo fino y residuos de obra. Deja tu nuevo espacio listo para habitar sin rastro de construcción.",
    avatarUrl: "https://i.pravatar.cc/150?u=carlos",
    resenas: [
      { id: 3, autor: "Andrés M.", calificacion: 5, comentario: "Increíble cómo quitó todo el polvo de la obra. Salvó mi mudanza.", fecha: "Hace 3 días" },
      { id: 4, autor: "Laura S.", calificacion: 4.5, comentario: "Buen servicio, muy rápido y eficiente.", fecha: "Hace 2 semanas" }
    ],
    galeria: [
      "https://picsum.photos/seed/carlos1/400/300",
      "https://picsum.photos/seed/carlos2/400/300",
      "https://picsum.photos/seed/carlos3/400/300"
    ]
  },
  {
    id: 3,
    nombre: "Sofía Chen",
    especialidad: "Desinfección Profunda y Sostenible",
    calificacion: 4.8,
    serviciosCompletados: 210,
    tarifaHora: 40,
    bio: "Utiliza exclusivamente productos orgánicos de grado hospitalario, garantizando un ambiente inmaculado y libre de tóxicos.",
    avatarUrl: "https://i.pravatar.cc/150?u=sofia",
    resenas: [
      { id: 5, autor: "Diana R.", calificacion: 5, comentario: "Me encanta que use productos ecológicos. Mi casa huele a limpio sin químicos.", fecha: "Hace 1 día" },
      { id: 6, autor: "Roberto T.", calificacion: 4.9, comentario: "Muy profesional y amable. Definitivamente la volveré a contratar.", fecha: "Hace 1 mes" }
    ],
    galeria: [
      "https://picsum.photos/seed/sofia1/400/300",
      "https://picsum.photos/seed/sofia2/400/300",
      "https://picsum.photos/seed/sofia3/400/300"
    ]
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    especialidad: "Organización de Espacios",
    calificacion: 4.9,
    serviciosCompletados: 340,
    tarifaHora: 50,
    bio: "Certificada en métodos de organización profesional. Optimiza cada rincón de tu hogar para máxima funcionalidad y estética.",
    avatarUrl: "https://i.pravatar.cc/150?u=ana",
    resenas: [
      { id: 7, autor: "Camila L.", calificacion: 5, comentario: "Mi clóset nunca se había visto tan ordenado. ¡Es magia!", fecha: "Hace 5 días" }
    ],
    galeria: [
      "https://picsum.photos/seed/ana1/400/300",
      "https://picsum.photos/seed/ana2/400/300"
    ]
  },
  {
    id: 5,
    nombre: "Diego Silva",
    especialidad: "Mantenimiento de Exteriores y Terrazas",
    calificacion: 4.6,
    serviciosCompletados: 92,
    tarifaHora: 45,
    bio: "Especialista en limpieza de fachadas, terrazas y mobiliario exterior. Devuelve la vida a tus espacios al aire libre.",
    avatarUrl: "https://i.pravatar.cc/150?u=diego",
    resenas: [
      { id: 8, autor: "Fernando G.", calificacion: 4.5, comentario: "Dejó mi terraza lista para el verano. Muy buen trabajo.", fecha: "Hace 2 meses" }
    ],
    galeria: [
      "https://picsum.photos/seed/diego1/400/300",
      "https://picsum.photos/seed/diego2/400/300",
      "https://picsum.photos/seed/diego3/400/300"
    ]
  },
  {
    id: 6,
    nombre: "Laura Ríos",
    especialidad: "Cuidado de Superficies Premium",
    calificacion: 5.0,
    serviciosCompletados: 156,
    tarifaHora: 70,
    bio: "Experta en el tratamiento y cuidado de mármol, granito y maderas finas. Protege tu inversión con limpieza especializada.",
    avatarUrl: "https://i.pravatar.cc/150?u=laura",
    resenas: [
      { id: 9, autor: "Patricia V.", calificacion: 5, comentario: "Mis pisos de mármol quedaron como nuevos. Excelente profesional.", fecha: "Hace 1 semana" },
      { id: 10, autor: "Héctor B.", calificacion: 5, comentario: "Vale cada centavo. Muy cuidadosa con los detalles.", fecha: "Hace 3 semanas" }
    ],
    galeria: [
      "https://picsum.photos/seed/laura1/400/300",
      "https://picsum.photos/seed/laura2/400/300"
    ]
  },
  {
    id: 7,
    nombre: "Miguel Torres",
    especialidad: "Limpieza Express y Eventos",
    calificacion: 4.7,
    serviciosCompletados: 420,
    tarifaHora: 35,
    bio: "Rápido, eficiente y detallista. Ideal para dejar tu casa impecable antes o después de una reunión importante.",
    avatarUrl: "https://i.pravatar.cc/150?u=miguel",
    resenas: [
      { id: 11, autor: "Silvia C.", calificacion: 4.8, comentario: "Me salvó después de una fiesta. Rápido y dejó todo perfecto.", fecha: "Hace 4 días" }
    ],
    galeria: [
      "https://picsum.photos/seed/miguel1/400/300",
      "https://picsum.photos/seed/miguel2/400/300",
      "https://picsum.photos/seed/miguel3/400/300"
    ]
  }
];
