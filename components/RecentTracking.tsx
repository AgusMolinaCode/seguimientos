import { getRecentHistory, type HistoryEntry } from "@/lib/history/tracking-history";
import Link from "next/link";
import { Package, Clock, MapPin, PackageCheck } from "lucide-react";
import Image from "next/image";

// Carrier name mapping
const carrierNames: Record<HistoryEntry["carrier"], string> = {
  "via-cargo": "Via Cargo",
  "buspack": "BusPack",
  "oca": "OCA",
  "andreani": "Andreani",
};

// Carrier logo mapping
const carrierLogos: Record<HistoryEntry["carrier"], string> = {
  "via-cargo": "/viacargo.svg",
  "buspack": "/buspack.png",
  "oca": "/logo-oca.jpg",
  "andreani": "/andreani.svg",
};

// Format timestamp to readable date
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Hace unos segundos";
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Check if shipment is delivered
function isDelivered(status: string): boolean {
  const lowerStatus = status.toLowerCase();
  return lowerStatus.includes("entregado") || lowerStatus.includes("entregada");
}

/**
 * Recent Tracking Dashboard Component
 * Shows the most recent tracking queries with caching
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

  return (
    <div className="w-full max-w-7xl mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 px-2">
        Consultas Recientes
      </h2>

      <div className="grid md:grid-cols-3 gap-4 px-2">
        {recentEntries.map((entry) => {
          const delivered = isDelivered(entry.data.currentStatus || entry.lastStatus);

          return (
            <Link
              key={entry.id}
              href={`/${entry.carrier}`}
              className="group block"
            >
              <div className={`bg-white h-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-5 border-2 ${
                delivered
                  ? "border-green-400 hover:border-green-500 bg-green-50/30"
                  : "border-gray-200 hover:border-blue-400"
              }`}>
              {/* Header with carrier and timestamp */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 relative flex items-center justify-center">
                    <Image
                      src={carrierLogos[entry.carrier]}
                      alt={carrierNames[entry.carrier]}
                      className="max-w-full max-h-full object-contain"
                      width={42}
                      height={42}
                    />
                  </div>
                  <span className="font-normal text-gray-700">
                    {carrierNames[entry.carrier]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(entry.timestamp)}</span>
                </div>
              </div>

              {/* Tracking Number */}
              <div className="bg-gray-50 rounded px-3 py-2 mb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="font-mono text-sm font-medium text-gray-800">
                    {entry.trackingNumber}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="mb-2">
                <div className="flex items-start gap-2">
                  {delivered ? (
                    <PackageCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium line-clamp-2 ${
                      delivered ? "text-green-700 font-semibold" : "text-gray-700"
                    }`}>
                      {entry.lastStatus}
                    </p>
                    {entry.data.currentStatus && entry.data.currentStatus !== entry.lastStatus && (
                      <p className={`text-xs mt-1 ${
                        delivered ? "text-green-600" : "text-gray-500"
                      }`}>
                        {entry.data.currentStatus}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Route info if available */}
              {entry.data.origin && entry.data.destination && (
                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  {entry.data.origin} → {entry.data.destination}
                </div>
              )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
