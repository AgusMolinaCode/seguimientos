"use client";

import { useState } from "react";
import { Carrier } from "@/lib/carriers/types";
import type { ViaCargoFormValues, BusPackFormValues } from "@/lib/carriers/schemas";
import type { ScraperResult } from "@/actions/types";
import { getViaCargoData } from "@/actions/via-cargo/track";
import { trackBusPack } from "@/actions/buspack/track";
import { CarrierSelector } from "./CarrierSelector";
import { ViaCargoForm } from "./ViaCargoForm";
import { BusPackForm } from "./BusPackForm";
import { TrackingResult } from "@/components/TrackingResult";
import { LoadingSteps } from "@/components/ui/LoadingSteps";

export function TrackingFormContainer() {
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier>(Carrier.VIA_CARGO);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScraperResult | null>(null);

  const handleViaCargoSubmit = async (data: ViaCargoFormValues) => {
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

  const handleBusPackSubmit = async (data: BusPackFormValues) => {
    setLoading(true);
    setResult(null);

    try {
      console.log("Buscando tracking BusPack:", data);
      const result = await trackBusPack({
        letra: data.letra,
        boca: data.boca,
        numero: data.numero,
      });
      console.log("Resultado BusPack:", result);
      setResult(result);
    } catch (error) {
      console.error("Error BusPack:", error);
      setResult({
        success: false,
        error: "Error al procesar la solicitud de BusPack"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCarrierChange = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <CarrierSelector
        selectedCarrier={selectedCarrier}
        onSelectCarrier={handleCarrierChange}
        disabled={loading}
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        {selectedCarrier === Carrier.VIA_CARGO && (
          <ViaCargoForm onSubmit={handleViaCargoSubmit} loading={loading} />
        )}

        {selectedCarrier === Carrier.BUSPACK && (
          <BusPackForm onSubmit={handleBusPackSubmit} loading={loading} />
        )}
      </div>

      {loading && <LoadingSteps />}

      {result && !loading && <TrackingResult result={result} />}
    </div>
  );
}
