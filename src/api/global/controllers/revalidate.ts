export default {
  async revalidate(ctx) {
    try {
      // Obtener la configuración desde las variables de entorno
      const revalidateUrl =
        process.env.NEXTJS_REVALIDATE_URL ||
        "http://localhost:3000/api/revalidate";
      const revalidationToken = process.env.REVALIDATION_TOKEN;

      if (!revalidationToken) {
        return ctx.badRequest("Token de revalidación no configurado");
      }

      // Realizar la petición al endpoint de Next.js
      const response = await fetch(revalidateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${revalidationToken}`,
        },
        body: JSON.stringify({
          path: "/", // Revalidar la página principal
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Log para debugging
        strapi.log.info("Revalidación exitosa:", result);

        return ctx.send({
          success: true,
          message: "Revalidación solicitada exitosamente",
          timestamp: new Date().toISOString(),
          data: result,
        });
      } else {
        const errorText = await response.text();
        strapi.log.error("Error en revalidación:", errorText);

        return ctx.badRequest(
          `Error en la revalidación: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      strapi.log.error("Error interno en revalidación:", error);

      return ctx.internalServerError({
        error: "Error interno del servidor",
        details: error.message,
      });
    }
  },
};
