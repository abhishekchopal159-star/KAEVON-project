"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  Loader2,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToUserOrders } from "@/services/order.service";
import {
  createReturnRequest,
  subscribeToUserReturns,
} from "@/services/return.service";
import type { CloudOrder } from "@/types/commerce";
import type {
  ReturnItem,
  ReturnRequest,
  ReturnResolution,
} from "@/types/return";

function orderItems(order: CloudOrder | undefined): ReturnItem[] {
  const raw = Array.isArray(order?.items) ? order.items : [];
  return raw.flatMap((entry, index) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    return [
      {
        itemId: String(item.id ?? item.productId ?? index),
        productId: String(item.productDocumentId ?? item.productId ?? item.id ?? ""),
        variantId: String(item.variantId ?? ""),
        name: String(item.name ?? "Styloverse piece"),
        image: String(item.image ?? ""),
        quantity: Math.max(1, Number(item.quantity) || 1),
        size: String(item.size ?? ""),
        color: String(item.color ?? ""),
        requestedSize: "",
        requestedColor: "",
      },
    ];
  });
}
const stages = [
  "requested",
  "approved",
  "pickup_scheduled",
  "in_transit",
  "received",
  "inspected",
  "refund_pending",
  "refund_processing",
  "completed",
];

export default function ReturnCenter() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<CloudOrder[]>([]);
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [orderId, setOrderId] = useState("");
  const [resolution, setResolution] = useState<ReturnResolution>("return");
  const [reason, setReason] = useState("Size or fit issue");
  const [details, setDetails] = useState("");
  const [evidence, setEvidence] = useState("");
  const [requestedSize, setRequestedSize] = useState("");
  const [requestedColor, setRequestedColor] = useState("");
  const [refundMethod, setRefundMethod] = useState<ReturnRequest["refundMethod"]>("original");
  const [upiId, setUpiId] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountLast4, setAccountLast4] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!user) return;
    const a = subscribeToUserOrders(user.uid, setOrders);
    const b = subscribeToUserReturns(user.uid, setRequests);
    return () => {
      a();
      b();
    };
  }, [user]);
  const eligibleOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          String(order.status) === "Delivered" &&
          !requests.some(
            (request) =>
              request.orderId === order.id &&
              !["rejected", "closed"].includes(request.status),
          ),
      ),
    [orders, requests],
  );
  const selectedOrder = eligibleOrders.find((order) => order.id === orderId);
  const items = orderItems(selectedOrder);
  const selectedItems = items
    .filter((item) => selectedItemIds.includes(item.itemId))
    .map((item) => ({ ...item, requestedSize: resolution === "exchange" ? requestedSize : "", requestedColor: resolution === "exchange" ? requestedColor : "" }));
  async function submit() {
    if (!user || !selectedOrder) return;
    if (resolution === "exchange" && !requestedSize.trim() && !requestedColor.trim()) {
      setNotice("Exchange ke liye requested size ya colour required hai.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      await createReturnRequest({
        orderId: selectedOrder.id,
        userId: user.uid,
        customerName:
          profile?.displayName || user.displayName || "Styloverse client",
        customerEmail: user.email || "",
        resolution,
        reason,
        details,
        evidenceUrls: evidence
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        items: selectedItems,
        refundMethod: resolution === "return" ? refundMethod : "not_applicable",
        refundDestination: { accountHolder, bankName, accountLast4, upiId },
      });
      setNotice(
        "Request securely created. This demo does not schedule a real pickup or refund.",
      );
      setOrderId("");
      setDetails("");
      setEvidence("");
    } catch (failure) {
      setNotice(
        failure instanceof Error
          ? failure.message
          : "Request create nahi ho saka.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="pb-10">
      <section className="relative overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_85%_15%,rgba(119,83,240,.3),transparent_34%),linear-gradient(130deg,#171513,#30243A)] p-6 text-white sm:p-9">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/7 px-4 py-2 text-[8px] font-bold uppercase tracking-[.22em] text-[#E0B576]">
          <RefreshCcw size={13} /> Aftercare atelier
        </span>
        <h1 className="mt-6 max-w-3xl font-heading text-5xl leading-[.92] sm:text-6xl">
          Care continues after delivery.
        </h1>
        <p className="mt-5 max-w-2xl text-xs leading-6 text-white/55">
          Request a return or exchange, follow every decision and keep
          inventory/refund truth synchronized.
        </p>
        <div className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/8 px-4 py-3 text-[9px] text-[#E9CC9E]">
          <ShieldCheck size={14} /> Portfolio demo · no real pickup, exchange
          shipment or money movement occurs.
        </div>
      </section>
      <section className="mt-6 grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
        <div className="rounded-[28px] border border-[#E1D7CE] bg-white p-5 sm:p-7">
          <p className="text-[8px] font-bold uppercase tracking-[.23em] text-[#9A6836]">
            New request
          </p>
          <h2 className="mt-2 font-heading text-3xl">Begin aftercare</h2>
          <label className="mt-6 grid gap-2 text-[8px] font-bold uppercase tracking-[.16em] text-[#857A71]">
            Order
            <select
              value={orderId}
              onChange={(event) => { const nextId=event.target.value;setOrderId(nextId);setSelectedItemIds(orderItems(eligibleOrders.find((order)=>order.id===nextId)).map((item)=>item.itemId)); }}
              className="h-12 rounded-2xl border border-[#DDD3C9] bg-white px-4 text-xs normal-case tracking-normal"
            >
              <option value="">Select an eligible order</option>
              {eligibleOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id} · {String(order.status)}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["return", "exchange"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setResolution(item)}
                className={`h-12 rounded-2xl border text-[9px] font-bold uppercase tracking-[.13em] ${resolution === item ? "border-[#1B1816] bg-[#1B1816] text-white" : "border-[#DDD3C9]"}`}
              >
                {item}
              </button>
            ))}
          </div>
          {selectedOrder && (
            <div className="mt-4 rounded-2xl bg-[#F7F2ED] p-4">
              <p className="text-[8px] font-bold uppercase tracking-[.16em] text-[#8A7F76]">Choose items ({selectedItems.length}/{items.length})</p>
              {items.map((item) => (
                <button type="button" key={item.itemId} onClick={() => setSelectedItemIds((current) => current.includes(item.itemId) ? current.filter((id) => id !== item.itemId) : [...current, item.itemId])} className={`mt-2 flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs font-semibold ${selectedItemIds.includes(item.itemId) ? "border-[#5B3DF5] bg-white" : "border-transparent opacity-55"}`}>
                  <span>{item.quantity}Ã— {item.name}</span><CheckCircle2 size={15}/>
                </button>
              ))}
            </div>
          )}
          {resolution === "exchange" && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <input value={requestedSize} onChange={(event)=>setRequestedSize(event.target.value)} placeholder="Requested size" className="h-11 rounded-xl border border-[#DDD3C9] px-3 text-xs"/>
              <input value={requestedColor} onChange={(event)=>setRequestedColor(event.target.value)} placeholder="Requested colour" className="h-11 rounded-xl border border-[#DDD3C9] px-3 text-xs"/>
            </div>
          )}
          {resolution === "return" && String(selectedOrder?.paymentMethod ?? "").toLowerCase().includes("cash") && <div className="mt-4 rounded-2xl border border-[#DDD3C9] bg-[#FBF8F5] p-4"><p className="text-[8px] font-bold uppercase tracking-[.16em] text-[#857A71]">COD refund destination</p><select value={refundMethod} onChange={(event)=>setRefundMethod(event.target.value as ReturnRequest["refundMethod"])} className="mt-3 h-11 w-full rounded-xl border border-[#DDD3C9] bg-white px-3 text-xs"><option value="upi">UPI</option><option value="bank">Bank account</option><option value="store_credit">Styloverse credit</option></select>{refundMethod === "upi" && <input value={upiId} onChange={(event)=>setUpiId(event.target.value)} placeholder="UPI ID" className="mt-2 h-11 w-full rounded-xl border border-[#DDD3C9] px-3 text-xs"/>}{refundMethod === "bank" && <div className="mt-2 grid gap-2 sm:grid-cols-2"><input value={accountHolder} onChange={(event)=>setAccountHolder(event.target.value)} placeholder="Account holder" className="h-11 rounded-xl border border-[#DDD3C9] px-3 text-xs"/><input value={bankName} onChange={(event)=>setBankName(event.target.value)} placeholder="Bank name" className="h-11 rounded-xl border border-[#DDD3C9] px-3 text-xs"/><input maxLength={4} value={accountLast4} onChange={(event)=>setAccountLast4(event.target.value.replace(/\D/g,""))} placeholder="Account last 4 digits" className="h-11 rounded-xl border border-[#DDD3C9] px-3 text-xs sm:col-span-2"/></div>}<p className="mt-2 text-[8px] leading-4 text-[#887B71]">Only masked bank details are stored in this portfolio build. No money movement occurs.</p></div>}
          <label className="mt-4 grid gap-2 text-[8px] font-bold uppercase tracking-[.16em] text-[#857A71]">
            Reason
            <select
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="h-12 rounded-2xl border border-[#DDD3C9] bg-white px-4 text-xs normal-case tracking-normal"
            >
              <option>Size or fit issue</option>
              <option>Damaged on arrival</option>
              <option>Different from description</option>
              <option>Quality concern</option>
              <option>Changed my mind</option>
            </select>
          </label>
          <textarea
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Describe the issue and preferred resolution…"
            className="mt-4 min-h-24 w-full rounded-2xl border border-[#DDD3C9] p-4 text-xs outline-none"
          />
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-dashed border-[#D5C8BC] p-4">
            <ImagePlus size={16} className="text-[#9A6836]" />
            <input
              value={evidence}
              onChange={(event) => setEvidence(event.target.value)}
              placeholder="Evidence image URLs, comma separated"
              className="min-w-0 flex-1 bg-transparent text-[10px] outline-none"
            />
          </div>
          {selectedOrder && (
            <div className="mt-4 rounded-2xl bg-[#F7F2ED] p-4">
              <p className="text-[8px] font-bold uppercase tracking-[.16em] text-[#8A7F76]">
                {items.length} item(s) selected
              </p>
              {items.slice(0, 3).map((item) => (
                <p key={item.itemId} className="mt-2 text-xs font-semibold">
                  {item.quantity}× {item.name}
                </p>
              ))}
            </div>
          )}
          <button
            onClick={submit}
            disabled={busy || !selectedOrder || !selectedItems.length}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#5B3DF5] text-[9px] font-bold uppercase tracking-[.15em] text-white disabled:opacity-45"
          >
            {busy ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <ArrowRight size={15} />
            )}{" "}
            Submit request
          </button>
          {notice && (
            <p className="mt-3 text-[9px] leading-5 text-[#795B3D]">{notice}</p>
          )}
        </div>
        <div className="rounded-[28px] border border-[#E1D7CE] bg-[#F9F5F1] p-5 sm:p-7">
          <p className="text-[8px] font-bold uppercase tracking-[.23em] text-[#9A6836]">
            Synchronized journey
          </p>
          <h2 className="mt-2 font-heading text-3xl">Your requests</h2>
          <div className="mt-6 space-y-4">
            {requests.map((request) => {
              const current = Math.max(0, stages.indexOf(request.status));
              return (
                <article
                  key={request.id}
                  className="rounded-[24px] border border-[#E0D6CD] bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[.16em] text-[#9A6836]">
                        {request.resolution} · {request.orderId}
                      </p>
                      <h3 className="mt-2 font-heading text-2xl">
                        {request.reason}
                      </h3>
                    </div>
                    <span className="rounded-full bg-[#F0E8DE] px-3 py-1.5 text-[7px] font-bold uppercase tracking-[.12em]">
                      {request.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="mt-5 flex gap-1">
                    {stages.slice(0, 6).map((stage, index) => (
                      <span
                        key={stage}
                        className={`h-1.5 flex-1 rounded-full ${index <= current ? "bg-[#5B3DF5]" : "bg-[#E8E1DA]"}`}
                      />
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-[#F8F4F0] p-3">
                      <PackageCheck
                        size={14}
                        className="mx-auto text-[#9A6836]"
                      />
                      <p className="mt-2 text-[7px] uppercase">
                        {request.items.length} items
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#F8F4F0] p-3">
                      <Truck size={14} className="mx-auto text-[#9A6836]" />
                      <p className="mt-2 text-[7px] uppercase">
                        {request.pickupCarrier || "Pending"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#F8F4F0] p-3">
                      <CheckCircle2
                        size={14}
                        className="mx-auto text-[#9A6836]"
                      />
                      <p className="mt-2 text-[7px] uppercase">
                        {request.refundStatus.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
            {!requests.length && (
              <div className="rounded-2xl border border-dashed border-[#D8CCC1] p-10 text-center text-xs text-[#81776F]">
                No return or exchange requests yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
