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
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface BusPackFormProps {
  onSubmit: (data: BusPackFormValues) => Promise<void>;
  loading?: boolean;
  initialValue?: string;
}

export function BusPackForm({ onSubmit, loading = false, initialValue = "" }: BusPackFormProps) {
  const config = getCarrierConfig(Carrier.BUSPACK);
  const [copied, setCopied] = useState(false);

  // Parse initialValue (format: "A-123-456" or empty)
  const parsedValues = initialValue ? initialValue.split("-") : ["", "", ""];
  const [letra, boca, numero] = parsedValues.length === 3 ? parsedValues : ["", "", ""];

  const form = useForm<BusPackFormValues>({
    resolver: zodResolver(busPackSchema),
    defaultValues: {
      carrier: Carrier.BUSPACK,
      letra: letra,
      boca: boca,
      numero: numero,
    },
  });

  const handleCopy = async () => {
    const letra = form.getValues("letra");
    const boca = form.getValues("boca");
    const numero = form.getValues("numero");

    if (letra && boca && numero) {
      const fullNumber = `${letra}-${boca}-${numero}`;
      await navigator.clipboard.writeText(fullNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-wrap md:flex-nowrap gap-4 items-end">
          <FormField
            control={form.control}
            name="letra"
            render={({ field }) => (
              <FormItem className="w-full md:w-20">
                <FormLabel>Letra</FormLabel>
                <FormControl>
                  <Input
                    placeholder={config.placeholder?.letra}
                    maxLength={1}
                    disabled={loading}
                    {...field}
                    className="h-10"
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
              <FormItem className="w-full md:w-1/2">
                <FormLabel>Boca</FormLabel>
                <FormControl>
                  <Input
                    placeholder={config.placeholder?.boca}
                    disabled={loading}
                    {...field}
                    className="h-10"
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
              <FormItem className="w-full md:w-1/2">
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input
                    placeholder={config.placeholder?.numero}
                    disabled={loading}
                    {...field}
                    className="h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("letra") &&
            form.watch("boca") &&
            form.watch("numero") && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={handleCopy}
                    variant="outline"
                    size="icon"
                    disabled={loading}
                    className="h-10 w-10 md:mt-1"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {copied
                      ? "¡Copiado!"
                      : `Copiar ${form.watch("letra")}-${form.watch(
                          "boca"
                        )}-${form.watch("numero")}`}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          <Button type="submit" disabled={loading} className="w-full md:w-auto h-10 md:mt-1">
            {loading ? "Buscando..." : "Buscar Envío"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
