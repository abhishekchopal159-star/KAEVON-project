"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ClipboardCheck,
  IndianRupee,
  Loader2,
  PackageCheck,
  RefreshCcw,
  Save,
  ShieldAlert,
} from "lucide-react";
import { useAdminAccess } from "@/contexts/AdminContext";
import {
  applyReturnInventoryDecision,
  subscribeToAdminReturns,
  updateReturnByAdmin,
} from "@/services/return.service";
import type { ReturnRequest, ReturnStatus } from "@/types/return";

const preview: ReturnRequest[] = [
  {
    id: "RET-PRV-1048",
    orderId: "STY-PRV-2026-1048",
    userId: "preview-meera",
    customerName: "Meera Kapoor",
    customerEmail: "meera.kapoor@example.com",
    resolution: "exchange",
    reason: "Size or fit issue",
    details: "Please exchange size M for size L.",
    evidenceUrls: [],
    items: [
      {
        itemId: "dress-1",
        productId: "women-champagne-gold-draped-dress",
        variantId: "women-champagne-gold-draped-dress-m-champagne",
        name: "Champagne Gold Draped Dress",
        image:
          "/images/shop/products/women/dresses/women-champagne-gold-draped-dress-01.png",
        quantity: 1,
        size: "M",
        color: "Champagne",
        requestedSize: "L",
        requestedColor: "Champagne",
      },
    ],
    status: "approved",
    pickupCarrier: "Delhivery",
    pickupTrackingId: "DLV-RET-90448",
    pickupScheduledAt: "2026-07-31T10:00",
    inspectionOutcome: "pending",
    inventoryAdjustmentStatus: "not_required",
    inventoryAdjustmentError: "",
    inventoryAdjustedAt: "",
    refundMethod: "not_applicable",
    refundDestination: { accountHolder: "", bankName: "", accountLast4: "", upiId: "" },
    refundAmount: 0,
    refundStatus: "not_applicable",
    refundReference: "",
    adminNote: "Priority Privé exchange.",
    createdAt: "2026-07-29T10:30:00.000Z",
    updatedAt: "2026-07-29T11:00:00.000Z",
    auditTrail: [],
  },
];
const next: Record<ReturnStatus, ReturnStatus[]> = {
  requested: ["approved", "rejected"],
  approved: ["pickup_scheduled", "exchange_reserved", "refund_pending"],
  rejected: ["closed"],
  pickup_scheduled: ["in_transit"],
  in_transit: ["received"],
  received: ["inspected"],
  inspected: ["exchange_reserved", "refund_pending", "closed"],
  exchange_reserved: ["completed"],
  refund_pending: ["refund_processing"],
  refund_processing: [],
  completed: ["closed"],
  closed: [],
};
const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminReturnsManager() {
  const { profile, isPreview } = useAdminAccess();
  const [requests, setRequests] = useState<ReturnRequest[]>(
    isPreview ? preview : [],
  );
  const [selected, setSelected] = useState<ReturnRequest | null>(null);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (isPreview) return;
    return subscribeToAdminReturns(setRequests, (error) =>
      setNotice(error.message),
    );
  }, [isPreview]);
  useEffect(() => {
    if (!selected) return;
    const fresh = requests.find((item) => item.id === selected.id);
    if (fresh && fresh !== selected) window.setTimeout(() => setSelected(fresh), 0);
  }, [requests, selected]);
  const visible = useMemo(
    () =>
      requests.filter(
        (item) =>
          (status === "all" || item.status === status) &&
          (!search ||
            `${item.id} ${item.orderId} ${item.customerName} ${item.customerEmail}`
              .toLowerCase()
              .includes(search.toLowerCase())),
      ),
    [requests, search, status],
  );
  const pending = requests.filter((item) =>
    [
      "requested",
      "approved",
      "pickup_scheduled",
      "in_transit",
      "received",
      "inspected",
    ].includes(item.status),
  ).length;
  const refundQueue = requests.filter((item) =>
    ["refund_pending", "refund_processing"].includes(item.status),
  ).length;
  const exchangeQueue = requests.filter(
    (item) =>
      item.resolution === "exchange" &&
      !["completed", "closed", "rejected"].includes(item.status),
  ).length;
  async function save(updates: Parameters<typeof updateReturnByAdmin>[1]) {
    if (!selected) return;
    if (isPreview) {
      setNotice(
        "Preview read-only hai. Real admin session mein action persist hoga.",
      );
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      await updateReturnByAdmin(selected, updates, {
        uid: profile.uid,
        displayName: profile.displayName,
      });
      setNotice("Aftercare record and audit trail updated.");
    } catch (failure) {
      setNotice(failure instanceof Error ? failure.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  }
  async function postInventory() {
    if (!selected || isPreview) {
      setNotice("Real admin session mein inventory posting persist hogi.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      await applyReturnInventoryDecision(selected, { uid: profile.uid, displayName: profile.displayName });
      setNotice("Return inventory posted idempotently. Duplicate movement protected hai.");
    } catch (failure) {
      setNotice(failure instanceof Error ? failure.message : "Inventory posting failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="min-h-full bg-[#F4EFE9] px-4 py-6 text-[#191614] sm:px-7 lg:px-10 lg:py-9">
      <section className="relative overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_85%_10%,rgba(109,78,226,.34),transparent_34%),linear-gradient(130deg,#171513,#302438)] px-6 py-9 text-white sm:px-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/13 bg-white/7 px-4 py-2 text-[8px] font-bold uppercase tracking-[.23em] text-[#E1B779]">
          <RefreshCcw size={13} /> Aftercare operations
        </span>
        <h1 className="mt-6 max-w-4xl font-heading text-5xl leading-[.92] sm:text-6xl">
          Every return, resolved with precision.
        </h1>
        <p className="mt-5 max-w-2xl text-xs leading-6 text-white/55">
          One operational truth for approvals, reverse logistics, inspection,
          exchange inventory and refund preparation.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/8 px-4 py-3 text-[9px] text-[#E8CA9B]">
          <ShieldAlert size={14} /> Payment safety: online refunds require a
          verified server or gateway webhook.
        </div>
      </section>
      {notice && (
        <div className="mt-5 rounded-2xl border border-[#E3D3BC] bg-[#FFF7EA] px-5 py-4 text-xs text-[#795A36]">
          {notice}
        </div>
      )}
      <section className="mt-6 grid grid-cols-3 gap-3">
        {[
          ["Open cases", pending, PackageCheck],
          ["Exchanges", exchangeQueue, RefreshCcw],
          ["Refund queue", refundQueue, IndianRupee],
        ].map(([label, value, Icon]) => {
          const I = Icon as typeof PackageCheck;
          return (
            <article
              key={String(label)}
              className="rounded-[24px] border border-[#E2D8CE] bg-white p-4 sm:p-5"
            >
              <I size={17} className="text-[#A9753C]" />
              <strong className="mt-4 block font-heading text-3xl">
                {String(value)}
              </strong>
              <span className="text-[7px] font-bold uppercase tracking-[.17em] text-[#8C8178]">
                {String(label)}
              </span>
            </article>
          );
        })}
      </section>
      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_390px]">
        <div className="overflow-hidden rounded-[28px] border border-[#E2D8CE] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#ECE4DC] p-5 sm:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case, order or client…"
              className="h-11 flex-1 rounded-xl border border-[#DDD3C9] px-4 text-xs outline-none"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 rounded-xl border border-[#DDD3C9] bg-white px-4 text-xs"
            >
              <option value="all">All stages</option>
              {Object.keys(next).map((item) => (
                <option key={item} value={item}>
                  {item.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="divide-y divide-[#EEE7E0]">
            {visible.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="grid w-full gap-3 px-5 py-5 text-left hover:bg-[#FCF9F6] sm:grid-cols-[1fr_100px_100px] sm:items-center"
              >
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[.16em] text-[#A9753C]">
                    {item.id} · {item.orderId}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl">
                    {item.customerName}
                  </h3>
                  <p className="mt-1 text-[10px] text-[#847A72]">
                    {item.items.length} item(s) · {item.reason}
                  </p>
                </div>
                <span className="text-[8px] font-bold uppercase">
                  {item.resolution}
                </span>
                <span className="rounded-full bg-[#F1E9E0] px-3 py-2 text-center text-[7px] font-bold uppercase">
                  {item.status.replace(/_/g, " ")}
                </span>
              </button>
            ))}
            {!visible.length && (
              <p className="p-12 text-center text-xs text-[#887E76]">
                No matching aftercare cases.
              </p>
            )}
          </div>
        </div>
        <aside className="rounded-[28px] bg-[#1C1917] p-6 text-white">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[.2em] text-[#DDB270]">
                    Case dossier
                  </p>
                  <h2 className="mt-2 font-heading text-3xl">
                    {selected.customerName}
                  </h2>
                  <p className="mt-2 text-[9px] text-white/42">
                    {selected.orderId} · {selected.customerEmail}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-2 text-[7px] font-bold uppercase">
                  {selected.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="mt-6 space-y-3">
                {selected.items.map((item) => (
                  <div
                    key={item.itemId}
                    className="rounded-2xl border border-white/9 bg-white/5 p-4"
                  >
                    <p className="text-xs font-semibold">
                      {item.quantity}× {item.name}
                    </p>
                    <p className="mt-2 text-[9px] text-white/45">
                      {item.size} / {item.color}
                      {selected.resolution === "exchange"
                        ? ` → ${item.requestedSize || "new size pending"}`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3">
                <label className="grid gap-2 text-[7px] font-bold uppercase tracking-[.16em] text-white/45">
                  Carrier
                  <input
                    value={selected.pickupCarrier}
                    onChange={(e) =>
                      setSelected({
                        ...selected,
                        pickupCarrier: e.target.value,
                      })
                    }
                    className="h-10 rounded-xl border border-white/10 bg-white/6 px-3 text-xs normal-case text-white outline-none"
                  />
                </label>
                <label className="grid gap-2 text-[7px] font-bold uppercase tracking-[.16em] text-white/45">
                  Tracking ID
                  <input
                    value={selected.pickupTrackingId}
                    onChange={(e) =>
                      setSelected({
                        ...selected,
                        pickupTrackingId: e.target.value,
                      })
                    }
                    className="h-10 rounded-xl border border-white/10 bg-white/6 px-3 text-xs normal-case text-white outline-none"
                  />
                </label>
                <label className="grid gap-2 text-[7px] font-bold uppercase tracking-[.16em] text-white/45">
                  Pickup schedule
                  <input
                    type="datetime-local"
                    value={selected.pickupScheduledAt.slice(0, 16)}
                    onChange={(e) => setSelected({ ...selected, pickupScheduledAt: e.target.value })}
                    className="h-10 rounded-xl border border-white/10 bg-white/6 px-3 text-xs normal-case text-white outline-none"
                  />
                </label>
                <label className="grid gap-2 text-[7px] font-bold uppercase tracking-[.16em] text-white/45">
                  Inspection
                  <select value={selected.inspectionOutcome} onChange={(e)=>setSelected({...selected,inspectionOutcome:e.target.value as ReturnRequest["inspectionOutcome"]})} className="h-10 rounded-xl border border-white/10 bg-[#24201D] px-3 text-xs normal-case text-white outline-none">
                    <option value="pending">Pending</option><option value="restock">Restock</option><option value="damaged">Damaged</option><option value="rejected">Rejected</option>
                  </select>
                </label>
                <label className="grid gap-2 text-[7px] font-bold uppercase tracking-[.16em] text-white/45">
                  Refund method
                  <select value={selected.refundMethod} onChange={(e)=>setSelected({...selected,refundMethod:e.target.value as ReturnRequest["refundMethod"]})} className="h-10 rounded-xl border border-white/10 bg-[#24201D] px-3 text-xs normal-case text-white outline-none">
                    <option value="not_applicable">Not applicable</option><option value="original">Original method</option><option value="bank">Bank</option><option value="upi">UPI</option><option value="store_credit">Store credit</option>
                  </select>
                </label>
                <label className="grid gap-2 text-[7px] font-bold uppercase tracking-[.16em] text-white/45">
                  Refund amount
                  <input
                    type="number"
                    value={selected.refundAmount}
                    onChange={(e) =>
                      setSelected({
                        ...selected,
                        refundAmount: Number(e.target.value),
                      })
                    }
                    className="h-10 rounded-xl border border-white/10 bg-white/6 px-3 text-xs normal-case text-white outline-none"
                  />
                </label>
                {(selected.refundMethod === "upi" || selected.refundMethod === "bank") && <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-[9px] leading-5 text-white/60"><strong className="text-white">Refund destination:</strong> {selected.refundMethod === "upi" ? (selected.refundDestination.upiId || "UPI ID pending") : `${selected.refundDestination.accountHolder || "Holder pending"} · ${selected.refundDestination.bankName || "Bank pending"} · •••• ${selected.refundDestination.accountLast4 || "----"}`}</div>}
                <label className="grid gap-2 text-[7px] font-bold uppercase tracking-[.16em] text-white/45">
                  Internal note
                  <textarea
                    value={selected.adminNote}
                    onChange={(e) =>
                      setSelected({ ...selected, adminNote: e.target.value })
                    }
                    className="min-h-20 rounded-xl border border-white/10 bg-white/6 p-3 text-xs normal-case text-white outline-none"
                  />
                </label>
              </div>
              <button
                onClick={() =>
                  save({
                    pickupCarrier: selected.pickupCarrier,
                    pickupTrackingId: selected.pickupTrackingId,
                    pickupScheduledAt: selected.pickupScheduledAt,
                    inspectionOutcome: selected.inspectionOutcome,
                    refundMethod: selected.refundMethod,
                    refundDestination: selected.refundDestination,
                    refundAmount: selected.refundAmount,
                    adminNote: selected.adminNote,
                  })
                }
                disabled={busy}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/12 text-[8px] font-bold uppercase"
              >
                <Save size={13} /> Save operations
              </button>
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="text-[7px] font-bold uppercase tracking-[.16em] text-white/45">Inventory reconciliation</p><p className="mt-1 text-[9px] text-[#DDB270]">{selected.inventoryAdjustmentStatus.replace(/_/g," ")}</p></div>
                  <button type="button" onClick={postInventory} disabled={busy || selected.inventoryAdjustmentStatus === "completed" || !["restock","damaged"].includes(selected.inspectionOutcome)} className="min-h-10 rounded-full bg-[#DFB16E] px-4 text-[7px] font-bold uppercase text-[#1C1711] disabled:opacity-35">Post stock</button>
                </div>
                {selected.inventoryAdjustmentError && <p className="mt-2 text-[8px] leading-4 text-red-200">{selected.inventoryAdjustmentError}</p>}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {next[selected.status].map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      save({
                        status: item,
                        refundStatus:
                          item === "refund_pending"
                            ? "pending"
                            : item === "refund_processing"
                              ? "processing"
                              : selected.refundStatus,
                      })
                    }
                    disabled={busy}
                    className={`min-h-11 rounded-xl px-3 text-[7px] font-bold uppercase tracking-[.1em] ${item === "rejected" || item === "closed" ? "bg-red-400/12 text-red-200" : "bg-[#DFB16E] text-[#1C1711]"}`}
                  >
                    {busy ? (
                      <Loader2 size={13} className="mx-auto animate-spin" />
                    ) : (
                      item.replace(/_/g, " ")
                    )}
                  </button>
                ))}
              </div>
              {selected.refundAmount > 0 && (
                <p className="mt-4 text-[9px] text-[#DDB270]">
                  Prepared refund: {money(selected.refundAmount)} ·{" "}
                  {selected.refundStatus}
                </p>
              )}
            </>
          ) : (
            <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
              <ClipboardCheck size={28} className="text-[#DDB270]" />
              <h2 className="mt-5 font-heading text-3xl">Select a case.</h2>
              <p className="mt-3 max-w-xs text-[10px] leading-5 text-white/40">
                Open a return or exchange to manage its synchronized journey.
              </p>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
