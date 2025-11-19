"use server";

import type { ScraperResult, TrackingInfo } from "../types";

/**
 * Interface para los eventos parseados de Correo Argentino
 */
interface CorreoArgentinoEvent {
  fecha: string;
  planta: string;
  historia: string;
  estado: string;
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
    const formData = new URLSearchParams();
    formData.append("action", "mercadolibre");
    formData.append("id", trackingNumber);

    // Hacer petición POST a la API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`API Correo Argentino error: ${response.status} ${response.statusText}`);
    }

    // Obtener la respuesta HTML
    const htmlText = await response.text();

    // Log para debugging en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.log("Correo Argentino API response length:", htmlText.length);
      console.log("Response preview:", htmlText.substring(0, 200));
    }

    // Verificar si el tracking no fue encontrado
    if (htmlText.includes("No se encontraron resultados") || htmlText.includes("no encontrada") || htmlText.length < 200) {
      console.error("Correo Argentino: No se encontró tracking o respuesta vacía");
      return {
        success: false,
        error: "No se encontró información para este número de tracking. Verifica que sea correcto.",
      };
    }

    // Parsear la tabla HTML
    const eventos = parseCorreoArgentinoHTML(htmlText);

    if (eventos.length === 0) {
      console.error("Correo Argentino: No se pudieron parsear eventos de la respuesta");
      return {
        success: false,
        error: "No se pudieron procesar los datos de seguimiento. Por favor, intenta nuevamente.",
      };
    }

    // El primer evento es el más reciente
    const latestEvent = eventos[0];
    const currentStatus = latestEvent.estado || latestEvent.historia || "Desconocido";

    // Obtener origen y destino
    const firstEvent = eventos[eventos.length - 1]; // Primer evento (origen)
    const origin = firstEvent.planta || "N/A";
    const destination = latestEvent.planta || "N/A";

    // Construir timeline
    const timeline = eventos.map((event) => {
      const datetime = event.fecha || "N/A";
      const location = event.planta || "N/A";

      let status = event.historia || "Sin información";
      if (event.estado && event.estado.trim() !== "") {
        status += ` - ${event.estado}`;
      }

      return {
        datetime,
        location,
        status,
      };
    });

    // Construir mensaje de estado firmado
    let signedByMessage = currentStatus;
    if (latestEvent.fecha) {
      signedByMessage += ` - ${latestEvent.fecha}`;
    }
    if (latestEvent.planta) {
      signedByMessage += ` - ${latestEvent.planta}`;
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
      incidents: latestEvent.estado && latestEvent.estado !== currentStatus
        ? latestEvent.estado
        : "",
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

/**
 * Parser de HTML para extraer los eventos de la tabla
 * @param htmlText - Texto HTML de la respuesta de Correo Argentino
 * @returns Array de eventos parseados
 */
function parseCorreoArgentinoHTML(htmlText: string): CorreoArgentinoEvent[] {
  const eventos: CorreoArgentinoEvent[] = [];

  try {
    // El HTML de Correo Argentino tiene <tr> sin cerrar, así que buscamos desde <tr> hasta el siguiente <tr> o </tbody>
    // Primero, extraemos la sección tbody
    const tbodyMatch = htmlText.match(/<tbody>([\s\S]*?)<\/tbody>/i);
    if (!tbodyMatch) {
      console.error("Correo Argentino Parser: No se encontró <tbody> en la respuesta HTML");
      if (process.env.NODE_ENV === "development") {
        console.log("HTML received:", htmlText.substring(0, 500));
      }
      return [];
    }

    const tbodyContent = tbodyMatch[1];

    // Dividir por <tr> para obtener las filas
    const rows = tbodyContent.split(/<tr>/i).filter(r => r.trim().length > 0);

    for (const row of rows) {
      // Buscar todas las celdas <td> en esta fila
      const cellRegex = /<td[^>]*>(.*?)<\/td>/gi;
      const cells = [];
      let match;

      while ((match = cellRegex.exec(row)) !== null) {
        // Limpiar el contenido de la celda (eliminar HTML interno si hay)
        const content = match[1].replace(/<[^>]+>/g, '').trim();
        cells.push(content);
      }

      // Si tenemos 4 celdas, es una fila válida (Fecha, Planta, Historia, Estado)
      if (cells.length >= 4) {
        eventos.push({
          fecha: cells[0],
          planta: cells[1],
          historia: cells[2],
          estado: cells[3],
        });
      }
    }

    return eventos;
  } catch (error) {
    console.error("Error parseando HTML de Correo Argentino:", error);
    return [];
  }
}
