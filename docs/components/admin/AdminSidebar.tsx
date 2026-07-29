"use client";

import Link from "next/link";
import {
  BarChart3,
  Boxes,
  ChevronRight,
  CircleDollarSign,
  ContactRound,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  Settings,
  ShoppingBag,
  Store,
  Tags,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { useAdminAccess } from "@/contexts/AdminContext";
import { useAuth } from "@/contexts/AuthContext";

export const adminNavigation = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: PackageSearch,
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Boxes,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: ContactRound,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderKanban,
  },
  {
    label: "Discounts",
    href: "/admin/discounts",
    icon: Tags,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

type AdminSidebarProps = {
  mobile?: boolean;
  onClose?: () => void;
};

export default function AdminSidebar({
  mobile = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { profile, isPreview } =
    useAdminAccess();
  const { logout } = useAuth();

  return (
    <aside
      className={
        mobile
          ? "flex h-full w-full flex-col bg-[#151412] px-5 pb-6 pt-5 text-white"
          : "sticky top-0 hidden h-screen w-[274px] shrink-0 flex-col border-r border-white/[0.07] bg-[#151412] px-5 pb-6 pt-7 text-white xl:flex"
      }
    >
      <div className="flex items-center justify-between px-2">
        <Link
          href="/admin"
          onClick={onClose}
        >
          <p className="font-[var(--font-heading)] text-[27px] tracking-[0.08em]">
            STYLO
            <span className="text-[#8A6BFF]">
              V
            </span>
            ERSE
          </p>
          <p className="mt-1 text-[7px] uppercase tracking-[0.39em] text-[#D5B273]">
            Private commerce office
          </p>
        </Link>

        {mobile ? (
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]"
            aria-label="Close admin menu"
          >
            <X size={17} />
          </button>
        ) : null}
      </div>

      <div className="mt-8 rounded-[22px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E0B86F] to-[#8C6538] font-[var(--font-heading)] text-lg text-[#171513]">
            {profile.displayName
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">
              {profile.displayName}
            </p>
            <p className="mt-1 truncate text-[9px] text-white/42">
              {isPreview
                ? "Read-only portfolio preview"
                : profile.email}
            </p>
          </div>
        </div>
      </div>

      <p className="mb-3 mt-7 px-3 text-[8px] font-semibold uppercase tracking-[0.34em] text-white/25">
        Management
      </p>

      <nav
        className="space-y-1"
        aria-label="Admin navigation"
      >
        {adminNavigation.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(
                  item.href
                );

          return (
            <Link
              key={item.href}
              href={
                isPreview
                  ? `${item.href}?preview=1`
                  : item.href
              }
              onClick={onClose}
              className={`group flex h-11 items-center gap-3 rounded-2xl px-3 text-[11px] font-medium transition ${
                active
                  ? "bg-[#EEE3D3] text-[#171513] shadow-[0_10px_28px_rgba(0,0,0,0.16)]"
                  : "text-white/52 hover:bg-white/[0.055] hover:text-white"
              }`}
            >
              <Icon
                size={17}
                strokeWidth={1.7}
                className={
                  active
                    ? "text-[#9A6B35]"
                    : "text-white/35 group-hover:text-[#D3AD70]"
                }
              />
              <span className="flex-1">
                {item.label}
              </span>
              {active ? (
                <ChevronRight
                  size={14}
                />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 pt-7">
        <Link
          href="/"
          className="flex h-11 items-center gap-3 rounded-2xl px-3 text-[11px] font-medium text-white/50 transition hover:bg-white/[0.055] hover:text-white"
        >
          <Store size={17} />
          View storefront
        </Link>
        {!isPreview ? (
          <button
            type="button"
            onClick={() =>
              void logout()
            }
            className="flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-[11px] font-medium text-white/50 transition hover:bg-[#A64E4E]/10 hover:text-[#E59A9A]"
          >
            <LogOut size={17} />
            Sign out
          </button>
        ) : (
          <Link
            href="/admin/login"
            className="flex h-11 items-center gap-3 rounded-2xl px-3 text-[11px] font-medium text-white/50 transition hover:bg-white/[0.055] hover:text-white"
          >
            <CircleDollarSign
              size={17}
            />
            Exit preview
          </Link>
        )}
      </div>
    </aside>
  );
}

