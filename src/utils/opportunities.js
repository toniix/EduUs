// Datos de ejemplo
export const opportunitiesData = [
  {
    id: 1,
    title: "Beca Completa para Estudios en el Extranjero",
    organization: "Fundación Educativa Internacional",
    description:
      "Beca completa para estudiar un año académico en universidades de Europa o América del Norte.",
    type: "scholarship",
    category: "Educación Superior",
    location: "Internacional",
    country: "España",
    deadline: "2025-05-15",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["educación", "internacional", "universidad"],
    requirements: [
      "Promedio mínimo de 8.5",
      "Menor de 25 años",
      "Nivel B2 de español",
    ],
  },
  {
    id: 2,
    title: "Taller de Liderazgo Juvenil",
    organization: "Líderes del Mañana",
    description:
      "Taller intensivo de dos semanas para desarrollar habilidades de liderazgo y trabajo en equipo.",
    type: "workshop",
    category: "Desarrollo Personal",
    location: "Nacional",
    country: "México",
    deadline: "2025-04-10",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["liderazgo", "habilidades", "desarrollo personal"],
    requirements: [
      "Edad entre 18 y 25 años",
      "Carta de motivación",
      "Disponibilidad tiempo completo",
    ],
  },
  {
    id: 3,
    title: "Programa de Intercambio Cultural",
    organization: "Juventud Global",
    description:
      "Vive tres meses en otro país mientras participas en proyectos comunitarios y aprendes sobre su cultura.",
    type: "exchange",
    category: "Intercambio Cultural",
    location: "Asia",
    country: "Japón",
    deadline: "2025-06-30",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["cultural", "viajes", "idiomas"],
    requirements: [
      "Nivel básico de japonés",
      "Entre 18 y 30 años",
      "Pasaporte vigente",
      "Seguro médico internacional",
    ],
  },
  {
    id: 4,
    title: "Voluntariado en Conservación Ambiental",
    organization: "Planeta Verde",
    description:
      "Participa en proyectos de conservación de ecosistemas y especies en peligro de extinción.",
    type: "volunteer",
    category: "Medio Ambiente",
    location: "América Latina",
    country: "Brasil",
    deadline: "2025-03-20",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["medio ambiente", "conservación", "naturaleza"],
    requirements: [
      "Interés en la conservación ambiental",
      "Experiencia previa en voluntariado",
      "Disponibilidad para viajar",
    ],
  },
  {
    id: 5,
    title: "Pasantía en Empresa Tecnológica",
    organization: "TechFuture",
    description:
      "Pasantía remunerada de 6 meses en una empresa líder en tecnología e innovación.",
    type: "internship",
    category: "Carrera Profesional",
    location: "Nacional",
    country: "México",
    deadline: "2025-04-05",
    imageUrl:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["tecnología", "profesional", "carrera"],
    requirements: [
      "Estudiante de último semestre",
      "Conocimientos básicos en programación",
      "Disponibilidad de tiempo completo",
    ],
  },
  {
    id: 6,
    title: "Beca para Estudios Técnicos",
    organization: "Fundación Técnica Nacional",
    description:
      "Beca del 75% para cursar estudios técnicos en áreas de alta demanda laboral.",
    type: "scholarship",
    category: "Educación Técnica",
    location: "Nacional",
    country: "México",
    deadline: "2025-05-25",
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["educación", "técnico", "empleo"],
    requirements: [
      "Promedio mínimo de 8.0",
      "Carta de recomendación",
      "Examen de admisión aprobado",
    ],
  },
  {
    id: 7,
    title: "Programa de Innovación Social",
    organization: "Impact Hub",
    description:
      "Programa intensivo para desarrollar proyectos de impacto social con mentorías y financiamiento.",
    type: "workshop",
    category: "Emprendimiento Social",
    location: "Nacional",
    country: "México",
    deadline: "2025-07-15",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["innovación", "emprendimiento", "impacto social"],
    requirements: [
      "Idea de proyecto social",
      "Mayor de 20 años",
      "Compromiso de tiempo completo",
    ],
  },
  {
    id: 8,
    title: "Intercambio Académico en Europa",
    organization: "European University Network",
    description:
      "Semestre académico en universidades europeas con todos los gastos cubiertos.",
    type: "exchange",
    category: "Educación Superior",
    location: "Internacional",
    country: "Alemania",
    deadline: "2025-08-30",
    imageUrl:
      "https://images.unsplash.com/photo-1498346229353-9594fa9c4329?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["educación", "europa", "intercambio"],
    requirements: [
      "Nivel B2 de inglés o alemán",
      "Promedio mínimo 8.5",
      "Estudiante universitario activo",
    ],
  },
  {
    id: 9,
    title: "Voluntariado en Educación Rural",
    organization: "Educar para el Futuro",
    description:
      "Programa de enseñanza en comunidades rurales durante el verano.",
    type: "volunteer",
    category: "Educación",
    location: "Nacional",
    country: "México",
    deadline: "2025-05-01",
    imageUrl:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["educación", "voluntariado", "impacto social"],
    requirements: [
      "Experiencia en docencia",
      "Disponibilidad 2 meses",
      "Habilidades de comunicación",
    ],
  },
  {
    id: 10,
    title: "Pasantía en Marketing Digital",
    organization: "Digital Growth Agency",
    description:
      "Experiencia práctica en una agencia líder de marketing digital.",
    type: "internship",
    category: "Marketing",
    location: "Nacional",
    country: "México",
    deadline: "2025-06-15",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["marketing", "digital", "práctica profesional"],
    requirements: [
      "Conocimientos de marketing digital",
      "Manejo de redes sociales",
      "Creatividad y proactividad",
    ],
  },
  {
    id: 11,
    title: "Beca de Investigación Científica",
    organization: "Instituto Nacional de Ciencias",
    description:
      "Beca para realizar investigación en laboratorios de primer nivel.",
    type: "scholarship",
    category: "Investigación",
    location: "Nacional",
    country: "México",
    deadline: "2025-09-01",
    imageUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["ciencia", "investigación", "laboratorio"],
    requirements: [
      "Estudiante de últimos semestres",
      "Promedio mínimo 9.0",
      "Carta de recomendación académica",
    ],
  },
  {
    id: 12,
    title: "Programa de Liderazgo Internacional",
    organization: "Global Youth Leadership",
    description:
      "Formación intensiva en liderazgo con jóvenes de todo el mundo.",
    type: "workshop",
    category: "Liderazgo",
    location: "Internacional",
    country: "Estados Unidos",
    deadline: "2025-07-30",
    imageUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["liderazgo", "internacional", "desarrollo personal"],
    requirements: [
      "Nivel B2 de inglés",
      "Entre 21 y 28 años",
      "Experiencia en proyectos comunitarios",
    ],
  },
  {
    id: 13,
    title: "Intercambio Cultural en Asia",
    organization: "Asian Cultural Exchange",
    description:
      "Inmersión cultural y aprendizaje de idiomas en países asiáticos.",
    type: "exchange",
    category: "Cultura",
    location: "Internacional",
    country: "Corea del Sur",
    deadline: "2025-08-15",
    imageUrl:
      "https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["cultura", "idiomas", "asia"],
    requirements: [
      "Interés en la cultura asiática",
      "Mayor de 18 años",
      "Pasaporte vigente",
    ],
  },
  {
    id: 14,
    title: "Voluntariado en Tecnología Educativa",
    organization: "TechEd Foundation",
    description:
      "Enseñanza de habilidades digitales a comunidades vulnerables.",
    type: "volunteer",
    category: "Educación Digital",
    location: "Nacional",
    // modalidad: "online",
    // nivelDeEstudio: "doctorado",
    // status: "active",
    // benefits: "Inclusión en la comunidad tecnológica",
    // contact: "info@teched.org",
    country: "México",
    deadline: "2025-06-30",
    imageUrl:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["tecnología", "educación", "voluntariado"],
    requirements: [
      "Conocimientos en tecnología",
      "Habilidades de enseñanza",
      "Compromiso de 3 meses",
    ],
  },
  {
    id: 15,
    title: "Pasantía en Desarrollo Sustentable",
    organization: "Green Future Corp",
    description:
      "Práctica profesional en proyectos de sustentabilidad y energías renovables.",
    type: "internship",
    category: "Medio Ambiente",
    location: "Nacional",
    country: "México",
    deadline: "2025-07-01",
    imageUrl:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["sustentabilidad", "medio ambiente", "energía"],
    requirements: [
      "Estudiante de ingeniería ambiental",
      "Conocimientos en energías renovables",
      "Disponibilidad tiempo completo",
    ],
  },
  {
    id: 16,
    title: "Beca para Estudios de Posgrado",
    organization: "Fundación Académica Global",
    description:
      "Beca completa para maestría en universidades de prestigio internacional.",
    type: "scholarship",
    category: "Posgrado",
    location: "Internacional",
    country: "Canadá",
    deadline: "2025-09-30",
    imageUrl:
      "https://images.unsplash.com/photo-1527269534026-c86f4009eace?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["posgrado", "maestría", "internacional"],
    requirements: [
      "Título universitario",
      "IELTS 7.0 o superior",
      "Experiencia profesional mínima 2 años",
    ],
  },
  {
    id: 17,
    title: "Programa de Innovación en Industria Creativa",
    organization: "Creative Hub International",
    description:
      "Programa intensivo en innovación y emprendimiento en industrias creativas y culturales.",
    type: "workshop",
    category: "Industrias Creativas",
    location: "Internacional",
    country: "Reino Unido",
    deadline: "2025-08-20",
    imageUrl:
      "https://images.unsplash.com/photo-1498075702571-ecb018f3752d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["creatividad", "innovación", "emprendimiento"],
    requirements: [
      "Proyecto creativo en desarrollo",
      "Portfolio de trabajos previos",
      "Nivel B2 de inglés",
    ],
  },
  {
    id: 18,
    title: "Beca en Inteligencia Artificial",
    organization: "Tech Innovation Foundation",
    description: "Beca completa para especialización en IA y Machine Learning.",
    type: "scholarship",
    category: "Tecnología",
    location: "Internacional",
    country: "Singapur",
    deadline: "2025-09-15",
    imageUrl:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["tecnología", "IA", "innovación"],
    requirements: [
      "Grado en Computación o afines",
      "Experiencia en programación",
      "TOEFL/IELTS requerido",
    ],
  },
  {
    id: 19,
    title: "Residencia Artística Internacional",
    organization: "Global Arts Foundation",
    description:
      "Programa de residencia artística con exposición internacional.",
    type: "exchange",
    category: "Artes",
    location: "Internacional",
    country: "Francia",
    deadline: "2025-07-30",
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["arte", "cultura", "creatividad"],
    requirements: [
      "Portfolio artístico",
      "Proyecto de exposición",
      "Experiencia previa en exposiciones",
    ],
  },
  {
    id: 20,
    title: "Voluntariado en Conservación Marina",
    organization: "Ocean Care International",
    description:
      "Programa de conservación de ecosistemas marinos y especies en peligro.",
    type: "volunteer",
    category: "Medio Ambiente",
    location: "Internacional",
    country: "Australia",
    deadline: "2025-06-01",
    imageUrl:
      "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["medio ambiente", "océanos", "conservación"],
    requirements: [
      "Certificación de buceo",
      "Experiencia en biología marina",
      "Inglés avanzado",
    ],
  },
  {
    id: 21,
    title: "Programa de Innovación en Salud Digital",
    organization: "HealthTech Innovation Lab",
    description: "Desarrollo de soluciones tecnológicas para el sector salud.",
    type: "internship",
    category: "Salud",
    location: "Nacional",
    country: "México",
    deadline: "2025-08-10",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["salud", "tecnología", "innovación"],
    requirements: [
      "Estudiantes de último año",
      "Conocimientos en desarrollo de software",
      "Interés en el sector salud",
    ],
  },
  {
    id: 22,
    title: "Beca de Investigación en Energías Renovables",
    organization: "Sustainable Energy Institute",
    description:
      "Investigación aplicada en energías renovables y sostenibilidad.",
    type: "scholarship",
    category: "Energía",
    location: "Internacional",
    country: "Dinamarca",
    deadline: "2025-09-20",
    imageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["energía", "sostenibilidad", "investigación"],
    requirements: [
      "Maestría en Ingeniería",
      "Experiencia en proyectos sostenibles",
      "Inglés avanzado",
    ],
  },
  {
    id: 23,
    title: "Programa de Emprendimiento Social",
    organization: "Social Impact Hub",
    description:
      "Aceleradora de proyectos de impacto social con mentoría y financiamiento.",
    type: "workshop",
    category: "Emprendimiento Social",
    location: "Nacional",
    country: "México",
    deadline: "2025-07-15",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["emprendimiento", "impacto social", "innovación"],
    requirements: [
      "Proyecto social validado",
      "Equipo conformado",
      "Plan de negocios inicial",
    ],
  },
  {
    id: 24,
    title: "Intercambio en Gastronomía Tradicional",
    organization: "Global Culinary Institute",
    description:
      "Programa de inmersión en gastronomía tradicional y técnicas culinarias.",
    type: "exchange",
    category: "Gastronomía",
    location: "Internacional",
    country: "Italia",
    deadline: "2025-08-30",
    imageUrl:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["gastronomía", "cultura", "cocina"],
    requirements: [
      "Experiencia culinaria básica",
      "Italiano básico",
      "Pasión por la gastronomía",
    ],
  },
  {
    id: 25,
    title: "Programa de Desarrollo de Videojuegos",
    organization: "Game Dev Academy",
    description:
      "Formación intensiva en desarrollo de videojuegos y realidad virtual.",
    type: "workshop",
    category: "Tecnología",
    location: "Internacional",
    country: "Canadá",
    deadline: "2025-09-01",
    imageUrl:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["videojuegos", "tecnología", "desarrollo"],
    requirements: [
      "Conocimientos de programación",
      "Portfolio de proyectos",
      "Inglés intermedio",
    ],
  },
  {
    id: 26,
    title: "Voluntariado en Educación STEM",
    organization: "Future Scientists Foundation",
    description:
      "Programa de enseñanza de ciencias y tecnología a niños de comunidades rurales.",
    type: "volunteer",
    category: "Educación",
    location: "Nacional",
    country: "México",
    deadline: "2025-07-20",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["educación", "STEM", "voluntariado"],
    requirements: [
      "Formación en áreas STEM",
      "Experiencia docente",
      "Disponibilidad para viajar",
    ],
  },
];
