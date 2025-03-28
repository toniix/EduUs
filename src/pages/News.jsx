import React from "react";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";

const newsItems = [
  {
    id: "1",
    title: "Nueva Iniciativa de Becas para Estudiantes Latinoamericanos",
    excerpt:
      "Importante fundación anuncia programa de becas completas para estudios en Europa.",
    date: "2024-03-15",
    category: "Becas",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    source: "Educación Global",
    sourceUrl: "#",
  },
  {
    id: "2",
    title: "Innovador Programa de Intercambio Virtual",
    excerpt:
      "Universidades lanzan plataforma para experiencias internacionales remotas.",
    date: "2024-03-14",
    category: "Tecnología",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    source: "Tech Education",
    sourceUrl: "#",
  },
  {
    id: "3",
    title: "Aumenta la Demanda de Habilidades Digitales",
    excerpt:
      "Estudio revela las competencias más solicitadas en el mercado laboral actual.",
    date: "2024-03-13",
    category: "Mercado Laboral",
    imageUrl:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    source: "Educación Digital",
    sourceUrl: "#",
  },
  {
    id: "4",
    title: "Conferencia Internacional de Educación 2024",
    excerpt:
      "Expertos globales se reúnen para discutir el futuro de la educación post-pandemia.",
    date: "2024-03-12",
    category: "Eventos",
    imageUrl:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    source: "Noticias Educativas",
    sourceUrl: "#",
  },
];

const News = () => {
  return (
    <div className="min-h-screen bg-light pt-16">
      {/* Hero Section */}
      <div className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Noticias Educativas
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Mantente informado sobre las últimas novedades en el mundo de la
              educación
            </p>
          </div>
        </div>
      </div>

      {/* Featured News */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Featured news"
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  Destacado
                </span>
              </div>
              <h2 className="text-3xl font-bold text-dark mb-4">
                Revolucionario Programa de Mentorías para Estudiantes
              </h2>
              <p className="text-gray-600 mb-6">
                Nueva iniciativa conecta estudiantes con profesionales exitosos
                en sus campos de interés, ofreciendo orientación personalizada y
                oportunidades de networking.
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Marzo 16, 2024</span>
                </div>
                <div className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <a href="#" className="hover:text-primary">
                    Fuente: Education Times
                  </a>
                </div>
              </div>
              <button className="inline-flex items-center text-primary hover:text-primary/80">
                Leer más
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <a
                    href={item.sourceUrl}
                    className="flex items-center hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span>{item.source}</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-dark mb-12">
            Categorías
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Becas",
              "Tecnología",
              "Eventos",
              "Investigación",
              "Innovación",
              "Mercado Laboral",
              "Internacional",
              "Desarrollo",
            ].map((category, index) => (
              <button
                key={index}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <span className="text-gray-800 font-medium">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
