import { useEffect, useState } from "react";
/**
 * Sub-componente para la previsualización de imagen local.
 * Crea y revoca la Object URL correctamente para evitar memory leaks.
 */
const ImagePreview = ({ file }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    // Cleanup: liberar la URL al desmontar o cambiar el archivo
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt="Previsualización"
      className="mt-2 rounded-xl max-h-40 border"
    />
  );
};
export default ImagePreview;
