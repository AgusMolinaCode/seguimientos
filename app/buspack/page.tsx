"use client";

import { useState } from "react";
import { trackBusPack } from "@/actions/buspack/track";
import { BusPackForm } from "@/components/tracking";
import { TrackingResult } from "@/components/TrackingResult";
import { LoadingSteps } from "@/components/ui/LoadingSteps";
import type { BusPackFormValues } from "@/lib/carriers/schemas";
import type { ScraperResult } from "@/actions/types";

export default function BusPackPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);

  const handleSubmit = async (data: BusPackFormValues) => {
    setLoading(true);
    setResult(null);

    try {
      const result = await trackBusPack({
        letra: data.letra,
        boca: data.boca,
        numero: data.numero,
      });

      setResult(result);
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
        <BusPackForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {loading && <LoadingSteps />}

      {result && !loading && <TrackingResult result={result} />}
    </div>
  );
}
