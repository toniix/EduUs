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

export async function createOpportunity(data) {
  // Obtener usuario autenticado
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return {
      success: false,
      error: "No se pudo obtener el usuario autenticado.",
    };
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

/**
 * Actualiza una oportunidad existente
 * @param {string} id - ID de la oportunidad a actualizar
 * @param {Object} data - Datos actualizados de la oportunidad
 * @returns {Promise<{success: boolean, data: Object|null, error: string|null}>}
 */
export async function updateOpportunity(id, data) {
  console.log(data);
  try {
    // Verificar autenticación
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return {
        success: false,
        data: null,
        error: "No se pudo autenticar al usuario",
      };
    }

    // Obtener la oportunidad existente
    console.log("Fetching opportunity with ID:", id);
    const { data: existingOpportunity, error: fetchError } = await supabase
      .from("opportunities")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingOpportunity) {
      return {
        success: false,
        error: "No se encontró la oportunidad",
      };
    }

    // Verificar que el usuario autenticado sea el creador de la oportunidad
    if (existingOpportunity.created_by !== userData.user.id) {
      return {
        success: false,
        error:
          "No tienes permiso para editar esta oportunidad. Solo el creador puede modificarla.",
      };
    }

    console.log("Opportunity fetched successfully");

    // Procesar categoría si se proporciona
    let categoryId = existingOpportunity.category_id;
    console.log("categoryId:", categoryId);
    if (data.category) {
      categoryId = await getOrCreateCategory(data.category);
    }

    // Procesar imagen si se proporciona una nueva
    let imageUrl = existingOpportunity.image_url;
    if (data.image_url && data.image_url !== existingOpportunity.image_url) {
      if (typeof data.image_url !== "string") {
        // Es un archivo nuevo, subirlo a Cloudinary
        imageUrl = await uploadImageToCloudinary(data.image_url);
      } else {
        // Es una URL existente
        imageUrl = data.image_url;
      }
    }

    // Preparar datos para actualizar
    const updateData = {
      ...data,
      category_id: categoryId,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    };

    // Eliminar campos que no deben actualizarse directamente
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.created_by;
    delete updateData.category;
    delete updateData.creator;
    delete updateData.tags;

    console.log("Updating opportunity...");
    // Actualizar la oportunidad
    console.log("Updating opportunity with data:", updateData);
    const { data: updatedOpportunity, error: updateError } = await supabase
      .from("opportunities")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    console.log("Opportunity updated successfully");

    // Actualizar tags si se proporcionaron
    if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
      console.log("Processing tags:", data.tags);

      // Obtener o crear los tags y obtener sus IDs
      const tagPromises = data.tags.map((tag) => getOrCreateTag(tag));
      const tagIds = await Promise.all(tagPromises);

      console.log("Tag IDs to relate:", tagIds);

      if (tagIds.length > 0) {
        // Eliminar relaciones de tags existentes
        await supabase
          .from("opportunity_tags")
          .delete()
          .eq("opportunity_id", id);

        // Crear nuevas relaciones con los tags
        await relateTagsToOpportunity(id, tagIds);
      }
    }

    // Obtener la oportunidad actualizada con sus relaciones
    const { data: fullOpportunity, error: fetchUpdatedError } = await supabase
      .from("opportunities")
      .select(
        `
        *,
        category:categories(*),
        opportunity_tags(tag:tags(*))
      `
      )
      .eq("id", id)
      .single();

    if (fetchUpdatedError) {
      console.error("Error fetching updated opportunity:", fetchUpdatedError);
      return {
        success: true,
        data: updatedOpportunity,
        error:
          "Oportunidad actualizada, pero no se pudieron cargar los detalles completos",
      };
    }

    return {
      success: true,
      data: fullOpportunity,
      error: null,
    };
  } catch (error) {
    console.error("Error updating opportunity:", error);
    return {
      success: false,
      data: null,
      error: error.message || "Error al actualizar la oportunidad",
    };
  }
}

/**
 * Elimina una oportunidad por su ID
 * @param {string} id - ID de la oportunidad a eliminar
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function deleteOpportunity(id, userRole = null) {
  try {
    // 1. Autenticar al usuario
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return { success: false, error: "No se pudo autenticar al usuario" };
    }

    // 2. Obtener la oportunidad y verificar permisos
    const { data: opportunity, error: fetchError } = await supabase
      .from("opportunities")
      .select("created_by, image_url")
      .eq("id", id)
      .single();

    if (fetchError || !opportunity) {
      return { success: false, error: "No se encontró la oportunidad" };
    }

    const isAdmin = userRole === "admin";
    const isCreator = opportunity.created_by === userData.user.id;

    if (!isCreator && !isAdmin) {
      return {
        success: false,
        error: "No tienes permiso para eliminar esta oportunidad",
      };
    }

    // 3. Eliminar la imagen de Cloudinary si existe
    console.log("Deleting image from Cloudinary...");
    console.log("Image URL:", opportunity.image_url);
    if (opportunity.image_url) {
      try {
        const response = await fetch(
          "https://tlhkmdnopmqftsglmyqr.supabase.co/functions/v1/delete-image",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl: opportunity.image_url }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          console.warn(
            `Warning: Could not delete image from Cloudinary: ${result.error}`
          );
        }
      } catch (error) {
        console.warn("Warning: Error calling deleteImage API:", error);
      }
    }

    // 4. Eliminar relaciones de tags
    const { error: deleteTagsError } = await supabase
      .from("opportunity_tags")
      .delete()
      .eq("opportunity_id", id);

    if (deleteTagsError) {
      console.warn("Warning deleting tag relations:", deleteTagsError);
    }

    // 5. Eliminar la oportunidad de Supabase
    const { error: deleteOppError } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", id);

    if (deleteOppError) {
      throw new Error(deleteOppError.message);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in deleteOpportunity:", error);
    return {
      success: false,
      error: error.message || "Error al eliminar la oportunidad",
    };
  }
}
