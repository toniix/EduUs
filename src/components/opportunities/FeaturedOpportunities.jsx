import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { opportunitiesService } from "../../services/fetchOpportunityService";
import { Link } from "react-router-dom";
import FeaturedOpportunityCard from "./FeaturedOpportunityCard";
import { ArrowRight, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const FeaturedOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedOpportunities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await opportunitiesService.getFeaturedOpportunities(4);
        setOpportunities(data);
      } catch (err) {
        console.error("Error fetching featured opportunities:", err);
        setError("Error al cargar las oportunidades destacadas");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedOpportunities();
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-secondary/5 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-36 bg-gray-200 rounded-full" />
              <div className="h-10 w-72 bg-gray-200 rounded-full" />
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gradient-to-b from-gray-200 to-gray-300 rounded-3xl h-96 shadow-md"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-red-500 font-semibold bg-red-50 rounded-2xl py-6 px-8">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-secondary/5 pointer-events-none" />

      {/* Círculos decorativos de fondo */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12 flex flex-col gap-6 sm:gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="text-center sm:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-secondary/10 border border-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
              <Sparkles className="w-3 h-3" />
              Descubre tu futuro
            </div>

            <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-x-3 gap-y-0">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                Oportunidades
              </h2>
              <span className="text-4xl sm:text-5xl font-medium italic text-secondary leading-tight">
                Destacadas
              </span>
            </div>

            {/* <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-md mx-auto sm:mx-0">
              Las mejores oportunidades seleccionadas para impulsar tu carrera académica y profesional.
            </p> */}
          </div>

          <Link
            to="/edutracker"
            className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-900 text-white text-sm sm:text-base rounded-full font-semibold hover:bg-gray-700 transition-all duration-300 whitespace-nowrap self-center sm:self-auto"
          >
            Explorar más
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>

        {/* Grid de tarjetas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {opportunities.map((opportunity, index) => (
            <FeaturedOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedOpportunities;
