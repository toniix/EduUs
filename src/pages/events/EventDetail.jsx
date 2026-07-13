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
import { FaWhatsapp, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import EventRegistrationForm from "../../components/events/EventRegistrationForm";
import SEO from "../../components/SEO";
import { useAuth } from "../../contexts/AuthContext";
import { eventsService } from "../../services/eventsService";

const PLACEHOLDER = "https://via.placeholder.com/1200x500?text=EDU-US+Evento";

export default function EventDetail() {
  const { slug } = useParams();
  const locationState = useLocation();
  const { event, loading, error } = useEventBySlug(slug);
  const [successName, setSuccessName] = useState("");
  const [shareFeedback, setShareFeedback] = useState("");
  const { profile, isAuthenticated } = useAuth();

  // Verificar si el usuario ya está registrado
  useEffect(() => {
    let active = true;
    const verifyRegistration = async () => {
      if (event?.id && isAuthenticated && profile?.id) {
        const { registered, name } = await eventsService.checkUserRegistration(
          event.id,
          profile.id,
        );
        if (registered && active) {
          setSuccessName(name || profile.full_name || "Participante");
        }
      }
    };
    verifyRegistration();
    return () => {
      active = false;
    };
  }, [event, isAuthenticated, profile]);

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

  const speaker = event.speaker
    ? {
        name: event.speaker.name,
        role: event.speaker.role,
        company: event.speaker.company,
        avatar: event.speaker.avatar_url || event.speaker.avatar || null,
      }
    : null;

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
            {/* Columna Izquierda: Tarjeta de Detalles del Evento */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900/40 border border-gray-150 dark:border-gray-850 rounded-3xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-6 sm:p-8 md:p-10 space-y-8">
                {/* Título y metadatos */}
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
                    {price === 0 && (
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Acceso Libre
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-light leading-tight font-heading">
                    {title}
                  </h1>

                  {/* Info rápida */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-600 dark:text-gray-400 py-2 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Calendar className="w-4.5 h-4.5 text-primary" />
                      {formatEventDate(starts_at)}
                    </span>
                    {location && modality !== "virtual" && (
                      <span className="flex items-center gap-1.5 font-semibold">
                        <MapPin className="w-4.5 h-4.5 text-primary" />
                        {location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Acerca de este evento */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-light font-heading">
                    Acerca de este evento
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
                    {description}
                  </div>
                </div>

                {/* Ponente del Evento */}
                {speaker && (
                  <div className="border-t border-gray-100 dark:border-gray-850 pt-8 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-light font-heading">
                      Ponente del evento
                    </h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/35 border border-gray-100 dark:border-gray-800">
                      {speaker.avatar ? (
                        <img
                          src={speaker.avatar}
                          alt={speaker.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-sm transition-transform duration-350 hover:scale-105"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border-2 border-primary/20 shadow-sm">
                          {speaker.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-light">
                          {speaker.name}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-primary">
                          {speaker.role}
                        </p>
                        {speaker.company && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                            {speaker.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Compartir Evento */}
                <div className="border-t border-gray-100 dark:border-gray-850 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Compartir este evento:
                  </span>
                  <div className="flex gap-2 relative items-center">
                    <button
                      onClick={() => handleShare("whatsapp")}
                      className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-[#25D366] hover:border-[#25D366]/30 hover:bg-green-50/30 dark:hover:bg-green-950/10 transition-all active:scale-95 flex items-center justify-center"
                      aria-label="Compartir por WhatsApp"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center"
                      aria-label="Compartir por X / Twitter"
                    >
                      <FaXTwitter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-all active:scale-95 flex items-center justify-center"
                      aria-label="Compartir por LinkedIn"
                    >
                      <FaLinkedinIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-95 flex items-center justify-center"
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
                    {successName
                      ? "Inscripción registrada"
                      : "Reserva tu lugar"}
                  </h3>
                  {successName ? (
                    <></>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-primary font-heading">
                        {price === 0 ? "Gratis" : `S/ ${price}`}
                      </span>
                      {price > 0 && (
                        <span className="text-xs text-gray-400">
                          Pago único
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Formulario / Éxito */}
                {successName ? (
                  <div className="p-5 rounded-2xl border border-green-150/40 dark:border-green-950/60 bg-green-50/15 dark:bg-green-950/5 flex flex-col items-center text-center gap-5 py-8 animate-[fadeIn_0.3s_ease] relative overflow-hidden">
                    {/* Glowing background highlights */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#25D366]/5 rounded-full blur-2xl pointer-events-none" />

                    {/* Pulsing checkmark badge */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md animate-ping" />
                      <div className="relative w-16 h-16 rounded-full bg-green-500/10 dark:bg-green-500/15 border border-green-500/30 flex items-center justify-center text-green-500">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="space-y-2.5 z-10">
                      <h4 className="text-base font-bold text-gray-900 dark:text-light tracking-tight font-heading">
                        ¡Cupo Asegurado!
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-[280px] mx-auto">
                        Hola{" "}
                        <strong className="text-gray-900 dark:text-light font-bold">
                          {successName}
                        </strong>
                        , tu cupo ha sido reservado con éxito. Te hemos enviado
                        un correo de confirmación con los detalles del evento.
                      </p>
                    </div>

                    <div className="w-full border-t border-gray-150/40 dark:border-gray-850 pt-4 mt-1 z-10">
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-3">
                        Únete a nuestro canal de WhatsApp para mantenerte
                        informado sobre este y otros eventos:
                      </p>

                      <a
                        href="https://chat.whatsapp.com/KLGckmNVzvO7nuqWURd1Pf?s=cl&p=i&mlu=3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 px-5 py-3 w-full rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-green-500/20"
                      >
                        <FaWhatsapp className="w-4 h-4 text-white" />
                        Unirse al grupo de WhatsApp
                      </a>
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
