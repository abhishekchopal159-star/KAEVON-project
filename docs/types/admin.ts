export type AdminRole = "admin";

export type AdminProfile = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: AdminRole;
};

export type AdminCustomerSummary = {
  id: string;
  displayName: string;
  email: string;
  role: string;
};

export const ADMIN_ORDER_STATUSES = [
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Return Requested",
  "Return Approved",
  "Return Received",
  "Exchange Requested",
] as const;

export type AdminOrderStatus =
  (typeof ADMIN_ORDER_STATUSES)[number];

export const ADMIN_PAYMENT_METHODS = [
  "UPI",
  "Card",
  "Wallet",
  "Cash on Delivery",
] as const;

export type AdminPaymentMethod =
  (typeof ADMIN_PAYMENT_METHODS)[number];

export const ADMIN_PAYMENT_STATUSES = [
  "Pending",
  "Authorized",
  "Received",
  "Failed",
  "Partially Refunded",
  "Refunded",
  "COD Collection Pending",
  "COD Received",
] as const;

export type AdminPaymentStatus =
  (typeof ADMIN_PAYMENT_STATUSES)[number];

export type AdminOrderItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  size: string;
  color: string;
};

export type AdminOrderAddress = {
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export type AdminOrderTimelineEvent = {
  id: string;
  label: string;
  detail: string;
  createdAt: string;
  actorName: string;
  actorRole: "customer" | "admin" | "system";
};

export type AdminOrderNote = {
  id: string;
  message: string;
  createdAt: string;
  authorId: string;
  authorName: string;
};

export type AdminOrderRecord = {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  status: AdminOrderStatus;
  paymentMethod: AdminPaymentMethod;
  paymentStatus: AdminPaymentStatus;
  paymentProvider: string;
  transactionId: string;
  amountReceived: number;
  paidAt: string;
  refundAmount: number;
  refundReference: string;
  paymentVerified: boolean;
  total: number;
  subtotal: number;
  savings: number;
  deliveryCharge: number;
  itemCount: number;
  items: AdminOrderItem[];
  shippingAddress: AdminOrderAddress;
  trackingId: string;
  shippingCarrier: string;
  timeline: AdminOrderTimelineEvent[];
  notes: AdminOrderNote[];
};

export type AdminCatalogSummary = {
  productCount: number;
  inventoryUnits: number;
  lowStockCount: number;
  categoryCount: number;
  lowStockProducts: Array<{
    id: number;
    slug: string;
    name: string;
    image: string;
    stock: number;
    category: string;
  }>;
};
