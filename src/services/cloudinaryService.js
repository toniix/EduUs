import { CLOUDINARY_CONFIG } from "../lib/cloudinary";

export async function uploadImageToCloudinary(file) {
  console.log(CLOUDINARY_CONFIG.cloudName, CLOUDINARY_CONFIG.uploadPreset);
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  console.log("empezando a subir imagen");
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Error subiendo imagen a Cloudinary");
  }

  const data = await response.json();
  console.log("terminando de subir imagen");
  return data.secure_url; // URL pública de la imagen
}
