import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Video, ExternalLink } from "lucide-react";

/* ─── Detectores de plataforma ───────────────────────────────── */
function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

function getVimeoId(url) {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

function isFacebookUrl(url) {
  if (!url) return false;
  return /facebook\.com|fb\.watch/i.test(url);
}

/* ─── Resolver ───────────────────────────────────────────────── */
function resolveVideo(url) {
  const ytId = getYouTubeId(url);
  if (ytId) {
    return {
      type: "youtube",
      ytId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
      thumbnail: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
    };
  }
  const vmId = getVimeoId(url);
  if (vmId) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vmId}?autoplay=1`,
      thumbnail: null,
    };
  }
  if (isFacebookUrl(url)) {
    return { type: "facebook" };
  }
  return { type: "direct", directUrl: url };
}

/* ─── Card de apertura para Facebook ─────────────────────────── */
function FacebookPreviewCard({ url, title }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#1877f2]/10 via-[#1877f2]/5 to-slate-900 hover:from-[#1877f2]/20 transition-all duration-300 p-8 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#1877f2] flex items-center justify-center shadow-lg shadow-[#1877f2]/30 group-hover:scale-105 transition-transform duration-300">
        <svg
          viewBox="0 0 24 24"
          className="w-9 h-9 fill-white"
          aria-hidden="true"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </div>
      <div>
        <p className="text-white font-semibold text-sm mb-1 line-clamp-2">
          {title}
        </p>
        <p className="text-[#1877f2]/80 text-xs font-medium">Ver en Facebook</p>
      </div>
      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1877f2] text-white text-xs font-semibold shadow group-hover:bg-[#1665d8] transition-colors duration-200">
        <ExternalLink className="w-3 h-3" />
        Abrir video
      </span>
    </a>
  );
}

/* ─── Reproductor para YouTube / Vimeo / Directo ─────────────── */
function EmbedPlayer({ resolved, videoTitle }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!isPlaying ? (
        <motion.div
          key="thumbnail"
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={() => setIsPlaying(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {resolved.thumbnail ? (
            <img
              src={resolved.thumbnail}
              alt={videoTitle}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-103"
              onError={(e) => {
                if (resolved.ytId) {
                  e.target.src = `https://img.youtube.com/vi/${resolved.ytId}/hqdefault.jpg`;
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 flex flex-col items-center justify-center p-6 text-center">
              <Video className="w-12 h-12 text-gray-700 mb-3 animate-pulse" />
              <p className="text-sm font-semibold text-gray-300">
                {videoTitle}
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:opacity-70 transition-opacity duration-300" />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/30 border border-white/20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            </motion.div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-[10px] text-white font-medium uppercase tracking-wide mb-1 border border-white/10">
              <Play className="w-2.5 h-2.5 fill-current" /> Reproducir video
            </span>
            <p className="text-white text-sm font-medium drop-shadow-md truncate">
              {videoTitle}
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="player"
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {resolved.type === "direct" ? (
            <video
              src={resolved.directUrl}
              controls
              autoPlay
              className="w-full h-full"
            />
          ) : (
            <iframe
              src={resolved.embedUrl}
              title={videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Componente principal ───────────────────────────────────── */
export default function OpportunityVideoSection({ video }) {
  if (!video || !video.url) return null;

  const resolved = resolveVideo(video.url);
  const videoTitle = video.title || "Video informativo de la oportunidad";

  return (
    <motion.section
      aria-label="Video informativo"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Video className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-bold text-gray-900 leading-tight">
            Conoce más sobre esta convocatoria
          </h2>
        </div>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-primary transition-colors"
          title="Abrir en plataforma original"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Reproductor */}
      <div className="p-6">
        <div
          className="relative w-full overflow-hidden rounded-xl bg-gray-950 shadow-inner group"
          style={{ aspectRatio: "16/9" }}
        >
          {/* ── Facebook: tarjeta de apertura externa ── */}
          {resolved.type === "facebook" && (
            <FacebookPreviewCard url={video.url} title={videoTitle} />
          )}

          {/* ── YouTube / Vimeo / Directo: Reproductor diferido nativo de React ── */}
          {resolved.type !== "facebook" && (
            <EmbedPlayer resolved={resolved} videoTitle={videoTitle} />
          )}
        </div>
      </div>
    </motion.section>
  );
}
