import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import ImpactSection from "../components/ImpactSection";
import AboutSection from "../components/AboutSection";
import OfferSection from "../components/OfferSection";
import SEO from "../components/SEO";
import EventsSection from "../components/events/EventsSection";
import PromoModal from "../components/events/PromoModal";

const TestimonialsSection = lazy(
  () => import("../components/TestimonialsSection"),
);
const CallToAction = lazy(() => import("../components/CallToAction"));

const Home = () => {
  const heroImageBase =
    "https://res.cloudinary.com/eduus/image/upload/f_auto,q_auto";

  return (
    <>
      <SEO
        title="EDU-US | Becas y oportunidades internacionales 2026"
        description="Encuentra becas, voluntariados y oportunidades académicas internacionales actualizadas cada semana."
      />
      {/* PromoModal se auto-controla con usePromoModal */}
      <PromoModal />
      <div className="flex flex-col min-h-screen">
        <section className="w-full min-h-[calc(100vh-4rem)] bg-center bg-cover flex items-center justify-center relative overflow-hidden">
          <img
            srcSet={`
            ${heroImageBase},w_768/Hero_zzriwy.jpg 768w,
            ${heroImageBase},w_1024/Hero_zzriwy.jpg 1024w,
            ${heroImageBase},w_1366/Hero_zzriwy.jpg 1366w,
            ${heroImageBase},w_1920/Hero_zzriwy.jpg 1920w
          `}
            sizes="100vw"
            src={`${heroImageBase},w_1920/Hero_zzriwy.jpg`}
            alt="Hero - Educación de Calidad"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark bg-opacity-60"></div>
          <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex ">
            <div className="text-light max-w-3xl lg:w-1/2">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Educación de Calidad para Todos
              </h1>
              <p className="text-xl mb-8">
                Acompañamos a jóvenes en el desarrollo de habilidades que les
                permitan explorar su potencial y aprovechar nuevas
                oportunidades.
              </p>
              <Link
                to="/edutracker"
                className="group inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/95 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
              >
                Explora oportunidades aquí
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </section>
        <ImpactSection />
        <AboutSection />
        <OfferSection />
        <EventsSection />
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
          <CallToAction />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
