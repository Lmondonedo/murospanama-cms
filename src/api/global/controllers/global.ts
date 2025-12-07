// src/api/global/controllers/global.js

import { factories } from "@strapi/strapi";

// --- Define la lógica de revalidación ---
const customActions = {
  async forceRevalidate(ctx) {
    // Nota: Es mejor obtener estas variables de forma segura
    const revalidationUrl = `${process.env.NEXTJS_REVALIDATE_URL}`; // e.g., https://yourdomain.com/api/revalidate
    const revalidationToken = process.env.REVALIDATION_TOKEN;

    if (!revalidationUrl || !revalidationToken) {
      ctx.badRequest("Configuración de revalidación faltante.", {
        error:
          "NEXTJS_REVALIDATE_URL o REVALIDATION_TOKEN no están definidos en Strapi .env.",
      });
      return;
    }

    const fullUrl = `${revalidationUrl}?secret=${revalidationToken}`;

    try {
      // Llama al endpoint secreto de NextJS
      const response = await fetch(fullUrl, { method: "GET" });

      if (!response.ok) {
        // Manejar códigos de estado como 401 (token inválido) o 500
        const errorText = await response.text();
        throw new Error(
          `NextJS Revalidation failed: ${response.status} - ${errorText}`
        );
      }

      strapi.log.info(
        "NextJS Revalidation triggered successfully by user action."
      );

      // Retorna una respuesta de éxito (código 200 OK por defecto)
      return {
        success: true,
        message: "Revalidación de NextJS solicitada con éxito.",
      };
    } catch (error) {
      strapi.log.error(
        "Error during manual NextJS Revalidation:",
        error.message
      );
      // Retorna un código 400 Bad Request o 500 Internal Server Error
      ctx.internalServerError(
        "Fallo en la revalidación. Revisar logs de Strapi.",
        { error: error.message }
      );
    }
  },
};

// --- Extensión del Core Controller ---
export default factories.createCoreController("api::global.global", () => ({
  // Esto mantiene todas las acciones CRUD por defecto (find, findOne, update, etc.)

  // Sobrescribe o añade funciones aquí.
  // Tu nueva función se inyecta directamente en el objeto de retorno:
  ...customActions,
}));
