export const MOCK_EVENTS = [
  {
    id: "mock-2",
    title: "Charla Informativa: Oportunidades de Posgrado en la Unión Europea",
    slug: "oportunidades-posgrado-union-europea",
    category: "charla",
    modality: "presencial",
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 días a futuro
    ends_at: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 3,
    ).toISOString(),
    location: "Campus Piura, Edificio de Ingeniería, Aula L-21",
    capacity: 60,
    spots_left: 25,
    price: 0,
    description: `¿Estás terminando tu carrera y te gustaría estudiar una maestría o doctorado en Europa con financiamiento total? Descubre el programa Erasmus Mundus y otras becas gubernamentales europeas.\n\nTemario:\n- Introducción a las Becas Erasmus+ y Erasmus Mundus Joint Masters.\n- Becas DAAD (Alemania), Chevening (Reino Unido) y MAECI (Italia).\n- Requisitos clave de idioma, traducción de documentos y legalización.\n- Retorno de inversión académica y profesional en el extranjero.`,
    banner_url:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    speaker: {
      name: "Dra. Sofía Martínez",
      role: "Coordinadora de Becas Erasmus+",
      company: "Delegación de la Unión Europea",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
    },
    status: "published",
  },
  {
    id: "mock-3",
    title: "Networking Session: Conecta con Mentores EDU-US",
    slug: "networking-mentores-edu-us",
    category: "networking",
    modality: "hibrido",
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 días a futuro
    ends_at: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60 * 2.5,
    ).toISOString(),
    location: "Campus Lima (UDEP) & Discord de la Comunidad",
    capacity: 40,
    spots_left: 0, // Agotado
    price: 15,
    description: `Una sesión exclusiva para conversar directamente con becarios y profesionales peruanos que ya estudian o trabajan en el extranjero. Podrás hacer preguntas directas, recibir feedback express de tu CV y ampliar tu red de contactos.\n\nNota: La capacidad presencial es limitada. La entrada incluye acceso a las grabaciones de los paneles y café de networking para la sesión presencial.`,
    banner_url:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop",
    speaker: {
      name: "Ing. Alejandro Torres",
      role: "Software Engineer / Ex-becario UDEP",
      company: "Google",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop"
    },
    status: "published",
  },
  {
    id: "mock-4",
    title: "Taller: Preparación Eficiente para los Exámenes TOEFL e IELTS",
    slug: "preparacion-eficiente-toefl-ielts",
    category: "taller",
    modality: "virtual",
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
    ends_at: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 20 + 1000 * 60 * 60 * 2,
    ).toISOString(),
    location: "Zoom Room A",
    capacity: 200,
    spots_left: 145,
    price: 0,
    description: `Conoce la estructura, criterios de evaluación y estrategias prácticas para obtener el puntaje necesario en las pruebas TOEFL iBT o IELTS Academic.\n\nDetalles del taller:\n- Formato y diferencias clave entre TOEFL e IELTS.\n- Técnicas de gestión de tiempo en las secciones de Lectura y Comprensión Auditiva.\n- Plantillas de respuesta para la sección de Expresión Oral (Speaking).\n- Consejos de redacción rápida para la sección Escrita (Writing).`,
    banner_url:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop",
    speaker: {
      name: "Mg. Elena Rostova",
      role: "Especialista en Evaluación Lingüística",
      company: "EDU-US English Academy",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop"
    },
    status: "published",
  },
  {
    id: "mock-5",
    title: "Bootcamp: Redacción de Ensayos para Becas Internacionales",
    slug: "bootcamp-redaccion-ensayos-becas",
    category: "campamento",
    modality: "presencial",
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    ends_at: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30 + 1000 * 60 * 60 * 6,
    ).toISOString(),
    location: "Auditorio Principal UDEP, Campus Piura",
    capacity: 50,
    spots_left: 12,
    price: 30,
    description: `Un campamento intensivo de 6 horas donde escribirás, estructurarás y corregirás tus ensayos de motivación y cartas de interés académico bajo la mentoría personalizada de nuestro staff.\n\nRequisito: Traer laptop propia y un borrador o idea preliminar de postulación. Almuerzo y materiales incluidos.`,
    banner_url:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    speaker: {
      name: "Dr. Carlos Mendoza",
      role: "Fundador y Consultor de Admisiones",
      company: "EDU-US",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
    },
    status: "published",
  },
];
