import React from "react";
import { Users, Target, Heart, Trophy } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-light pt-16">
      {/* Hero Section */}
      <div className="relative py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Sobre EDU-US
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Transformando el futuro de la educación en América Latina a través
              de oportunidades significativas para jóvenes.
            </p>
          </div>
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-dark mb-4">
                Nuestra Misión
              </h2>
              <p className="text-gray-600">
                Facilitar el acceso a oportunidades educativas de calidad para
                jóvenes latinoamericanos, conectándolos con programas, becas y
                recursos que impulsen su desarrollo académico y profesional.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-dark mb-4">
                Nuestra Visión
              </h2>
              <p className="text-gray-600">
                Ser la plataforma líder en América Latina que democratiza el
                acceso a la educación de calidad, creando un futuro donde cada
                joven tenga la oportunidad de alcanzar su máximo potencial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-dark mb-12">
            Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Inclusión</h3>
              <p className="text-gray-600">
                Oportunidades accesibles para todos los jóvenes.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excelencia</h3>
              <p className="text-gray-600">
                Compromiso con la calidad educativa.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Empatía</h3>
              <p className="text-gray-600">
                Entendemos las necesidades de cada estudiante.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Impacto</h3>
              <p className="text-gray-600">
                Resultados transformadores en la educación.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-dark mb-12">
            Nuestro Equipo
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
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
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-600">{member.role}</p>
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
