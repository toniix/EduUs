/**
 * Optimiza una URL de Cloudinary inyectando transformaciones de formato y calidad automáticos.
 *
 * - `f_auto` → entrega WebP, AVIF o el mejor formato según el navegador.
 * - `q_auto` → calidad automática optimizada por Cloudinary.
 * - `w_<width>` → opcional, redimensiona la imagen al ancho indicado.
 * - `c_fill,g_auto` → opcional, recorte inteligente para llenar dimensiones.
 *
 * @param {string} url          – URL original de Cloudinary (puede o no tener transformaciones)
 * @param {object} [options]
 * @param {number} [options.width]  – Ancho deseado en px
 * @param {string} [options.crop]   – Modo de recorte, p.ej. "fill", "fit", "scale" (default: "fill")
 * @param {string} [options.gravity]– Punto focal, p.ej. "auto", "face" (default: "auto")
 * @returns {string} URL optimizada
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== "string") return url;

  // Solo procesar URLs de Cloudinary
  if (!url.includes("res.cloudinary.com")) return url;

  const { width, crop = "fill", gravity = "auto" } = options;

  // Transformaciones base (formato y calidad automáticos)
  const transforms = ["f_auto", "q_auto"];

  if (width) {
    transforms.push(`w_${width}`, `c_${crop}`, `g_${gravity}`);
  }

  const transformString = transforms.join(",");

  // Patrón: https://res.cloudinary.com/<cloud>/image/upload/<posibles_transformaciones>/v<version>/<archivo>
  // Si ya tiene transformaciones, las reemplazamos; si no, las insertamos
  const uploadSegment = "/image/upload/";
  const uploadIndex = url.indexOf(uploadSegment);

  if (uploadIndex === -1) return url;

  const afterUpload = url.substring(uploadIndex + uploadSegment.length);

  // Detectar si ya tiene transformaciones
  const versionOrIdMatch = afterUpload.match(/v\d+\//);

  if (versionOrIdMatch) {
    const versionIndex = afterUpload.indexOf(versionOrIdMatch[0]);
    const existingTransforms = afterUpload.substring(0, versionIndex);
    const rest = afterUpload.substring(versionIndex);

    // Si ya tiene f_auto y q_auto, no duplicar
    if (existingTransforms.includes("f_auto") && existingTransforms.includes("q_auto")) {
      if (width && !existingTransforms.includes(`w_${width}`)) {
        const widthTransforms = `w_${width},c_${crop},g_${gravity}`;
        const newTransforms = existingTransforms
          ? `${existingTransforms.replace(/\/$/, "")},${widthTransforms}/`
          : `${widthTransforms}/`;
        return url.substring(0, uploadIndex + uploadSegment.length) + newTransforms + rest;
      }
      return url;
    }

    // Insertar nuestras transformaciones antes de las existentes
    const newTransforms = existingTransforms
      ? `${transformString},${existingTransforms.replace(/\/$/, "")}/`
      : `${transformString}/`;

    return url.substring(0, uploadIndex + uploadSegment.length) + newTransforms + rest;
  }

  // No hay versión ni transformaciones previas
  return url.substring(0, uploadIndex + uploadSegment.length) + transformString + "/" + afterUpload;
}
