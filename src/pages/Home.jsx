import { ArrowRight, BookOpen, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-dark bg-opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-light max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Educación de Calidad para Todos los Jóvenes
            </h1>
            <p className="text-xl mb-8">
              Descubre oportunidades educativas que transformarán tu futuro.
              Becas, talleres, intercambios y más te esperan.
            </p>
            <Link
              to="/edutracker"
              className="inline-flex items-center bg-primary text-light px-6 py-3 rounded-md hover:bg-opacity-90 hover:text-dark"
            >
              Explorar Oportunidades
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué EDU-US?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-secondary bg-opacity-10 rounded-full p-4 w-16 h-16 mx-auto mb-6 transform hover:rotate-6 transition-transform duration-300">
                <BookOpen className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Educación de Calidad
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Accede a oportunidades educativas verificadas y de alta calidad
                en instituciones reconocidas mundialmente.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-primary bg-opacity-10 rounded-full p-4 w-16 h-16 mx-auto mb-6 transform hover:rotate-6 transition-transform duration-300">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Comunidad Activa
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Únete a una red global de jóvenes comprometidos con su
                desarrollo académico y profesional.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="bg-accent bg-opacity-10 rounded-full p-4 w-16 h-16 mx-auto mb-6 transform hover:rotate-6 transition-transform duration-300">
                <Globe className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Alcance Global
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Descubre oportunidades internacionales y expande tus horizontes
                en más de 50 países.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-light mb-6">
            ¿Listo para comenzar tu viaje educativo?
          </h2>
          <p className="text-light text-xl mb-8 max-w-2xl mx-auto">
            Únete a nuestra plataforma y accede a cientos de oportunidades
            educativas.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-primary text-light px-6 py-3 rounded-md hover:bg-opacity-90"
            >
              Registrarse
            </Link>
            <Link
              to="/about"
              className="bg-light text-dark px-6 py-3 rounded-md hover:bg-opacity-90"
            >
              Conocer Más
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
