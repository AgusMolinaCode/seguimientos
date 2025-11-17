"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackCorreoArgentinoWithCache } from "@/actions/cached-track";
import { CorreoArgentinoForm } from "@/components/tracking/CorreoArgentinoForm";
import { TrackingResult } from "@/components/TrackingResult";
import { LoadingSteps } from "@/components/ui/LoadingSteps";
import type { CorreoArgentinoFormValues } from "@/lib/carriers/schemas";
import type { ScraperResult } from "@/actions/types";

export default function CorreoArgentinoPage() {
  const searchParams = useSearchParams();
  const initialTracking = searchParams.get("tracking") || "";

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);

  const handleSubmit = async (data: CorreoArgentinoFormValues) => {
    setLoading(true);
    setResult(null);

    try {
      const result = await trackCorreoArgentinoWithCache(data.trackingNumber);

      setResult(result);
    } catch (error) {
      console.error("Error Correo Argentino:", error);
      setResult({
        success: false,
        error: "Error al procesar la solicitud de Correo Argentino",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[90rem] mx-auto mt-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Correo Argentino - Seguimiento de Envíos
        </h1>
        <p className="text-gray-600">
          Ingresa tu número de tracking para consultar el estado de tu envío
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <CorreoArgentinoForm onSubmit={handleSubmit} loading={loading} initialValue={initialTracking} />
      </div>

      {loading && <LoadingSteps />}

      {result && !loading && <TrackingResult result={result} />}
    </div>
  );
}
