"use server";

import {
  getCachedViaCargoData,
  getCachedBusPackData,
  getCachedOCAData,
  getCachedAndreaniData,
  getCachedCorreoArgentinoData,
} from "@/lib/cache/cached-tracking";
import type { ScraperResult } from "./types";

/**
 * Track Via Cargo shipment with caching
 * History is handled client-side via localStorage
 */
export async function trackViaCargoWithCache(
  trackingNumber: string
): Promise<ScraperResult> {
  return await getCachedViaCargoData(trackingNumber);
}

/**
 * Track BusPack shipment with caching
 * History is handled client-side via localStorage
 */
export async function trackBusPackWithCache(
  letra: string,
  boca: string,
  numero: string
): Promise<ScraperResult> {
  return await getCachedBusPackData(letra, boca, numero);
}

/**
 * Track OCA shipment with caching
 * History is handled client-side via localStorage
 */
export async function trackOCAWithCache(
  trackingNumber: string
): Promise<ScraperResult> {
  return await getCachedOCAData(trackingNumber);
}

/**
 * Track Andreani shipment with caching
 * History is handled client-side via localStorage
 */
export async function trackAndreaniWithCache(
  trackingNumber: string
): Promise<ScraperResult> {
  return await getCachedAndreaniData(trackingNumber);
}

/**
 * Track Correo Argentino shipment with caching
 * History is handled client-side via localStorage
 */
export async function trackCorreoArgentinoWithCache(
  trackingNumber: string
): Promise<ScraperResult> {
  return await getCachedCorreoArgentinoData(trackingNumber);
}
