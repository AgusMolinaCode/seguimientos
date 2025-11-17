/**
 * Carrier types and enums for multi-carrier tracking system
 */

export enum Carrier {
  VIA_CARGO = "via-cargo",
  BUSPACK = "buspack",
  ANDREANI = "andreani",
  OCA = "oca",
  CORREO_ARGENTINO = "correo-argentino",
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

export interface AndreaniFormData extends BaseCarrierFormData {
  carrier: Carrier.ANDREANI;
  trackingNumber: string;
}

export interface OCAFormData extends BaseCarrierFormData {
  carrier: Carrier.OCA;
  trackingNumber: string;
}

export interface CorreoArgentinoFormData extends BaseCarrierFormData {
  carrier: Carrier.CORREO_ARGENTINO;
  trackingNumber: string;
}

export type CarrierFormData = ViaCargoFormData | BusPackFormData | AndreaniFormData | OCAFormData | CorreoArgentinoFormData;
