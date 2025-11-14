"use server";

import { scrapeOCA } from "./scraper";
import type { ScraperResult } from "../types";

/**
 * Server action para trackear envíos de OCA usando 17track.net
 * @param trackingNumber - Número de seguimiento
 * @returns Resultado del scraping con datos del envío
 */
export async function trackOCA(
  trackingNumber: string
): Promise<ScraperResult> {
  try {
    console.log("Iniciando scraping OCA para:", trackingNumber);

    // Validar parámetros
    if (!trackingNumber || trackingNumber.trim().length === 0) {
      return {
        success: false,
        error: "El número de seguimiento es requerido",
      };
    }

    const result = await scrapeOCA(trackingNumber.trim());
    return result;
  } catch (error) {
    console.error("Error en trackOCA:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
