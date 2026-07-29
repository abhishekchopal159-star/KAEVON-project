import type {
  InventoryVariantStatus,
  ProductInventorySummary,
  ProductVariant,
} from "@/types/inventory";

function safeInteger(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? Math.max(0, Math.floor(parsed))
    : 0;
}

export function createVariantId(
  size: string,
  colorName: string
) {
  const value = `${size}-${colorName}`
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return value || "one-size-as-shown";
}

export function getInventoryVariantDocumentId(
  productId: string,
  variantId: string
) {
  return `${productId}__${variantId}`
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .slice(0, 180);
}

export function getVariantAvailableStock(
  variant: Pick<
    ProductVariant,
    "stockOnHand" | "stockReserved"
  >
) {
  return Math.max(
    0,
    safeInteger(variant.stockOnHand) -
      safeInteger(variant.stockReserved)
  );
}

export function getVariantStatus(
  variant: Pick<
    ProductVariant,
    | "stockOnHand"
    | "stockReserved"
    | "reorderLevel"
  >,
  archived = false
): InventoryVariantStatus {
  if (archived) {
    return "archived";
  }

  const available =
    getVariantAvailableStock(variant);

  if (available === 0) {
    return "out_of_stock";
  }

  if (
    available <=
    Math.max(0, safeInteger(variant.reorderLevel))
  ) {
    return "low_stock";
  }

  return "active";
}

export function normalizeVariant(
  value: unknown,
  fallback: Partial<ProductVariant> = {}
): ProductVariant | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const size = String(
    record.size ?? fallback.size ?? "One Size"
  ).trim();
  const colorName = String(
    record.colorName ??
      fallback.colorName ??
      "As Shown"
  ).trim();
  const stockOnHand = safeInteger(
    record.stockOnHand ??
      fallback.stockOnHand
  );
  const stockReserved = Math.min(
    stockOnHand,
    safeInteger(
      record.stockReserved ??
        fallback.stockReserved
    )
  );
  const reorderLevel = safeInteger(
    record.reorderLevel ??
      fallback.reorderLevel ??
      5
  );
  const archived =
    record.status === "archived";
  const base = {
    id: String(
      record.id ??
        fallback.id ??
        createVariantId(size, colorName)
    ).trim(),
    sku: String(
      record.sku ?? fallback.sku ?? ""
    )
      .trim()
      .toUpperCase(),
    barcode: String(
      record.barcode ?? fallback.barcode ?? ""
    ).trim(),
    size: size || "One Size",
    colorName: colorName || "As Shown",
    colorValue: String(
      record.colorValue ??
        fallback.colorValue ??
        "#A3A3A3"
    ).trim(),
    image: String(
      record.image ?? fallback.image ?? ""
    ).trim(),
    price: Math.max(
      0,
      Number(
        record.price ?? fallback.price ?? 0
      ) || 0
    ),
    stockOnHand,
    stockReserved,
    stockSold: safeInteger(
      record.stockSold ?? fallback.stockSold
    ),
    stockReturned: safeInteger(
      record.stockReturned ??
        fallback.stockReturned
    ),
    stockDamaged: safeInteger(
      record.stockDamaged ??
        fallback.stockDamaged
    ),
    reorderLevel,
  };

  if (!base.id || !base.sku) {
    return null;
  }

  return {
    ...base,
    status: getVariantStatus(base, archived),
  };
}

export function createDefaultVariants({
  sku,
  sizes,
  colorName,
  colorValue,
  image,
  price,
  stock,
}: {
  sku: string;
  sizes: string[];
  colorName: string;
  colorValue: string;
  image: string;
  price: number;
  stock: number;
}) {
  const safeSizes =
    sizes.length > 0 ? sizes : ["One Size"];
  const totalStock = safeInteger(stock);
  const baseShare = Math.floor(
    totalStock / safeSizes.length
  );
  let remainder =
    totalStock -
    baseShare * safeSizes.length;

  return safeSizes.map((size, index) => {
    const allocated =
      baseShare + (remainder > 0 ? 1 : 0);
    remainder = Math.max(0, remainder - 1);
    const suffix = size
      .replace(/[^a-z0-9]+/gi, "")
      .toUpperCase();
    const variant = {
      id: createVariantId(size, colorName),
      sku:
        safeSizes.length === 1
          ? sku.toUpperCase()
          : `${sku}-${suffix || index + 1}`.toUpperCase(),
      barcode: "",
      size,
      colorName,
      colorValue,
      image,
      price,
      stockOnHand: allocated,
      stockReserved: 0,
      stockSold: 0,
      stockReturned: 0,
      stockDamaged: 0,
      reorderLevel: 5,
    };

    return {
      ...variant,
      status: getVariantStatus(variant),
    } satisfies ProductVariant;
  });
}

export function calculateInventorySummary(
  variants: ProductVariant[],
  updatedAt = new Date().toISOString()
): ProductInventorySummary {
  return variants.reduce<ProductInventorySummary>(
    (summary, variant) => {
      const available =
        getVariantAvailableStock(variant);

      summary.stockOnHand +=
        safeInteger(variant.stockOnHand);
      summary.stockReserved +=
        safeInteger(variant.stockReserved);
      summary.stockAvailable += available;
      summary.stockSold +=
        safeInteger(variant.stockSold);
      summary.stockReturned +=
        safeInteger(variant.stockReturned);
      summary.stockDamaged +=
        safeInteger(variant.stockDamaged);
      summary.inventoryValue +=
        available *
        Math.max(0, Number(variant.price) || 0);
      summary.lowStockVariants +=
        variant.status === "low_stock" ? 1 : 0;
      summary.outOfStockVariants +=
        variant.status === "out_of_stock"
          ? 1
          : 0;

      return summary;
    },
    {
      stockOnHand: 0,
      stockReserved: 0,
      stockAvailable: 0,
      stockSold: 0,
      stockReturned: 0,
      stockDamaged: 0,
      inventoryValue: 0,
      lowStockVariants: 0,
      outOfStockVariants: 0,
      updatedAt,
    }
  );
}
