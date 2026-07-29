import { describe, expect, it } from "vitest";
import { canBulkTransition, canTransitionOrderStatus, getAllowedNextStatuses } from "@/lib/order-transitions";

describe("order lifecycle", () => {
  it("allows only the next operational state", () => {
    expect(canTransitionOrderStatus("Confirmed", "Processing").allowed).toBe(true);
    expect(canTransitionOrderStatus("Confirmed", "Delivered").allowed).toBe(false);
  });
  it("locks terminal states", () => expect(getAllowedNextStatuses("Delivered")).toEqual([]));
  it("rejects an unsafe mixed bulk transition", () => expect(canBulkTransition(["Confirmed", "Packed"], "Processing")).toEqual({ allowed: false, invalidCount: 1 }));
});
