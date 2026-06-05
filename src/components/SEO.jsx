import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://eduus.club";
const DEFAULT_IMAGE = `${BASE_URL}/logo_1.png`;
const SITE_NAME = "EDU-US";

/**
 * Componente SEO mejorado.
 * Gestiona: title, description, canonical, Open Graph, Twitter Cards y JSON-LD.
 *
 * @param {string}  title         - Título de la página (50-60 caracteres recomendado)
 * @param {string}  description   - Meta description (150-160 caracteres recomendado)
 * @param {string}  [image]       - URL absoluta de la imagen OG (1200×630 recomendado)
 * @param {string}  [type]        - OG type: "website" | "article" (default: "website")
 * @param {boolean} [noindex]     - true para páginas privadas / sin indexar
 * @param {object}  [jsonLd]      - Objeto JSON-LD para datos estructurados
 */
export default function SEO({
  title,
  description,
  image,
  type = "website",
  noindex = false,
  jsonLd,
}) {
  const { pathname } = useLocation();
  const canonicalUrl = `${BASE_URL}${pathname}`;
  const ogImage = image || DEFAULT_IMAGE;

  useEffect(() => {
    // ── 1. Title ──────────────────────────────────────────────────
    if (title) {
      document.title = title;
    }

    // ── 2. Helpers ────────────────────────────────────────────────
    const setMeta = (selector, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        // Determinar si es name o property
        if (selector.includes("property=")) {
          el.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
        } else {
          el.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] || "");
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    // ── 3. Meta básicas ───────────────────────────────────────────
    if (description) {
      setMeta('meta[name="description"]', description);
    }

    // Robots
    setMeta(
      'meta[name="robots"]',
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-snippet:160, max-image-preview:large"
    );

    // ── 4. Canonical ──────────────────────────────────────────────
    setLink("canonical", canonicalUrl);

    // ── 5. Open Graph ─────────────────────────────────────────────
    if (title) setMeta('meta[property="og:title"]', title);
    if (description) setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:type"]', type);
    setMeta('meta[property="og:site_name"]', SITE_NAME);
    setMeta('meta[property="og:image"]', ogImage);
    setMeta('meta[property="og:image:width"]', "1200");
    setMeta('meta[property="og:image:height"]', "630");
    setMeta('meta[property="og:locale"]', "es_PE");

    // ── 6. Twitter Cards ──────────────────────────────────────────
    setMeta('meta[name="twitter:card"]', "summary_large_image");
    if (title) setMeta('meta[name="twitter:title"]', title);
    if (description) setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', ogImage);
    setMeta('meta[name="twitter:site"]', "@eduus_latam");

    // ── 7. JSON-LD ────────────────────────────────────────────────
    const existingScript = document.getElementById("seo-jsonld");
    if (jsonLd) {
      const script = existingScript || document.createElement("script");
      script.id = "seo-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      if (!existingScript) document.head.appendChild(script);
    } else if (existingScript) {
      existingScript.remove();
    }

    // ── 8. Cleanup al desmontar ───────────────────────────────────
    return () => {
      // Solo limpiar JSON-LD dinámico
      const script = document.getElementById("seo-jsonld");
      if (script && !jsonLd) script.remove();
    };
  }, [title, description, canonicalUrl, ogImage, type, noindex, jsonLd]);

  return null;
}
