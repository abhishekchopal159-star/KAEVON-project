"use client";

import { useEffect, useMemo, useState } from "react";
import { Gift, Loader2, Search, Sparkles, WalletCards } from "lucide-react";
import { useAdminAccess } from "@/contexts/AdminContext";
import { subscribeToAdminCustomerCrm } from "@/services/customer-admin.service";
import {
  adminAdjustLoyaltyWallet,
  adminIssueVoucher,
} from "@/services/loyalty.service";
import type { AdminCustomerRecord } from "@/types/customer-admin";

export default function AdminLoyaltyOperations() {
  const { profile, isPreview } = useAdminAccess();
  const [customers, setCustomers] = useState<AdminCustomerRecord[]>(isPreview ? [{id:"preview-client",displayName:"Meera Kapoor",email:"meera@example.com",phoneNumber:"",photoURL:"",role:"customer",subscriptionPlan:"prive",createdAt:"",lastActiveAt:"",orderCount:4,deliveredOrderCount:3,cancelledOrderCount:0,lifetimeValue:28990,averageOrderValue:7247,lastOrderAt:"",segment:"vip",tags:[],notes:[],auditTrail:[],accountStatus:"active",wishlistCount:3,cartCount:1,addressCount:1,orders:[]}] : []);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [points, setPoints] = useState(0);
  const [credit, setCredit] = useState(0);
  const [reason, setReason] = useState("");
  const [voucherAmount, setVoucherAmount] = useState(500);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (isPreview) return;
    return subscribeToAdminCustomerCrm(setCustomers, (error) =>
      setNotice(error.message),
    );
  }, [isPreview]);
  const visible = useMemo(
    () =>
      customers
        .filter((item) =>
          `${item.displayName} ${item.email} ${item.id}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
        .slice(0, 8),
    [customers, search],
  );
  const selected = customers.find((item) => item.id === selectedId);
  async function adjust() {
    if (!selected) return;
    if (isPreview) {
      setNotice("Preview read-only hai.");
      return;
    }
    if (!reason.trim()) {
      setNotice("Audit reason required hai.");
      return;
    }
    setBusy(true);
    try {
      await adminAdjustLoyaltyWallet(
        selected.id,
        {
          points,
          storeCredit: credit,
          type: "adjustment",
          description: reason,
        },
        profile.uid,
      );
      setNotice("Wallet adjustment audited and saved.");
      setPoints(0);
      setCredit(0);
      setReason("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Adjustment failed.");
    } finally {
      setBusy(false);
    }
  }
  async function issue() {
    if (!selected) return;
    if (isPreview) {
      setNotice("Preview read-only hai.");
      return;
    }
    setBusy(true);
    try {
      const now = Date.now();
      await adminIssueVoucher(selected.id, {
        id: crypto.randomUUID(),
        code: `PRIVATE${String(now).slice(-6)}`,
        label: "Private client reward",
        amount: voucherAmount,
        minimumOrderValue: voucherAmount * 2,
        expiresAt: new Date(now + 90 * 86400000).toISOString(),
        status: "active",
      });
      setNotice("Private voucher issued to the selected account.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Voucher issue failed.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="bg-[#F5F0EA] px-4 pb-10 sm:px-7 lg:px-10">
      <div className="mx-auto grid max-w-[1540px] gap-5 rounded-[34px] border border-[#E1D7CE] bg-white p-5 lg:grid-cols-[.9fr_1.1fr] lg:p-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F1E7DA] px-4 py-2 text-[8px] font-bold uppercase tracking-[.2em] text-[#966537]">
            <WalletCards size={13} /> Loyalty operations
          </span>
          <h2 className="mt-5 font-heading text-4xl">
            Reward the right client.
          </h2>
          <p className="mt-3 text-xs leading-6 text-[#7C7168]">
            Account-scoped points, store credit and vouchers. Every balance
            adjustment requires an operational reason.
          </p>
          <label className="mt-6 flex h-12 items-center gap-3 rounded-2xl border border-[#DDD3C9] px-4">
            <Search size={15} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search client or email…"
              className="min-w-0 flex-1 text-xs outline-none"
            />
          </label>
          <div className="mt-3 space-y-2">
            {visible.map((customer) => (
              <button
                key={customer.id}
                onClick={() => setSelectedId(customer.id)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left ${selectedId === customer.id ? "border-[#5B3DF5] bg-[#F4F1FF]" : "border-[#E4DCD4]"}`}
              >
                <span>
                  <strong className="block text-xs">
                    {customer.displayName}
                  </strong>
                  <span className="mt-1 block text-[9px] text-[#81766E]">
                    {customer.email}
                  </span>
                </span>
                <span className="text-[7px] font-bold uppercase text-[#9A6836]">
                  {customer.subscriptionPlan}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] bg-[#1C1917] p-6 text-white">
          <Sparkles className="text-[#DDB474]" />
          <h3 className="mt-4 font-heading text-3xl">
            {selected?.displayName || "Select a client"}
          </h3>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <label className="grid gap-2 text-[7px] font-bold uppercase tracking-[.15em] text-white/45">
              Points adjustment
              <input
                type="number"
                value={points}
                onChange={(event) => setPoints(Number(event.target.value))}
                className="h-11 rounded-xl border border-white/10 bg-white/6 px-3 text-xs text-white"
              />
            </label>
            <label className="grid gap-2 text-[7px] font-bold uppercase tracking-[.15em] text-white/45">
              Store credit
              <input
                type="number"
                value={credit}
                onChange={(event) => setCredit(Number(event.target.value))}
                className="h-11 rounded-xl border border-white/10 bg-white/6 px-3 text-xs text-white"
              />
            </label>
          </div>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Required audit reason…"
            className="mt-3 min-h-20 w-full rounded-xl border border-white/10 bg-white/6 p-3 text-xs text-white outline-none"
          />
          <button
            onClick={adjust}
            disabled={!selected || busy}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#DDB474] text-[8px] font-bold uppercase tracking-[.14em] text-[#1C1917]"
          >
            {busy ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}{" "}
            Apply audited adjustment
          </button>
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-[8px] font-bold uppercase tracking-[.18em] text-white/45">
              Issue voucher
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="number"
                value={voucherAmount}
                onChange={(event) =>
                  setVoucherAmount(Math.max(1, Number(event.target.value)))
                }
                className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/6 px-3 text-xs text-white"
              />
              <button
                onClick={issue}
                disabled={!selected || busy}
                className="flex h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-[8px] font-bold uppercase"
              >
                <Gift size={13} /> Issue
              </button>
            </div>
          </div>
          {notice && (
            <p className="mt-4 text-[9px] leading-5 text-[#E2C694]">{notice}</p>
          )}
        </div>
      </div>
    </section>
  );
}
