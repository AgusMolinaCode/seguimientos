"use server";

import { scrapeBusPack } from "./scraper";
import type { ScraperResult } from "../types";
import type { BusPackParams } from "./types";

/**
 * Server action para trackear envíos de BusPack
 * @param params - Parámetros con Letra, Boca y Numero
 * @returns Resultado del scraping con datos del envío
 */
export async function trackBusPack(
  params: BusPackParams
): Promise<ScraperResult> {
  try {
    console.log("Iniciando scraping BusPack para:", params);

    // Validar parámetros
    if (!params.letra || !params.boca || !params.numero) {
      return {
        success: false,
        error: "Todos los parámetros son requeridos: Letra, Boca y Numero",
      };
    }

    // Validar que no estén vacíos
    if (
      params.letra.trim() === "" ||
      params.boca.trim() === "" ||
      params.numero.trim() === ""
    ) {
      return {
        success: false,
        error: "Los parámetros no pueden estar vacíos",
      };
    }

    const result = await scrapeBusPack({
      letra: params.letra.trim(),
      boca: params.boca.trim(),
      numero: params.numero.trim(),
    });

    return result;
  } catch (error) {
    console.error("Error en trackBusPack:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
