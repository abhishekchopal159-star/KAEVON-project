"use client";

import Link from "next/link";
import {
  Bell,
  Menu,
  Search,
  Store,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useAdminAccess } from "@/contexts/AdminContext";

const routeTitles: Record<
  string,
  string
> = {
  "/admin": "Overview",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/inventory": "Inventory",
  "/admin/customers": "Customers",
  "/admin/categories": "Categories",
  "/admin/discounts": "Discounts",
  "/admin/returns": "Returns & Aftercare",
  "/admin/support": "Client Support",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
};

export default function AdminHeader({
  onOpenMenu,
}: {
  onOpenMenu: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAdminAccess();
  const [searchQuery, setSearchQuery] =
    useState("");
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);
  const searchInputRef =
    useRef<HTMLInputElement>(null);
  const pageTitle =
    routeTitles[pathname] ??
    "Control room";

  useEffect(() => {
    function handleShortcut(
      event: KeyboardEvent
    ) {
      if (
        (event.metaKey ||
          event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }

      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleShortcut
      );
    };
  }, []);

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const query = searchQuery.trim();
    if (!query) {
      searchInputRef.current?.focus();
      return;
    }

    const target =
      /order|sty-/i.test(query)
        ? "/admin/orders"
        : "/admin/products";
    router.push(
      `${target}?search=${encodeURIComponent(
        query
      )}`
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#DED6CD]/70 bg-[#F4EFE9]/90 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1540px] items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#DED5CB] bg-white/80 text-[#28231F] xl:hidden"
          aria-label="Open admin navigation"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <p className="text-[8px] font-semibold uppercase tracking-[0.31em] text-[#A17340]">
            Commerce office
          </p>
          <h1 className="truncate font-[var(--font-heading)] text-2xl leading-tight text-[#171513] sm:text-3xl">
            {pageTitle}
          </h1>
        </div>

        <form
          onSubmit={handleSearch}
          className="ml-auto hidden h-11 w-full max-w-[360px] items-center gap-3 rounded-2xl border border-[#DED5CB] bg-white/65 px-4 text-[#80766D] lg:flex"
        >
          <button
            type="submit"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition hover:bg-[#EEE6DE] hover:text-[#8F6335]"
            aria-label="Search admin records"
          >
            <Search size={16} />
          </button>
          <label
            htmlFor="admin-global-search"
            className="sr-only"
          >
            Search admin panel
          </label>
          <input
            ref={searchInputRef}
            id="admin-global-search"
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
            placeholder="Search orders, products..."
            className="min-w-0 flex-1 bg-transparent text-xs text-[#302A25] outline-none placeholder:text-[#9A9188]"
          />
          <kbd className="rounded-md border border-[#DED5CB] bg-white px-2 py-1 text-[8px]">
            ⌘ K
          </kbd>
        </form>

        <Link
          href="/"
          className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[#DED5CB] bg-white/75 text-[#37302A] transition hover:border-[#B98C59] md:flex"
          aria-label="Open storefront"
        >
          <Store size={17} />
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setNotificationsOpen(
                (open) => !open
              )
            }
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#DED5CB] bg-white/75 text-[#37302A]"
            aria-label="Admin notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell size={17} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#A87942] ring-2 ring-white" />
          </button>

          <div
            className={`absolute right-0 top-[calc(100%+12px)] w-[290px] overflow-hidden rounded-[24px] border border-[#DED5CB] bg-[#FFFDFC] shadow-[0_24px_70px_rgba(43,32,23,.18)] transition ${
              notificationsOpen
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-2 opacity-0"
            }`}
          >
            <div className="border-b border-[#E8E0D8] px-5 py-4">
              <p className="font-[var(--font-heading)] text-xl">
                Office notices
              </p>
              <p className="mt-1 text-[9px] text-[#8A8178]">
                System and stock updates
              </p>
            </div>
            <div className="space-y-1 p-2">
              {[
                "Live admin data is connected.",
                "11 catalogue pieces need a stock review.",
                "Admin access is protected by role rules.",
              ].map((notice) => (
                <p
                  key={notice}
                  className="rounded-2xl px-3 py-3 text-[10px] leading-5 text-[#655C53] hover:bg-[#F5EFE8]"
                >
                  {notice}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#171513] font-[var(--font-heading)] text-sm text-[#E4BD7D] shadow-[0_10px_25px_rgba(23,21,19,.16)]">
          {profile.displayName
            .charAt(0)
            .toUpperCase()}
        </div>
      </div>
    </header>
  );
}
