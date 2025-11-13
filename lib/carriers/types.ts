/**
 * Carrier types and enums for multi-carrier tracking system
 */

export enum Carrier {
  VIA_CARGO = "via-cargo",
  BUSPACK = "buspack",
}

export interface BaseCarrierFormData {
  carrier: Carrier;
}

export interface ViaCargoFormData extends BaseCarrierFormData {
  carrier: Carrier.VIA_CARGO;
  trackingNumber: string;
}

export interface BusPackFormData extends BaseCarrierFormData {
  carrier: Carrier.BUSPACK;
  letra: string;
  boca: string;
  numero: string;
}

export type CarrierFormData = ViaCargoFormData | BusPackFormData;
