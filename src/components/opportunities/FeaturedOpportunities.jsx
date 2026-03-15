import { useEffect, useState } from "react";
import { opportunitiesService } from "../../services/fetchOpportunityService";
import { Link } from "react-router-dom";
import FeaturedOpportunityCard from "./FeaturedOpportunityCard";

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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-secondary text-sm font-semibold tracking-wider mb-2">
              DESCUBRE TU FUTURO
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-3xl h-96 shadow-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-red-600 font-semibold">{error}</p>
        </div>
      </section>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-secondary text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">
              DESCUBRE TU FUTURO
            </p>
            <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-x-2 gap-y-0">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Oportunidades
              </h2>
              <p className="text-3xl sm:text-4xl md:text-5xl font-medium italic text-secondary leading-tight">
                Destacadas
              </p>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end sm:flex-shrink-0">
            <Link
              to="/edutracker"
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-900 text-white text-sm sm:text-base rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300 whitespace-nowrap"
            >
              Explorar todo el catálogo
            </Link>
          </div>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {opportunities.map((opportunity, index) => (
            <FeaturedOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedOpportunities;
