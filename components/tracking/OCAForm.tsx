"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ocaSchema, type OCAFormValues } from "@/lib/carriers/schemas";
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

interface OCAFormProps {
  onSubmit: (data: OCAFormValues) => Promise<void>;
  loading?: boolean;
}

export function OCAForm({ onSubmit, loading = false }: OCAFormProps) {
  const config = getCarrierConfig(Carrier.OCA);

  const form = useForm<OCAFormValues>({
    resolver: zodResolver(ocaSchema),
    defaultValues: {
      carrier: Carrier.OCA,
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
              <FormLabel>Número de Seguimiento OCA</FormLabel>
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
          {loading ? "Redirigiendo..." : "Ver Seguimiento"}
        </Button>
      </form>
    </Form>
  );
}
