"use client";

import { trackBusPack } from "@/actions/buspack/track";
import { TrackingResult } from "@/components/TrackingResult";
import { useState } from "react";
import type { ScraperResult } from "@/actions/types";

export default function Page() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      console.log("Buscando tracking BusPack:", trackingNumber);

      // Parsear el formato R-3101-10055 a { letra, boca, numero }
      const parts = trackingNumber.trim().split("-");

      if (parts.length !== 3) {
        setResult({
          success: false,
          error: "Formato inválido. Usa el formato: LETRA-BOCA-NUMERO (ej: R-3101-10055)",
        });
        setLoading(false);
        return;
      }

      const [letra, boca, numero] = parts;

      const data = await trackBusPack({ letra, boca, numero });
      console.log("Resultado completo:", data);
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ success: false, error: "Error al procesar la solicitud" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-8 max-w-7xl mx-auto mt-22">
        <div className="flex gap-4">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Número de envío (ej: R-3101-10055)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 w-xs text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
        {/* <p className="mt-2 text-sm text-gray-500">
          Formato: LETRA-BOCA-NUMERO (ej: R-3101-10055)
        </p> */}
      </form>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">
            Buscando información del envío...
          </p>
        </div>
      )}

      {result && !loading && <TrackingResult result={result} />}
    </>
  );
}
