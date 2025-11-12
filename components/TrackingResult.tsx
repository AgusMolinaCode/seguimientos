import type { ScraperResult } from "@/actions/types";
import NoResult from "./NoResult";

interface TrackingResultProps {
  result: ScraperResult;
}

export function TrackingResult({ result }: TrackingResultProps) {
  if (!result.success) {
    return <NoResult result={result} />;
  }

  if (!result.data) {
    return null;
  }

  const { data } = result;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="flex items-center gap-2">
            <p className="text-blue-600 text-2xl font-bold">
              {data.currentStatus}
              {}
            </p>
          </div>

          <h2 className="text-lg font-bold text-gray-500 mt-2">
            Envío Encontrado
          </h2>
          <p className="text-gray-600">Número: {data.trackingNumber}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Origen</p>
            <p className="font-semibold text-gray-800">{data.origin}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Destino</p>
            <p className="font-semibold text-gray-800">{data.destination}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Piezas</p>
            <p className="font-semibold text-gray-800">{data.pieces}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Peso</p>
            <p className="font-semibold text-gray-800">{data.weight}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Servicio</p>
            <p className="font-semibold text-gray-800">{data.service}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Firmado por</p>
            <p className="font-semibold text-gray-800">{data.signedBy}</p>
          </div>
        </div>

        {data.timeline && data.timeline.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Historial de Seguimiento
            </h3>
            <div className="space-y-3">
              {data.timeline.map((event, index) => {
                return (
                  <div
                    key={index}
                    className={`flex gap-4 border-l-4 pl-4 py-2`}
                  >
                    <div className="flex-1">
                      {event.location && (
                        <p className="font-semibold text-gray-800">
                          {event.location}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {event.datetime}• {event.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
