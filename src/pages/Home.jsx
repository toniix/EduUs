import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ImpactSection from "../components/ImpactSection";
import AboutSection from "../components/AboutSection";
import OfferSection from "../components/OfferSection";
import TestimonialsSection from "../components/TestimonialsSection";
import { useState, useEffect } from "react";
import CallToAction from "../components/CallToAction";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="w-full min-h-[calc(100vh-4rem)] bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/eduus/image/upload/f_auto,q_auto,w_1920/Hero_zzriwy.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-dark bg-opacity-60"></div>
        <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex ">
          <div className="text-light max-w-3xl lg:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Educación de Calidad para Todos
            </h1>
            <p className="text-xl mb-8">
              Acompañamos a jóvenes en el desarrollo de habilidades que les
              permitan explorar su potencial y aprovechar nuevas oportunidades.
            </p>
            <Link
              to="/edutracker"
              className="inline-flex items-center bg-primary text-light px-6 py-3 rounded-md hover:bg-opacity-90 hover:text-dark"
            >
              Explora oportunidades aqui
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      <ImpactSection />
      <AboutSection />
      <OfferSection />
      <TestimonialsSection />
      <CallToAction />
    </div>
  );
};

export default Home;
