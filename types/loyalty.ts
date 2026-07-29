export type LoyaltyEntryType = "earn" | "redeem" | "expire" | "adjustment" | "refund_credit" | "referral" | "birthday";
export type LoyaltyLedgerEntry = {
  id: string;
  type: LoyaltyEntryType;
  points: number;
  amount: number;
  description: string;
  orderId: string;
  actorUid: string;
  createdAt: string;
};

export type Voucher = {
  id: string;
  code: string;
  label: string;
  amount: number;
  minimumOrderValue: number;
  expiresAt: string;
  status: "active" | "used" | "expired";
};

export type LoyaltyWallet = {
  userId: string;
  pointsBalance: number;
  storeCredit: number;
  referralCode: string;
  membershipPlan: "free" | "prive";
  vouchers: Voucher[];
  ledger: LoyaltyLedgerEntry[];
  updatedAt: string;
};

