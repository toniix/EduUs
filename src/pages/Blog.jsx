import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: "1",
    title: "Cómo Encontrar la Beca Perfecta para tus Estudios",
    excerpt:
      "Una guía completa para navegar por el proceso de búsqueda y aplicación a becas internacionales.",
    author: "María González",
    date: "2024-03-15",
    category: "Becas",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    readTime: "5 min",
  },
  {
    id: "2",
    title: "Los Beneficios del Intercambio Cultural en tu Carrera",
    excerpt:
      "Descubre cómo la experiencia internacional puede impulsar tu desarrollo profesional.",
    author: "Carlos Rodríguez",
    date: "2024-03-10",
    category: "Desarrollo Profesional",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    readTime: "7 min",
  },
  {
    id: "3",
    title: "5 Habilidades Esenciales para el Futuro del Trabajo",
    excerpt:
      "Prepárate para el mercado laboral del mañana con estas competencias clave.",
    author: "Ana Martínez",
    date: "2024-03-05",
    category: "Carrera",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    readTime: "6 min",
  },
  {
    id: "4",
    title: "Guía para Estudiar en el Extranjero",
    excerpt:
      "Todo lo que necesitas saber para prepararte para una experiencia académica internacional.",
    author: "Luis Pérez",
    date: "2024-03-01",
    category: "Estudios Internacionales",
    imageUrl:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    readTime: "8 min",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-light pt-16">
      {/* Hero Section */}
      <div className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blog EDU-US
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Recursos, consejos y experiencias para impulsar tu desarrollo
              educativo
            </p>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Featured post"
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
                Maximiza tus Oportunidades de Estudio en 2024
              </h2>
              <p className="text-gray-600 mb-6">
                Descubre las mejores estrategias para aprovechar las
                oportunidades educativas este año. Una guía completa con
                consejos prácticos y recursos útiles.
              </p>
              <div className="flex items-center text-gray-500 text-sm mb-6">
                <User className="h-4 w-4 mr-2" />
                <span className="mr-4">Por Juan Silva</span>
                <Calendar className="h-4 w-4 mr-2" />
                <span>Marzo 15, 2024</span>
              </div>
              <button className="inline-flex items-center text-primary hover:text-primary/80">
                Leer más
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-dark mb-4">
              Suscríbete a Nuestro Newsletter
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Recibe las últimas actualizaciones sobre oportunidades educativas,
              consejos y recursos directamente en tu bandeja de entrada.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
