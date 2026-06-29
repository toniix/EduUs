import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useEventBySlug } from "../../hooks/useEvents";
import {
  formatEventDate,
  categoryConfig,
  modalityConfig,
} from "../../utils/events";
import { optimizeCloudinaryUrl } from "../../utils/cloudinaryOptimize";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  Share2,
  Users,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import EventRegistrationForm from "../../components/events/EventRegistrationForm";
import SEO from "../../components/SEO";

const PLACEHOLDER = "https://via.placeholder.com/1200x500?text=EDU-US+Evento";

export default function EventDetail() {
  const { slug } = useParams();
  const locationState = useLocation();
  const { event, loading, error } = useEventBySlug(slug);
  const [successName, setSuccessName] = useState("");
  const [shareFeedback, setShareFeedback] = useState("");

  // Manejar scroll suave al formulario si viene con hash #inscripcion
  useEffect(() => {
    if (event && locationState.hash === "#inscripcion") {
      setTimeout(() => {
        const element = document.getElementById("inscripcion");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [event, locationState]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30 dark:bg-dark py-12 animate-pulse">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-10 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <div className="h-4.5 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            </div>
            <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/30 dark:bg-dark py-12 px-4 text-center">
        <AlertTriangle className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-light mb-2 font-heading">
          El evento no fue encontrado
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-6">
          Es posible que el enlace esté roto o que el evento haya sido retirado
          por la organización.
        </p>
        <Link
          to="/eventos"
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-md hover:bg-primary/95 transition-all"
        >
          Volver a Eventos
        </Link>
      </div>
    );
  }

  const {
    title,
    category,
    modality,
    starts_at,
    ends_at,
    location,
    capacity,
    spots_left,
    price,
    description,
    banner_url,
  } = event;

  const catCfg = categoryConfig[category] || {
    label: category,
    badgeClass: "bg-gray-100 text-gray-700",
  };

  const modalCfg = modalityConfig[modality] || {
    label: modality,
    icon: "📍",
  };

  const isSoldOut = spots_left === 0;

  const handleShare = (platform) => {
    const shareUrl = window.location.href;
    const text = `¡Únete al evento "${title}" organizado por EDU-US!`;

    let url = "";
    if (platform === "whatsapp") {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + shareUrl)}`;
    } else if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === "linkedin") {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
      setShareFeedback("¡Copiado al portapapeles!");
      setTimeout(() => setShareFeedback(""), 2000);
      return;
    }

    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <SEO
        title={`${title} | Eventos EDU-US`}
        description={
          description?.substring(0, 160) ||
          "Detalle del evento y registro en línea."
        }
        image={banner_url}
      />

      <div className="min-h-screen bg-secondary/15 dark:bg-dark py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Botón de regreso */}
          <Link
            to="/edutracker?tab=events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-primary transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver a eventos
          </Link>

          {/* Grid Principal de 2 Columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Columna Izquierda: Información de Evento */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${catCfg.badgeClass}`}
                  >
                    {catCfg.label}
                  </span>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {modalCfg.label}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-light leading-tight font-heading">
                  {title}
                </h1>

                {/* Info rápida */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-600 dark:text-gray-400 py-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    {formatEventDate(starts_at)}
                  </span>
                  {location && modality !== "virtual" && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      {location}
                    </span>
                  )}
                </div>
              </div>

              {/* Compartir Evento */}
              <div className="border-t border-b border-gray-100 dark:border-gray-800/80 py-4 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Compartir este evento:
                </span>
                <div className="flex gap-2 relative items-center">
                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                    aria-label="Compartir por WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.176c-1.493.799-2.863 1.93-3.716 3.217-1.735 2.786-2.262 6.144-1.463 9.234.397 1.527 1.172 2.958 2.212 4.174.524.572 1.159 1.07 1.865 1.404 1.502.74 3.127 1.123 4.821 1.123 2.488 0 4.817-.726 6.852-2.095 2.035-1.369 3.627-3.37 4.614-5.811 1.463-3.66 1.227-7.684-.649-11.134-.85-1.599-2.136-2.952-3.685-3.957-1.549-1.005-3.315-1.619-5.223-1.788zm10.389-10.154c-.788-.028-1.546.234-2.135.789-.589.555-.974 1.301-1.101 2.115-.127.814.073 1.652.567 2.322.494.67 1.244 1.113 2.098 1.188.854.075 1.717-.171 2.368-.702.651-.531 1.084-1.318 1.187-2.181.103-.863-.188-1.749-.825-2.426-.637-.677-1.567-1.104-2.559-1.205zm5.156-.404c-1.065-.021-2.104.326-2.895.969-.791.643-1.319 1.568-1.485 2.599-.166 1.031.088 2.09.716 2.942.628.852 1.578 1.43 2.649 1.57 1.071.14 2.177-.274 2.967-.997.79-.723 1.307-1.762 1.441-2.879.134-1.117-.262-2.288-1.087-3.146-.825-.858-1.988-1.366-3.206-1.458z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                    aria-label="Compartir por X / Twitter"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                    aria-label="Compartir por LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                    aria-label="Copiar enlace"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {shareFeedback && (
                    <span className="absolute -top-8 right-0 text-[10px] bg-dark text-white dark:bg-light dark:text-dark px-2 py-1 rounded shadow-md animate-fade-in whitespace-nowrap">
                      {shareFeedback}
                    </span>
                  )}
                </div>
              </div>

              {/* Acerca de este evento */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-light font-heading">
                  Acerca de este evento
                </h2>
                <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
                  {description}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Tarjeta de Registro Sticky */}
            <div
              id="inscripcion"
              className="lg:col-span-1 lg:sticky lg:top-24 space-y-6"
            >
              <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-150 dark:border-gray-850 rounded-3xl p-6 shadow-sm">
                {/* Cabecera del formulario */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-light mb-1.5 font-heading">
                    Reserva tu lugar
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-primary font-heading">
                      {price === 0 ? "Gratis" : `S/ ${price}`}
                    </span>
                    {price > 0 && (
                      <span className="text-xs text-gray-400">Pago único</span>
                    )}
                  </div>
                </div>

                {/* Formulario / Éxito */}
                {successName ? (
                  <div className="flex flex-col items-center text-center gap-4 py-8 animate-[fadeIn_0.3s_ease]">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-light">
                        ¡Registro Confirmado!
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                        Hola{" "}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {successName}
                        </span>
                        , tu cupo ha sido reservado. Te enviamos la confirmación
                        e instrucciones de acceso a tu correo.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Detalles adicionales en form */}
                    <div className="space-y-3 mb-6 pb-4 border-b border-gray-200/60 dark:border-gray-800/80 text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {spots_left !== null && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span>
                            {isSoldOut ? (
                              <span className="text-red-500 font-semibold">
                                Cupos agotados
                              </span>
                            ) : (
                              <span>
                                {spots_left} cupos restantes de un aforo de{" "}
                                {capacity}
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                      {ends_at && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>
                            Finaliza:{" "}
                            {new Date(ends_at).toLocaleTimeString("es-PE", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    <EventRegistrationForm
                      event={event}
                      onSuccess={(name) => setSuccessName(name)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
