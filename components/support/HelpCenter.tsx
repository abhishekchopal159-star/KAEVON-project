"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Headphones,
  Loader2,
  RefreshCcw,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  createSupportTicket,
  subscribeToUserTickets,
} from "@/services/support.service";
import type { SupportTicket } from "@/types/support";

const faqs = [
  [
    "How does delivery work?",
    "Portfolio demo orders never trigger real fulfilment. In a live handoff, carrier, tracking ID and delivery milestones sync from the admin office.",
  ],
  [
    "When can I request a return?",
    "Eligible delivered pieces can enter the aftercare journey from your account. The operational return window is designed to be configurable by a future store owner.",
  ],
  [
    "How are refunds handled?",
    "COD, UPI, Card and Wallet are represented in the data model. Online refund completion stays server/webhook-only and cannot be faked by the browser.",
  ],
  [
    "Can I exchange a size or colour?",
    "Yes. Exchange requests preserve the original item and requested size/colour so inventory can be reserved after approval.",
  ],
];

export default function HelpCenter() {
  const { user, profile } = useAuth();
  const [query, setQuery] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [category, setCategory] = useState<SupportTicket["category"]>("order");
  const [orderId, setOrderId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(
    () =>
      user
        ? subscribeToUserTickets(user.uid, setTickets, (error) =>
            setNotice(error.message),
          )
        : undefined,
    [user],
  );
  const visibleFaqs = useMemo(
    () =>
      faqs.filter((item) =>
        item.join(" ").toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  async function submit() {
    if (!user) return;
    setBusy(true);
    setNotice("");
    try {
      await createSupportTicket({
        userId: user.uid,
        customerName:
          profile?.displayName || user.displayName || "Styloverse client",
        customerEmail: user.email || "",
        orderId,
        category,
        subject,
        message,
      });
      setSubject("");
      setMessage("");
      setNotice(
        "Support request securely received. Our demo office will not contact or charge you.",
      );
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Ticket create nahi ho saka.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="min-h-screen bg-[#F4EFE9] text-[#191614]">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_85%_10%,rgba(111,78,235,.34),transparent_32%),linear-gradient(130deg,#151311,#30243A)] px-5 py-20 text-white sm:px-10 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/7 px-4 py-2 text-[9px] font-bold uppercase tracking-[.23em] text-[#E2B977]">
            <Headphones size={14} /> Client care atelier
          </span>
          <h1 className="mt-7 max-w-4xl font-heading text-6xl leading-[.88] sm:text-7xl lg:text-8xl">
            Considered care, at every step.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55">
            Shipping, exchanges, returns and account support—designed as one
            synchronized premium journey.
          </p>
          <label className="mt-9 flex h-14 max-w-2xl items-center gap-3 rounded-full border border-white/14 bg-white/9 px-5 backdrop-blur-xl">
            <Search size={18} className="text-[#E2B977]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search delivery, refunds, exchanges…"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </label>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-7 lg:py-16">
        <section className="grid gap-3 sm:grid-cols-3">
          {[
            [Truck, "Shipping", "Tracked fulfilment architecture"],
            [RefreshCcw, "Returns & exchange", "One aftercare timeline"],
            [ShieldCheck, "Refund safety", "Webhook-ready payment truth"],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof Truck;
            return (
              <article
                key={String(title)}
                className="rounded-[28px] border border-[#E0D6CC] bg-white p-6"
              >
                <I className="text-[#9A6836]" />
                <h2 className="mt-5 font-heading text-2xl">{String(title)}</h2>
                <p className="mt-2 text-xs leading-6 text-[#81766D]">
                  {String(text)}
                </p>
              </article>
            );
          })}
        </section>
        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_.92fr]">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.24em] text-[#9A6836]">
              Frequently considered
            </p>
            <div className="mt-5 space-y-3">
              {visibleFaqs.map(([question, answer]) => (
                <details
                  key={question}
                  className="group rounded-[24px] border border-[#E0D6CC] bg-white p-5"
                >
                  <summary className="cursor-pointer list-none font-heading text-xl">
                    {question}
                  </summary>
                  <p className="mt-4 border-t border-[#EEE6DF] pt-4 text-xs leading-6 text-[#776D65]">
                    {answer}
                  </p>
                </details>
              ))}
              {!visibleFaqs.length && (
                <div className="rounded-[24px] border border-dashed border-[#D8CCC1] p-10 text-center text-xs text-[#81776F]">
                  No exact answer found—open a private support request.
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/account/returns"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#191614] px-5 text-[9px] font-bold uppercase tracking-[.14em] text-white"
              >
                Open return center <ArrowRight size={14} />
              </Link>
              <Link
                href="/help/policies"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#D8CCC1] px-5 text-[9px] font-bold uppercase tracking-[.14em]"
              >
                Read policies
              </Link>
            </div>
          </div>
          <aside className="rounded-[32px] bg-white p-6 shadow-[0_24px_80px_rgba(45,33,22,.08)] sm:p-8">
            <CircleHelp className="text-[#9A6836]" />
            <h2 className="mt-4 font-heading text-3xl">
              Private support request
            </h2>
            {user ? (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(
                        event.target.value as SupportTicket["category"],
                      )
                    }
                    className="h-12 rounded-2xl border border-[#DDD2C8] bg-white px-4 text-xs"
                  >
                    <option value="order">Order</option>
                    <option value="delivery">Delivery</option>
                    <option value="return">Return</option>
                    <option value="refund">Refund</option>
                    <option value="product">Product</option>
                    <option value="account">Account</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    value={orderId}
                    onChange={(event) => setOrderId(event.target.value)}
                    placeholder="Order ID (optional)"
                    className="h-12 rounded-2xl border border-[#DDD2C8] px-4 text-xs"
                  />
                </div>
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="How can we help?"
                  className="mt-3 h-12 w-full rounded-2xl border border-[#DDD2C8] px-4 text-xs"
                />
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Share the details…"
                  className="mt-3 min-h-28 w-full rounded-2xl border border-[#DDD2C8] p-4 text-xs"
                />
                <button
                  onClick={submit}
                  disabled={busy}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#5B3DF5] text-[9px] font-bold uppercase tracking-[.15em] text-white"
                >
                  {busy ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <ArrowRight size={15} />
                  )}{" "}
                  Submit securely
                </button>
              </>
            ) : (
              <div className="mt-6 rounded-2xl bg-[#F7F2ED] p-5 text-xs leading-6 text-[#756A62]">
                Sign in to create and follow an account-scoped support ticket.
                <Link
                  href="/login"
                  className="mt-4 flex font-bold text-[#5B3DF5]"
                >
                  Sign in <ArrowRight size={14} />
                </Link>
              </div>
            )}
            {notice && (
              <p className="mt-4 text-[10px] leading-5 text-[#755739]">
                {notice}
              </p>
            )}
            {user && (
              <div className="mt-6 space-y-2">
                {tickets.slice(0, 3).map((ticket) => (
                  <article
                    key={ticket.id}
                    className="rounded-2xl bg-[#F8F4F0] p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold">{ticket.subject}</p>
                      <span className="text-[7px] font-bold uppercase text-[#9A6836]">
                        {ticket.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="mt-2 flex items-center gap-2 text-[8px] text-[#83786F]">
                      {ticket.status === "resolved" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock3 size={12} />
                      )}{" "}
                      {ticket.id}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
