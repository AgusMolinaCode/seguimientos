import React from "react";
import type { ScraperResult } from "@/actions/types";

interface TrackingResultProps {
  result: ScraperResult;
}

const NoResult = ({ result }: TrackingResultProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center py-8">
        <div className="text-red-600 text-5xl mb-4">✗</div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Envío no encontrado
        </h2>
        <p className="text-gray-700 mb-4">{result.error}</p>
        <div className="text-sm text-gray-500 mt-6 text-left max-w-md mx-auto">
          <p className="font-semibold mb-2">Verifica que:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>El número de envío sea correcto</li>
            <li>No tenga espacios ni caracteres especialesss</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoResult;
