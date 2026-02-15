import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
  );

  // Traer solo oportunidades activas
  const { data, error } = await supabase
    .from("opportunities")
    .select("id, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return res.status(500).send("Error generating sitemap");
  }

  const baseUrl = "https://eduus.club";
  const today = new Date().toISOString().split("T")[0];
  const staticRoutes = [
    { path: "" },
    { path: "/nosotros" },
    { path: "/proyectos" },
    { path: "/edutracker" },
    { path: "/privacidad" },
    { path: "/terminos" },
  ];

  const staticUrls = staticRoutes
    .map(
      (route) => `
    <url>
      <loc>${baseUrl}${route.path}</loc>
      <lastmod>${today}</lastmod>
    </url>`,
    )
    .join("");

  const opportunityUrls = data
    .map(
      (item) => `
    <url>
      <loc>${baseUrl}/edutracker/oportunidad/${item.id}</loc>
      <lastmod>${new Date(item.updated_at).toISOString().split("T")[0]}</lastmod>
    </url>`,
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${opportunityUrls}
</urlset>`;

  // Headers para caché (los crawlers revisitan cada 24 horas aprox)
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
  res.status(200).send(sitemap);
}
