/**
 * context-builder.ts
 *
 * Transforms a raw Supabase `opportunities` record into a clean,
 * human-readable text block suitable for injection into an LLM prompt.
 *
 * Design notes:
 * - Excludes all internal/technical fields (id, slug, image_url, created_by, timestamps…)
 * - For video_url: only signals its existence, never sends the URL to the model
 * - For documentation JSONB: extracts name, description, and URL of each document
 * - For contact / social_links JSONB: serializes to readable key=value pairs
 * - For application_steps JSONB: numbered list of steps
 * - Future-ready: if RAG is added, this builder can be extended to attach
 *   retrieved chunks as a new section at the end of the context string.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DocumentationItem {
  name?: string;
  title?: string;
  description?: string;
  url?: string;
  link?: string;
}

export interface ApplicationStep {
  step?: number;
  order?: number;
  title?: string;
  description?: string;
}

export interface Opportunity {
  id?: string;
  title?: string;
  description?: string;
  organization?: string;
  country?: string;
  location?: string;
  modality?: string;
  audience?: string;
  deadline?: string;
  benefits?: string[] | string;
  requirements?: string[] | string;
  contact?: Record<string, unknown> | null;
  social_links?: Record<string, unknown> | null;
  application_steps?: ApplicationStep[] | null;
  documentation?: DocumentationItem[] | null;
  video_url?: string | null;
  // Fields intentionally excluded from context:
  // image_url, created_by, created_at, updated_at, slug,
  // is_published, is_featured, featured_order, category_id
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parses a value that may be a JSON string, an array, or null.
 * Returns an array or null.
 */
function toArray<T>(value: T[] | string | null | undefined): T[] | null {
  if (!value) return null;
  if (Array.isArray(value)) return value.length > 0 ? value : null;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch {
      // Single-item string, not JSON
      return [value as unknown as T];
    }
  }
  return null;
}

/**
 * Formats a date string into a Spanish-language readable format.
 * e.g. "2025-03-15" → "15 de marzo de 2025"
 */
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Converts a JSONB contact/social_links object into a readable string.
 * Filters out null/empty/false values and formats as "key: value" lines.
 */
function formatJsonObject(
  obj: Record<string, unknown> | null | undefined,
  label: string
): string | null {
  if (!obj || typeof obj !== "object") return null;
  const entries = Object.entries(obj)
    .filter(([, v]) => v !== null && v !== "" && v !== false)
    .map(([k, v]) => `  - ${k}: ${v}`);
  if (entries.length === 0) return null;
  return `${label}:\n${entries.join("\n")}`;
}

/**
 * Formats a documentation JSONB array into a readable list.
 * Only includes name/title, description, and URL per item.
 */
function formatDocumentation(
  docs: DocumentationItem[] | null | undefined
): string | null {
  const arr = toArray(docs as unknown as DocumentationItem[] | string);
  if (!arr || arr.length === 0) return null;

  const lines: string[] = [];
  arr.forEach((doc, i) => {
    const name = doc.name || doc.title || `Documento ${i + 1}`;
    lines.push(`  ${i + 1}. ${name}`);
    if (doc.description) lines.push(`     Descripción: ${doc.description}`);
    if (doc.url || doc.link) lines.push(`     Enlace: ${doc.url || doc.link}`);
  });

  return lines.length > 0 ? `Documentación disponible:\n${lines.join("\n")}` : null;
}

/**
 * Formats application steps JSONB into a numbered list.
 */
function formatApplicationSteps(
  steps: ApplicationStep[] | null | undefined
): string | null {
  const arr = toArray(steps as unknown as ApplicationStep[] | string);
  if (!arr || arr.length === 0) return null;

  // Sort by step/order number if available
  const sorted = [...arr].sort((a, b) => {
    const na = a.step ?? a.order ?? 0;
    const nb = b.step ?? b.order ?? 0;
    return na - nb;
  });

  const lines = sorted
    .map((s, i) => {
      const num = s.step ?? s.order ?? i + 1;
      const title = s.title || `Paso ${num}`;
      return s.description
        ? `  ${num}. ${title}: ${s.description}`
        : `  ${num}. ${title}`;
    });

  return `Pasos para aplicar:\n${lines.join("\n")}`;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * buildOpportunityContext
 *
 * Builds a structured, LLM-ready text block from an `opportunities` record.
 *
 * @param opportunity - Raw record from the Supabase `opportunities` table
 * @returns A formatted string to be injected as context in the system prompt
 */
export function buildOpportunityContext(opportunity: Opportunity): string {
  const sections: string[] = [];

  sections.push("=== INFORMACIÓN DE LA OPORTUNIDAD ===");

  // Title
  if (opportunity.title) {
    sections.push(`Título: ${opportunity.title}`);
  }

  // Organization
  if (opportunity.organization) {
    sections.push(`Organización: ${opportunity.organization}`);
  }

  // Description
  if (opportunity.description) {
    sections.push(`Descripción:\n${opportunity.description}`);
  }

  // Audience
  if (opportunity.audience) {
    sections.push(`Dirigido a: ${opportunity.audience}`);
  }

  // Modality
  if (opportunity.modality) {
    sections.push(`Modalidad: ${opportunity.modality}`);
  }

  // Location / Country
  const locationParts: string[] = [];
  if (opportunity.location) locationParts.push(opportunity.location);
  if (opportunity.country) locationParts.push(opportunity.country);
  if (locationParts.length > 0) {
    sections.push(`Ubicación: ${locationParts.join(", ")}`);
  }

  // Deadline
  if (opportunity.deadline) {
    sections.push(`Fecha límite de postulación: ${formatDate(opportunity.deadline)}`);
  }

  // Requirements
  const requirements = toArray<string>(opportunity.requirements);
  if (requirements) {
    const reqLines = requirements.map((r) => `  - ${r}`).join("\n");
    sections.push(`Requisitos:\n${reqLines}`);
  }

  // Benefits
  const benefits = toArray<string>(opportunity.benefits);
  if (benefits) {
    const benLines = benefits.map((b) => `  - ${b}`).join("\n");
    sections.push(`Beneficios:\n${benLines}`);
  }

  // Application steps
  const steps = formatApplicationSteps(opportunity.application_steps);
  if (steps) sections.push(steps);

  // Documentation
  const docs = formatDocumentation(opportunity.documentation);
  if (docs) sections.push(docs);

  // Contact
  const contact = formatJsonObject(
    opportunity.contact as Record<string, unknown>,
    "Información de contacto"
  );
  if (contact) sections.push(contact);

  // Social links
  const socials = formatJsonObject(
    opportunity.social_links as Record<string, unknown>,
    "Redes sociales y enlaces"
  );
  if (socials) sections.push(socials);

  // Video (signal existence only — never send the URL to the model)
  if (opportunity.video_url) {
    sections.push("Nota: Existe un video relacionado disponible en esta oportunidad.");
  }

  sections.push("=== FIN DE LA INFORMACIÓN ===");

  return sections.join("\n\n");
}
