import { getRecentHistory } from "@/lib/history/tracking-history";
import { Package } from "lucide-react";
import { RecentTrackingClient } from "@/components/RecentTrackingClient";

/**
 * Server component wrapper that fetches tracking history
 * and passes it to the client component for filtering and rendering
 */
export async function RecentTracking() {
  // Fetch recent history (server component - can use 'use cache')
  const recentEntries = await getRecentHistory(8);

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
