import type { DiscountCampaign, PromotionContext, PromotionResult } from "@/types/discount";

export function normalizeCouponCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
}

export function getCampaignRuntimeStatus(campaign: DiscountCampaign, now = Date.now()) {
  if (["draft", "paused", "archived"].includes(campaign.status)) return campaign.status;
  if (campaign.startsAt && new Date(campaign.startsAt).getTime() > now) return "scheduled";
  if (campaign.endsAt && new Date(campaign.endsAt).getTime() <= now) return "expired";
  return "active";
}

export function evaluatePromotion(campaign: DiscountCampaign, context: PromotionContext): PromotionResult {
  const runtimeStatus = getCampaignRuntimeStatus(campaign, context.now);
  if (runtimeStatus !== "active") return { valid: false, reason: runtimeStatus === "scheduled" ? "This private offer has not started yet." : "This offer is not active." };
  if (campaign.usageLimit > 0 && campaign.usageCount >= campaign.usageLimit) return { valid: false, reason: "This offer has reached its usage limit." };
  if (campaign.perCustomerLimit > 0 && context.customerUsageCount >= campaign.perCustomerLimit) return { valid: false, reason: "You have already used this offer." };
  if (context.subtotal < campaign.minimumOrderValue) return { valid: false, reason: `Minimum order value is ₹${campaign.minimumOrderValue.toLocaleString("en-IN")}.` };
  if (campaign.eligibility.firstOrderOnly && context.previousOrderCount > 0) return { valid: false, reason: "This offer is reserved for a first order." };
  if (campaign.eligibility.customerIds.length && !campaign.eligibility.customerIds.includes(context.customerId)) return { valid: false, reason: "This offer is not assigned to this account." };
  if (campaign.eligibility.membershipPlans.length && !campaign.eligibility.membershipPlans.includes(context.membershipPlan)) return { valid: false, reason: "This offer requires an eligible membership." };

  const eligibleItems = context.items.filter((item) => {
    const productMatch = !campaign.eligibility.productIds.length || campaign.eligibility.productIds.includes(item.productId);
    const categoryMatch = !campaign.eligibility.categories.length || campaign.eligibility.categories.includes(item.category.toUpperCase());
    return productMatch && categoryMatch;
  });
  if (!eligibleItems.length) return { valid: false, reason: "No item in your bag is eligible for this offer." };
  const eligibleSubtotal = eligibleItems.reduce((sum, item) => sum + Math.max(0, item.price) * Math.max(1, item.quantity), 0);
  let amount = campaign.type === "percentage" ? eligibleSubtotal * campaign.value / 100 : campaign.value;
  if (campaign.maximumDiscount > 0) amount = Math.min(amount, campaign.maximumDiscount);
  amount = Math.max(0, Math.min(eligibleSubtotal, Math.round(amount)));
  if (!amount) return { valid: false, reason: "This offer does not change the current total." };
  return { valid: true, promotion: { campaignId: campaign.id, code: campaign.code, name: campaign.name, amount, automatic: campaign.automatic } };
}

export function chooseBestPromotion(campaigns: DiscountCampaign[], context: PromotionContext) {
  return campaigns
    .filter((campaign) => campaign.automatic)
    .map((campaign) => evaluatePromotion(campaign, context))
    .filter((result): result is Extract<PromotionResult, { valid: true }> => result.valid)
    .sort((a, b) => b.promotion.amount - a.promotion.amount)[0]?.promotion ?? null;
}

