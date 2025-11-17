import { Carrier } from "./types";

/**
 * Carrier metadata and configuration
 */
export interface CarrierConfig {
  id: Carrier;
  name: string;
  displayName: string;
  description: string;
  placeholder?: Record<string, string>;
}

export const CARRIER_CONFIGS: Record<Carrier, CarrierConfig> = {
  [Carrier.VIA_CARGO]: {
    id: Carrier.VIA_CARGO,
    name: "via-cargo",
    displayName: "Via Cargo",
    description: "Seguimiento de envíos Via Cargo",
    placeholder: {
      trackingNumber: "Ej: 999030148732",
    },
  },
  [Carrier.BUSPACK]: {
    id: Carrier.BUSPACK,
    name: "buspack",
    displayName: "BusPack",
    description: "Seguimiento de envíos BusPack",
    placeholder: {
      letra: "Ej: R",
      boca: "Ej: 3101",
      numero: "Ej: 10055",
    },
  },
  [Carrier.ANDREANI]: {
    id: Carrier.ANDREANI,
    name: "andreani",
    displayName: "Andreani",
    description: "Seguimiento de envíos Andreani",
    placeholder: {
      trackingNumber: "Ej: 360002701689990",
    },
  },
  [Carrier.OCA]: {
    id: Carrier.OCA,
    name: "oca",
    displayName: "OCA",
    description: "Seguimiento de envíos OCA (17track)",
    placeholder: {
      trackingNumber: "Ej: 5079800000002376408",
    },
  },
  [Carrier.CORREO_ARGENTINO]: {
    id: Carrier.CORREO_ARGENTINO,
    name: "correo-argentino",
    displayName: "Correo Argentino",
    description: "Seguimiento de envíos Correo Argentino",
    placeholder: {
      trackingNumber: "Ej: HC261803236AR",
    },
  },
};

/**
 * Get carrier configuration by ID
 */
export function getCarrierConfig(carrier: Carrier): CarrierConfig {
  return CARRIER_CONFIGS[carrier];
}

/**
 * Get all available carriers
 */
export function getAllCarriers(): CarrierConfig[] {
  return Object.values(CARRIER_CONFIGS);
}
