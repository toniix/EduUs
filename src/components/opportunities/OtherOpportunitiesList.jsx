import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { opportunitiesService } from "../../services/fetchOpportunityService";
import { optimizeCloudinaryUrl } from "../../utils/cloudinaryOptimize";
import { motion } from "framer-motion";

export default function OtherOpportunitiesList({ currentOpportunityId }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOtherOpportunities = async () => {
      try {
        setLoading(true);
        const recent = await opportunitiesService.getRecentOpportunities(6);
        const filtered = recent
          .filter((opp) => opp.id !== currentOpportunityId)
          .slice(0, 5);
        setOpportunities(filtered);
      } catch (err) {
        console.error("Error fetching other opportunities:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentOpportunityId) {
      fetchOtherOpportunities();
    }
  }, [currentOpportunityId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex gap-3">
              <div className="w-24 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
    >
      <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2">
        Otras convocatorias abiertas
      </h3>

      <div className="space-y-3">
        {opportunities.map((opp) => (
          <Link
            key={opp.id}
            to={`/edutracker/oportunidad/${opp.slug || opp.id}`}
            className="group flex gap-3 p-1.5 -mx-1.5 rounded-xl hover:bg-gray-50/80 transition-all duration-200"
          >
            {/* Miniatura */}
            <div className="w-24 h-16 sm:w-28 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100/50">
              <img
                src={
                  optimizeCloudinaryUrl(opp.image_url, { width: 200 }) ||
                  "/placeholder.svg"
                }
                alt={opp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Información */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200">
                {opp.title}
              </h4>
              {opp.organization && (
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1 truncate">
                  {opp.organization}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
