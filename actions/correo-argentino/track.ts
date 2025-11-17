"use server";

import { scrapeCorreoArgentino } from "./scraper";
import type { ScraperResult } from "../types";

/**
 * Server action to track Correo Argentino shipments
 */
export async function trackCorreoArgentino(
  trackingNumber: string
): Promise<ScraperResult> {
  return scrapeCorreoArgentino(trackingNumber);
}
