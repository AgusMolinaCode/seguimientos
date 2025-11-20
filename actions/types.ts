export interface TimelineEvent {
  location: string;
  datetime: string;
  status: string;
}

export interface TrackingInfo {
  trackingNumber: string;
  origin: string;
  destination: string;
  pieces: string;
  weight: string;
  signedBy: string;
  service: string;
  carrier?: string; // Empresa transportista (Via Cargo, etc.)
  timeline: TimelineEvent[];
  incidents: string;
  currentStatus?: string;
  fetchedAt?: string; // Timestamp of when the data was fetched
}

export interface ScraperResult {
  success: boolean;
  data?: TrackingInfo;
  error?: string;
}
