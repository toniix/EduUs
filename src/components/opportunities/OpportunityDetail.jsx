import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { opportunitiesData } from "../../utils/opportunities";
import {
  Calendar,
  MapPin,
  BookOpen,
  Users,
  Award,
  Briefcase,
  ChevronLeft,
} from "lucide-react";

const typeIcons = {
  beca: <Award className="h-5 w-5" />,
  taller: <BookOpen className="h-5 w-5" />,
  intercambio: <Users className="h-5 w-5" />,
  charla: <Briefcase className="h-5 w-5" />,
  conferencia: <Users className="h-5 w-5" />,
};

const OpportunityDetail = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
  }, []);

  useEffect(() => {
    // Simulando una llamada a la API
    const fetchOpportunity = () => {
      setLoading(true);
      try {
        // Por ahora usamos los datos mock
        const found = opportunitiesData.find((opp) => opp.id.toString() === id);
        if (found) {
          setOpportunity(found);
        } else {
          setError("Oportunidad no encontrada");
        }
      } catch (err) {
        setError("Error al cargar la oportunidad");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!opportunity) return <div>Oportunidad no encontrada</div>;

  return (
    // Detailed view of selected opportunity
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
      <Link
        to="/edutracker"
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-white border border-primary hover:bg-primary rounded-md transition-all duration-200 ease-in-out mb-6 group"
      >
        <ChevronLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Volver a oportunidades</span>
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-64 overflow-hidden">
          <img
            src={opportunity.imageUrl}
            alt={opportunity.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          <div className="flex items-center mb-4">
            {typeIcons[opportunity.type]}
            <span className="ml-2 text-sm font-medium text-gray-500 capitalize">
              {opportunity.type}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-dark mb-4">
            {opportunity.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Detalles</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{opportunity.country}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>
                    Fecha límite:{" "}
                    {new Date(opportunity.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span>{opportunity.organization}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Requisitos</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {opportunity.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-gray-600 mb-8">{opportunity.description}</p>

          <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors">
            Aplicar Ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
