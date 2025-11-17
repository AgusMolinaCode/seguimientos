"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface TrackingNumberDisplayProps {
  trackingNumber: string;
}

export function TrackingNumberDisplay({ trackingNumber }: TrackingNumberDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm font-medium text-gray-800">
        {trackingNumber}
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "¡Copiado!" : "Copiar número"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
