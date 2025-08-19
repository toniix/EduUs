import { Target, Globe, Lightbulb } from "lucide-react";
import { values } from "../data/eduUsValues";
import { teamMembers } from "../data/teamMembers";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Mejorado */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary pt-20 pb-16">
        <div className="absolute inset-0 bg-dark/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-light rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-light/10 backdrop-blur-sm rounded-full text-light/90 text-sm font-medium mb-8 border border-light/20">
            <Lightbulb className="w-4 h-4 mr-2 text-accent" />
            Transformando el futuro educativo
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Sobre
            <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              {" "}
              EDU-US
            </span>
          </h1>

          <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12">
            Capacitamos a jóvenes con herramientas blandas, técnicas y digitales
            para{" "}
            <span className="text-accent font-medium">
              impulsar su potencial
            </span>
          </p>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
      {/* <Hero /> */}
      {/* Mission and Vision - Rediseñado */}
      <section className="py-20 bg-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[length:40px_40px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestro Propósito
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Misión Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/60 to-secondary/60 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-400"></div>
              <div className="relative bg-white rounded-2xl p-8 h-full border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                  Nuestra Misión
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Empoderar a jóvenes en situación de desventaja a través de
                  procesos formativos integrales que desarrollen sus capacidades
                  personales y profesionales, conectándolos con oportunidades
                  reales en el mercado laboral.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="h-1 w-20 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Visión Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/60 to-primary/60 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-400"></div>
              <div className="relative bg-white rounded-2xl p-8 h-full border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 mx-auto">
                  <Globe className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                  Nuestra Visión
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Ser una organización sostenible, innovadora y referente en
                  América Latina por su capacidad de reducir brechas
                  estructurales, conectar talento joven con el mercado y generar
                  impacto medible en la empleabilidad juvenil.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="h-1 w-20 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Valores Fundamentales
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-fr">
            {values.map((value, index) => (
              <div key={index} className="group relative flex">
                <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 w-full flex flex-col">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 md:w-10 md:h-10 bg-gradient-to-r ${value.color} rounded-xl flex-shrink-0 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300`}
                    >
                      <value.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed ">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Ejes Estratégicos Section */}
      <section className="py-20 bg-white bg-[url('https://www.transparenttextures.com/patterns/wavecut.png')]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Ejes Estratégicos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestros pilares se alinean con los{" "}
              <span className="font-bold text-secundary">
                Objetivos de Desarrollo Sostenible 4 y 10 (Educación de calidad
                y Reducción de desigualdades)
              </span>{" "}
              y se concretan en tres ejes:
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fila 1 - Col 1: Eje 1 Texto */}
            <div className="relative p-8 flex flex-col justify-center bg-gradient-to-b from-white to-gray-50">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Empleabilidad
              </h3>
              <p className="text-gray-600">
                Diseñamos programas que fortalecen habilidades blandas y
                técnicas clave para la inserción laboral.
              </p>
            </div>

            {/* Fila 1 - Col 2: Imagen Eje 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center p-4">
              <svg
                className="w-32 h-32 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
            </div>

            {/* Fila 1 - Col 3: Eje 2 Texto */}
            <div className="relative p-8 flex flex-col justify-center bg-gradient-to-b from-white to-gray-50">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-primary"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Asociatividad
              </h3>
              <p className="text-gray-600">
                Construimos redes de colaboración con empresas, mentores,
                instituciones educativas y organizaciones aliadas.
              </p>
            </div>

            {/* Fila 2 - Col 1: Imagen Eje 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center p-4 md:col-start-1">
              <svg
                className="w-32 h-32 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>

            {/* Fila 2 - Col 2: Eje 3 Texto */}
            <div className="relative p-8 flex flex-col justify-center bg-gradient-to-t from-white to-gray-50">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tecnologías emergentes
              </h3>
              <p className="text-gray-600">
                Incorporamos herramientas digitales e inteligencia artificial
                para personalizar procesos, escalar nuestro alcance e innovar en
                la educación.
              </p>
            </div>

            {/* Fila 2 - Col 3: Imagen Eje 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center p-4">
              <svg
                className="w-32 h-32 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Minimalista */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestro Equipo
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium text-sm">
                  {member.role}
                </p>
                {member.bio && (
                  <p className="text-gray-600 text-sm mt-2 max-w-xs mx-auto">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
