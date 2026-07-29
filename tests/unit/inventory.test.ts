import { describe, expect, it } from "vitest";
import { calculateInventorySummary, createDefaultVariants, createVariantId, getVariantAvailableStock, getVariantStatus } from "@/lib/inventory";

describe("inventory engine", () => {
  it("normalizes stable variant ids", () => expect(createVariantId("XL", "Café Gold")).toBe("xl-cafe-gold"));
  it("never exposes reserved stock as available", () => expect(getVariantAvailableStock({ stockOnHand: 4, stockReserved: 7 })).toBe(0));
  it("classifies stock states", () => {
    expect(getVariantStatus({ stockOnHand: 0, stockReserved: 0, reorderLevel: 5 })).toBe("out_of_stock");
    expect(getVariantStatus({ stockOnHand: 5, stockReserved: 2, reorderLevel: 3 })).toBe("low_stock");
    expect(getVariantStatus({ stockOnHand: 12, stockReserved: 2, reorderLevel: 3 })).toBe("active");
  });
  it("allocates and totals variant stock without losing units", () => {
    const variants = createDefaultVariants({ sku: "STY-TEST", sizes: ["S", "M", "L"], colorName: "Black", colorValue: "#000", image: "/test.png", price: 2000, stock: 10 });
    expect(variants.map((item) => item.stockOnHand)).toEqual([4, 3, 3]);
    expect(calculateInventorySummary(variants).stockAvailable).toBe(10);
    expect(calculateInventorySummary(variants).inventoryValue).toBe(20_000);
  });
});
