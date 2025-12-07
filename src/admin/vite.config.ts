import { mergeConfig, type UserConfig } from "vite";

export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    resolve: {
      alias: {
        "@": "/src",
        // Polyfill para path en el navegador
        path: "path-browserify",
      },
    },
    define: {
      // Definir global para compatibilidad
      global: "globalThis",
    },
    optimizeDeps: {
      // Incluir polyfills para módulos de Node.js
      include: ["path-browserify"],
    },
  });
};
