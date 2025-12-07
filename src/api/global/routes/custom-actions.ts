module.exports = {
  routes: [
    {
      // Usamos el método POST ya que es una acción de mutación/comando
      method: "POST",

      // La ruta que será llamada por el botón en el panel de Strapi
      path: "/global/revalidate",

      // Apunta al controlador 'global' y a la función 'forceRevalidate'
      handler: "global.forceRevalidate",

      config: {
        // 🚨 Configuración de Seguridad CRUCIAL 🚨
        // Esta ruta DEBE estar protegida para que solo la puedan llamar administradores.
        // La política 'admin::isAuthenticatedAdmin' garantiza que solo los usuarios
        // del panel de administración logueados (con rol adecuado) puedan acceder.
        policies: ["admin::isAuthenticatedAdmin"],
        auth: false, // Desactivar la autenticación del plugin de Usuarios y Permisos si solo queremos admins
      },
    },
  ],
};
