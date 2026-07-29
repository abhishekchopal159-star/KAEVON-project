"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bell, ChevronRight, Search } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import CloudSyncBadge from "@/components/account/CloudSyncBadge";

type DashboardHeaderProps = {
  pageTitle?: string;
};

export default function DashboardHeader({
  pageTitle,
}: DashboardHeaderProps) {
  const { user, profile } = useAuth();
  const firstName =
    (
      profile?.displayName ||
      user?.displayName ||
      "Member"
    ).split(" ")[0] || "Member";

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="mb-5 flex items-start justify-between gap-4 border-b border-[#D8CEC4] pb-5 md:mb-8 md:flex-col md:gap-6 md:pb-7 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#9A6837] md:text-[10px] md:tracking-[0.38em]">
          {pageTitle ? "Private account" : greeting}
        </p>
        <h1 className="mt-2 font-heading text-[34px] leading-[0.94] tracking-[-0.035em] text-[#171717] md:text-5xl sm:text-6xl">
          {pageTitle ? (
            pageTitle
          ) : (
            <>
              Welcome, <span className="text-[#6B50E8]">{firstName}</span>
            </>
          )}
        </h1>
        <p className="mt-2.5 max-w-[235px] text-[10px] leading-4 text-[#756D66] md:mt-4 md:max-w-none md:text-sm">
          {pageTitle ? `${firstName}'s curated account space` : today}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        <CloudSyncBadge />

        <Link
          href="/shop"
          className="group hidden min-h-12 items-center gap-3 rounded-full border border-[#D8CEC4] bg-white/70 px-5 text-sm font-medium text-[#302B27] shadow-[0_10px_30px_rgba(45,32,20,0.05)] backdrop-blur-xl transition hover:border-[#BDAE9F] hover:bg-white sm:flex"
        >
          <Search size={16} className="text-[#9A6837]" />
          Browse collection
          <ChevronRight
            size={14}
            className="transition group-hover:translate-x-0.5"
          />
        </Link>
        <Link
          href="/account/notifications"
          aria-label="Open notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#D8CEC4] bg-white/75 text-[#171717] shadow-[0_10px_30px_rgba(45,32,20,0.05)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white md:h-12 md:w-12"
        >
          <Bell size={18} strokeWidth={1.7} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#6B50E8] ring-2 ring-white" />
        </Link>
        <Link
          href="/account/profile"
          aria-label="Open profile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171717] font-heading text-base text-white shadow-[0_12px_28px_rgba(23,23,23,0.18)] transition hover:-translate-y-0.5 md:h-12 md:w-12 md:text-lg"
        >
          {firstName.charAt(0).toUpperCase()}
        </Link>
      </div>
    </header>
  );
}
