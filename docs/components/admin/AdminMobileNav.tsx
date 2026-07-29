"use client";

import Link from "next/link";
import {
  Boxes,
  LayoutDashboard,
  Menu,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { useAdminAccess } from "@/contexts/AdminContext";

const items = [
  {
    label: "Home",
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
    label: "Stock",
    href: "/admin/inventory",
    icon: Boxes,
  },
];

export default function AdminMobileNav({
  onOpenMenu,
}: {
  onOpenMenu: () => void;
}) {
  const pathname = usePathname();
  const { isPreview } =
    useAdminAccess();

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-40 flex h-[72px] items-center justify-around rounded-[24px] border border-white/10 bg-[#171513]/95 px-2 text-white shadow-[0_24px_70px_rgba(22,18,15,.35)] backdrop-blur-2xl xl:hidden"
      aria-label="Mobile admin navigation"
    >
      {items.map((item) => {
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
            className={`flex h-14 min-w-[54px] flex-col items-center justify-center gap-1 rounded-2xl text-[8px] font-medium transition ${
              active
                ? "bg-[#E7D7BD] text-[#171513]"
                : "text-white/44"
            }`}
          >
            <Icon size={17} />
            {item.label}
          </Link>
        );
      })}

      <button
        type="button"
        onClick={onOpenMenu}
        className="flex h-14 min-w-[54px] flex-col items-center justify-center gap-1 rounded-2xl text-[8px] font-medium text-white/44"
      >
        <Menu size={17} />
        Menu
      </button>
    </nav>
  );
}

