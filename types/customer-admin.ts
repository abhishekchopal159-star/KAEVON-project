export const CUSTOMER_SEGMENTS = [
  "new",
  "active",
  "returning",
  "vip",
  "dormant",
] as const;

export type CustomerSegment =
  (typeof CUSTOMER_SEGMENTS)[number];

export type CustomerAccountStatus =
  | "active"
  | "watch"
  | "restricted";

export type CustomerCrmNote = {
  id: string;
  message: string;
  authorUid: string;
  authorName: string;
  createdAt: string;
};

export type CustomerCrmAuditEntry = {
  id: string;
  action: string;
  detail: string;
  actorUid: string;
  actorName: string;
  createdAt: string;
};

export type CustomerOrderSnapshot = {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  itemCount: number;
  createdAt: string;
};

export type AdminCustomerRecord = {
  id: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  role: string;
  subscriptionPlan: "free" | "prive";
  createdAt: string;
  lastActiveAt: string;
  orderCount: number;
  deliveredOrderCount: number;
  cancelledOrderCount: number;
  lifetimeValue: number;
  averageOrderValue: number;
  lastOrderAt: string;
  segment: CustomerSegment;
  tags: string[];
  notes: CustomerCrmNote[];
  auditTrail: CustomerCrmAuditEntry[];
  accountStatus: CustomerAccountStatus;
  wishlistCount: number;
  cartCount: number;
  addressCount: number;
  orders: CustomerOrderSnapshot[];
};

export type CustomerCrmActor = {
  uid: string;
  displayName: string;
};
