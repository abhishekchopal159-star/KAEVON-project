"use client";

import { useEffect, useMemo, useState } from "react";
import { Headphones, Loader2, Save, Search, ShieldCheck } from "lucide-react";
import { useAdminAccess } from "@/contexts/AdminContext";
import { subscribeToAdminTickets, updateSupportTicket } from "@/services/support.service";
import type { SupportTicket } from "@/types/support";

const preview: SupportTicket[] = [{ id:"SUP-PRV-1024", userId:"preview", customerName:"Meera Kapoor", customerEmail:"meera@example.com", orderId:"STY-PRV-1024", category:"delivery", subject:"Delivery date clarification", message:"Could you confirm the evening delivery window?", status:"open", priority:"normal", adminReply:"", createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() }];

export default function AdminSupportManager() {
  const { isPreview } = useAdminAccess();
  const [tickets,setTickets] = useState<SupportTicket[]>(isPreview ? preview : []);
  const [selected,setSelected] = useState<SupportTicket|null>(null);
  const [search,setSearch] = useState("");
  const [status,setStatus] = useState("all");
  const [busy,setBusy] = useState(false);
  const [notice,setNotice] = useState("");
  useEffect(() => isPreview ? undefined : subscribeToAdminTickets(setTickets,(error)=>setNotice(error.message)),[isPreview]);
  const visible = useMemo(()=>tickets.filter((ticket)=>(status === "all" || ticket.status === status) && `${ticket.customerName} ${ticket.customerEmail} ${ticket.subject} ${ticket.orderId}`.toLowerCase().includes(search.toLowerCase())),[tickets,status,search]);
  async function save() {
    if (!selected) return;
    if (isPreview) { setNotice("Preview is read-only; real admin replies persist in Firestore."); return; }
    setBusy(true); setNotice("");
    try { await updateSupportTicket(selected.id,{status:selected.status,priority:selected.priority,adminReply:selected.adminReply}); setNotice("Client-care response saved securely."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Update failed."); }
    finally { setBusy(false); }
  }
  return <main className="min-h-full bg-[#F4EFE9] p-4 text-[#191614] sm:p-8">
    <section className="rounded-[36px] bg-[radial-gradient(circle_at_85%_10%,rgba(111,78,235,.36),transparent_34%),linear-gradient(130deg,#151311,#31253A)] p-7 text-white sm:p-10"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[8px] font-bold uppercase tracking-[.22em] text-[#E2B977]"><Headphones size={14}/>Client care command</span><h1 className="mt-6 font-heading text-5xl leading-none sm:text-7xl">Every conversation, considered.</h1><p className="mt-5 max-w-2xl text-xs leading-6 text-white/50">Account-scoped requests, priority handling and a synchronized customer-visible response.</p></section>
    {notice && <p className="mt-5 rounded-2xl border border-[#DDCFBF] bg-white px-5 py-4 text-xs">{notice}</p>}
    <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_400px]">
      <div className="overflow-hidden rounded-[28px] border border-[#E1D7CD] bg-white"><div className="flex gap-3 border-b border-[#EEE6DE] p-4"><label className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-[#DDD3C9] px-3"><Search size={14}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search client, order or subject" className="min-w-0 flex-1 text-xs outline-none"/></label><select value={status} onChange={(e)=>setStatus(e.target.value)} className="rounded-xl border border-[#DDD3C9] px-3 text-xs"><option value="all">All states</option><option value="open">Open</option><option value="in_progress">In progress</option><option value="waiting_customer">Waiting customer</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select></div><div className="divide-y divide-[#EEE6DE]">{visible.map((ticket)=><button key={ticket.id} onClick={()=>setSelected(ticket)} className="grid w-full gap-2 p-5 text-left hover:bg-[#FCF9F6] sm:grid-cols-[1fr_110px]"><div><p className="text-[8px] font-bold uppercase tracking-[.16em] text-[#A9753C]">{ticket.category} · {ticket.orderId || "No order"}</p><h2 className="mt-2 font-heading text-2xl">{ticket.subject}</h2><p className="mt-1 text-[10px] text-[#81766D]">{ticket.customerName} · {ticket.customerEmail}</p></div><span className="self-center rounded-full bg-[#F2EBE4] px-3 py-2 text-center text-[7px] font-bold uppercase">{ticket.status.replace(/_/g," ")}</span></button>)}{!visible.length && <p className="p-12 text-center text-xs text-[#82776E]">No matching support cases.</p>}</div></div>
      <aside className="rounded-[28px] bg-[#1B1816] p-6 text-white">{selected ? <><p className="text-[8px] font-bold uppercase tracking-[.2em] text-[#DFB16E]">{selected.id}</p><h2 className="mt-3 font-heading text-3xl">{selected.customerName}</h2><p className="mt-5 rounded-2xl bg-white/6 p-4 text-xs leading-6 text-white/65">{selected.message}</p><div className="mt-5 grid grid-cols-2 gap-2"><select value={selected.status} onChange={(e)=>setSelected({...selected,status:e.target.value as SupportTicket["status"]})} className="h-11 rounded-xl border border-white/10 bg-[#292522] px-3 text-xs"><option value="open">Open</option><option value="in_progress">In progress</option><option value="waiting_customer">Waiting customer</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select><select value={selected.priority} onChange={(e)=>setSelected({...selected,priority:e.target.value as SupportTicket["priority"]})} className="h-11 rounded-xl border border-white/10 bg-[#292522] px-3 text-xs"><option value="normal">Normal</option><option value="high">High priority</option></select></div><textarea value={selected.adminReply} onChange={(e)=>setSelected({...selected,adminReply:e.target.value})} placeholder="Write the customer-visible response…" className="mt-3 min-h-36 w-full rounded-2xl border border-white/10 bg-white/6 p-4 text-xs outline-none"/><button onClick={()=>void save()} disabled={busy} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#DFB16E] text-[8px] font-bold uppercase text-[#1B1816]">{busy?<Loader2 size={14} className="animate-spin"/>:<Save size={14}/>}Save response</button></> : <div className="flex min-h-[480px] flex-col items-center justify-center text-center"><ShieldCheck className="text-[#DFB16E]"/><h2 className="mt-5 font-heading text-3xl">Select a conversation.</h2></div>}</aside>
    </section>
  </main>;
}
