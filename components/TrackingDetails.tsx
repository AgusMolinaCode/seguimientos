import type { TrackingInfo } from "@/actions/types";

interface TrackingDetailsProps {
  data: TrackingInfo;
}

export function TrackingDetails({ data }: TrackingDetailsProps) {
  return (
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
  );
}
