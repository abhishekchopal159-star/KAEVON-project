"use client";

import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Check,
  Gem,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

function formatMemberSince(
  creationTime?: string,
  profileDate?: Date | null
) {
  const date = profileDate
    ? profileDate
    : creationTime
      ? new Date(creationTime)
      : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "Recently joined";
  }

  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export default function ProfileCard() {
  const {
    user,
    profile,
    isAdmin,
  } = useAuth();
  const displayName =
    profile?.displayName ||
    user?.displayName ||
    "Styloverse Member";
  const email = user?.email || "";
  const phone =
    profile?.phoneNumber ||
    user?.phoneNumber ||
    "Not added";
  const isPrive =
    isAdmin ||
    profile?.subscriptionPlan === "prive";
  const completionFields = [
    displayName,
    email,
    profile?.phoneNumber,
    profile?.dateOfBirth,
    profile?.gender,
  ];
  const completion = Math.round(
    (completionFields.filter(Boolean).length /
      completionFields.length) *
      100
  );
  const memberSince = formatMemberSince(
    user?.metadata.creationTime,
    profile?.createdAt
  );

  return (
    <aside className="group relative overflow-hidden rounded-[32px] border border-white/65 bg-white/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.07)] backdrop-blur-xl md:rounded-[36px] md:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#5B3DF5]/10 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-[#D4AF37]/10 blur-[80px]" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 md:flex-col md:text-center">
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#5B3DF5] via-[#7555FF] to-[#A48CFF] text-3xl font-bold text-white shadow-2xl ring-[6px] ring-[#F8F6F2] md:h-28 md:w-28 md:text-4xl">
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>
            <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500 md:bottom-2 md:right-2" />
          </div>

          <div className="min-w-0 md:mt-5">
            <h2 className="truncate font-heading text-2xl leading-tight text-[#171717] md:text-3xl">
              {displayName}
            </h2>
            <p className="mt-1 truncate text-xs text-gray-500 md:text-sm">
              {email}
            </p>
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] ${
                isPrive
                  ? "bg-[#171517] text-[#E4B66D]"
                  : "border border-[#DED4CA] bg-[#F7F2EC] text-[#766A60]"
              }`}
            >
              {isPrive ? (
                <Gem size={13} />
              ) : (
                <ShieldCheck size={13} />
              )}
              {isPrive
                ? isAdmin
                  ? "Admin · Privé Gold"
                  : "Privé active"
                : "Free account"}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex justify-between text-xs">
            <span className="font-medium text-gray-500">
              Profile completion
            </span>
            <span className="font-semibold text-[#5B3DF5]">
              {completion}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#ECECEC]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#5B3DF5] to-[#A083FF] transition-[width] duration-700"
              style={{
                width: `${completion}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-7 space-y-3">
          {[
            {
              label: "Verified email",
              value: email,
              icon: Mail,
            },
            {
              label: "Phone",
              value: phone,
              icon: Phone,
            },
            {
              label: "Member since",
              value: memberSince,
              icon: Calendar,
            },
          ].map((detail) => {
            const Icon = detail.icon;

            return (
              <div
                key={detail.label}
                className="flex items-center gap-3 rounded-2xl border border-black/[0.03] bg-[#FAF8F6] p-3.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#6046E8] shadow-sm">
                  <Icon size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                    {detail.label}
                  </p>
                  <p className="mt-1 truncate text-xs font-medium text-[#292521]">
                    {detail.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mt-7 overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#181617,#292139_62%,#44327B)] p-5 text-white shadow-xl">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-[#E4B66D]/20" />
          <div className="absolute right-2 top-2 h-14 w-14 rounded-full bg-[#7B5CFF]/20 blur-xl" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#D9B378]">
                Styloverse Privé
              </p>
              <Sparkles
                size={17}
                className="text-[#E7BD78]"
              />
            </div>
            <h3 className="mt-3 font-heading text-2xl">
              {isPrive
                ? isAdmin
                  ? "Your Privé Gold access is included."
                  : "Your private access is active."
                : "Elevate every order."}
            </h3>
            <div className="mt-4 space-y-2 text-[10px] text-white/65">
              {[
                "Early collection access",
                "Priority delivery privileges",
                "Members-only private offers",
              ].map((benefit) => (
                <p
                  key={benefit}
                  className="flex items-center gap-2"
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
              className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#171517] transition hover:-translate-y-0.5"
            >
              {isPrive
                ? "Manage Privé"
                : "Compare plans"}
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <Link
          href="/account/profile#personal-details"
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#D9D0C7] bg-white text-xs font-semibold text-[#2B2723] transition hover:border-[#171717] hover:bg-[#171717] hover:text-white"
        >
          <Pencil size={15} />
          Edit profile
        </Link>
      </div>
    </aside>
  );
}
