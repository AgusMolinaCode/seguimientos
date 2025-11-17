"use server";

import { promises as fs } from "fs";
import path from "path";
import type { TrackingInfo } from "@/actions/types";

// Path to history file in project root
const HISTORY_FILE = path.join(process.cwd(), "data", "tracking-history.json");

export interface HistoryEntry {
  id: string;
  carrier: "via-cargo" | "buspack" | "oca" | "andreani" | "correo-argentino";
  trackingNumber: string;
  timestamp: number;
  lastStatus: string;
  data: TrackingInfo;
}

/**
 * Ensure data directory exists
 */
async function ensureDataDirectory(): Promise<void> {
  const dataDir = path.dirname(HISTORY_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

/**
 * Read history from JSON file
 */
async function readHistory(): Promise<HistoryEntry[]> {
  try {
    await ensureDataDirectory();
    const fileContent = await fs.readFile(HISTORY_FILE, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return [];
  }
}

/**
 * Write history to JSON file
 */
async function writeHistory(history: HistoryEntry[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
}

/**
 * Add or update a tracking entry in history
 */
export async function addToHistory(
  carrier: HistoryEntry["carrier"],
  trackingNumber: string,
  data: TrackingInfo
): Promise<void> {
  const history = await readHistory();

  // Create unique ID for this tracking entry
  const id = `${carrier}-${trackingNumber}`;

  // Check if entry already exists
  const existingIndex = history.findIndex((entry) => entry.id === id);

  const newEntry: HistoryEntry = {
    id,
    carrier,
    trackingNumber,
    timestamp: Date.now(),
    lastStatus: data.currentStatus || data.timeline[0]?.status || "Unknown",
    data,
  };

  if (existingIndex >= 0) {
    // Update existing entry
    history[existingIndex] = newEntry;
  } else {
    // Add new entry at the beginning
    history.unshift(newEntry);
  }

  // Keep only last 50 entries
  const trimmedHistory = history.slice(0, 50);

  await writeHistory(trimmedHistory);
}

/**
 * Get recent tracking history
 * @param limit Maximum number of entries to return (default: 10)
 */
export async function getRecentHistory(limit: number = 10): Promise<HistoryEntry[]> {
  const history = await readHistory();
  return history.slice(0, limit);
}

/**
 * Get history for a specific carrier
 */
export async function getHistoryByCarrier(
  carrier: HistoryEntry["carrier"]
): Promise<HistoryEntry[]> {
  const history = await readHistory();
  return history.filter((entry) => entry.carrier === carrier);
}

/**
 * Delete a specific history entry by ID
 */
export async function deleteHistoryEntry(id: string): Promise<void> {
  const history = await readHistory();
  const filteredHistory = history.filter((entry) => entry.id !== id);
  await writeHistory(filteredHistory);
}

/**
 * Clear all history
 */
export async function clearHistory(): Promise<void> {
  await writeHistory([]);
}
