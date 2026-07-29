import { describe, expect, it } from "vitest";
import { chooseBestPromotion, evaluatePromotion, normalizeCouponCode } from "@/lib/promotion-engine";
import type { DiscountCampaign, PromotionContext } from "@/types/discount";

const campaign: DiscountCampaign = { id:"gold", name:"Private Gold", code:"GOLD20", type:"percentage", value:20, maximumDiscount:1500, minimumOrderValue:2000, automatic:true, stackable:false, usageLimit:100, perCustomerLimit:1, usageCount:2, startsAt:"2025-01-01T00:00:00.000Z", endsAt:"2030-01-01T00:00:00.000Z", status:"active", eligibility:{productIds:[],categories:["WOMEN"],customerIds:[],membershipPlans:[],firstOrderOnly:false}, createdAt:"",updatedAt:"",auditTrail:[] };
const context: PromotionContext = { items:[{productId:"dress",category:"WOMEN",price:6000,quantity:2}],subtotal:12000,customerId:"customer",membershipPlan:"free",previousOrderCount:0,customerUsageCount:0,now:new Date("2026-07-29").getTime() };

describe("promotion engine", () => {
  it("sanitizes coupon input", () => expect(normalizeCouponCode(" gold 20! ")).toBe("GOLD20"));
  it("caps percentage discounts", () => expect(evaluatePromotion(campaign, context)).toMatchObject({ valid:true, promotion:{amount:1500} }));
  it("rejects minimum-order failures", () => expect(evaluatePromotion(campaign,{...context,subtotal:1000}).valid).toBe(false));
  it("chooses the highest valid automatic promotion", () => {
    const fixed={...campaign,id:"fixed",code:"FIXED",type:"fixed" as const,value:500,maximumDiscount:0};
    expect(chooseBestPromotion([fixed,campaign],context)?.code).toBe("GOLD20");
  });
});
