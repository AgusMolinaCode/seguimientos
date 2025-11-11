import type { ScraperResult } from "@/actions/types";

interface TrackingResultProps {
  result: ScraperResult;
}

export function TrackingResult({ result }: TrackingResultProps) {
  if (!result.success) {
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
              <li>No tenga espacios ni caracteres especiales</li>
              <li>El envío esté registrado en Via Cargo</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!result.data) {
    return null;
  }

  const { data } = result;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <p className="text-black text-2xl font-bold py-2">
            {data.currentStatus}
          </p>
          <h2 className="text-lg font-bold text-green-600 mb-2">
            ✓ Envío Encontrado
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
                // Detectar si es BusPack y es el último evento (más reciente)
                const isBusPack = data.service === "BusPack";
                const isLatestEvent = index === data.timeline.length - 1;
                const shouldHighlight = isBusPack && isLatestEvent;

                return (
                  <div
                    key={index}
                    className={`flex gap-4 border-l-4 pl-4 py-2 ${
                      shouldHighlight ? "border-green-500" : "border-blue-500"
                    }`}
                  >
                    <div className="flex-1">
                      {event.location && (
                        <p className="font-semibold text-gray-800">
                          {event.location}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {event.datetime}
                        {shouldHighlight ? (
                          <>
                            {" • "}
                            <span className="text-2xl font-bold text-black">
                              {event.status}
                            </span>
                          </>
                        ) : (
                           <> • {event.status}</>
                        )}
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
