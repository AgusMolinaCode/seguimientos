"use server";

import type { ScraperResult, TrackingInfo } from "../types";

/**
 * Interface para los datos de la tabla XML de OCA
 */
interface OCATableData {
  IdLogAccion?: string;
  NumeroEnvio?: string;
  Motivo?: string;
  Estado?: string;
  IdEstado?: string;
  Sucursal?: string;
  Sucursal_Direccion?: string;
  Fecha?: string;
}

/**
 * Scraper de OCA usando la API XML oficial
 * @param trackingNumber - Número de seguimiento de OCA
 * @returns Resultado del tracking con timeline completo
 */
export async function scrapeOCA(
  trackingNumber: string
): Promise<ScraperResult> {
  try {

    // Construir URL de la API XML de OCA
    const apiUrl = `http://webservice.oca.com.ar/epak_tracking/Oep_TrackEPak.asmx/Tracking_Pieza_ConIdEstado?NumeroEnvio=${trackingNumber}`;

    // Hacer petición a la API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/xml, text/xml",
      },
    });

    if (!response.ok) {
      throw new Error(`API OCA error: ${response.status} ${response.statusText}`);
    }

    // Obtener el XML como texto
    const xmlText = await response.text();

    // Parsear el XML manualmente (Next.js no tiene DOMParser en el servidor)
    const tables = parseOCAXML(xmlText);

    if (tables.length === 0) {
      return {
        success: false,
        error: "No se encontró información para este número de tracking. Verifica que sea correcto.",
      };
    }

    // El último evento es el estado actual
    const latestEvent = tables[tables.length - 1];
    const currentStatus = latestEvent.Estado || "Desconocido";

    // Buscar información de origen/destino
    const firstEvent = tables[0];
    const lastLocation = latestEvent.Sucursal || "N/A";
    const lastAddress = latestEvent.Sucursal_Direccion || "N/A";

    // Construir timeline (invertir para que el más reciente esté primero)
    const timeline = tables.reverse().map((event) => {
      const datetime = event.Fecha
        ? formatOCADate(event.Fecha)
        : "N/A";

      const location = event.Sucursal_Direccion || event.Sucursal || "";

      let status = event.Estado || "Sin información";
      if (event.Motivo && event.Motivo !== "Sin Motivo") {
        status += ` (${event.Motivo})`;
      }

      return {
        datetime,
        location,
        status,
      };
    });

    // Construir mensaje de estado
    const lastEvent = tables[0]; // Ahora el primer elemento es el más reciente
    let signedByMessage = currentStatus;
    if (lastEvent.Fecha) {
      signedByMessage += ` - ${formatOCADate(lastEvent.Fecha)}`;
    }
    if (lastLocation !== "N/A") {
      signedByMessage += ` - ${lastLocation}`;
    }

    // Construir objeto TrackingInfo
    const trackingInfo: TrackingInfo = {
      trackingNumber,
      currentStatus,
      origin: firstEvent.Sucursal || "N/A",
      destination: lastLocation,
      pieces: "N/A",
      weight: "N/A",
      signedBy: signedByMessage,
      service: "OCA Argentina",
      carrier: "OCA",
      timeline,
      incidents: lastEvent.Motivo && lastEvent.Motivo !== "Sin Motivo"
        ? lastEvent.Motivo
        : "",
    };

    return {
      success: true,
      data: trackingInfo,
    };
  } catch (error) {
    console.error("Error en scrapeOCA:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `Error al obtener información: ${error.message}`
          : "Error desconocido al procesar la solicitud de OCA",
    };
  }
}

/**
 * Parser simple de XML para extraer los datos de las tablas
 * @param xmlText - Texto XML de la respuesta de OCA
 * @returns Array de objetos con los datos de cada tabla
 */
function parseOCAXML(xmlText: string): OCATableData[] {
  const tables: OCATableData[] = [];

  // Buscar todos los bloques <Table>...</Table>
  const tableRegex = /<Table[^>]*>([\s\S]*?)<\/Table>/gi;
  const tableMatches = xmlText.matchAll(tableRegex);

  for (const match of tableMatches) {
    const tableContent = match[1];
    const tableData: OCATableData = {};

    // Extraer cada campo del XML
    const extractField = (fieldName: string): string | undefined => {
      const fieldRegex = new RegExp(`<${fieldName}>([\\s\\S]*?)<\/${fieldName}>`, 'i');
      const fieldMatch = tableContent.match(fieldRegex);
      return fieldMatch ? fieldMatch[1].trim() : undefined;
    };

    tableData.IdLogAccion = extractField('IdLogAccion');
    tableData.NumeroEnvio = extractField('NumeroEnvio');
    tableData.Motivo = extractField('Motivo');
    tableData.Estado = extractField('Estado');
    tableData.IdEstado = extractField('IdEstado');
    tableData.Sucursal = extractField('Sucursal');
    tableData.Sucursal_Direccion = extractField('Sucursal_Direccion');
    tableData.Fecha = extractField('Fecha');

    tables.push(tableData);
  }

  return tables;
}

/**
 * Formatea la fecha de OCA a un formato legible
 * @param ocaDate - Fecha en formato ISO de OCA (2024-11-26T17:32:52.787-03:00)
 * @returns Fecha formateada (2024-11-26 17:32)
 */
function formatOCADate(ocaDate: string): string {
  try {
    const date = new Date(ocaDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch {
    return ocaDate; // Si falla el parseo, devolver el original
  }
}
