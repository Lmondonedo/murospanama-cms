import React from "react";
import { ArrowRight } from "@strapi/icons";

// Extender la interfaz de Window para incluir strapi
declare global {
  interface Window {
    strapi: any;
  }
}

interface RevalidateButtonProps {
  // Opcional: recibir props si es necesario
}

const RevalidateButton: React.FC<RevalidateButtonProps> = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRevalidate = async () => {
    try {
      setIsLoading(true);

      // Obtener el token de autorización de Strapi
      const token =
        localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");

      // Realizar la petición POST al endpoint de revalidación
      const response = await fetch("/api/global/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();

        // Mostrar notificación de éxito
        console.log("Revalidación exitosa:", result);
        alert("Revalidación web solicitada exitosamente");
      } else {
        throw new Error(`Error HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error("Error en la revalidación:", error);

      // Mostrar notificación de error
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al solicitar la revalidación: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRevalidate}
      disabled={isLoading}
      style={{
        marginLeft: "8px",
        padding: "8px 16px",
        backgroundColor: "#4945ff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: isLoading ? "not-allowed" : "pointer",
        fontSize: "14px",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <ArrowRight style={{ width: "16px", height: "16px" }} />
      {isLoading ? "Procesando..." : "Forzar Revalidación Web"}
    </button>
  );
};

export default RevalidateButton;
