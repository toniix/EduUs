import { supabase } from "../lib/supabase";
import { uploadImageToCloudinary } from "../services/cloudinaryService";

// Busca o crea la categoría y retorna su id
async function getOrCreateCategory(name) {
  if (!name) return null;
  // Buscar categoría existente
  let { data: category, error } = await supabase
    .from("categories")
    .select("id")
    .eq("name", name)
    .single();
  if (category) return category.id;
  // Si no existe, crearla
  const { data: newCat, error: insertError } = await supabase
    .from("categories")
    .insert([{ name }])
    .select()
    .single();
  if (insertError)
    throw new Error("Error creando categoría: " + insertError.message);
  return newCat.id;
}

// Busca o crea un tag y retorna su id
async function getOrCreateTag(name) {
  if (!name) return null;
  let { data: tag, error } = await supabase
    .from("tags")
    .select("id")
    .eq("name", name)
    .single();
  if (tag) return tag.id;
  const { data: newTag, error: insertError } = await supabase
    .from("tags")
    .insert([{ name }])
    .select()
    .single();
  if (insertError) throw new Error("Error creando tag: " + insertError.message);
  return newTag.id;
}

// Relaciona tags con la oportunidad
async function relateTagsToOpportunity(opportunityId, tags) {
  if (!opportunityId || !tags?.length) return;
  const relations = tags.map((tagId) => ({
    opportunity_id: opportunityId,
    tag_id: tagId,
  }));
  const { error } = await supabase.from("opportunity_tags").insert(relations);
  if (error) throw new Error("Error relacionando tags: " + error.message);
}

export async function createOpportunity(data) {
  // Obtener usuario autenticado
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return { success: false, error: "No se pudo obtener el usuario autenticado." };
  }
  const userId = userData.user.id; // este será el created_by

  try {
    // 1. Procesar categoría
    let categoryId = null;
    console.log("empezando a procesar categoría");
    if (data.category) {
      categoryId = await getOrCreateCategory(data.category);
    }
    console.log("terminando de procesar categoría");

    // 2. Subir imagen a Cloudinary si es un archivo
    let imageUrl = data.image_url;
    if (imageUrl && typeof imageUrl !== "string") {
      // Si es un File/Blob
      imageUrl = await uploadImageToCloudinary(imageUrl);
    }

    // 3. Insertar oportunidad (sin tags todavía)
    const opportunityPayload = {
      ...data,
      category_id: categoryId,
      image_url: imageUrl || "",
      created_by: userId,
    };

    delete opportunityPayload.category; // No enviar el nombre, sino el id
    delete opportunityPayload.tags; // ← Agrega esta línea
    console.log("empezando a insertar oportunidad");
    const { data: result, error } = await supabase
      .from("opportunities")
      .insert([opportunityPayload])
      .select()
      .single();
    if (error) {
      console.log("error insertando oportunidad");
      return { success: false, error: error.message };
    }
    console.log("terminando de insertar oportunidad");
    const opportunityId = result.id;

    // 3. Procesar tags y relacionar
    if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
      const tagIds = [];
      for (const tagName of data.tags) {
        const tagId = await getOrCreateTag(tagName);
        tagIds.push(tagId);
      }
      await relateTagsToOpportunity(opportunityId, tagIds);
    }

    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.message || "Error desconocido" };
  }
}
