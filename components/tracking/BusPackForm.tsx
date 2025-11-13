"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { busPackSchema, type BusPackFormValues } from "@/lib/carriers/schemas";
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

interface BusPackFormProps {
  onSubmit: (data: BusPackFormValues) => Promise<void>;
  loading?: boolean;
}

export function BusPackForm({ onSubmit, loading = false }: BusPackFormProps) {
  const config = getCarrierConfig(Carrier.BUSPACK);

  const form = useForm<BusPackFormValues>({
    resolver: zodResolver(busPackSchema),
    defaultValues: {
      carrier: Carrier.BUSPACK,
      letra: "",
      boca: "",
      numero: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-4 gap-4 items-end">
          <FormField
            control={form.control}
            name="letra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Letra</FormLabel>
                <FormControl>
                  <Input
                    placeholder={config.placeholder?.letra}
                    maxLength={1}
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="boca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Boca</FormLabel>
                <FormControl>
                  <Input
                    placeholder={config.placeholder?.boca}
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input
                    placeholder={config.placeholder?.numero}
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full h-10">
            {loading ? "Buscando..." : "Buscar Envío"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
