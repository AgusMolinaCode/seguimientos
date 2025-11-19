"use server";

import { cacheLife, cacheTag } from "next/cache";
import { getViaCargoData } from "@/actions/via-cargo/track";
import { trackBusPack } from "@/actions/buspack/track";
import { trackOCA } from "@/actions/oca/track";
import { trackAndreani } from "@/actions/andreani/track";
import { trackCorreoArgentino } from "@/actions/correo-argentino/track";
import type { ScraperResult } from "@/actions/types";

// ⚠️ CACHING STRATEGY DECISION (HUMAN INPUT):
// - Content type: Dynamic tracking data (changes as shipments move)
// - Update frequency: Shipment status updates every few hours
// - User decision: 4-6 hours cache duration (performance priority)
// - Revalidation: Time-based (shipments update on carrier schedules)
// - Strategy: Public cache with medium-term revalidation

/**
 * Via Cargo tracking query (no caching due to Puppeteer browser automation)
 * Caching disabled: Browser automation incompatible with Next.js cache in serverless
 */
async function getCachedViaCargoData(
  trackingNumber: string
): Promise<ScraperResult> {
  // "use cache" disabled - Puppeteer browser automation incompatible with serverless caching
  return getViaCargoData(trackingNumber);
}

/**
 * BusPack tracking query (no caching due to Puppeteer browser automation)
 * Caching disabled: Browser automation incompatible with Next.js cache in serverless
 */
async function getCachedBusPackData(
  letra: string,
  boca: string,
  numero: string
): Promise<ScraperResult> {
  // "use cache" disabled - Puppeteer browser automation incompatible with serverless caching
  return trackBusPack({ letra, boca, numero });
}

/**
 * Cached OCA tracking query
 * Cache duration: 4-6 hours
 */
async function getCachedOCAData(
  trackingNumber: string
): Promise<ScraperResult> {
  "use cache";

  cacheLife({
    stale: 300,
    revalidate: 14400,
    expire: 21600,
  });

  cacheTag(`oca-${trackingNumber}`);

  return trackOCA(trackingNumber);
}

/**
 * Andreani tracking query (no caching due to Puppeteer browser automation)
 * Caching disabled: Browser automation incompatible with Next.js cache in serverless
 */
async function getCachedAndreaniData(
  trackingNumber: string
): Promise<ScraperResult> {
  // "use cache" disabled - Puppeteer browser automation incompatible with serverless caching
  return trackAndreani(trackingNumber);
}

/**
 * Cached Correo Argentino tracking query
 * Cache duration: 4-6 hours
 */
async function getCachedCorreoArgentinoData(
  trackingNumber: string
): Promise<ScraperResult> {
  "use cache";

  cacheLife({
    stale: 300,
    revalidate: 14400,
    expire: 21600,
  });

  cacheTag(`correo-argentino-${trackingNumber}`);

  return trackCorreoArgentino(trackingNumber);
}

// Export all cached functions
export {
  getCachedViaCargoData,
  getCachedBusPackData,
  getCachedOCAData,
  getCachedAndreaniData,
  getCachedCorreoArgentinoData,
};
