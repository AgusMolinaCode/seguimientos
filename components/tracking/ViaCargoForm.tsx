"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { viaCargoSchema, type ViaCargoFormValues } from "@/lib/carriers/schemas";
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

interface ViaCargoFormProps {
  onSubmit: (data: ViaCargoFormValues) => Promise<void>;
  loading?: boolean;
}

export function ViaCargoForm({ onSubmit, loading = false }: ViaCargoFormProps) {
  const config = getCarrierConfig(Carrier.VIA_CARGO);

  const form = useForm<ViaCargoFormValues>({
    resolver: zodResolver(viaCargoSchema),
    defaultValues: {
      carrier: Carrier.VIA_CARGO,
      trackingNumber: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-wrap md:flex-nowrap md:gap-4 items-center">
        <FormField
          control={form.control}
          
          name="trackingNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Número de Tracking</FormLabel>
              <FormControl>
                <Input
                  placeholder={config.placeholder?.trackingNumber}
                  disabled={loading}
                  {...field}
                  className="h-10"
                />
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
