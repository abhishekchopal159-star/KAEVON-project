export type OmnichannelAvailability = {
  enabled: boolean;
  provider: "disabled" | "custom";
  locations: Array<{ id: string; name: string; pickupReady: boolean }>;
};

// Provider-neutral boundary for a future buyer. No location is fabricated while
// a verified store/ERP integration is absent.
export async function getOmnichannelAvailability(): Promise<OmnichannelAvailability> {
  return { enabled: false, provider: "disabled", locations: [] };
}
