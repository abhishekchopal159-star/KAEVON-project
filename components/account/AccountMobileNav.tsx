"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  Package,
  RefreshCcw,
  ShoppingBag,
} from "lucide-react";

const mobileAccountLinks = [
  {
    label: "Overview",
    href: "/account",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    label: "Saved",
    href: "/account/wishlist",
    icon: Heart,
  },
  {
    label: "Bag",
    href: "/cart",
    icon: ShoppingBag,
  },
  {
    label: "Returns",
    href: "/account/returns",
    icon: RefreshCcw,
  },
] as const;

export default function AccountMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile account navigation"
      className="fixed inset-x-3 bottom-[max(10px,env(safe-area-inset-bottom))] z-[120] grid h-[72px] grid-cols-5 items-center rounded-[25px] border border-white/15 bg-[#171517]/95 px-2 text-white shadow-[0_20px_60px_rgba(18,14,17,0.34)] backdrop-blur-2xl md:hidden"
    >
      {mobileAccountLinks.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/account"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className="flex h-full flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                isActive
                  ? "bg-[#E3B777] text-[#17120E] shadow-[0_7px_20px_rgba(227,183,119,0.24)]"
                  : "text-white/62"
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.6} />
            </span>
            <span
              className={`text-[7px] font-semibold uppercase tracking-[0.1em] ${
                isActive ? "text-[#E3B777]" : "text-white/38"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
