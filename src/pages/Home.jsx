import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ImpactSection from "../components/ImpactSection";
import AboutSection from "../components/AboutSection";
import OfferSection from "../components/OfferSection";
import TestimonialsSection from "../components/TestimonialsSection";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="w-full h-screen bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/eduus/image/upload/f_auto,q_auto,w_1920/Hero_zzriwy.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-dark bg-opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-light max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Educación de Calidad para Todos
            </h1>
            <p className="text-xl mb-8">
              Capacitamos a jóvenes con herramientas blandas, técnicas y
              digitales para impulsar su potencial.
            </p>
            <Link
              to="/proyectos"
              className="inline-flex items-center bg-primary text-light px-6 py-3 rounded-md hover:bg-opacity-90 hover:text-dark"
            >
              Explorar proyectos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      <ImpactSection />
      <AboutSection />
      <OfferSection />
      <TestimonialsSection />
    </div>
  );
};

export default Home;
