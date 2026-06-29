export const MOCK_EVENTS = [
  {
    id: "mock-1",
    title: "Taller Práctico: Postulación a Becas de Pregrado en EE.UU.",
    slug: "postulacion-becas-pregrado-eeuu",
    category: "taller",
    modality: "virtual",
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 días a futuro
    ends_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60 * 2).toISOString(),
    location: "Zoom & YouTube Live",
    capacity: 100,
    spots_left: 4,
    price: 0,
    description: `Aprende el paso a paso para postular a universidades estadounidenses y conseguir becas completas. En este taller interactivo revisaremos:\n\n- Cómo llenar el Common App.\n- Estrategias para escribir ensayos personales (Personal Statements) atractivos.\n- Cómo solicitar cartas de recomendación impactantes.\n- Perfil académico y actividades extracurriculares valoradas por los comités de admisión.\n\nAl final de la sesión, resolveremos preguntas en vivo y compartiremos una plantilla de seguimiento para tus postulaciones.`,
    banner_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    status: "published"
  },
  {
    id: "mock-2",
    title: "Charla Informativa: Oportunidades de Posgrado en la Unión Europea",
    slug: "oportunidades-posgrado-union-europea",
    category: "charla",
    modality: "presencial",
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 días a futuro
    ends_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 3).toISOString(),
    location: "Campus Piura, Edificio de Ingeniería, Aula L-21",
    capacity: 60,
    spots_left: 25,
    price: 0,
    description: `¿Estás terminando tu carrera y te gustaría estudiar una maestría o doctorado en Europa con financiamiento total? Descubre el programa Erasmus Mundus y otras becas gubernamentales europeas.\n\nTemario:\n- Introducción a las Becas Erasmus+ y Erasmus Mundus Joint Masters.\n- Becas DAAD (Alemania), Chevening (Reino Unido) y MAECI (Italia).\n- Requisitos clave de idioma, traducción de documentos y legalización.\n- Retorno de inversión académica y profesional en el extranjero.`,
    banner_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    status: "published"
  },
  {
    id: "mock-3",
    title: "Networking Session: Conecta con Mentores EDU-US",
    slug: "networking-mentores-edu-us",
    category: "networking",
    modality: "hibrido",
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 días a futuro
    ends_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60 * 2.5).toISOString(),
    location: "Campus Lima (UDEP) & Discord de la Comunidad",
    capacity: 40,
    spots_left: 0, // Agotado
    price: 15,
    description: `Una sesión exclusiva para conversar directamente con becarios y profesionales peruanos que ya estudian o trabajan en el extranjero. Podrás hacer preguntas directas, recibir feedback express de tu CV y ampliar tu red de contactos.\n\nNota: La capacidad presencial es limitada. La entrada incluye acceso a las grabaciones de los paneles y café de networking para la sesión presencial.`,
    banner_url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop",
    status: "published"
  },
  {
    id: "mock-4",
    title: "Taller: Preparación Eficiente para los Exámenes TOEFL e IELTS",
    slug: "preparacion-eficiente-toefl-ielts",
    category: "taller",
    modality: "virtual",
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
    ends_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20 + 1000 * 60 * 60 * 2).toISOString(),
    location: "Zoom Room A",
    capacity: 200,
    spots_left: 145,
    price: 0,
    description: `Conoce la estructura, criterios de evaluación y estrategias prácticas para obtener el puntaje necesario en las pruebas TOEFL iBT o IELTS Academic.\n\nDetalles del taller:\n- Formato y diferencias clave entre TOEFL e IELTS.\n- Técnicas de gestión de tiempo en las secciones de Lectura y Comprensión Auditiva.\n- Plantillas de respuesta para la sección de Expresión Oral (Speaking).\n- Consejos de redacción rápida para la sección Escrita (Writing).`,
    banner_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop",
    status: "published"
  },
  {
    id: "mock-5",
    title: "Bootcamp: Redacción de Ensayos para Becas Internacionales",
    slug: "bootcamp-redaccion-ensayos-becas",
    category: "campamento",
    modality: "presencial",
    starts_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    ends_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 + 1000 * 60 * 60 * 6).toISOString(),
    location: "Auditorio Principal UDEP, Campus Piura",
    capacity: 50,
    spots_left: 12,
    price: 30,
    description: `Un campamento intensivo de 6 horas donde escribirás, estructurarás y corregirás tus ensayos de motivación y cartas de interés académico bajo la mentoría personalizada de nuestro staff.\n\nRequisito: Traer laptop propia y un borrador o idea preliminar de postulación. Almuerzo y materiales incluidos.`,
    banner_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    status: "published"
  }
];
