import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  );

  // Traer todas las oportunidades con slug y fecha de actualización
  const { data, error } = await supabase
    .from("opportunities")
    .select("id, slug, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return res.status(500).send("Error generating sitemap");
  }

  const baseUrl = "https://eduus.club";
  const today = new Date().toISOString().split("T")[0];

  // Rutas estáticas con prioridad y frecuencia de cambio adecuadas
  const staticRoutes = [
    { path: "",          changefreq: "weekly",  priority: "1.0" },
    { path: "/nosotros", changefreq: "monthly", priority: "0.8" },
    { path: "/unete",    changefreq: "monthly", priority: "0.8" },
    { path: "/edutracker", changefreq: "daily", priority: "0.9" },
    { path: "/privacidad", changefreq: "yearly", priority: "0.3" },
    { path: "/terminos",   changefreq: "yearly", priority: "0.3" },
  ];

  // Generar XML de cada URL como bloque limpio y consistente
  const buildUrlEntry = (loc, lastmod, changefreq, priority) =>
    [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");

  const staticUrls = staticRoutes
    .map((route) =>
      buildUrlEntry(
        `${baseUrl}${route.path}`,
        today,
        route.changefreq,
        route.priority,
      ),
    )
    .join("\n");

  const opportunityUrls = (data || [])
    .map((item) =>
      buildUrlEntry(
        `${baseUrl}/edutracker/oportunidad/${item.slug || item.id}`,
        new Date(item.updated_at || today).toISOString().split("T")[0],
        "weekly",
        "0.7",
      ),
    )
    .join("\n");

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    staticUrls,
    opportunityUrls,
    "</urlset>",
  ].join("\n");

  // Cache de 24 horas (los crawlers revisan aprox. cada 24 h)
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
  res.status(200).send(sitemap);
}

