"use client";

import { useState } from "react";
import { getViaCargoData } from "@/actions/via-cargo/track";
import { ViaCargoForm } from "@/components/tracking";
import { TrackingResult } from "@/components/TrackingResult";
import { LoadingSteps } from "@/components/ui/LoadingSteps";
import type { ViaCargoFormValues } from "@/lib/carriers/schemas";
import type { ScraperResult } from "@/actions/types";

export default function ViaCargoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);

  const handleSubmit = async (data: ViaCargoFormValues) => {
    setLoading(true);
    setResult(null);

    try {
      console.log("Buscando tracking Via Cargo:", data.trackingNumber);
      const result = await getViaCargoData(data.trackingNumber);
      console.log("Resultado Via Cargo:", result);
      setResult(result);
    } catch (error) {
      console.error("Error Via Cargo:", error);
      setResult({
        success: false,
        error: "Error al procesar la solicitud de Via Cargo"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Via Cargo - Seguimiento de Envíos
        </h1>
        <p className="text-gray-600">
          Ingresa tu número de tracking para consultar el estado de tu envío
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <ViaCargoForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {loading && <LoadingSteps />}

      {result && !loading && <TrackingResult result={result} />}
    </div>
  );
}
