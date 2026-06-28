import { motion } from "framer-motion";
import {
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Send, // Telegram
  ExternalLink,
} from "lucide-react";

/* ─── Config por red social ──────────────────────────────────── */
const SOCIAL_CONFIG = {
  website: {
    label: "Sitio web",
    Icon: Globe,
    color: "text-gray-600",
    bg: "bg-gray-50 hover:bg-gray-100",
    border: "border-gray-200 hover:border-gray-300",
    iconBg: "bg-gray-100",
  },
  facebook: {
    label: "Facebook",
    Icon: Facebook,
    color: "text-blue-600",
    bg: "bg-blue-50 hover:bg-blue-100",
    border: "border-blue-100 hover:border-blue-200",
    iconBg: "bg-blue-100",
  },
  twitter: {
    label: "Twitter / X",
    Icon: Twitter,
    color: "text-sky-500",
    bg: "bg-sky-50 hover:bg-sky-100",
    border: "border-sky-100 hover:border-sky-200",
    iconBg: "bg-sky-100",
  },
  linkedin: {
    label: "LinkedIn",
    Icon: Linkedin,
    color: "text-blue-700",
    bg: "bg-blue-50 hover:bg-blue-100",
    border: "border-blue-100 hover:border-blue-200",
    iconBg: "bg-blue-100",
  },
  instagram: {
    label: "Instagram",
    Icon: Instagram,
    color: "text-pink-500",
    bg: "bg-pink-50 hover:bg-pink-100",
    border: "border-pink-100 hover:border-pink-200",
    iconBg: "bg-pink-100",
  },
  youtube: {
    label: "YouTube",
    Icon: Youtube,
    color: "text-red-600",
    bg: "bg-red-50 hover:bg-red-100",
    border: "border-red-100 hover:border-red-200",
    iconBg: "bg-red-100",
  },
  telegram: {
    label: "Telegram",
    Icon: Send,
    color: "text-sky-600",
    bg: "bg-sky-50 hover:bg-sky-100",
    border: "border-sky-100 hover:border-sky-200",
    iconBg: "bg-sky-100",
  },
};

/**
 * Normaliza un conjunto de campos de contacto / social_links al formato uniforme
 * { key, url, label }[]
 *
 * Acepta:
 *   • social_links: { facebook, twitter, instagram, linkedin, youtube, telegram }
 *   • contact: { website, email } — se extrae solo website aquí
 */
function normalizeSocials(socialLinks = {}, websiteUrl = null) {
  const entries = [];

  if (websiteUrl) {
    entries.push({ key: "website", url: websiteUrl });
  }

  const KNOWN_KEYS = ["facebook", "twitter", "linkedin", "instagram", "youtube", "telegram"];
  for (const key of KNOWN_KEYS) {
    const url = socialLinks?.[key];
    if (url && typeof url === "string" && url.trim()) {
      entries.push({ key, url: url.trim() });
    }
  }

  return entries;
}

/* ─── Chip / pill por red ────────────────────────────────────── */
function SocialChip({ item, index }) {
  const config = SOCIAL_CONFIG[item.key] || SOCIAL_CONFIG.website;
  const { Icon } = config;

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group inline-flex items-center gap-2.5 px-4 py-2.5
        rounded-xl border text-sm font-medium
        transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]
        active:scale-[0.97]
        ${config.bg} ${config.border} ${config.color}
      `}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.23, 1, 0.32, 1] }}
      aria-label={`Visitar ${config.label}`}
    >
      <span
        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${config.iconBg} transition-transform duration-200 group-hover:scale-110`}
      >
        <Icon className="w-3.5 h-3.5" />
      </span>
      <span>{config.label}</span>
      <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-80 transition-opacity duration-150 ml-auto flex-shrink-0" />
    </motion.a>
  );
}

/* ─── Componente principal ───────────────────────────────────── */
/**
 * OpportunitySocialLinks
 *
 * Props:
 *   social_links: object  — { facebook?, twitter?, instagram?, linkedin?, youtube?, telegram? }
 *   website: string|null  — URL del sitio web de la institución
 *   organization: string  — Nombre de la organización (para el label)
 */
export default function OpportunitySocialLinks({
  social_links,
  website,
  organization,
}) {
  const items = normalizeSocials(social_links, website);

  if (items.length === 0) return null;

  return (
    <motion.section
      aria-label={`Redes sociales de ${organization || "la institución"}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <Globe className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              Redes sociales
            </h2>
            {organization && (
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">
                {organization}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Chips */}
      <div className="p-6 flex flex-wrap gap-3">
        {items.map((item, i) => (
          <SocialChip key={`${item.key}-${i}`} item={item} index={i} />
        ))}
      </div>
    </motion.section>
  );
}
