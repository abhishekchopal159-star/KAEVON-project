"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Construction,
  Sparkles,
} from "lucide-react";

import { useAdminAccess } from "@/contexts/AdminContext";

const moduleDetails = {
  products: {
    eyebrow: "Catalogue studio",
    title: "Products",
    description:
      "Create, edit and publish every Styloverse piece with images, variants, pricing and collection placement.",
    next:
      "Product editor, image gallery and publishing workflow",
  },
  orders: {
    eyebrow: "Order operations",
    title: "Orders",
    description:
      "Review real customer orders, payment state, delivery details and the complete fulfilment journey.",
    next:
      "Order table, filters, detail drawer and status controls",
  },
  inventory: {
    eyebrow: "Stock intelligence",
    title: "Inventory",
    description:
      "Monitor size-level quantities, low-stock alerts and movements across the entire catalogue.",
    next:
      "Stock ledger, alerts and controlled adjustments",
  },
  customers: {
    eyebrow: "Client relations",
    title: "Customers",
    description:
      "Understand client history and value while exposing only the information an administrator needs.",
    next:
      "Customer directory, order history and safe profile view",
  },
  categories: {
    eyebrow: "Collection architecture",
    title: "Categories",
    description:
      "Control categories, subcategories and the visual order of the storefront collection worlds.",
    next:
      "Category editor and merchandising order",
  },
  discounts: {
    eyebrow: "Private offers",
    title: "Discounts",
    description:
      "Design premium promotional codes with validity dates, limits and minimum order values.",
    next:
      "Coupon builder, conditions and campaign status",
  },
  analytics: {
    eyebrow: "Business intelligence",
    title: "Analytics",
    description:
      "Explore revenue, conversion, best sellers, cancellations and customer growth in depth.",
    next:
      "Interactive charts, date ranges and performance reports",
  },
  settings: {
    eyebrow: "House configuration",
    title: "Settings",
    description:
      "Manage store identity, operational preferences, admin access and future integrations.",
    next:
      "Brand, commerce and role configuration",
  },
} as const;

export type AdminModuleKey =
  keyof typeof moduleDetails;

export default function AdminModulePlaceholder({
  module,
}: {
  module: AdminModuleKey;
}) {
  const content =
    moduleDetails[module];
  const { isPreview } =
    useAdminAccess();

  return (
    <section className="admin-panel-enter relative min-h-[calc(100vh-180px)] overflow-hidden rounded-[34px] border border-white/80 bg-white/70 p-6 shadow-[0_30px_90px_rgba(60,44,30,.1)] backdrop-blur-2xl sm:p-9 lg:p-12">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#8061EB]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-[#BE8D53]/12 blur-[110px]" />

      <div className="relative flex min-h-[550px] max-w-3xl flex-col justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#171513] text-[#E2BB7B] shadow-[0_16px_38px_rgba(23,21,19,.2)]">
          <Construction size={22} />
        </div>
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.36em] text-[#A4723D]">
          {content.eyebrow}
        </p>
        <h2 className="mt-3 font-[var(--font-heading)] text-5xl leading-none text-[#171513] sm:text-6xl lg:text-7xl">
          {content.title}
          <span className="text-[#A57A4A]">
            .
          </span>
        </h2>
        <p className="mt-6 max-w-2xl text-sm leading-8 text-[#71675E] sm:text-base">
          {content.description}
        </p>

        <div className="mt-9 rounded-[24px] border border-[#DDD3C9] bg-[#F8F4EF] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#B1834D]/10 text-[#956537]">
              <Sparkles size={17} />
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#9A6A38]">
                Next build milestone
              </p>
              <p className="mt-2 text-xs leading-6 text-[#62584F]">
                {content.next}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={
              isPreview
                ? "/admin?preview=1"
                : "/admin"
            }
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#171513] px-6 text-[10px] font-semibold uppercase tracking-[0.18em] !text-white"
          >
            <ArrowLeft size={14} />
            Return to overview
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#D5CBC1] bg-white px-6 text-[10px] font-semibold uppercase tracking-[0.18em] !text-[#39322C]"
          >
            View storefront
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
