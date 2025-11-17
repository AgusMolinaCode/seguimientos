"use server";

import {
  getCachedViaCargoData,
  getCachedBusPackData,
  getCachedOCAData,
  getCachedAndreaniData,
} from "@/lib/cache/cached-tracking";
import { addToHistory } from "@/lib/history/tracking-history";
import type { ScraperResult } from "./types";

/**
 * Track Via Cargo shipment with caching and history
 */
export async function trackViaCargoWithCache(
  trackingNumber: string
): Promise<ScraperResult> {
  // Get cached result
  const result = await getCachedViaCargoData(trackingNumber);

  // If successful, add to history
  if (result.success && result.data) {
    await addToHistory("via-cargo", trackingNumber, result.data);
  }

  return result;
}

/**
 * Track BusPack shipment with caching and history
 */
export async function trackBusPackWithCache(
  letra: string,
  boca: string,
  numero: string
): Promise<ScraperResult> {
  // Get cached result
  const result = await getCachedBusPackData(letra, boca, numero);

  // If successful, add to history
  if (result.success && result.data) {
    const trackingNumber = `${letra}-${boca}-${numero}`;
    await addToHistory("buspack", trackingNumber, result.data);
  }

  return result;
}

/**
 * Track OCA shipment with caching and history
 */
export async function trackOCAWithCache(
  trackingNumber: string
): Promise<ScraperResult> {
  // Get cached result
  const result = await getCachedOCAData(trackingNumber);

  // If successful, add to history
  if (result.success && result.data) {
    await addToHistory("oca", trackingNumber, result.data);
  }

  return result;
}

/**
 * Track Andreani shipment with caching and history
 */
export async function trackAndreaniWithCache(
  trackingNumber: string
): Promise<ScraperResult> {
  // Get cached result
  const result = await getCachedAndreaniData(trackingNumber);

  // If successful, add to history
  if (result.success && result.data) {
    await addToHistory("andreani", trackingNumber, result.data);
  }

  return result;
}
