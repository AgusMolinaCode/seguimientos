"use client";

import { useState } from "react";
import { trackAndreani } from "@/actions/andreani/track";
import { AndreaniForm } from "@/components/tracking";
import { TrackingResult } from "@/components/TrackingResult";
import { LoadingSteps } from "@/components/ui/LoadingSteps";
import type { AndreaniFormValues } from "@/lib/carriers/schemas";
import type { ScraperResult } from "@/actions/types";

export default function AndreaniPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);

  const handleSubmit = async (data: AndreaniFormValues) => {
    setLoading(true);
    setResult(null);

    try {
      const result = await trackAndreani(data.trackingNumber);

      setResult(result);
    } catch (error) {
      console.error("Error Andreani:", error);
      setResult({
        success: false,
        error: "Error al procesar la solicitud de Andreani",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[90rem] mx-auto mt-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Andreani - Seguimiento de Envíos
        </h1>
        <p className="text-gray-600">
          Ingresa tu número de seguimiento de 15 dígitos para consultar el
          estado de tu envío
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <AndreaniForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {loading && <LoadingSteps />}

      {result && !loading && <TrackingResult result={result} />}
    </div>
  );
}
