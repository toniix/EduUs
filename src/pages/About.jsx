import { Users, Target, Heart, Trophy } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-gray-50 pt-16">
      {/* Hero Section */}
      <div className="relative py-12 bg-gradient-to-r from-secondary to-secondary/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Sobre EDU-US
            </h1>
            <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              Transformando el futuro de la educación en América Latina a través
              de oportunidades significativas para jóvenes.
            </p>
          </div>
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h2 className="text-3xl font-bold text-dark mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Nuestra Misión
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Facilitar el acceso a oportunidades educativas de calidad para
                jóvenes latinoamericanos, conectándolos con programas, becas y
                recursos que impulsen su desarrollo académico y profesional.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h2 className="text-3xl font-bold text-dark mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Nuestra Visión
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Ser la plataforma líder en América Latina que democratiza el
                acceso a la educación de calidad, creando un futuro donde cada
                joven tenga la oportunidad de alcanzar su máximo potencial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-dark mb-16">
            Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                color: "primary",
                title: "Inclusión",
                text: "Oportunidades accesibles para todos los jóvenes.",
              },
              {
                icon: Target,
                color: "secondary",
                title: "Excelencia",
                text: "Compromiso con la calidad educativa.",
              },
              {
                icon: Heart,
                color: "accent",
                title: "Empatía",
                text: "Entendemos las necesidades de cada estudiante.",
              },
              {
                icon: Trophy,
                color: "primary",
                title: "Impacto",
                text: "Resultados transformadores en la educación.",
              },
            ].map((value, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`bg-${value.color}/10 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg`}
                >
                  <value.icon className={`h-10 w-10 text-${value.color}`} />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-dark mb-16">
            Nuestro Equipo
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "María González",
                role: "Directora Ejecutiva",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
              },
              {
                name: "Carlos Rodríguez",
                role: "Director de Programas Educativos",
                image:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
              },
              {
                name: "Ana Martínez",
                role: "Coordinadora de Alianzas",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative overflow-hidden group">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-dark mb-2">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
