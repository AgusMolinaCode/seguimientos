"use server";

import type { ScraperResult, TrackingInfo } from "../types";

/**
 * Interface para la respuesta de Correo Argentino
 */
interface CorreoArgentinoEvent {
  fecha?: string;
  hora?: string;
  estado?: string;
  subestado?: string;
  oficina?: string;
  localidad?: string;
  provincia?: string;
  comentarios?: string;
}

interface CorreoArgentinoResponse {
  error?: boolean;
  mensaje?: string;
  resultado?: {
    eventos?: CorreoArgentinoEvent[];
    numero?: string;
    estadoActual?: string;
    [key: string]: any;
  };
}

/**
 * Scraper de Correo Argentino usando la API oficial
 * @param trackingNumber - Número de tracking de Correo Argentino
 * @returns Resultado del tracking con timeline completo
 */
export async function scrapeCorreoArgentino(
  trackingNumber: string
): Promise<ScraperResult> {
  try {
    // URL de la API de Correo Argentino
    const apiUrl = "https://www.correoargentino.com.ar/sites/all/modules/custom/ca_forms/api/wsFacade.php";

    // Crear FormData con los parámetros requeridos
    const formData = new FormData();
    formData.append("action", "mercadolibre");
    formData.append("id", trackingNumber);

    // Hacer petición POST a la API
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Correo Argentino error: ${response.status} ${response.statusText}`);
    }

    // Obtener la respuesta JSON
    const data: CorreoArgentinoResponse = await response.json();

    // Verificar si hay error en la respuesta
    if (data.error || !data.resultado) {
      return {
        success: false,
        error: data.mensaje || "No se encontró información para este número de tracking. Verifica que sea correcto.",
      };
    }

    const resultado = data.resultado;
    const eventos = resultado.eventos || [];

    if (eventos.length === 0) {
      return {
        success: false,
        error: "No hay eventos de seguimiento disponibles para este envío.",
      };
    }

    // El primer evento es el más reciente
    const latestEvent = eventos[0];
    const currentStatus = latestEvent.estado || "Desconocido";

    // Obtener origen y destino
    const firstEvent = eventos[eventos.length - 1]; // Primer evento (origen)
    const origin = firstEvent.localidad && firstEvent.provincia
      ? `${firstEvent.localidad}, ${firstEvent.provincia}`
      : firstEvent.localidad || firstEvent.provincia || "N/A";

    const destination = latestEvent.localidad && latestEvent.provincia
      ? `${latestEvent.localidad}, ${latestEvent.provincia}`
      : latestEvent.localidad || latestEvent.provincia || "N/A";

    // Construir timeline
    const timeline = eventos.map((event) => {
      const fecha = event.fecha || "";
      const hora = event.hora || "";
      const datetime = fecha && hora ? `${fecha} ${hora}` : fecha || hora || "N/A";

      const location = [
        event.oficina,
        event.localidad,
        event.provincia
      ].filter(Boolean).join(", ") || "N/A";

      let status = event.estado || "Sin información";
      if (event.subestado) {
        status += ` - ${event.subestado}`;
      }
      if (event.comentarios) {
        status += ` (${event.comentarios})`;
      }

      return {
        datetime,
        location,
        status,
      };
    });

    // Construir mensaje de estado firmado
    const lastEventDate = latestEvent.fecha && latestEvent.hora
      ? `${latestEvent.fecha} ${latestEvent.hora}`
      : latestEvent.fecha || "";

    const lastLocation = [latestEvent.oficina, latestEvent.localidad]
      .filter(Boolean)
      .join(" - ");

    let signedByMessage = currentStatus;
    if (lastEventDate) {
      signedByMessage += ` - ${lastEventDate}`;
    }
    if (lastLocation) {
      signedByMessage += ` - ${lastLocation}`;
    }

    // Construir objeto TrackingInfo
    const trackingInfo: TrackingInfo = {
      trackingNumber,
      currentStatus,
      origin,
      destination,
      pieces: "N/A",
      weight: "N/A",
      signedBy: signedByMessage,
      service: "Correo Argentino",
      carrier: "Correo Argentino",
      timeline,
      incidents: latestEvent.comentarios || "",
    };

    return {
      success: true,
      data: trackingInfo,
    };
  } catch (error) {
    console.error("Error en scrapeCorreoArgentino:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `Error al obtener información: ${error.message}`
          : "Error desconocido al procesar la solicitud de Correo Argentino",
    };
  }
}
