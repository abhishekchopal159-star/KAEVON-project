"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Gem,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

export default function WelcomeBanner() {
  const {
    user,
    profile,
    isAdmin,
  } = useAuth();
  const firstName =
    (
      profile?.displayName ||
      user?.displayName ||
      "Member"
    ).split(" ")[0] || "Member";
  const isPrive =
    isAdmin ||
    profile?.subscriptionPlan === "prive";

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  }, []);

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(125deg,#151414_0%,#222022_54%,#342A58_100%)] p-5 text-white shadow-[0_28px_70px_rgba(34,26,22,0.22)] md:rounded-[42px] md:p-7 md:shadow-[0_38px_100px_rgba(34,26,22,0.24)] sm:p-10 lg:p-12">
      <div className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-[#775CFF]/20 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#D4A15F]/15 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(115deg,transparent_44%,white_45%,transparent_46%)] [background-size:220px_220px]" />

      <div className="relative z-10 grid items-center gap-10 2xl:grid-cols-[minmax(0,1.45fr)_380px]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 backdrop-blur-xl md:px-4">
            <Sparkles size={14} className="text-[#E2B77E]" />
            <span className="text-[7px] font-semibold uppercase tracking-[0.2em] text-white/70 md:text-[9px] md:tracking-[0.28em]">
              Styloverse private experience
            </span>
          </div>

          <p className="mt-6 text-[11px] font-medium text-[#E0B273] md:mt-8 md:text-sm">
            {greeting}, {firstName}
          </p>
          <h2 className="mt-3 max-w-3xl font-heading text-[36px] leading-[0.96] tracking-[-0.035em] md:text-5xl sm:text-6xl 2xl:text-7xl">
            Your wardrobe,
            <br />
            exceptionally curated.
          </h2>
          <p className="mt-4 max-w-2xl text-[11px] leading-5 text-white/55 md:mt-6 md:text-sm md:leading-7 sm:text-base">
            Explore refined essentials and occasion pieces selected from the
            real Styloverse collection, with your orders, wishlist and account
            activity in one private space.
          </p>

          <div className="mt-6 flex gap-2.5 md:mt-9 md:flex-wrap md:gap-3">
            <Link
              href="/shop"
              className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#F6F2ED] px-4 text-[11px] font-semibold text-[#171717] transition hover:-translate-y-0.5 hover:bg-white md:min-h-13 md:flex-none md:gap-3 md:px-6 md:text-sm"
            >
              Explore collection
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/account/orders"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-4 text-[11px] font-semibold text-white/75 backdrop-blur transition hover:border-white/30 hover:bg-white/[0.09] hover:text-white md:min-h-13 md:flex-none md:px-6 md:text-sm"
            >
              View my orders
            </Link>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/12 bg-white/[0.075] p-4 shadow-2xl backdrop-blur-2xl md:rounded-[32px] md:p-6 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#D9AC64] text-[#17120E] shadow-lg md:h-12 md:w-12 md:rounded-[17px]">
                <Gem size={22} />
              </div>
              <div>
                <p className="text-xs text-white/45">Membership</p>
                <h3 className="mt-1 font-heading text-xl md:text-2xl">
                  {isPrive
                    ? isAdmin
                      ? "Privé Gold · Admin"
                      : "Privé Member"
                    : "Free Account"}
                </h3>
              </div>
            </div>
            <ShieldCheck
              size={20}
              className={
                isPrive
                  ? "text-[#E4B66D]"
                  : "text-emerald-300"
              }
            />
          </div>

          <div className="mt-5 rounded-[18px] border border-white/8 bg-black/15 p-4 md:mt-7 md:rounded-[22px] md:p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-white/38">
              {isPrive
                ? "Your private privileges"
                : "Unlock with Privé"}
            </p>
            <div className="mt-4 space-y-2.5">
              {[
                "48-hour collection preview",
                "Priority delivery privileges",
                "Members-only private offers",
              ].map((benefit) => (
                <p
                  key={benefit}
                  className="flex items-center gap-2 text-[10px] text-white/58"
                >
                  <Check
                    size={12}
                    className="text-[#E4B66D]"
                  />
                  {benefit}
                </p>
              ))}
            </div>
            <Link
              href="/account/subscription"
              className="group mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#171517] transition hover:-translate-y-0.5"
            >
              {isPrive
                ? "Manage membership"
                : "Compare Free vs Privé"}
              <ArrowRight
                size={13}
                className="transition group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
