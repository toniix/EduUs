import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOpportunity } from "../../hooks/useOpportunities";
import { ChevronLeft } from "lucide-react";
import { statusColors } from "../../utils/opportunity";
import OpportunityLoading from "./OpportunityLoading";
import OpportunityError from "./OpportunityError";
import OpportunityNotFound from "./OpportunityNotFound";
import OpportunitySidebar from "./OpportunitySidebar";
import ShareOpportunity from "./ShareOpportunity";
import SEO from "../SEO";
import DetailHeader from "./OpportunityDetailHeader";
import DetailBody from "./OpportunityDetailBody";

const OpportunityDetail = () => {
  const { id } = useParams();
  const { opportunity, loading, error } = useOpportunity(id);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Función para abrir el modal
  const openShareModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeShareModal = () => {
    setIsModalOpen(false);
    setSelectedNetwork(null);
  };
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Aquí implementarías la lógica para guardar/quitar de favoritos
  };

  if (loading) {
    return <OpportunityLoading />;
  }

  if (error) {
    return <OpportunityError />;
  }

  if (!opportunity) {
    return <OpportunityNotFound />;
  }

  const {
    id: opportunityId,
    title,
    organization,
    description,
    location,
    deadline,
    image_url,
    tags,
    category,
    country,
    requirements,
    benefits,
    contact,
    modality,
    audience,
  } = opportunity;


  // console.log("oportunity:", opportunity);
  // Supón que data.requirements viene como un string JSON
  const parsedRequirements =
    typeof requirements === "string" ? JSON.parse(requirements) : requirements;

  const parsedBenefits =
    typeof benefits === "string" ? JSON.parse(benefits) : benefits;

  // console.log("requirements:", requirements);
  // console.log("type:", typeof requirements);
  // console.log("is array:", Array.isArray(requirements));
  const isExpired = deadline && new Date(deadline) < new Date();

  const status = isExpired ? "inactive" : "active";

  const statusConfig = statusColors[status] || statusColors.active;
  const StatusIcon = statusConfig.icon;

  const daysUntilDeadline = deadline
    ? Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <>
      <SEO
        title={`${opportunity.title} en ${opportunity.country} – Postulación abierta | EDU-US`}
        description={`Postula a ${opportunity.title} en ${opportunity.country}. Conoce requisitos, beneficios y fecha límite. Convocatoria abierta.`}
      />
      <div className="min-h-screen bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link
              to="/edutracker"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-white border border-primary hover:bg-primary rounded-lg transition-all duration-200 ease-in-out group"
            >
              <ChevronLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Volver a oportunidades</span>
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenido Principal */}
            <div className="lg:col-span-2 space-y-6">
              <DetailHeader
                title={title}
                image_url={image_url}
                status={status}
                statusConfig={statusConfig}
                category={category}
                modality={modality}
                organization={organization}
                location={location}
                country={country}
                tags={tags}
                openShareModal={openShareModal}
              />
              <DetailBody
                description={description}
                audience={audience}
                parsedRequirements={parsedRequirements}
                parsedBenefits={parsedBenefits}
              />
            </div>

            <OpportunitySidebar
              deadline={deadline}
              contact={contact}
              opportunityId={opportunityId}
              isExpired={isExpired}
              daysUntilDeadline={daysUntilDeadline}
            />
          </div>
        </div>
        {/* Modal de compartir */}
        {isModalOpen && (
          <ShareOpportunity
            opportunity={opportunity}
            closeModal={closeShareModal}
          />
        )}
      </div>
    </>
  );
};

export default OpportunityDetail;
