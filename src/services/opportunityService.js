import { supabase } from "../lib/supabase";
import { uploadImageToCloudinary } from "../services/cloudinaryService";
import { createSlug } from "../utils/slugify";

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
  const userId = userData.user.id;

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
      slug: createSlug(data.title), // Generar slug desde el título
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
 * Valida y obtiene la cantidad actual de oportunidades destacadas
 * @param {string} excludeOpportunityId - ID de la oportunidad a excluir del conteo
 * @returns {Promise<number>} Número de oportunidades destacadas
 */
export async function getCountOfFeaturedOpportunities(
  excludeOpportunityId = null,
) {
  let query = supabase
    .from("opportunities")
    .select("id", { count: "exact", head: true })
    .eq("is_featured", true);
  // .eq("status", "active");

  if (excludeOpportunityId) {
    query = query.neq("id", excludeOpportunityId);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(
      `Error contando oportunidades destacadas: ${error.message}`,
    );
  }

  return count || 0;
}

/**
 * Valida que no exista otra oportunidad con el mismo featured_order
 * @param {number} featuredOrder - El orden a validar
 * @param {string} excludeOpportunityId - ID de la oportunidad a excluir del search
 * @returns {Promise<Object|null>} Oportunidad conflictiva o null si no existe
 */
async function findOpportunityByFeaturedOrder(
  featuredOrder,
  excludeOpportunityId = null,
) {
  let query = supabase
    .from("opportunities")
    .select("id, title, featured_order")
    .eq("featured_order", featuredOrder)
    .eq("is_featured", true)
    // .eq("status", "active")
    .single();

  try {
    const { data } = await query;

    // Si existe una oportunidad con este orden
    if (data && data.id !== excludeOpportunityId) {
      return data;
    }
    return null;
  } catch (error) {
    // Si no se encontró nada, retornar null
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }
}

/**
 * Reorganiza los órdenes destacados después de eliminar o cambiar uno
 * @param {number} removedOrder - El orden que fue removido
 */
async function reorganizeFeaturedOrders(removedOrder) {
  // Obtener todas las oportunidades destacadas ordenadas por featured_order
  const { data: featured, error } = await supabase
    .from("opportunities")
    .select("id, featured_order")
    .eq("is_featured", true)
    // .eq("status", "active")
    .gt("featured_order", removedOrder)
    .order("featured_order", { ascending: true });

  if (error) {
    console.warn("Error reorganizando órdenes:", error);
    return;
  }

  // Decrementar en 1 cada orden mayor al removido
  if (featured && featured.length > 0) {
    for (const opp of featured) {
      await supabase
        .from("opportunities")
        .update({ featured_order: opp.featured_order - 1 })
        .eq("id", opp.id);
    }
  }
}

/**
 * Actualiza una oportunidad existente
 * @param {string} id - ID de la oportunidad a actualizar
 * @param {Object} data - Datos actualizados de la oportunidad
 * @returns {Promise<{success: boolean, data: Object|null, error: string|null}>}
 */
export async function updateOpportunity(id, data, userRole = null) {
  console.log(data);
  console.log(userRole);
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

    // Verificar que el usuario autenticado sea el creador de la oportunidad o un admin
    console.log("verificando permisos para usuario:", userData.user.id);
    if (
      existingOpportunity.created_by !== userData.user.id &&
      userRole !== "admin"
    ) {
      return {
        success: false,
        error:
          "No tienes permiso para editar esta oportunidad. Solo el creador o un administrador puede modificarla.",
      };
    }

    console.log("Opportunity fetched successfully");

    // ========== VALIDACIONES DE DESTACADO ==========
    const isMarkingAsFeatured = data.is_featured === true;
    const wasAlreadyFeatured = existingOpportunity.is_featured === true;
    const isUnmarkingAsFeatured =
      data.is_featured === false && wasAlreadyFeatured;

    if (isMarkingAsFeatured) {
      // 1. Validar que no se exceda el máximo de 4 destacadas
      const featuredCount = await getCountOfFeaturedOpportunities(id);
      if (featuredCount >= 4) {
        return {
          success: false,
          error: "Ya hay 4 oportunidades destacadas. No se pueden agregar más.",
        };
      }

      // 2. Validar que featured_order sea válido y no esté duplicado
      if (data.featured_order) {
        const featuredOrder = parseInt(data.featured_order);

        // Validar rango 1-4
        if (featuredOrder < 1 || featuredOrder > 4) {
          return {
            success: false,
            error: "La posición destacada debe estar entre 1 y 4.",
          };
        }

        // Verificar si otro ya tiene este orden
        const conflictingOpportunity = await findOpportunityByFeaturedOrder(
          featuredOrder,
          id,
        );

        if (conflictingOpportunity) {
          // Reasignar automáticamente el orden anterior al conflictivo
          console.log(
            `Reasignando orden ${featuredOrder} de ${conflictingOpportunity.title}`,
          );

          // Buscar un orden disponible
          let newOrder = 1;
          while (newOrder <= 4) {
            const occupied = await findOpportunityByFeaturedOrder(newOrder, id);
            if (!occupied) break;
            newOrder++;
          }

          if (newOrder > 4) {
            return {
              success: false,
              error:
                "No hay posiciones disponibles. Intenta liberar una primero.",
            };
          }

          // Actualizar la oportunidad conflictiva
          await supabase
            .from("opportunities")
            .update({ featured_order: newOrder })
            .eq("id", conflictingOpportunity.id);

          console.log(
            `Orden reasignado: ${conflictingOpportunity.id} → posición ${newOrder}`,
          );
        }
      }
    }

    // Si se desmarca como destacada y tenía un orden, reorganizar
    if (isUnmarkingAsFeatured && existingOpportunity.featured_order) {
      await reorganizeFeaturedOrders(existingOpportunity.featured_order);
      console.log(
        `Órdenes reorganizados después de remover posición ${existingOpportunity.featured_order}`,
      );
    }

    // ========== FIN VALIDACIONES DE DESTACADO ==========

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
      slug: data.title ? createSlug(data.title) : existingOpportunity.slug,
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
      `,
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
      .select("created_by, image_url, is_featured, featured_order")
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

    // 3. Si es una oportunidad destacada, reorganizar órdenes
    if (opportunity.is_featured && opportunity.featured_order) {
      await reorganizeFeaturedOrders(opportunity.featured_order);
      console.log(
        `Órdenes reorganizados después de eliminar posición ${opportunity.featured_order}`,
      );
    }

    // 4. Eliminar la imagen de Cloudinary si existe
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
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          console.warn(
            `Warning: Could not delete image from Cloudinary: ${result.error}`,
          );
        }
      } catch (error) {
        console.warn("Warning: Error calling deleteImage API:", error);
      }
    }

    // 5. Eliminar relaciones de tags
    const { error: deleteTagsError } = await supabase
      .from("opportunity_tags")
      .delete()
      .eq("opportunity_id", id);

    if (deleteTagsError) {
      console.warn("Warning deleting tag relations:", deleteTagsError);
    }

    // 6. Eliminar la oportunidad de Supabase
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
