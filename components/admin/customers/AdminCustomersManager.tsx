"use client";

import {
  ArrowRight,
  BadgeIndianRupee,
  Crown,
  Download,
  HeartHandshake,
  Loader2,
  Mail,
  MessageSquareText,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tags,
  UserRoundCheck,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAdminAccess } from "@/contexts/AdminContext";
import {
  addCustomerCrmNote,
  subscribeToAdminCustomerCrm,
  updateCustomerCrmProfile,
} from "@/services/customer-admin.service";
import {
  CUSTOMER_SEGMENTS,
  type AdminCustomerRecord,
  type CustomerAccountStatus,
  type CustomerSegment,
} from "@/types/customer-admin";

const previewCustomers: AdminCustomerRecord[] = [
  {
    id: "preview-meera",
    displayName: "Meera Kapoor",
    email: "meera.kapoor@example.com",
    phoneNumber: "+91 98765 41028",
    photoURL: "",
    role: "customer",
    subscriptionPlan: "prive",
    createdAt: "2026-03-12T10:00:00.000Z",
    lastActiveAt: "2026-07-29T08:00:00.000Z",
    orderCount: 7,
    deliveredOrderCount: 6,
    cancelledOrderCount: 1,
    lifetimeValue: 68490,
    averageOrderValue: 11415,
    lastOrderAt: "2026-07-28T10:05:00.000Z",
    segment: "vip",
    tags: ["High value", "Occasion wear"],
    notes: [{
      id: "note-preview-1",
      message: "Prefers signature packaging and evening delivery windows.",
      authorUid: "preview-admin",
      authorName: "Abhishek",
      createdAt: "2026-07-28T15:35:00.000Z",
    }],
    auditTrail: [],
    accountStatus: "active",
    wishlistCount: 5,
    cartCount: 2,
    addressCount: 2,
    orders: [
      { id: "STY-PRV-2026-1048", status: "Processing", paymentStatus: "Received", total: 11498, itemCount: 2, createdAt: "2026-07-28T10:05:00.000Z" },
      { id: "STY-PRV-2026-0981", status: "Delivered", paymentStatus: "Received", total: 8999, itemCount: 1, createdAt: "2026-06-18T12:30:00.000Z" },
    ],
  },
  {
    id: "preview-aarav",
    displayName: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    phoneNumber: "+91 98111 42008",
    photoURL: "",
    role: "customer",
    subscriptionPlan: "free",
    createdAt: "2026-06-10T10:00:00.000Z",
    lastActiveAt: "2026-07-28T07:00:00.000Z",
    orderCount: 2,
    deliveredOrderCount: 1,
    cancelledOrderCount: 0,
    lifetimeValue: 7499,
    averageOrderValue: 7499,
    lastOrderAt: "2026-07-28T09:10:00.000Z",
    segment: "returning",
    tags: ["Menswear"],
    notes: [],
    auditTrail: [],
    accountStatus: "active",
    wishlistCount: 2,
    cartCount: 0,
    addressCount: 1,
    orders: [{ id: "STY-PRV-2026-1047", status: "Packed", paymentStatus: "COD Collection Pending", total: 7499, itemCount: 1, createdAt: "2026-07-28T09:10:00.000Z" }],
  },
  {
    id: "preview-sana",
    displayName: "Sana Qureshi",
    email: "sana.q@example.com",
    phoneNumber: "+91 99220 11223",
    photoURL: "",
    role: "customer",
    subscriptionPlan: "free",
    createdAt: "2026-07-25T10:00:00.000Z",
    lastActiveAt: "2026-07-29T09:00:00.000Z",
    orderCount: 0,
    deliveredOrderCount: 0,
    cancelledOrderCount: 0,
    lifetimeValue: 0,
    averageOrderValue: 0,
    lastOrderAt: "",
    segment: "new",
    tags: [],
    notes: [],
    auditTrail: [],
    accountStatus: "active",
    wishlistCount: 1,
    cartCount: 3,
    addressCount: 0,
    orders: [],
  },
];

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function formatDate(value: string) {
  if (!value) return "No activity";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function exportCustomers(customers: AdminCustomerRecord[]) {
  const headings = ["customerId", "name", "email", "phone", "segment", "membership", "orders", "lifetimeValue", "lastActive", "status", "tags"];
  const rows = customers.map((customer) => [
    customer.id, customer.displayName, customer.email, customer.phoneNumber,
    customer.segment, customer.subscriptionPlan, customer.orderCount,
    customer.lifetimeValue, customer.lastActiveAt, customer.accountStatus,
    customer.tags.join(" | "),
  ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","));
  const url = URL.createObjectURL(new Blob([[headings.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `styloverse-customers-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminCustomersManager() {
  const { profile, isPreview } = useAdminAccess();
  const [customers, setCustomers] = useState<AdminCustomerRecord[]>(isPreview ? previewCustomers : []);
  const [loading, setLoading] = useState(!isPreview);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState<"all" | CustomerSegment>("all");
  const [membership, setMembership] = useState("all");
  const [selected, setSelected] = useState<AdminCustomerRecord | null>(null);
  const [note, setNote] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [segmentDraft, setSegmentDraft] = useState<CustomerSegment>("new");
  const [statusDraft, setStatusDraft] = useState<CustomerAccountStatus>("active");
  const [saving, setSaving] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const actor = useMemo(() => ({ uid: profile.uid, displayName: profile.displayName || "Styloverse administrator" }), [profile]);

  useEffect(() => {
    if (isPreview) return;
    return subscribeToAdminCustomerCrm((records) => {
      setCustomers(records);
      setSelected((current) => current ? records.find((item) => item.id === current.id) ?? null : null);
      setLoading(false);
    }, (failure) => {
      setError(failure.message);
      setLoading(false);
    });
  }, [isPreview]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement as HTMLElement | null;
    drawerRef.current?.focus();
    const handle = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", handle);
    return () => { window.removeEventListener("keydown", handle); previous?.focus?.(); };
  }, [selected]);

  const filtered = useMemo(() => customers.filter((customer) => {
    const term = query.trim().toLowerCase();
    return (!term || [customer.displayName, customer.email, customer.phoneNumber, customer.tags.join(" ")].join(" ").toLowerCase().includes(term))
      && (segment === "all" || customer.segment === segment)
      && (membership === "all" || customer.subscriptionPlan === membership);
  }), [customers, membership, query, segment]);

  const metrics = useMemo(() => ({
    customers: customers.length,
    vip: customers.filter((item) => item.segment === "vip").length,
    members: customers.filter((item) => item.subscriptionPlan === "prive").length,
    value: customers.reduce((sum, item) => sum + item.lifetimeValue, 0),
  }), [customers]);

  function openCustomer(customer: AdminCustomerRecord) {
    setSelected(customer);
    setSegmentDraft(customer.segment);
    setStatusDraft(customer.accountStatus);
    setTagDraft(customer.tags.join(", "));
    setNote("");
    setError("");
  }

  async function saveCrmProfile() {
    if (!selected) return;
    if (isPreview) { setNotice("Preview is read-only. Sign in as administrator to save CRM changes."); return; }
    setSaving(true);
    try {
      await updateCustomerCrmProfile({ customerId: selected.id, tags: tagDraft.split(","), segment: segmentDraft, accountStatus: statusDraft, actor });
      setNotice(`${selected.displayName}'s CRM profile updated.`);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "CRM update failed."); }
    finally { setSaving(false); }
  }

  async function saveNote() {
    if (!selected || !note.trim()) return;
    if (isPreview) { setNotice("Preview is read-only. Sign in as administrator to add notes."); return; }
    setSaving(true);
    try { await addCustomerCrmNote(selected.id, note, actor); setNote(""); setNotice("Private customer note added."); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Note failed."); }
    finally { setSaving(false); }
  }

  return (
    <section className="space-y-6 pb-28 text-[#191715] lg:pb-10">
      <div className="relative overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_85%_15%,rgba(139,104,255,.25),transparent_30%),linear-gradient(135deg,#171513,#28202F)] px-6 py-9 text-white shadow-[0_30px_80px_rgba(34,25,22,.18)] sm:px-10 lg:px-12 lg:py-12">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.07] px-4 py-2 text-[9px] font-bold uppercase tracking-[.22em] text-[#E4BE83]"><HeartHandshake size={14}/> Client intelligence</div>
          <h1 className="mt-5 font-[var(--font-heading)] text-4xl leading-[.95] sm:text-6xl">Every client,<br/><span className="text-[#D8B170]">personally understood.</span></h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">Relationship history, lifetime value, private notes and meaningful segments—without exposing or changing customer login identity.</p>
          <button onClick={() => exportCustomers(filtered)} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#E2B66E] px-6 text-[10px] font-bold uppercase tracking-[.16em] text-[#19130D]"><Download size={15}/> Export clients</button>
        </div>
      </div>

      {notice && <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-xs text-emerald-800">{notice}</div>}
      {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-xs text-rose-800">{error}</div>}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          ["Client profiles", metrics.customers, UsersRound],
          ["Private members", metrics.members, Crown],
          ["VIP clients", metrics.vip, Sparkles],
          ["Lifetime value", currency.format(metrics.value), BadgeIndianRupee],
        ].map(([label, value, Icon], index) => {
          const MetricIcon = Icon as typeof UsersRound;
          return <article key={String(label)} className={`rounded-[26px] border border-[#E4DBD2] p-5 ${index === 3 ? "bg-[#211D1B] text-white" : "bg-white"}`}><MetricIcon size={18} className="text-[#B48348]"/><p className="mt-5 text-[8px] font-bold uppercase tracking-[.18em] opacity-55">{String(label)}</p><p className="mt-1 font-[var(--font-heading)] text-3xl">{String(value)}</p></article>;
        })}
      </div>

      <div className="overflow-hidden rounded-[32px] border border-[#E3DAD1] bg-white shadow-[0_20px_60px_rgba(45,35,27,.07)]">
        <div className="border-b border-[#E9E1D9] p-5 sm:p-7">
          <p className="text-[9px] font-bold uppercase tracking-[.22em] text-[#AD7D45]">Private client book</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_190px_190px]">
            <label className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94887E]" size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, phone or tag…" className="h-12 w-full rounded-2xl border border-[#DDD3CA] bg-[#FBF8F5] pl-11 pr-4 text-xs outline-none focus:border-[#A77B47]"/></label>
            <select aria-label="Customer segment" value={segment} onChange={(event) => setSegment(event.target.value as "all" | CustomerSegment)} className="h-12 rounded-2xl border border-[#DDD3CA] bg-[#FBF8F5] px-4 text-[9px] font-bold uppercase tracking-[.11em]"><option value="all">All segments</option>{CUSTOMER_SEGMENTS.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            <select aria-label="Membership" value={membership} onChange={(event) => setMembership(event.target.value)} className="h-12 rounded-2xl border border-[#DDD3CA] bg-[#FBF8F5] px-4 text-[9px] font-bold uppercase tracking-[.11em]"><option value="all">All memberships</option><option value="free">Free</option><option value="prive">Privé</option></select>
          </div>
        </div>

        {loading ? <div className="flex min-h-72 items-center justify-center"><Loader2 className="animate-spin text-[#A87842]"/></div> : filtered.length === 0 ? <div className="p-16 text-center text-sm text-[#887C72]">No clients match this private view.</div> : <>
          <div className="hidden lg:block">
            <div className="grid grid-cols-[1.6fr_.7fr_.8fr_.7fr_.4fr] border-b border-[#EEE7E0] px-7 py-3 text-[8px] font-bold uppercase tracking-[.16em] text-[#8B8077]"><span>Client</span><span>Segment</span><span>Lifetime value</span><span>Last active</span><span/></div>
            {filtered.map((customer) => <button key={customer.id} onClick={() => openCustomer(customer)} className="grid w-full grid-cols-[1.6fr_.7fr_.8fr_.7fr_.4fr] items-center border-b border-[#F0EAE4] px-7 py-4 text-left transition hover:bg-[#FBF7F2]">
              <span className="flex min-w-0 items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#211D1A] text-xs font-bold text-[#E3BC82]">{initials(customer.displayName)}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{customer.displayName}</span><span className="block truncate text-[9px] text-[#8A8077]">{customer.email}</span></span>{customer.subscriptionPlan === "prive" && <Crown size={14} className="text-[#B6813E]"/>}</span>
              <span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#A36D31]">{customer.segment}</span><span className="font-[var(--font-heading)] text-lg">{currency.format(customer.lifetimeValue)}</span><span className="text-[10px] text-[#71675E]">{formatDate(customer.lastActiveAt)}</span><span className="flex justify-end"><ArrowRight size={16}/></span>
            </button>)}
          </div>
          <div className="grid gap-3 p-4 lg:hidden">{filtered.map((customer) => <button key={customer.id} onClick={() => openCustomer(customer)} className="rounded-[24px] border border-[#E8DFD7] bg-[#FCFAF7] p-4 text-left"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#211D1A] text-xs font-bold text-[#E3BC82]">{initials(customer.displayName)}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{customer.displayName}</p><p className="truncate text-[9px] text-[#8A8077]">{customer.email}</p></div><ArrowRight size={16}/></div><div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#E9E1DA] pt-3 text-center"><span><b className="block font-[var(--font-heading)] text-lg">{customer.orderCount}</b><small className="text-[7px] uppercase tracking-[.12em]">Orders</small></span><span><b className="block font-[var(--font-heading)] text-lg">{currency.format(customer.lifetimeValue)}</b><small className="text-[7px] uppercase tracking-[.12em]">Value</small></span><span><b className="block text-[9px] uppercase text-[#A36D31]">{customer.segment}</b><small className="text-[7px] uppercase tracking-[.12em]">Segment</small></span></div></button>)}</div>
        </>}
      </div>

      {selected && <div className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="customer-dossier-title"><button className="absolute inset-0" onClick={() => setSelected(null)} aria-label="Close customer dossier"/><aside ref={drawerRef} tabIndex={-1} className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[34px] bg-[#F8F3ED] outline-none lg:inset-y-0 left-auto h-full w-full max-w-[720px] rounded-none">
        <div className="sticky top-0 z-10 bg-[#1B1816] px-6 py-6 text-white sm:px-8"><button onClick={() => setSelected(null)} className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10" aria-label="Close customer dossier"><X/></button><p className="text-[9px] font-bold uppercase tracking-[.24em] text-[#D9AF72]">Client dossier</p><h2 id="customer-dossier-title" className="mt-2 pr-14 font-[var(--font-heading)] text-4xl">{selected.displayName}</h2><p className="mt-2 text-xs text-white/50">{selected.email} · Email identity locked</p></div>
        <div className="space-y-4 p-5 sm:p-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Orders", selected.orderCount, ShoppingBag],["Value", currency.format(selected.lifetimeValue), BadgeIndianRupee],["Saved", selected.wishlistCount, HeartHandshake],["Member", selected.subscriptionPlan === "prive" ? "Privé" : "Free", Crown]].map(([label,value,Icon]) => { const SmallIcon=Icon as typeof ShoppingBag; return <div key={String(label)} className="rounded-[20px] bg-white p-4"><SmallIcon size={15} className="text-[#AE7B3F]"/><p className="mt-3 text-[7px] uppercase tracking-[.15em] text-[#8C8177]">{String(label)}</p><p className="mt-1 font-[var(--font-heading)] text-xl">{String(value)}</p></div>;})}</div>
          <section className="rounded-[26px] bg-white p-5"><div className="flex items-center gap-2"><UserRoundCheck size={17} className="text-[#A87339]"/><h3 className="font-[var(--font-heading)] text-2xl">Relationship controls</h3></div><p className="mt-2 text-[10px] leading-5 text-[#7B7168]">Tags and support status are private CRM metadata. Customer login email cannot be changed here.</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><label><span className="text-[8px] font-bold uppercase tracking-[.14em]">Segment</span><select value={segmentDraft} onChange={(event)=>setSegmentDraft(event.target.value as CustomerSegment)} className="mt-2 h-12 w-full rounded-2xl border border-[#DED5CC] px-4 text-xs">{CUSTOMER_SEGMENTS.map((item)=><option key={item}>{item}</option>)}</select></label><label><span className="text-[8px] font-bold uppercase tracking-[.14em]">Support status</span><select value={statusDraft} onChange={(event)=>setStatusDraft(event.target.value as CustomerAccountStatus)} className="mt-2 h-12 w-full rounded-2xl border border-[#DED5CC] px-4 text-xs"><option value="active">Active</option><option value="watch">Watch</option><option value="restricted">Restricted</option></select></label><label className="sm:col-span-2"><span className="text-[8px] font-bold uppercase tracking-[.14em]">Private tags · comma separated</span><div className="relative mt-2"><Tags className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94887E]" size={15}/><input value={tagDraft} onChange={(event)=>setTagDraft(event.target.value)} className="h-12 w-full rounded-2xl border border-[#DED5CC] pl-11 pr-4 text-xs"/></div></label></div><button onClick={saveCrmProfile} disabled={saving} className="mt-4 min-h-12 w-full rounded-2xl bg-[#1D1A18] text-[9px] font-bold uppercase tracking-[.16em] text-white disabled:opacity-50">Save private profile</button></section>
          <section className="rounded-[26px] bg-white p-5"><div className="flex items-center gap-2"><MessageSquareText size={17} className="text-[#A87339]"/><h3 className="font-[var(--font-heading)] text-2xl">Private notes</h3></div><div className="mt-4 space-y-2">{selected.notes.length ? selected.notes.slice().reverse().map((entry)=><div key={entry.id} className="rounded-2xl bg-[#F8F4EF] p-4"><p className="text-xs leading-6">{entry.message}</p><p className="mt-2 text-[7px] uppercase tracking-[.12em] text-[#8C8177]">{entry.authorName} · {formatDate(entry.createdAt)}</p></div>) : <p className="text-xs text-[#8B8179]">No private notes yet.</p>}</div><textarea value={note} onChange={(event)=>setNote(event.target.value)} maxLength={600} placeholder="Add support context…" className="mt-4 min-h-24 w-full rounded-2xl border border-[#DDD4CB] p-4 text-xs"/><button onClick={saveNote} disabled={saving || note.trim().length<3} className="mt-2 min-h-12 w-full rounded-2xl bg-[#DDB16D] text-[9px] font-bold uppercase tracking-[.16em] disabled:opacity-40">Add private note</button></section>
          <section className="rounded-[26px] bg-white p-5"><div className="flex items-center gap-2"><ShieldCheck size={17} className="text-[#A87339]"/><h3 className="font-[var(--font-heading)] text-2xl">Order history</h3></div><div className="mt-4 space-y-2">{selected.orders.length ? selected.orders.map((order)=><div key={order.id} className="flex items-center justify-between rounded-2xl border border-[#E8E0D8] p-4"><div><p className="text-xs font-semibold">{order.id}</p><p className="mt-1 text-[8px] uppercase tracking-[.12em] text-[#8C8177]">{formatDate(order.createdAt)} · {order.itemCount} pieces</p></div><div className="text-right"><p className="font-[var(--font-heading)] text-lg">{currency.format(order.total)}</p><p className="text-[8px] text-[#A06E37]">{order.status}</p></div></div>) : <p className="text-xs text-[#8B8179]">No orders placed yet.</p>}</div></section>
          <div className="flex items-center gap-2 rounded-2xl border border-[#E2D8CE] px-4 py-3 text-[9px] text-[#756B63]"><Mail size={14}/> Login email is read-only and remains controlled by Firebase Authentication.</div>
        </div>
      </aside></div>}
    </section>
  );
}
