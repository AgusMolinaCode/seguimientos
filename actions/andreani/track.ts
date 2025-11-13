"use server";

import { scrapeAndreani } from "./scraper";
import type { ScraperResult } from "../types";

/**
 * Server action para trackear envíos de Andreani
 * @param trackingNumber - Número de seguimiento de 15 dígitos
 * @returns Resultado del scraping con datos del envío
 */
export async function trackAndreani(
  trackingNumber: string
): Promise<ScraperResult> {
  try {
    console.log("Iniciando scraping Andreani para:", trackingNumber);

    // Validar parámetros
    if (!trackingNumber || trackingNumber.trim().length === 0) {
      return {
        success: false,
        error: "El número de seguimiento es requerido",
      };
    }

    // Validar que sea numérico y tenga 15 dígitos
    if (!/^\d{15}$/.test(trackingNumber.trim())) {
      return {
        success: false,
        error: "El número de Andreani debe tener 15 dígitos numéricos",
      };
    }

    const result = await scrapeAndreani(trackingNumber.trim());
    return result;
  } catch (error) {
    console.error("Error en trackAndreani:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
