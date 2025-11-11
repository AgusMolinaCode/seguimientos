"use server";

import { scrapeViaCargo } from "./scraper";
import type { ScraperResult } from "../types";

export async function getViaCargoData(
  trackingNumber: string
): Promise<ScraperResult> {
  try {

    if (!trackingNumber || trackingNumber.trim().length === 0) {
      return {
        success: false,
        error: "El número de tracking es requerido",
      };
    }

    const result = await scrapeViaCargo(trackingNumber.trim());
    return result;
  } catch (error) {
    console.error("Error en getViaCargoData:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
