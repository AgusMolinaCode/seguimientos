"use client";

import { Carrier } from "@/lib/carriers/types";
import { getAllCarriers } from "@/lib/carriers/config";
import { Button } from "@/components/ui/button";

interface CarrierSelectorProps {
  selectedCarrier: Carrier;
  onSelectCarrier: (carrier: Carrier) => void;
  disabled?: boolean;
}

export function CarrierSelector({
  selectedCarrier,
  onSelectCarrier,
  disabled = false,
}: CarrierSelectorProps) {
  const carriers = getAllCarriers();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Selecciona tu transportista
      </label>
      <div className="grid grid-cols-2 gap-4">
        {carriers.map((carrier) => (
          <Button
            key={carrier.id}
            type="button"
            variant={selectedCarrier === carrier.id ? "default" : "outline"}
            onClick={() => onSelectCarrier(carrier.id)}
            disabled={disabled}
            className="h-auto py-4 flex flex-col items-center gap-2"
          >
            <span className="font-semibold text-base">{carrier.displayName}</span>
            <span className="text-xs text-muted-foreground font-normal">
              {carrier.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
