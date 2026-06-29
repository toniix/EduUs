import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useOpportunity } from "../../hooks/useOpportunities";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { statusColors } from "../../utils/opportunity";

// Estados de carga / error
import OpportunityLoading from "./OpportunityLoading";
import OpportunityError from "./OpportunityError";
import OpportunityNotFound from "./OpportunityNotFound";

// Secciones principales
import OpportunitySidebar from "./OpportunitySidebar";
import ShareOpportunity from "./ShareOpportunity";
import SEO from "../SEO";
import DetailHeader from "./OpportunityDetailHeader";
import DetailBody from "./OpportunityDetailBody";
import OpportunityVideoSection from "./OpportunityVideoSection";
import OpportunityTimeline from "./OpportunityTimeline";
import OpportunityAIAssistant from "./OpportunityAIAssistant";
import { useAuth } from "../../contexts/AuthContext";
import OtherOpportunitiesList from "./OtherOpportunitiesList";
import RegisterSidebarCTA from "./RegisterSidebarCTA";

/* ─── OpportunityDetail ──────────────────────────────────────── */
const OpportunityDetail = () => {
  const { idOrSlug } = useParams();
  const { opportunity, loading, error } = useOpportunity(idOrSlug);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirección 301 (client-side): si entra por ID o slug viejo, redirigir al slug actual
  useEffect(() => {
    if (
      opportunity &&
      opportunity.slug &&
      (idOrSlug === opportunity.id || idOrSlug === opportunity.slug) &&
      idOrSlug !== opportunity.slug
    ) {
      navigate(`/edutracker/oportunidad/${opportunity.slug}`, {
        replace: true,
      });
    }
  }, [opportunity, idOrSlug, navigate]);

  if (loading) return <OpportunityLoading />;
  if (error) return <OpportunityError error={error} />;
  if (!opportunity) return <OpportunityNotFound />;

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
    created_at,
    social_links,
    application_steps,
    documentation,
  } = opportunity;

  const parsedRequirements =
    typeof requirements === "string" ? JSON.parse(requirements) : requirements;
  const parsedBenefits =
    typeof benefits === "string" ? JSON.parse(benefits) : benefits;

  const isExpired = deadline && new Date(deadline) < new Date();
  const status = isExpired ? "inactive" : "active";
  const statusConfig = statusColors[status] || statusColors.active;

  const daysUntilDeadline = deadline
    ? Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  /* ── Schema.org ── */
  const opportunityJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: opportunity.title,
    description: opportunity.description,
    url: `https://eduus.club/edutracker/oportunidad/${opportunity.slug || opportunity.id}`,
    organizer: {
      "@type": "Organization",
      name: opportunity.organization || "EDU-US",
    },
    ...(opportunity.image_url && { image: opportunity.image_url }),
    ...(opportunity.deadline && {
      endDate: new Date(opportunity.deadline).toISOString().split("T")[0],
    }),
    ...(opportunity.location && {
      location: {
        "@type": "Place",
        name: opportunity.location,
        address: {
          "@type": "PostalAddress",
          addressCountry: opportunity.country || "PE",
        },
      },
    }),
    ...(opportunity.modality === "virtual" || opportunity.modality === "online"
      ? { eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode" }
      : {}),
  };

  /* ── Normalizar redes sociales: acepta `social_links` o contacto directo ── */
  const resolvedSocials =
    social_links &&
    Object.keys(social_links).filter((k) => social_links[k]).length > 0
      ? social_links
      : {};

  const resolvedSteps =
    application_steps && application_steps.length > 0 ? application_steps : [];

  return (
    <>
      <SEO
        title={`${opportunity.title} en ${opportunity.country} – Postulación abierta | EDU-US`}
        description={`Postula a ${opportunity.title} en ${opportunity.country}. Conoce requisitos, beneficios y fecha límite. Convocatoria abierta en EDU-US.`}
        image={opportunity.image_url}
        type="article"
        jsonLd={opportunityJsonLd}
      />

      <div className="min-h-screen bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <motion.nav
            className="mb-6"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <Link
              to="/edutracker"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-500 hover:text-primary border border-gray-200 hover:border-primary/30 hover:bg-primary/5 bg-white rounded-xl transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group active:scale-[0.98]"
            >
              <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Volver a oportunidades
            </Link>
          </motion.nav>

          {/* Layout principal: 2 col en desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Columna de contenido (2/3) ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Header */}
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
                openShareModal={() => setIsModalOpen(true)}
              />

              {/* Cuerpo: descripción, audiencia, requisitos, beneficios */}
              <DetailBody
                description={description}
                audience={audience}
                parsedRequirements={parsedRequirements}
                parsedBenefits={parsedBenefits}
              />
            </div>

            {/* ── Sidebar (1/3) ── */}
            <div className="space-y-6">
              <OpportunitySidebar
                deadline={deadline}
                contact={contact}
                social_links={resolvedSocials}
                opportunityId={opportunityId}
                isExpired={isExpired}
                daysUntilDeadline={daysUntilDeadline}
                organization={organization}
                created_at={created_at}
                documentation={documentation}
              />

              {/* Video secundario en el sidebar */}
              {opportunity.video_url && (
                <OpportunityVideoSection
                  video={{
                    url: opportunity.video_url,
                    title: opportunity.title,
                  }}
                />
              )}

              {/* CTA de Registro */}
              {!isAuthenticated && <RegisterSidebarCTA />}

              {/* Otras oportunidades abiertas */}
              <OtherOpportunitiesList currentOpportunityId={opportunityId} />
            </div>
          </div>

          {/* Timeline del proceso de postulación (Ancho Completo) */}
          <div className="mt-6">
            <OpportunityTimeline steps={resolvedSteps} deadline={deadline} />
          </div>
        </div>

        {/* Modal de compartir */}
        {isModalOpen && (
          <ShareOpportunity
            opportunity={opportunity}
            closeModal={() => setIsModalOpen(false)}
          />
        )}
      </div>

      {/* Asistente IA flotante (FAB) */}
      {/* <OpportunityAIAssistant opportunity={opportunity} /> */}
    </>
  );
};

export default OpportunityDetail;
