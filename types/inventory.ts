export const INVENTORY_MOVEMENT_TYPES = [
  "stock_received",
  "manual_increase",
  "manual_decrease",
  "reserved",
  "released",
  "sold",
  "returned",
  "damaged",
  "exchange_in",
  "exchange_out",
] as const;

export type InventoryMovementType =
  (typeof INVENTORY_MOVEMENT_TYPES)[number];

export type InventoryVariantStatus =
  | "active"
  | "low_stock"
  | "out_of_stock"
  | "archived";

export type ProductVariant = {
  id: string;
  sku: string;
  barcode: string;
  size: string;
  colorName: string;
  colorValue: string;
  image: string;
  price: number;
  stockOnHand: number;
  stockReserved: number;
  stockSold: number;
  stockReturned: number;
  stockDamaged: number;
  reorderLevel: number;
  status: InventoryVariantStatus;
};

export type ProductInventorySummary = {
  stockOnHand: number;
  stockReserved: number;
  stockAvailable: number;
  stockSold: number;
  stockReturned: number;
  stockDamaged: number;
  inventoryValue: number;
  lowStockVariants: number;
  outOfStockVariants: number;
  updatedAt: string;
};

export type InventoryProduct = {
  documentId: string;
  id: number;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  image: string;
  price: number;
  status: string;
  variants: ProductVariant[];
  inventory: ProductInventorySummary;
};

export type InventoryMovement = {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  type: InventoryMovementType;
  quantity: number;
  previousOnHand: number;
  nextOnHand: number;
  previousReserved: number;
  nextReserved: number;
  reason: string;
  orderId: string;
  actorUid: string;
  actorName: string;
  createdAt: string;
};

export type InventoryActor = {
  uid: string;
  displayName: string;
};

export type InventoryAdjustmentInput = {
  movementId?: string;
  productId: string;
  variantId: string;
  quantity: number;
  type:
    | "stock_received"
    | "manual_increase"
    | "manual_decrease"
    | "returned"
    | "damaged";
  reason: string;
  actor: InventoryActor;
};

export type InventoryVariantDraft = Omit<
  ProductVariant,
  "status"
>;
