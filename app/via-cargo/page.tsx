"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { trackViaCargoWithCache } from "@/actions/cached-track";
import { ViaCargoForm } from "@/components/tracking";
import { TrackingResult } from "@/components/TrackingResult";
import { LoadingSteps } from "@/components/ui/LoadingSteps";
import { addToHistory } from "@/lib/history/client-tracking-history";
import type { ViaCargoFormValues } from "@/lib/carriers/schemas";
import type { ScraperResult } from "@/actions/types";

function ViaCargoContent() {
  const searchParams = useSearchParams();
  const initialTracking = searchParams.get("tracking") || "";

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);

  const handleSubmit = async (data: ViaCargoFormValues) => {
    setLoading(true);
    setResult(null);

    try {
      const result = await trackViaCargoWithCache(data.trackingNumber);

      setResult(result);

      // Save to localStorage if successful
      if (result.success && result.data) {
        addToHistory("via-cargo", data.trackingNumber, result.data);
        window.dispatchEvent(new Event("historyUpdated"));
      }
    } catch (error) {
      console.error("Error Via Cargo:", error);
      setResult({
        success: false,
        error: "Error al procesar la solicitud de Via Cargo",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[90rem] mx-auto mt-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Via Cargo - Seguimiento de Envíos
        </h1>
        <p className="text-gray-600">
          Ingresa tu número de tracking para consultar el estado de tu envío
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <ViaCargoForm onSubmit={handleSubmit} loading={loading} initialValue={initialTracking} />
      </div>

      {loading && <LoadingSteps />}

      {result && !loading && <TrackingResult result={result} />}
    </div>
  );
}

export default function ViaCargoPage() {
  return (
    <Suspense fallback={<div className="max-w-[90rem] mx-auto mt-12 px-4">Cargando...</div>}>
      <ViaCargoContent />
    </Suspense>
  );
}
