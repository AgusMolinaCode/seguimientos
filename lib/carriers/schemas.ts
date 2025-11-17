import { z } from "zod";
import { Carrier } from "./types";

/**
 * Via Cargo validation schema
 * Single tracking number field with basic validation
 */
export const viaCargoSchema = z.object({
  carrier: z.literal(Carrier.VIA_CARGO),
  trackingNumber: z
    .string()
    .min(1, "El número de tracking es requerido")
    .trim()
    .regex(/^\d+$/, "El número de tracking debe contener solo dígitos"),
});

/**
 * BusPack validation schema
 * Three fields: letra, boca, numero with specific validation rules
 */
export const busPackSchema = z.object({
  carrier: z.literal(Carrier.BUSPACK),
  letra: z
    .string()
    .min(1, "La letra es requerida")
    .max(1, "La letra debe ser un solo carácter")
    .trim(),
  boca: z
    .string()
    .min(1, "La boca es requerida")
    .trim()
    .regex(/^\d+$/, "La boca debe contener solo dígitos"),
  numero: z
    .string()
    .min(1, "El número es requerido")
    .trim()
    .regex(/^\d+$/, "El número debe contener solo dígitos"),
});

/**
 * Andreani validation schema
 * Single tracking number field with 15-digit validation
 */
export const andreaniSchema = z.object({
  carrier: z.literal(Carrier.ANDREANI),
  trackingNumber: z
    .string()
    .min(1, "El número de seguimiento es requerido")
    .trim()
    .regex(/^\d+$/, "El número debe contener solo dígitos")
    .length(15, "El número de Andreani debe tener 15 dígitos"),
});

/**
 * OCA validation schema
 * Single tracking number field (uses 17track)
 */
export const ocaSchema = z.object({
  carrier: z.literal(Carrier.OCA),
  trackingNumber: z
    .string()
    .min(1, "El número de seguimiento es requerido")
    .trim(),
});

/**
 * Correo Argentino validation schema
 * Single tracking number field with alphanumeric validation
 */
export const correoArgentinoSchema = z.object({
  carrier: z.literal(Carrier.CORREO_ARGENTINO),
  trackingNumber: z
    .string()
    .min(1, "El número de seguimiento es requerido")
    .trim()
    .regex(/^[A-Z0-9]+$/, "El número debe contener solo letras mayúsculas y dígitos"),
});

/**
 * Union schema for all carriers
 */
export const carrierFormSchema = z.discriminatedUnion("carrier", [
  viaCargoSchema,
  busPackSchema,
  andreaniSchema,
  ocaSchema,
  correoArgentinoSchema,
]);

/**
 * Type inference from schemas
 */
export type ViaCargoFormValues = z.infer<typeof viaCargoSchema>;
export type BusPackFormValues = z.infer<typeof busPackSchema>;
export type AndreaniFormValues = z.infer<typeof andreaniSchema>;
export type OCAFormValues = z.infer<typeof ocaSchema>;
export type CorreoArgentinoFormValues = z.infer<typeof correoArgentinoSchema>;
export type CarrierFormValues = z.infer<typeof carrierFormSchema>;
