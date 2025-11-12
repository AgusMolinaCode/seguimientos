interface BuspackStatusProps {
  currentStatus: string;
}

export function BuspackStatus({ currentStatus }: BuspackStatusProps) {
  const isDelivered = currentStatus?.toLowerCase() === "entregado";

  if (isDelivered) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-green-600 text-3xl">✓</span>
        <p className="text-green-600 text-2xl font-bold">{currentStatus}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-blue-600 text-3xl">🚚</span>
      <p className="text-blue-600 text-2xl font-bold">En viaje</p>
    </div>
  );
}
