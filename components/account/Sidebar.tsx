"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  Bell,
  ChevronRight,
  Gem,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  RefreshCcw,
  Settings,
  Shield,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

const menu = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/account" },
  { title: "Style Atelier", icon: WandSparkles, href: "/account/atelier" },
  { title: "Orders", icon: Package, href: "/account/orders" },
  { title: "Returns", icon: RefreshCcw, href: "/account/returns" },
  { title: "Wishlist", icon: Heart, href: "/account/wishlist" },
  { title: "Addresses", icon: MapPin, href: "/account/addresses" },
  {
    title: "Subscription",
    icon: Gem,
    href: "/account/subscription",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/account/notifications",
  },
  { title: "Security", icon: Shield, href: "/account/security" },
  { title: "Settings", icon: Settings, href: "/account/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    profile,
    isAdmin,
  } = useAuth();

  const displayName =
    profile?.displayName ||
    user?.displayName ||
    "Styloverse Member";
  const firstName = displayName.split(" ")[0] || "Member";
  const isPrive =
    isAdmin ||
    profile?.subscriptionPlan === "prive";

  async function logout() {
    await signOut(auth);
    router.push("/login");
  }

  return (
    <aside className="sticky top-5 hidden h-[calc(100vh-40px)] w-[286px] shrink-0 overflow-x-hidden overflow-y-auto rounded-[34px] border border-white/70 bg-[#FBF9F6]/92 shadow-[0_28px_85px_rgba(51,38,26,0.11)] backdrop-blur-2xl xl:flex">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_left,rgba(116,87,255,0.15),transparent_65%)]" />
      <div className="relative z-10 flex h-full w-full flex-col px-5 py-6">
        <Link href="/" className="px-2">
          <p className="font-heading text-[27px] tracking-[0.04em] text-[#171717]">
            STYLOVERSE
          </p>
          <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.54em] text-[#A36F3B]">
            Private Fashion House
          </p>
        </Link>

        <div className="mt-6 rounded-[24px] border border-[#E4DBD2] bg-white/75 p-4 shadow-[0_12px_34px_rgba(46,33,22,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-[#171717] text-lg font-semibold text-white shadow-lg">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-lg leading-tight text-[#171717]">
                {displayName}
              </p>
              <p className="mt-1 truncate text-[11px] text-[#7A716A]">
                {user?.email || "Private account"}
              </p>
            </div>
          </div>
          <Link
            href="/account/subscription"
            className="mt-4 flex items-center justify-between rounded-2xl bg-[#F3EBDD] px-3.5 py-2.5 transition hover:bg-[#EDE1D2]"
          >
            <div className="flex items-center gap-2 text-[#7A552C]">
              <Gem size={14} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                {isPrive
                  ? isAdmin
                    ? "Privé Gold"
                    : "Privé Member"
                  : "Free Plan"}
              </span>
            </div>
            <Sparkles size={14} className="text-[#B57A32]" />
          </Link>
        </div>

        <nav className="mt-5 flex-1 space-y-1" aria-label="Account navigation">
          {menu.map((item) => {
            const isActive =
              item.href === "/account"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex min-h-12 items-center justify-between overflow-hidden rounded-[16px] px-4 text-sm font-medium transition duration-300 ${
                  isActive
                    ? "bg-[#171717] text-white shadow-[0_12px_28px_rgba(23,23,23,0.16)]"
                    : "text-[#5E5751] hover:bg-white hover:text-[#171717]"
                }`}
              >
                {isActive ? (
                  <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-[#D6A467]" />
                ) : null}
                <span className="flex items-center gap-3.5">
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 1.9 : 1.65}
                    className={isActive ? "text-[#E3B777]" : ""}
                  />
                  {item.title}
                </span>
                <ChevronRight
                  size={14}
                  className={`transition ${
                    isActive
                      ? "opacity-70"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-[#E6DED6] pt-4">
          <Link
            href="/account/subscription"
            className="group mb-3 flex items-center justify-between rounded-[18px] bg-[linear-gradient(135deg,#1B191C,#32294E)] px-4 py-3 text-white transition hover:-translate-y-0.5"
          >
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Styloverse Privé
              </p>
              <p className="mt-1 text-xs font-medium text-white/85">
                {isPrive
                  ? "Private access active"
                  : "Compare member benefits"}
              </p>
            </div>
            <ChevronRight
              size={16}
              className="text-[#E4B76F] transition group-hover:translate-x-0.5"
            />
          </Link>
          <button
            type="button"
            onClick={logout}
            className="group flex min-h-11 w-full items-center justify-between rounded-[15px] px-4 text-sm font-medium text-[#9C3F49] transition hover:bg-[#FFF0F1]"
          >
            <span className="flex items-center gap-3">
              <LogOut size={17} /> Sign out
            </span>
            <ChevronRight
              size={14}
              className="opacity-0 transition group-hover:opacity-60"
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
