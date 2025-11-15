"use client";

import { useState } from "react";
import { Carrier } from "@/lib/carriers/types";
import type {
  ViaCargoFormValues,
  BusPackFormValues,
  AndreaniFormValues,
  OCAFormValues,
} from "@/lib/carriers/schemas";
import type { ScraperResult } from "@/actions/types";
import { getViaCargoData } from "@/actions/via-cargo/track";
import { trackBusPack } from "@/actions/buspack/track";
import { trackAndreani } from "@/actions/andreani/track";
import { trackOCA } from "@/actions/oca/track";
import { CarrierSelector } from "./CarrierSelector";
import { ViaCargoForm } from "./ViaCargoForm";
import { BusPackForm } from "./BusPackForm";
import { AndreaniForm } from "./AndreaniForm";
import { OCAForm } from "./OCAForm";
import { TrackingResult } from "@/components/TrackingResult";
import { LoadingSteps } from "@/components/ui/LoadingSteps";

export function TrackingFormContainer() {
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier>(
    Carrier.VIA_CARGO
  );
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
        error: "Error al procesar la solicitud de Via Cargo",
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
        error: "Error al procesar la solicitud de BusPack",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAndreaniSubmit = async (data: AndreaniFormValues) => {
    setLoading(true);
    setResult(null);

    try {
      console.log("Buscando tracking Andreani:", data.trackingNumber);
      const result = await trackAndreani(data.trackingNumber);
      console.log("Resultado Andreani:", result);
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

  const handleOCASubmit = async (data: OCAFormValues) => {
    setLoading(true);
    setResult(null);

    try {
      const result = await trackOCA(data.trackingNumber) ;
      setResult(result);
    } catch (error) {
      console.error("Error OCA:", error);
      setResult({
        success: false,
        error: "Error al procesar la solicitud de OCA",
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

        {selectedCarrier === Carrier.ANDREANI && (
          <AndreaniForm onSubmit={handleAndreaniSubmit} loading={loading} />
        )}

        {selectedCarrier === Carrier.OCA && (
          <OCAForm onSubmit={handleOCASubmit} loading={loading} />
        )}
      </div>

      {loading && <LoadingSteps />}

      {result && !loading && <TrackingResult result={result} />}
    </div>
  );
}
