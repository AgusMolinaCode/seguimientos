"use client";

import { useState, useEffect } from "react";
import { getRecentHistory } from "@/lib/history/client-tracking-history";
import { Package } from "lucide-react";
import { RecentTrackingClient } from "@/components/RecentTrackingClient";
import type { HistoryEntry } from "@/lib/history/client-tracking-history";

import { 
  trackViaCargoWithCache, 
  trackBusPackWithCache, 
  trackOCAWithCache, 
  trackAndreaniWithCache, 
  trackCorreoArgentinoWithCache 
} from "@/actions/cached-track";
import { updateHistoryData } from "@/lib/history/client-tracking-history";

/**
 * Client component that reads tracking history from localStorage
 */
export function RecentTracking() {
  const [recentEntries, setRecentEntries] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read from localStorage on mount
    const entries = getRecentHistory(8);
    setRecentEntries(entries);
    setIsLoading(false);

    // Auto-refresh recent entries
    const refreshEntries = async () => {
      const entriesToRefresh = entries.filter(entry => {
        // Only refresh if not delivered (optional optimization, but user wants updates)
        // For now, refresh all recent ones to be sure, or maybe just the top 4
        // Let's refresh all 8 but sequentially or in parallel?
        // Parallel is better for user, but heavier for server.
        // Let's do parallel.
        const status = (entry.data.currentStatus || entry.lastStatus).toLowerCase();
        return !status.includes("entregado") && !status.includes("entregada");
      });

      if (entriesToRefresh.length === 0) return;

      console.log("Refreshing tracking for:", entriesToRefresh.map(e => e.trackingNumber));

      const updates = entriesToRefresh.map(async (entry) => {
        try {
          let result;
          switch (entry.carrier) {
            case "via-cargo":
              result = await trackViaCargoWithCache(entry.trackingNumber);
              break;
            case "buspack":
              const parts = entry.trackingNumber.split("-");
              if (parts.length === 3) {
                result = await trackBusPackWithCache(parts[0], parts[1], parts[2]);
              }
              break;
            case "oca":
              result = await trackOCAWithCache(entry.trackingNumber);
              break;
            case "andreani":
              result = await trackAndreaniWithCache(entry.trackingNumber);
              break;
            case "correo-argentino":
              result = await trackCorreoArgentinoWithCache(entry.trackingNumber);
              break;
          }

          if (result?.success && result.data) {
            updateHistoryData(entry.id, result.data);
            // We don't update state here to avoid too many re-renders
            // We will trigger a reload of history after all are done
            return true;
          }
        } catch (error) {
          console.error(`Error refreshing ${entry.carrier} ${entry.trackingNumber}:`, error);
        }
        return false;
      });

      await Promise.all(updates);
      
      // Reload history to show updates
      const updatedEntries = getRecentHistory(8);
      setRecentEntries(updatedEntries);
    };

    // Run refresh in background
    refreshEntries();

    // Listen for storage changes (from other tabs or same page)
    const handleStorageChange = () => {
      const updatedEntries = getRecentHistory(8);
      setRecentEntries(updatedEntries);
    };

    window.addEventListener("storage", handleStorageChange);
    // Custom event for same-page updates
    window.addEventListener("historyUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("historyUpdated", handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mt-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (recentEntries.length === 0) {
    return (
      <div className="w-full max-w-7xl mt-12">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Sin consultas recientes
          </h3>
          <p className="text-gray-500">
            Las consultas de seguimiento aparecerán aquí
          </p>
        </div>
      </div>
    );
  }

  return <RecentTrackingClient entries={recentEntries} />;
}
