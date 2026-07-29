import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { LoyaltyLedgerEntry, LoyaltyWallet, Voucher } from "@/types/loyalty";

const emptyWallet = (userId: string): LoyaltyWallet => ({ userId, pointsBalance: 0, storeCredit: 0, referralCode: `STY-${userId.slice(0, 6).toUpperCase()}`, membershipPlan: "free", vouchers: [], ledger: [], updatedAt: "" });

export function subscribeToLoyaltyWallet(userId: string, onData: (wallet: LoyaltyWallet) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(doc(db, "loyaltyWallets", userId), (snapshot) => onData(snapshot.exists() ? { ...emptyWallet(userId), ...snapshot.data(), userId } as LoyaltyWallet : emptyWallet(userId)), (error) => onError?.(error));
}

export async function adminAdjustLoyaltyWallet(userId: string, input: { points?: number; storeCredit?: number; type: LoyaltyLedgerEntry["type"]; description: string; orderId?: string }, actorUid: string) {
  const reference = doc(db, "loyaltyWallets", userId);
  const snapshot = await getDoc(reference);
  const current = snapshot.exists() ? { ...emptyWallet(userId), ...snapshot.data(), userId } as LoyaltyWallet : emptyWallet(userId);
  const entry: LoyaltyLedgerEntry = { id: crypto.randomUUID(), type: input.type, points: Number(input.points) || 0, amount: Number(input.storeCredit) || 0, description: input.description.trim(), orderId: input.orderId || "", actorUid, createdAt: new Date().toISOString() };
  await setDoc(reference, { ...current, pointsBalance: Math.max(0, current.pointsBalance + entry.points), storeCredit: Math.max(0, current.storeCredit + entry.amount), ledger: [entry, ...current.ledger].slice(0, 250), updatedAt: serverTimestamp() }, { merge: true });
}

export async function adminIssueVoucher(userId: string, voucher: Voucher) {
  const reference = doc(db, "loyaltyWallets", userId);
  const snapshot = await getDoc(reference);
  const current = snapshot.exists() ? { ...emptyWallet(userId), ...snapshot.data(), userId } as LoyaltyWallet : emptyWallet(userId);
  await setDoc(reference, { ...current, vouchers: [voucher, ...current.vouchers.filter((item) => item.id !== voucher.id)], updatedAt: serverTimestamp() }, { merge: true });
}
