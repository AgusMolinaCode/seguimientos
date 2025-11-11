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
  timeline: TimelineEvent[];
  incidents: string;
  currentStatus?: string;
}

export interface ScraperResult {
  success: boolean;
  data?: TrackingInfo;
  error?: string;
}
