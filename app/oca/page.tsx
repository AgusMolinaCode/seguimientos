"use client";

import { useState } from "react";
import { trackOCA } from "@/actions/oca/track";
import { OCAForm } from "@/components/tracking/OCAForm";
import { TrackingResult } from "@/components/TrackingResult";
import { LoadingSteps } from "@/components/ui/LoadingSteps";
import type { OCAFormValues } from "@/lib/carriers/schemas";
import type { ScraperResult } from "@/actions/types";

export default function OCAPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);

  const handleSubmit = async (data: OCAFormValues) => {
    setLoading(true);
    setResult(null);

    try {
      const result = await trackOCA(data.trackingNumber);
  
      setResult(result);
    } catch (error) {
      console.error("Error OCA:", error);
      setResult({
        success: false,
        error: "Error al procesar la solicitud de OCA"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[90rem] mx-auto mt-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          OCA - Seguimiento de Envíos
        </h1>
        <p className="text-gray-600">
          Ingresa tu número de seguimiento para consultar el estado de tu envío de OCA
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <OCAForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {loading && <LoadingSteps />}

      {result && !loading && <TrackingResult result={result} />}
    </div>
  );
}
