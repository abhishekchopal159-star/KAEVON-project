import { collection, doc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where, type DocumentData, type Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeCouponCode } from "@/lib/promotion-engine";
import type { DiscountCampaign, DiscountStatus } from "@/types/discount";

function text(value: unknown, fallback = "") { return typeof value === "string" ? value.trim() : fallback; }
function num(value: unknown) { const parsed = Number(value); return Number.isFinite(parsed) ? Math.max(0, parsed) : 0; }
function list(value: unknown) { return Array.isArray(value) ? value.map((item) => text(item)).filter(Boolean) : []; }
function date(value: unknown) { if (typeof value === "string") return value; if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate().toISOString(); return ""; }
function normalizeCampaign(id: string, data: DocumentData): DiscountCampaign {
  const eligibility = data.eligibility && typeof data.eligibility === "object" ? data.eligibility as DocumentData : {};
  return { id, name: text(data.name), code: normalizeCouponCode(text(data.code)), type: data.type === "fixed" ? "fixed" : "percentage", value: num(data.value), maximumDiscount: num(data.maximumDiscount), minimumOrderValue: num(data.minimumOrderValue), automatic: Boolean(data.automatic), stackable: Boolean(data.stackable), usageLimit: num(data.usageLimit), perCustomerLimit: num(data.perCustomerLimit), usageCount: num(data.usageCount), startsAt: date(data.startsAt) || text(data.startsAt), endsAt: date(data.endsAt) || text(data.endsAt), status: (["draft", "scheduled", "active", "paused", "expired", "archived"].includes(data.status) ? data.status : "draft") as DiscountStatus, eligibility: { productIds: list(eligibility.productIds), categories: list(eligibility.categories).map((item) => item.toUpperCase()), customerIds: list(eligibility.customerIds), membershipPlans: list(eligibility.membershipPlans).filter((item): item is "free" | "prive" => item === "free" || item === "prive"), firstOrderOnly: Boolean(eligibility.firstOrderOnly) }, createdAt: date(data.createdAt), updatedAt: date(data.updatedAt), auditTrail: Array.isArray(data.auditTrail) ? data.auditTrail : [] };
}

export function subscribeToDiscountCampaigns(onData: (items: DiscountCampaign[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(collection(db, "discountCampaigns"), (snapshot) => onData(snapshot.docs.map((item) => normalizeCampaign(item.id, item.data())).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))), (error) => onError?.(error));
}

export async function findCouponCampaign(code: string) {
  const normalized = normalizeCouponCode(code);
  if (!normalized) return null;
  const snapshot = await getDocs(query(collection(db, "discountCampaigns"), where("code", "==", normalized), where("status", "in", ["active", "scheduled"])));
  const match = snapshot.docs[0];
  return match ? normalizeCampaign(match.id, match.data()) : null;
}

export async function saveDiscountCampaign(campaign: DiscountCampaign, actor: { uid: string; displayName: string }) {
  const code = normalizeCouponCode(campaign.code);
  if (!campaign.name.trim()) throw new Error("Campaign name required hai.");
  if (!campaign.automatic && code.length < 4) throw new Error("Coupon code kam-se-kam 4 characters ka hona chahiye.");
  if (campaign.value <= 0 || (campaign.type === "percentage" && campaign.value > 100)) throw new Error("Discount value valid nahi hai.");
  if (campaign.endsAt && campaign.startsAt && new Date(campaign.endsAt) <= new Date(campaign.startsAt)) throw new Error("End time start time ke baad hona chahiye.");
  const id = campaign.id || `campaign-${crypto.randomUUID()}`;
  const audit = { id: crypto.randomUUID(), action: "campaign_saved", detail: `${campaign.name} saved as ${campaign.status}.`, actorUid: actor.uid, actorName: actor.displayName || "Administrator", createdAt: new Date().toISOString() };
  await setDoc(doc(db, "discountCampaigns", id), { ...campaign, id, code, auditTrail: [...campaign.auditTrail, audit].slice(-100), createdAt: campaign.createdAt || serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
}
