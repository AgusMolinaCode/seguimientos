"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Clock, MapPin, PackageCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import { TrackingNumberDisplay } from "@/components/TrackingNumberDisplay";
import { DeleteTrackingButton } from "@/components/DeleteTrackingButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HistoryEntry } from "@/lib/history/tracking-history";

// Carrier name mapping
const carrierNames: Record<HistoryEntry["carrier"], string> = {
  "via-cargo": "Via Cargo",
  "buspack": "BusPack",
  "oca": "OCA",
  "andreani": "Andreani",
  "correo-argentino": "Correo Argentino",
};

// Carrier logo mapping
const carrierLogos: Record<HistoryEntry["carrier"], string> = {
  "via-cargo": "/viacargo.svg",
  "buspack": "/buspack.png",
  "oca": "/logo-oca.jpg",
  "andreani": "/andreani.svg",
  "correo-argentino": "/correo-argentino.png",
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
  return lowerStatus.includes("entregado") || lowerStatus.includes("entregada") || lowerStatus.includes("entrega en sucursal");
}

type FilterType = "all" | "delivered" | "in-transit";

interface RecentTrackingClientProps {
  entries: HistoryEntry[];
}

export function RecentTrackingClient({ entries }: RecentTrackingClientProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  // Filter entries based on selected filter
  const filteredEntries = entries.filter((entry) => {
    if (filter === "all") return true;

    const delivered = isDelivered(entry.data.currentStatus || entry.lastStatus);

    if (filter === "delivered") return delivered;
    if (filter === "in-transit") return !delivered;

    return true;
  });

  return (
    <div className="w-full max-w-7xl mt-12">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-2 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Consultas Recientes
        </h2>

        {/* Desktop filters (buttons) */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("delivered")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "delivered"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Entregados
          </button>
          <button
            onClick={() => setFilter("in-transit")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "in-transit"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            En viaje
          </button>
        </div>

        {/* Mobile filter (select) */}
        <div className="md:hidden">
          <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="delivered">Entregados</SelectItem>
                <SelectItem value="in-transit">En viaje</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty state */}
      {filteredEntries.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center mx-2">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No hay {filter === "delivered" ? "envíos entregados" : filter === "in-transit" ? "envíos en viaje" : "consultas"}
          </h3>
          <p className="text-gray-500">
            {filter === "all"
              ? "Las consultas de seguimiento aparecerán aquí"
              : "Intenta cambiar el filtro para ver más resultados"
            }
          </p>
        </div>
      )}

      {/* Cards grid */}
      {filteredEntries.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
          {filteredEntries.map((entry) => {
            const delivered = isDelivered(entry.data.currentStatus || entry.lastStatus);

            return (
              <div
                key={entry.id}
                className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-5 border-2 ${
                  delivered
                    ? "border-green-400 bg-green-50/30"
                    : "border-gray-200"
                }`}
              >
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
                    <DeleteTrackingButton
                      entryId={entry.id}
                      trackingNumber={entry.trackingNumber}
                    />
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
                    <TrackingNumberDisplay trackingNumber={entry.trackingNumber} />
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

                {/* Ver más button */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <Link
                    href={`/${entry.carrier}?tracking=${encodeURIComponent(entry.trackingNumber)}`}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Ver más
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
