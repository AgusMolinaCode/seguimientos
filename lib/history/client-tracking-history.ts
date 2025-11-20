"use client";

import type { TrackingInfo } from "@/actions/types";

const HISTORY_KEY = "tracking-history";
const MAX_ENTRIES = 50;

export interface HistoryEntry {
  id: string;
  carrier: "via-cargo" | "buspack" | "oca" | "andreani" | "correo-argentino";
  trackingNumber: string;
  timestamp: number;
  lastStatus: string;
  data: TrackingInfo;
}

/**
 * Read history from localStorage
 */
export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading history from localStorage:", error);
    return [];
  }
}

/**
 * Get recent history entries (limited)
 */
export function getRecentHistory(limit: number = 8): HistoryEntry[] {
  const history = getHistory();
  return history
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

/**
 * Add or update a tracking entry in history
 */
export function addToHistory(
  carrier: HistoryEntry["carrier"],
  trackingNumber: string,
  data: TrackingInfo
): void {
  if (typeof window === "undefined") return;

  try {
    const history = getHistory();
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

    if (existingIndex !== -1) {
      // Update existing entry
      history[existingIndex] = newEntry;
    } else {
      // Add new entry
      history.unshift(newEntry);
    }

    // Keep only the most recent MAX_ENTRIES entries
    const trimmedHistory = history
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_ENTRIES);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error adding to history:", error);
  }
}

/**
 * Delete a specific history entry by ID
 */
export function deleteHistoryEntry(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const history = getHistory();
    const filteredHistory = history.filter((entry) => entry.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error("Error deleting history entry:", error);
  }
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing history:", error);
  }
}

/**
 * Update only the data of a history entry without changing timestamp
 */
export function updateHistoryData(
  id: string,
  data: TrackingInfo
): void {
  if (typeof window === "undefined") return;

  try {
    const history = getHistory();
    const index = history.findIndex((entry) => entry.id === id);

    if (index !== -1) {
      history[index] = {
        ...history[index],
        lastStatus: data.currentStatus || data.timeline[0]?.status || "Unknown",
        data,
      };
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  } catch (error) {
    console.error("Error updating history data:", error);
  }
}

