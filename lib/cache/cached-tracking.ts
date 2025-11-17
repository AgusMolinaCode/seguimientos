"use server";

import { cacheLife, cacheTag } from "next/cache";
import { getViaCargoData } from "@/actions/via-cargo/track";
import { trackBusPack } from "@/actions/buspack/track";
import { trackOCA } from "@/actions/oca/track";
import { trackAndreani } from "@/actions/andreani/track";
import type { ScraperResult } from "@/actions/types";

// ⚠️ CACHING STRATEGY DECISION (HUMAN INPUT):
// - Content type: Dynamic tracking data (changes as shipments move)
// - Update frequency: Shipment status updates every few hours
// - User decision: 4-6 hours cache duration (performance priority)
// - Revalidation: Time-based (shipments update on carrier schedules)
// - Strategy: Public cache with medium-term revalidation

/**
 * Cached Via Cargo tracking query
 * Cache duration: 4-6 hours (balance between freshness and performance)
 */
async function getCachedViaCargoData(
  trackingNumber: string
): Promise<ScraperResult> {
  "use cache";

  // Custom cacheLife profile for tracking data
  // stale: 300s (5 min) - how long before considering stale
  // revalidate: 14400s (4 hours) - revalidate after 4 hours
  // expire: 21600s (6 hours) - hard expire after 6 hours
  cacheLife({
    stale: 300,
    revalidate: 14400,
    expire: 21600,
  });

  // Tag for potential on-demand revalidation
  cacheTag(`via-cargo-${trackingNumber}`);

  return getViaCargoData(trackingNumber);
}

/**
 * Cached BusPack tracking query
 * Cache duration: 4-6 hours
 */
async function getCachedBusPackData(
  letra: string,
  boca: string,
  numero: string
): Promise<ScraperResult> {
  "use cache";

  cacheLife({
    stale: 300,
    revalidate: 14400,
    expire: 21600,
  });

  const trackingId = `${letra}-${boca}-${numero}`;
  cacheTag(`buspack-${trackingId}`);

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
 * Cached Andreani tracking query
 * Cache duration: 4-6 hours
 */
async function getCachedAndreaniData(
  trackingNumber: string
): Promise<ScraperResult> {
  "use cache";

  cacheLife({
    stale: 300,
    revalidate: 14400,
    expire: 21600,
  });

  cacheTag(`andreani-${trackingNumber}`);

  return trackAndreani(trackingNumber);
}

// Export all cached functions
export {
  getCachedViaCargoData,
  getCachedBusPackData,
  getCachedOCAData,
  getCachedAndreaniData,
};
