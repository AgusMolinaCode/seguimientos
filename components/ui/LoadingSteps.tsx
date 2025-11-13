"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface LoadingStep {
  id: number;
  message: string;
  duration: number; // milliseconds
}

const DEFAULT_STEPS: LoadingStep[] = [
  { id: 1, message: "Buscando información del envío...", duration: 2000 },
  { id: 2, message: "Obteniendo datos...", duration: 2000 },
  { id: 3, message: "Preparando resultados...", duration: 1000 },
];

interface LoadingStepsProps {
  steps?: LoadingStep[];
  currentStep?: number; // Controlled mode
  className?: string;
  showSpinner?: boolean;
  spinnerSize?: "sm" | "md" | "lg";
}

export function LoadingSteps({
  steps = DEFAULT_STEPS,
  currentStep: controlledStep,
  className = "",
  showSpinner = true,
  spinnerSize = "md",
}: LoadingStepsProps) {
  const isControlled = controlledStep !== undefined;
  const [internalStep, setInternalStep] = useState(0);
  const currentStep = isControlled ? controlledStep : internalStep;

  // Auto-progression for uncontrolled mode
  useEffect(() => {
    if (!isControlled && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setInternalStep((prev) => Math.min(prev + 1, steps.length - 1));
      }, steps[currentStep].duration);

      return () => clearTimeout(timer);
    }
  }, [currentStep, steps, isControlled]);

  const spinnerSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn("text-center py-8", className)}
    >
      {/* Spinner */}
      {showSpinner && (
        <div className="flex justify-center mb-6">
          <div
            className={cn(
              "animate-spin rounded-full border-4 border-gray-300 border-t-blue-600",
              spinnerSizes[spinnerSize]
            )}
          />
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-3 max-w-md mx-auto">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 text-left transition-all duration-300",
                {
                  "opacity-100": isActive || isCompleted,
                  "opacity-50": isPending,
                }
              )}
            >
              {/* Step Indicator */}
              <div
                className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                  {
                    "bg-blue-600 text-white animate-pulse": isActive,
                    "bg-green-600 text-white": isCompleted,
                    "bg-gray-300 text-gray-500": isPending,
                  }
                )}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4 animate-fadeIn"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs">{step.id}</span>
                )}
              </div>

              {/* Step Message */}
              <p
                className={cn("text-sm md:text-base font-medium", {
                  "text-blue-600": isActive,
                  "text-green-600": isCompleted,
                  "text-gray-600": isPending,
                })}
              >
                {step.message}
              </p>
            </div>
          );
        })}
      </div>

      {/* Screen reader only current message */}
      <span className="sr-only">
        {steps[currentStep]?.message || "Cargando..."}
      </span>
    </div>
  );
}
