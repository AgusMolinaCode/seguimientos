"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { andreaniSchema, type AndreaniFormValues } from "@/lib/carriers/schemas";
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

interface AndreaniFormProps {
  onSubmit: (data: AndreaniFormValues) => Promise<void>;
  loading?: boolean;
}

export function AndreaniForm({ onSubmit, loading = false }: AndreaniFormProps) {
  const config = getCarrierConfig(Carrier.ANDREANI);

  const form = useForm<AndreaniFormValues>({
    resolver: zodResolver(andreaniSchema),
    defaultValues: {
      carrier: Carrier.ANDREANI,
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
              <FormLabel>Número de Seguimiento (15 dígitos)</FormLabel>
              <FormControl>
                <Input
                  placeholder={config.placeholder?.trackingNumber}
                  disabled={loading}
                  maxLength={15}
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
