"use client";

import { useEffect, useState } from "react";
import { Copy, Gift, History, Sparkles, TicketPercent, WalletCards } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToLoyaltyWallet } from "@/services/loyalty.service";
import type { LoyaltyWallet } from "@/types/loyalty";

const formatCurrency = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function LoyaltyWalletPanel() {
  const { user, profile, isAdmin } = useAuth();
  const [wallet, setWallet] = useState<LoyaltyWallet | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    return subscribeToLoyaltyWallet(user.uid, setWallet, () => setWallet(null));
  }, [user]);

  const points = wallet?.pointsBalance ?? (isAdmin ? 5000 : 0);
  const credit = wallet?.storeCredit ?? 0;
  const referralCode = wallet?.referralCode ?? (user ? `STY-${user.uid.slice(0, 6).toUpperCase()}` : "SIGN-IN");
  const isPrive = isAdmin || profile?.subscriptionPlan === "prive";

  return <section className="mt-8 overflow-hidden rounded-[34px] border border-[#DCD1C6] bg-white shadow-[0_24px_75px_rgba(48,35,25,.08)]">
    <div className="grid lg:grid-cols-[.9fr_1.1fr]">
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_85%_15%,rgba(125,91,255,.3),transparent_35%),linear-gradient(135deg,#191618,#332442)] p-6 text-white md:p-9"><div className="relative z-10"><span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/7 px-4 py-2 text-[8px] font-bold uppercase tracking-[.2em] text-[#E2B775]"><WalletCards size={13}/> Private wallet</span><h3 className="mt-6 font-heading text-4xl">Rewards that remember you.</h3><p className="mt-3 max-w-md text-xs leading-6 text-white/55">Points, vouchers, referrals and future refund credit remain attached only to your verified account.</p><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/10 bg-white/7 p-4"><Sparkles size={16} className="text-[#E2B775]"/><strong className="mt-4 block font-heading text-3xl">{points.toLocaleString("en-IN")}</strong><span className="text-[7px] uppercase tracking-[.18em] text-white/40">Points balance</span></div><div className="rounded-2xl border border-white/10 bg-white/7 p-4"><Gift size={16} className="text-[#E2B775]"/><strong className="mt-4 block font-heading text-3xl">{formatCurrency(credit)}</strong><span className="text-[7px] uppercase tracking-[.18em] text-white/40">Store credit</span></div></div></div></div>
      <div className="p-6 md:p-9"><div className="flex items-start justify-between gap-4"><div><p className="text-[8px] font-bold uppercase tracking-[.24em] text-[#9D6D3C]">{isPrive ? "Privé earning rate" : "Standard earning rate"}</p><h3 className="mt-2 font-heading text-3xl text-[#1B1816]">Your reward ledger</h3></div><span className="rounded-full bg-[#F2E8DB] px-3 py-2 text-[8px] font-bold uppercase tracking-[.12em] text-[#8E6034]">{isPrive ? "2× points" : "1× points"}</span></div><div className="mt-6 rounded-2xl border border-[#E2D8CF] bg-[#FBF8F5] p-4"><p className="text-[7px] font-bold uppercase tracking-[.2em] text-[#948980]">Referral code</p><div className="mt-2 flex items-center justify-between gap-3"><strong className="font-heading text-2xl">{referralCode}</strong><button type="button" onClick={async () => { await navigator.clipboard.writeText(referralCode); setCopied(true); }} className="flex h-10 items-center gap-2 rounded-full bg-[#1B1816] px-4 text-[8px] font-bold uppercase tracking-[.12em] text-white"><Copy size={13}/>{copied ? "Copied" : "Copy"}</button></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-[#E5DCD4] p-4"><TicketPercent size={16} className="text-[#9D6D3C]"/><p className="mt-3 text-xs font-semibold">Voucher wallet</p><p className="mt-1 text-[10px] leading-5 text-[#7D736B]">{wallet?.vouchers.filter((item) => item.status === "active").length ?? 0} active private vouchers</p></div><div className="rounded-2xl border border-[#E5DCD4] p-4"><History size={16} className="text-[#9D6D3C]"/><p className="mt-3 text-xs font-semibold">Recent movement</p><p className="mt-1 text-[10px] leading-5 text-[#7D736B]">{wallet?.ledger[0]?.description ?? "Your first reward movement will appear here."}</p></div></div><p className="mt-5 text-[9px] leading-5 text-[#8A8078]">Demo mode: points and credit have no cash value. Only authorized operations can change this wallet.</p></div>
    </div>
  </section>;
}
