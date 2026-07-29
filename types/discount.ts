export const DISCOUNT_TYPES = ["percentage", "fixed"] as const;
export type DiscountType = (typeof DISCOUNT_TYPES)[number];
export const DISCOUNT_STATUSES = ["draft", "scheduled", "active", "paused", "expired", "archived"] as const;
export type DiscountStatus = (typeof DISCOUNT_STATUSES)[number];

export type DiscountEligibility = {
  productIds: string[];
  categories: string[];
  customerIds: string[];
  membershipPlans: Array<"free" | "prive">;
  firstOrderOnly: boolean;
};

export type DiscountCampaign = {
  id: string;
  name: string;
  code: string;
  type: DiscountType;
  value: number;
  maximumDiscount: number;
  minimumOrderValue: number;
  automatic: boolean;
  stackable: boolean;
  usageLimit: number;
  perCustomerLimit: number;
  usageCount: number;
  startsAt: string;
  endsAt: string;
  status: DiscountStatus;
  eligibility: DiscountEligibility;
  createdAt: string;
  updatedAt: string;
  auditTrail: DiscountAuditEntry[];
};

export type DiscountAuditEntry = {
  id: string;
  action: string;
  detail: string;
  actorUid: string;
  actorName: string;
  createdAt: string;
};

export type PromotionCartItem = {
  productId: string;
  category: string;
  price: number;
  quantity: number;
};

export type PromotionContext = {
  items: PromotionCartItem[];
  subtotal: number;
  customerId: string;
  membershipPlan: "free" | "prive";
  previousOrderCount: number;
  customerUsageCount: number;
  now?: number;
};

export type AppliedPromotion = {
  campaignId: string;
  code: string;
  name: string;
  amount: number;
  automatic: boolean;
};

export type PromotionResult =
  | { valid: true; promotion: AppliedPromotion }
  | { valid: false; reason: string };

