"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { correoArgentinoSchema, type CorreoArgentinoFormValues } from "@/lib/carriers/schemas";
import { Carrier } from "@/lib/carriers/types";
import { getCarrierConfig } from "@/lib/carriers/config";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface CorreoArgentinoFormProps {
  onSubmit: (data: CorreoArgentinoFormValues) => Promise<void>;
  loading?: boolean;
  initialValue?: string;
}

export function CorreoArgentinoForm({ onSubmit, loading = false, initialValue = "" }: CorreoArgentinoFormProps) {
  const config = getCarrierConfig(Carrier.CORREO_ARGENTINO);
  const [copied, setCopied] = useState(false);

  const form = useForm<CorreoArgentinoFormValues>({
    resolver: zodResolver(correoArgentinoSchema),
    defaultValues: {
      carrier: Carrier.CORREO_ARGENTINO,
      trackingNumber: initialValue,
    },
  });

  const handleCopy = async () => {
    const value = form.getValues("trackingNumber");
    if (value) {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-wrap md:flex-nowrap md:gap-4 items-center">
        <FormField
          control={form.control}
          name="trackingNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Número de Seguimiento</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder={config.placeholder?.trackingNumber}
                    disabled={loading}
                    {...field}
                    className="h-10 pr-10 uppercase"
                    onChange={(e) => {
                      field.onChange(e.target.value.toUpperCase());
                    }}
                  />
                  {field.value && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          disabled={loading}
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
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full md:w-1/4 h-10 md:mt-1">
          {loading ? "Buscando..." : "Buscar Envío"}
        </Button>
      </form>
    </Form>
  );
}
