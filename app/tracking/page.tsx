"use client";

import { TrackingFormContainer } from "@/components/tracking";

export default function TrackingPage() {
  return (
    <div className="max-w-7xl mx-auto mt-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Seguimiento de Envíos
        </h1>
        <p className="text-gray-600">
          Selecciona tu transportista y consulta el estado de tu envío
        </p>
      </div>

      <TrackingFormContainer />
    </div>
  );
}
