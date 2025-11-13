import { Target, Globe, Lightbulb } from "lucide-react";
import { values } from "../data/eduUsValues";
import { teamMembers } from "../data/teamMembers";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Mejorado */}
      <section
        className="relative overflow-hidden py-16"
        style={{
          background:
            "linear-gradient(90deg,rgba(165, 240, 232, 1) 0%, rgba(242, 216, 201, 1) 100%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-transparent"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full text-primary text-sm font-semibold mb-10 border border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <Lightbulb className="w-4 h-4 mr-2.5 text-accent" />
            Transformando el futuro educativo
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Conoce sobre{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EDU-US
              </span>
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-primary/60 to-secondary/60 rounded-full"></span>
            </span>
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
            Capacitamos a jóvenes con herramientas blandas, técnicas y digitales
            para{" "}
            <span className="relative font-semibold text-primary">
              <span className="relative z-10">impulsar su potencial</span>
              <span className="absolute bottom-0 left-0 w-full h-1.5 bg-accent/30 -z-0"></span>
            </span>
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <div className="w-8 h-12 border-2 border-primary/30 rounded-full flex justify-center hover:border-primary/50 transition-colors">
              <div className="w-1 h-3 bg-gradient-to-b from-primary to-secondary rounded-full mt-2.5 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
      {/* <Hero /> */}
      {/* Mission and Vision - Rediseñado */}
      <section className="py-20 bg-white">
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
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative inline-block text-center w-full">
                  Misión
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full group-hover:w-24 transition-all duration-300"></span>
                </h3>
                <p className="text-gray-600 leading-relaxed text-center mb-4">
                  Empoderar a jóvenes en situación de desventaja a través de
                  procesos formativos integrales que desarrollen sus capacidades
                  personales y profesionales, conectándolos con oportunidades
                  reales en el mercado laboral.
                </p>
              </div>
            </div>

            {/* Visión Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/60 to-primary/60 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-400"></div>
              <div className="relative bg-white rounded-2xl p-8 h-full border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 mx-auto">
                  <Globe className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative inline-block text-center w-full">
                  Visión
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:w-24 transition-all duration-300"></span>
                </h3>
                <p className="text-gray-600 leading-relaxed text-center mb-4">
                  Ser una organización sostenible, innovadora y referente en
                  América Latina por su capacidad de reducir brechas
                  estructurales, conectar talento joven con el mercado y generar
                  impacto medible en la empleabilidad juvenil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Valores
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
                    <h3 className="text-2xl  font-bold text-gray-900">
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
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 mb-4"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Se alinean con los{" "}
              <span className="font-bold text-secundary">
                Objetivos de Desarrollo Sostenible (ODS) 4 y 10
              </span>{" "}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Fila 1 - Col 2: Imagen Eje 3 */}
            <div className="hidden sm:block bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center p-4 h-full">
              <img
                src="https://res.cloudinary.com/eduus/image/upload/v1762959587/125822_qsdxzb.jpg"
                alt="Empleabilidad"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:hidden bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center p-4 h-full">
              <img
                src="https://res.cloudinary.com/eduus/image/upload/v1762959587/2310_pdfuvo.jpg"
                alt="Tecnologías emergentes"
                className="w-full h-48 object-cover rounded-lg"
              />
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

            {/* Fila 2 - Col 1: Imagen Eje 1 */}
            <div className="hidden sm:block bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center p-4 h-full md:col-start-1">
              <img
                src="https://res.cloudinary.com/eduus/image/upload/v1762959587/2310_pdfuvo.jpg"
                alt="Tecnologías emergentes"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:hidden bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center p-4 h-full">
              <img
                src="https://res.cloudinary.com/eduus/image/upload/v1762959587/2613_vacbit.jpg"
                alt="Asociatividad"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            {/* Fila 2 - Col 2: Eje 2 Texto */}
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
            <div className="hidden sm:block bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center p-4 h-full">
              <img
                src="https://res.cloudinary.com/eduus/image/upload/v1762959587/2613_vacbit.jpg"
                alt="Asociatividad"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:hidden bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center p-4 h-full">
              <img
                src="https://res.cloudinary.com/eduus/image/upload/v1762959587/125822_qsdxzb.jpg"
                alt="Empleabilidad"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Minimalista */}
      <section className="py-20 bg-secondary/10">
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
