import type { ScraperResult } from "@/actions/types";
import NoResult from "./NoResult";
import { TrackingDetails } from "./TrackingDetails";

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

        <TrackingDetails data={data} />

        {data.timeline && data.timeline.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Historial de Seguimiento
            </h3>
            <div className="space-y-4">
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
                      <p className={` ${data.service == 'BusPack' ? 'text-md' : 'text-sm'} text-gray-500 font-semibold`}>
                        {event.datetime} • {event.status}
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
