interface ViaCargoStatusProps {
  currentStatus: string;
}

export function ViaCargoStatus({ currentStatus }: ViaCargoStatusProps) {
  const isDelivered = currentStatus?.toLowerCase() === "entregada";

  console.log("ViaCargoStatus - currentStatus:", currentStatus, "isDelivered:", isDelivered);

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
      <p className="text-blue-600 text-2xl font-bold">{currentStatus}</p>
    </div>
  );
}
