"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { trackBusPackWithCache } from "@/actions/cached-track";
import { BusPackForm } from "@/components/tracking";
import { TrackingResult } from "@/components/TrackingResult";
import { LoadingSteps } from "@/components/ui/LoadingSteps";
import { addToHistory } from "@/lib/history/client-tracking-history";
import type { BusPackFormValues } from "@/lib/carriers/schemas";
import type { ScraperResult } from "@/actions/types";

function BusPackContent() {
  const searchParams = useSearchParams();
  const initialTracking = searchParams.get("tracking") || "";

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);

  const handleSubmit = async (data: BusPackFormValues) => {
    setLoading(true);
    setResult(null);

    try {
      const result = await trackBusPackWithCache(
        data.letra,
        data.boca,
        data.numero
      );

      setResult(result);

      // Save to localStorage if successful
      if (result.success && result.data) {
        const trackingId = `${data.letra}-${data.boca}-${data.numero}`;
        addToHistory("buspack", trackingId, result.data);
        // Trigger custom event to update UI
        window.dispatchEvent(new Event("historyUpdated"));
      }
    } catch (error) {
      console.error("Error BusPack:", error);
      setResult({
        success: false,
        error: "Error al procesar la solicitud de BusPack",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[90rem] mx-auto my-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          BusPack - Seguimiento de Envíos
        </h1>
        <p className="text-gray-600">
          Ingresa los datos de tu envío para consultar el estado
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <BusPackForm onSubmit={handleSubmit} loading={loading} initialValue={initialTracking} />
      </div>

      {loading && <LoadingSteps />}

      {result && !loading && <TrackingResult result={result} />}
    </div>
  );
}

export default function BusPackPage() {
  return (
    <Suspense fallback={<div className="max-w-[90rem] mx-auto my-12 px-4">Cargando...</div>}>
      <BusPackContent />
    </Suspense>
  );
}
