export type StoreOperationsSettings = {
  id: "global";
  storeName: string;
  legalName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  locale: string;
  shippingThreshold: number;
  standardShippingFee: number;
  taxRate: number;
  taxInclusive: boolean;
  orderPrefix: string;
  invoicePrefix: string;
  returnWindowDays: number;
  maintenanceMode: boolean;
  commerceMode: "portfolio" | "live";
  emailNotifications: boolean;
  pushNotifications: boolean;
  lowStockNotifications: boolean;
  gatewayIntegration: "disabled" | "configured";
  carrierIntegration: "disabled" | "configured";
  updatedAt: string;
  updatedBy: string;
  auditTrail: Array<{ id: string; action: string; actorUid: string; actorName: string; createdAt: string }>;
};

export const DEFAULT_STORE_SETTINGS: StoreOperationsSettings = {
  id: "global", storeName: "Styloverse", legalName: "Styloverse Private Fashion House",
  supportEmail: "care@styloverse.com", supportPhone: "", currency: "INR", locale: "en-IN",
  shippingThreshold: 10000, standardShippingFee: 299, taxRate: 18, taxInclusive: true,
  orderPrefix: "STY", invoicePrefix: "STY-INV", returnWindowDays: 7,
  maintenanceMode: false, commerceMode: "portfolio", emailNotifications: true,
  pushNotifications: true, lowStockNotifications: true, gatewayIntegration: "disabled",
  carrierIntegration: "disabled", updatedAt: "", updatedBy: "", auditTrail: [],
};
