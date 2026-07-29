"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ArrowRight,
  ChevronDown,
  Gem,
  Heart,
  Home,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import Logo from "./Logo";
import { useAuth } from "@/contexts/AuthContext";

import {
  SHOP_CATEGORY_LINKS,
  WINTER_SUBCATEGORIES,
} from "@/data/navigation";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";

/* ============================================================================
   NAVIGATION DATA
============================================================================ */

const DEFAULT_MAIN_LINKS = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Shop",
    href: "/shop",
  },
  {
    name: "Collections",
    href: "/collections",
  },
  ...SHOP_CATEGORY_LINKS,
  {
    name: "Winter",
    href: "/winter",
  },
];

const SEARCH_SUGGESTIONS = [
  "Premium Wool Jacket",
  "Luxury Sneakers",
  "Oversized Hoodie",
  "Champagne Gold Draped Dress",
];

function subscribeToHydration() {
  return () => undefined;
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

/* ============================================================================
   LOCAL STORAGE HELPERS
============================================================================ */

function getWishlistCount(): number {
  try {
    const savedWishlist =
      window.localStorage.getItem(
        "styloverse-wishlist"
      );

    if (!savedWishlist) {
      return 0;
    }

    const parsedWishlist: unknown =
      JSON.parse(savedWishlist);

    if (!Array.isArray(parsedWishlist)) {
      return 0;
    }

    const uniqueWishlistItems =
      parsedWishlist.map((item, index) => {
        if (
          typeof item === "string" ||
          typeof item === "number"
        ) {
          return String(item);
        }

        if (
          item &&
          typeof item === "object"
        ) {
          const wishlistItem =
            item as Record<
              string,
              unknown
            >;

          return String(
            wishlistItem.id ??
              wishlistItem.productId ??
              wishlistItem.slug ??
              `wishlist-${index}`
          );
        }

        return `wishlist-${index}`;
      });

    return new Set(
      uniqueWishlistItems
    ).size;
  } catch {
    return 0;
  }
}

function getCartCount(): number {
  try {
    const savedCart =
      window.localStorage.getItem(
        "styloverse-cart"
      );

    if (!savedCart) {
      return 0;
    }

    const parsedCart: unknown =
      JSON.parse(savedCart);

    if (!Array.isArray(parsedCart)) {
      return 0;
    }

    return parsedCart.reduce(
      (total, item) => {
        if (
          !item ||
          typeof item !== "object"
        ) {
          return total;
        }

        const cartItem =
          item as Record<
            string,
            unknown
          >;

        const rawQuantity =
          cartItem.quantity;

        const quantity =
          typeof rawQuantity ===
            "number" &&
          Number.isFinite(rawQuantity)
            ? Math.max(
                1,
                Math.floor(rawQuantity)
              )
            : 1;

        return total + quantity;
      },
      0
    );
  } catch {
    return 0;
  }
}

/* ============================================================================
   NAVBAR
============================================================================ */

export default function Navbar() {
  const { categories: managedCategories } = useStorefrontContent();
  const mainLinks = managedCategories.length ? [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/collections" },
    ...managedCategories.map((category) => ({ name: category.name, href: category.href })),
  ] : DEFAULT_MAIN_LINKS;
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    profile,
    loading: authLoading,
    isAdmin,
    logout,
  } = useAuth();

  /* --------------------------------------------------------------------------
     STATE
  -------------------------------------------------------------------------- */

  const [
    isScrolled,
    setIsScrolled,
  ] = useState(false);

  const [
    isMobileOpen,
    setIsMobileOpen,
  ] = useState(false);

  const [
    isSearchOpen,
    setIsSearchOpen,
  ] = useState(false);

  const [
    isCollectionsOpen,
    setIsCollectionsOpen,
  ] = useState(false);

  const [
    isAccountOpen,
    setIsAccountOpen,
  ] = useState(false);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    wishlistCount,
    setWishlistCount,
  ] = useState(0);

  const [
    cartCount,
    setCartCount,
  ] = useState(0);

  /* --------------------------------------------------------------------------
     REFS
  -------------------------------------------------------------------------- */

  const searchInputRef =
    useRef<HTMLInputElement>(null);

  const accountRef =
    useRef<HTMLDivElement>(null);

  /* --------------------------------------------------------------------------
     NAVBAR APPEARANCE
  -------------------------------------------------------------------------- */

  const isHomePage =
    pathname === "/";

  const useTransparentNavbar =
    isHomePage && !isScrolled;

  /* --------------------------------------------------------------------------
     USER DATA
  -------------------------------------------------------------------------- */

  const accountDisplayName =
    profile?.displayName?.trim() ||
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    "Styloverse Member";

  const userInitial =
    isHydrated
      ? accountDisplayName
          .charAt(0)
          .toUpperCase()
      : "";

  const userDisplayName =
    accountDisplayName;

  /* --------------------------------------------------------------------------
     ACTIVE ROUTE
  -------------------------------------------------------------------------- */

  function isActive(
    href: string
  ): boolean {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/shop") {
      return pathname === "/shop";
    }

    return pathname.startsWith(href);
  }

  /* --------------------------------------------------------------------------
     SCROLL
  -------------------------------------------------------------------------- */

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(
        window.scrollY > 30
      );
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* --------------------------------------------------------------------------
     CART AND WISHLIST COUNTS
  -------------------------------------------------------------------------- */

  useEffect(() => {
    function refreshCounts() {
      setWishlistCount(
        getWishlistCount()
      );

      setCartCount(
        getCartCount()
      );
    }

    refreshCounts();

    window.addEventListener(
      "storage",
      refreshCounts
    );

    window.addEventListener(
      "styloverse-wishlist-updated",
      refreshCounts
    );

    window.addEventListener(
      "styloverse-cart-updated",
      refreshCounts
    );

    window.addEventListener(
      "focus",
      refreshCounts
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshCounts
      );

      window.removeEventListener(
        "styloverse-wishlist-updated",
        refreshCounts
      );

      window.removeEventListener(
        "styloverse-cart-updated",
        refreshCounts
      );

      window.removeEventListener(
        "focus",
        refreshCounts
      );
    };
  }, []);

  /* --------------------------------------------------------------------------
     SEARCH FOCUS
  -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isSearchOpen]);

  /* --------------------------------------------------------------------------
     BODY SCROLL LOCK
  -------------------------------------------------------------------------- */

  useEffect(() => {
    const shouldLockBody =
      isSearchOpen ||
      isMobileOpen;

    document.body.style.overflow =
      shouldLockBody
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [
    isMobileOpen,
    isSearchOpen,
  ]);

  /* --------------------------------------------------------------------------
     ACCOUNT OUTSIDE CLICK
  -------------------------------------------------------------------------- */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        accountRef.current &&
        !accountRef.current.contains(
          event.target as Node
        )
      ) {
        setIsAccountOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* --------------------------------------------------------------------------
     ESCAPE KEY
  -------------------------------------------------------------------------- */

  useEffect(() => {
    function handleKeyboard(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
        setIsSearchOpen(false);
        setIsAccountOpen(false);
        setIsCollectionsOpen(false);
      }

      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "k"
      ) {
        event.preventDefault();

        setIsSearchOpen(true);
        setIsMobileOpen(false);
        setIsAccountOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  /* --------------------------------------------------------------------------
     SEARCH
  -------------------------------------------------------------------------- */

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const query =
      searchQuery.trim();

    router.push(
      query
        ? `/shop?search=${encodeURIComponent(
            query
          )}`
        : "/shop"
    );

    setIsSearchOpen(false);
  }

  function openSearch() {
    setIsSearchOpen(true);
    setIsMobileOpen(false);
    setIsAccountOpen(false);
    setIsCollectionsOpen(false);
  }

  function navigateFromSearch(
    href: string
  ) {
    router.push(href);
    setIsSearchOpen(false);
  }

  /* --------------------------------------------------------------------------
     LOGOUT
  -------------------------------------------------------------------------- */

  async function handleLogout() {
    try {
      setIsAccountOpen(false);
      setIsMobileOpen(false);

      await logout();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  }

  return (
    <>
      {/* Announcement bar */}

      <div className="mobile-announcement fixed left-0 right-0 top-0 z-[80] flex h-8 items-center justify-center overflow-hidden bg-[#111111] px-4 text-white">
        <p className="text-center text-[9px] font-medium uppercase tracking-[0.21em] text-white/90 md:text-[10px]">
          Complimentary shipping on
          orders over ₹10,000
        </p>
      </div>

      {/* Main navbar */}

      <header
        className={`mobile-luxury-header fixed left-0 right-0 top-8 z-[70] w-full transition-all duration-500 ${
          useTransparentNavbar
            ? "border-b border-transparent bg-transparent py-3 lg:py-5"
            : "border-b border-black/[0.05] bg-[#FFF8F2]/95 py-2 shadow-[0_10px_35px_rgba(0,0,0,0.05)] backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4 px-4 md:px-7 xl:px-9">
          {/* Mobile menu button */}

          <button
            type="button"
            onClick={() => {
              setIsMobileOpen(true);
              setIsSearchOpen(false);
              setIsAccountOpen(false);
              setIsCollectionsOpen(false);
            }}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-[#171717] lg:hidden"
          >
            <Menu
              size={22}
              strokeWidth={1.7}
            />
          </button>

          {/* Logo */}

          <div className="shrink-0">
            <Logo />
          </div>

          {/* Desktop navigation */}

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 lg:flex xl:gap-6 2xl:gap-7">
            {mainLinks.map((link) => {
              const active =
                isActive(link.href);

              if (
                link.name ===
                "Collections"
              ) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() =>
                      setIsCollectionsOpen(
                        true
                      )
                    }
                    onMouseLeave={() =>
                      setIsCollectionsOpen(
                        false
                      )
                    }
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 py-5 text-[9px] font-semibold uppercase tracking-[0.14em] transition xl:text-[10px] 2xl:text-[11px] ${
                        active
                          ? "text-[#5B3DF5]"
                          : "text-[#171717]/75 hover:text-[#5B3DF5]"
                      }`}
                    >
                      {link.name}

                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-300 ${
                          isCollectionsOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </Link>

                    {/* Collections dropdown */}

                    <div
                      className={`absolute left-1/2 top-full w-[650px] -translate-x-1/2 rounded-3xl border border-black/[0.07] bg-white p-7 shadow-[0_25px_70px_rgba(0,0,0,0.15)] transition-all duration-300 ${
                        isCollectionsOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible -translate-y-2 opacity-0"
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#A67C52]">
                            Collections
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            {SHOP_CATEGORY_LINKS.map(
                              (
                                category
                              ) => (
                                <Link
                                  key={
                                    category.href
                                  }
                                  href={
                                    category.href
                                  }
                                  onClick={() =>
                                    setIsCollectionsOpen(
                                      false
                                    )
                                  }
                                  className="rounded-xl px-3 py-2.5 text-sm text-[#555] transition hover:bg-[#F3EDFF] hover:text-[#5B3DF5]"
                                >
                                  {
                                    category.name
                                  }
                                </Link>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#64748B]">
                            Winter
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            {WINTER_SUBCATEGORIES.map(
                              (
                                category
                              ) => (
                                <Link
                                  key={
                                    category.href
                                  }
                                  href={
                                    category.href
                                  }
                                  onClick={() =>
                                    setIsCollectionsOpen(
                                      false
                                    )
                                  }
                                  className="rounded-xl px-3 py-2.5 text-sm text-[#555] transition hover:bg-[#EEF2F7] hover:text-[#111827]"
                                >
                                  {
                                    category.name
                                  }
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative whitespace-nowrap py-5 text-[9px] font-semibold uppercase tracking-[0.14em] transition xl:text-[10px] 2xl:text-[11px] ${
                    active
                      ? "text-[#5B3DF5]"
                      : "text-[#171717]/75 hover:text-[#5B3DF5]"
                  }`}
                >
                  {link.name}

                  <span
                    className={`absolute bottom-3 left-0 h-px bg-[#5B3DF5] transition-all duration-300 ${
                      active
                        ? "w-full"
                        : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search products"
              className="hidden h-10 w-10 items-center justify-center text-[#171717] transition hover:text-[#5B3DF5] sm:flex"
            >
              <Search
                size={20}
                strokeWidth={1.7}
              />
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden h-10 w-10 items-center justify-center text-[#171717] transition hover:text-[#5B3DF5] sm:flex"
            >
              <Heart
                size={20}
                strokeWidth={1.7}
              />

              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#5B3DF5] px-1 text-[9px] font-bold text-white">
                  {wishlistCount >
                  99
                    ? "99+"
                    : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative flex h-10 w-10 items-center justify-center text-[#171717] transition hover:text-[#5B3DF5]"
            >
              <ShoppingBag
                size={20}
                strokeWidth={1.7}
              />

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#5B3DF5] px-1 text-[9px] font-bold text-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            {/* Account dropdown */}

            <div
              ref={accountRef}
              className="relative hidden sm:block"
            >
              <button
                type="button"
                onClick={() => {
                  setIsAccountOpen(
                    (currentValue) =>
                      !currentValue
                  );

                  setIsCollectionsOpen(
                    false
                  );
                }}
                aria-label="Account"
                aria-expanded={
                  isAccountOpen
                }
                className="flex h-10 w-10 items-center justify-center text-[#171717] transition hover:text-[#5B3DF5]"
              >
                {userInitial ? (
                  <span className="text-sm font-bold text-[#5B3DF5]">
                    {userInitial}
                  </span>
                ) : (
                  <User
                    size={20}
                    strokeWidth={1.7}
                  />
                )}
              </button>

              <div
                className={`absolute right-0 top-[calc(100%+12px)] w-[280px] rounded-3xl border border-black/[0.07] bg-white p-4 shadow-[0_25px_70px_rgba(0,0,0,0.15)] transition-all duration-300 ${
                  isAccountOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0"
                }`}
              >
                {!isHydrated || authLoading ? (
                  <p className="p-3 text-sm text-gray-500">
                    Checking account...
                  </p>
                ) : user ? (
                  <>
                    <div className="border-b border-[#EEE8E2] px-3 pb-4">
                      <p className="truncate font-semibold text-[#171717]">
                        {
                          userDisplayName
                        }
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {user.email ||
                          user.phoneNumber ||
                          "Verified member"}
                      </p>
                    </div>

                    <Link
                      href="/account"
                      onClick={() =>
                        setIsAccountOpen(
                          false
                        )
                      }
                      className="mt-3 block rounded-xl px-3 py-3 text-sm transition hover:bg-[#F3EDFF] hover:text-[#5B3DF5]"
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() =>
                        setIsAccountOpen(
                          false
                        )
                      }
                      className="block rounded-xl px-3 py-3 text-sm transition hover:bg-[#F3EDFF] hover:text-[#5B3DF5]"
                    >
                      My Orders
                    </Link>

                    <Link
                      href="/wishlist"
                      onClick={() =>
                        setIsAccountOpen(
                          false
                        )
                      }
                      className="block rounded-xl px-3 py-3 text-sm transition hover:bg-[#F3EDFF] hover:text-[#5B3DF5]"
                    >
                      Wishlist
                    </Link>

                    <Link
                      href="/account/subscription"
                      onClick={() =>
                        setIsAccountOpen(
                          false
                        )
                      }
                      className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm transition hover:bg-[#F3EDFF] hover:text-[#5B3DF5]"
                    >
                      <Gem size={15} />
                      Styloverse Privé
                    </Link>

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut
                        size={17}
                      />

                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() =>
                      setIsAccountOpen(
                        false
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#171717] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5B3DF5]"
                  >
                    Sign In

                    <ArrowRight
                      size={16}
                    />
                  </Link>
                )}

                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() =>
                      setIsAccountOpen(
                        false
                      )
                    }
                    className="mt-2 flex items-center gap-2 border-t border-[#EEE8E2] px-3 pt-4 text-xs font-semibold uppercase tracking-[0.13em] text-[#8A633A] transition hover:text-[#5B3DF5]"
                  >
                    <ShieldCheck
                      size={15}
                    />
                    Admin Office
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search overlay */}

      <div
        className={`fixed inset-0 z-[100] bg-[#FFF8F2]/96 backdrop-blur-2xl transition-all duration-500 ${
          isSearchOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() =>
            setIsSearchOpen(false)
          }
          aria-label="Close search"
          className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md sm:right-8 sm:top-8"
        >
          <X size={25} />
        </button>

        <div className="mx-auto mt-28 max-w-5xl px-6 sm:mt-32">
          <form
            onSubmit={handleSearch}
            className="flex items-center border-b border-black/15 pb-5"
          >
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="What are you looking for?"
              className="w-full bg-transparent text-3xl text-[#171717] outline-none placeholder:text-[#999] sm:text-5xl"
            />

            <button
              type="submit"
              aria-label="Submit search"
              className="flex h-12 w-12 items-center justify-center"
            >
              <ArrowRight size={28} />
            </button>
          </form>

          <div className="mt-12 grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#171717]">
                Trending Searches
              </h3>

              <div className="space-y-3">
                {SEARCH_SUGGESTIONS.map(
                  (
                    suggestion
                  ) => (
                    <button
                      key={
                        suggestion
                      }
                      type="button"
                      onClick={() =>
                        navigateFromSearch(
                          `/shop?search=${encodeURIComponent(
                            suggestion
                          )}`
                        )
                      }
                      className="block text-left text-lg text-gray-600 transition hover:text-[#5B3DF5] sm:text-xl"
                    >
                      {
                        suggestion
                      }
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#171717]">
                Categories
              </h3>

              <div className="flex flex-wrap gap-3">
                {SHOP_CATEGORY_LINKS.map(
                  (
                    category
                  ) => (
                    <button
                      key={
                        category.href
                      }
                      type="button"
                      onClick={() =>
                        navigateFromSearch(
                          category.href
                        )
                      }
                      className="rounded-full border border-[#D8D0C7] px-5 py-3 text-sm transition hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
                    >
                      {
                        category.name
                      }
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() =>
                    navigateFromSearch(
                      "/winter"
                    )
                  }
                  className="rounded-full border border-[#D8D0C7] px-5 py-3 text-sm transition hover:border-[#111827] hover:text-[#111827]"
                >
                  Winter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone navigation dock */}

      <nav
        className="fixed inset-x-3 bottom-[max(10px,env(safe-area-inset-bottom))] z-[105] grid h-[70px] grid-cols-5 items-center rounded-[25px] border border-white/15 bg-[#171517]/95 px-2 text-white shadow-[0_20px_60px_rgba(18,14,17,0.34)] backdrop-blur-2xl md:hidden"
        aria-label="Mobile primary navigation"
      >
        {[
          {
            label: "Home",
            href: "/",
            icon: Home,
          },
          {
            label: "Shop",
            href: "/shop",
            icon: Search,
          },
          {
            label: "Saved",
            href: "/wishlist",
            icon: Heart,
            count: wishlistCount,
          },
          {
            label: "Bag",
            href: "/cart",
            icon: ShoppingBag,
            count: cartCount,
          },
          {
            label: "Account",
            href: user ? "/account" : "/login",
            icon: User,
          },
        ].map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="relative flex h-full flex-col items-center justify-center gap-1.5"
            >
              <span
                className={`relative flex h-8 w-8 items-center justify-center rounded-xl transition ${
                  active
                    ? "bg-[#E5B979] text-[#17120E] shadow-[0_7px_20px_rgba(229,185,121,0.25)]"
                    : "text-white/68"
                }`}
              >
                <Icon size={16} strokeWidth={active ? 2 : 1.6} />

                {item.count && item.count > 0 ? (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6E50F4] px-1 text-[7px] font-bold text-white ring-2 ring-[#171517]">
                    {item.count > 99 ? "99+" : item.count}
                  </span>
                ) : null}
              </span>

              <span
                className={`text-[7px] font-semibold uppercase tracking-[0.11em] ${
                  active ? "text-[#E5B979]" : "text-white/42"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Phone luxury drawer */}

      <div
        className={`fixed inset-0 z-[150] md:hidden ${
          isMobileOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close navigation menu"
          className={`absolute inset-0 bg-[#100D10]/60 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute inset-y-0 left-0 w-[89%] max-w-[380px] overflow-y-auto rounded-r-[38px] border-r border-white/10 bg-[linear-gradient(155deg,#171517_0%,#201B22_54%,#2E2441_100%)] px-5 pb-8 pt-6 text-white shadow-[30px_0_80px_rgba(15,12,15,0.4)] transition-transform duration-500 ease-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="pointer-events-none absolute -right-28 top-20 h-72 w-72 rounded-full bg-[#785CFB]/20 blur-[90px]" />
          <div className="relative flex items-center justify-between border-b border-white/10 pb-5">
            <Link href="/" onClick={() => setIsMobileOpen(false)}>
              <p className="font-heading text-[24px] tracking-[0.13em]">
                STYLO<span className="text-[#A994FF]">V</span>ERSE
              </p>
              <p className="mt-1.5 text-[7px] font-semibold uppercase tracking-[0.38em] text-white/38">
                Private fashion house
              </p>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/7 text-white/75"
            >
              <X size={19} />
            </button>
          </div>

          <div className="relative mt-6 rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
            <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#DFAF70]">
              {user ? "Private member" : "Guest access"}
            </p>
            <p className="mt-2 font-heading text-[24px] leading-tight">
              {user ? userDisplayName : "Explore without limits."}
            </p>
            <p className="mt-2 text-[10px] leading-5 text-white/44">
              {user
                ? "Your saved edit, orders and personal account."
                : "Browse every collection. Sign in only when you are ready to purchase."}
            </p>
          </div>

          <nav className="relative mt-7" aria-label="Mobile menu">
            {mainLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="group flex items-center justify-between border-b border-white/[0.08] py-4"
              >
                <span className="flex items-baseline gap-3">
                  <span className="text-[8px] font-semibold text-[#B98A58]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-heading text-[22px] ${
                      isActive(link.href) ? "text-[#B9A9FF]" : "text-white/88"
                    }`}
                  >
                    {link.name}
                  </span>
                </span>
                <ArrowRight
                  size={15}
                  className="text-white/28 transition group-active:translate-x-1"
                />
              </Link>
            ))}
          </nav>

          <div className="relative mt-7 grid grid-cols-2 gap-2.5">
            <Link
              href="/wishlist"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3.5 text-[11px] font-semibold"
            >
              <span className="flex items-center gap-2">
                <Heart size={15} /> Saved
              </span>
              <span className="text-[#DDB177]">{wishlistCount}</span>
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3.5 text-[11px] font-semibold"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag size={15} /> Bag
              </span>
              <span className="text-[#DDB177]">{cartCount}</span>
            </Link>
          </div>

          {user ? (
            <div className="relative mt-3 space-y-2.5">
              <Link
                href="/account/subscription"
                onClick={() => setIsMobileOpen(false)}
                className="flex min-h-12 items-center justify-between rounded-[18px] border border-[#DDB177]/25 bg-[#DDB177]/10 px-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#F1D19E]"
              >
                <span className="flex items-center gap-2">
                  <Gem size={15} /> Styloverse Privé
                </span>
                <ArrowRight size={14} />
              </Link>
              <div className="grid grid-cols-[1fr_auto] gap-2.5">
                <Link
                  href="/account"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-[#F4EFEA] px-4 text-[11px] font-semibold text-[#171517]"
                >
                  <User size={15} /> My account
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Sign out"
                  className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-red-300/20 bg-red-400/10 text-red-200"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileOpen(false)}
              className="relative mt-3 flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(135deg,#E7BC7B,#C99555)] px-4 text-[11px] font-bold text-[#21170F]"
            >
              Sign in when ready <ArrowRight size={14} />
            </Link>
          )}

          {isAdmin ? (
            <Link
              href="/admin"
              onClick={() =>
                setIsMobileOpen(false)
              }
              className="relative mt-3 flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-[#DDB177]/25 bg-[#DDB177]/10 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F1D19E]"
            >
              <ShieldCheck size={15} />
              Admin Office
            </Link>
          ) : null}
        </aside>
      </div>

      {/* Tablet drawer (keeps the existing tablet interface) */}

      <div
        className={`fixed inset-0 z-[110] hidden md:block lg:hidden ${
          isMobileOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={() =>
            setIsMobileOpen(false)
          }
          aria-label="Close navigation menu"
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isMobileOpen
              ? "opacity-100"
              : "opacity-0"
          }`}
        />

        <aside
          className={`absolute left-0 top-0 h-full w-[88%] max-w-[420px] overflow-y-auto bg-[#FFF8F2] p-6 shadow-2xl transition-transform duration-300 ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Logo />

            <button
              type="button"
              onClick={() =>
                setIsMobileOpen(
                  false
                )
              }
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center"
            >
              <X />
            </button>
          </div>

          <nav className="mt-10 flex flex-col">
            {mainLinks.map(
              (link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() =>
                    setIsMobileOpen(
                      false
                    )
                  }
                  className={`border-b border-black/10 py-4 text-xl font-medium transition ${
                    isActive(
                      link.href
                    )
                      ? "text-[#5B3DF5]"
                      : "text-[#171717]"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>

          <div className="mt-8 space-y-5 border-t border-black/10 pt-7">
            <Link
              href="/wishlist"
              onClick={() =>
                setIsMobileOpen(false)
              }
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-3">
                <Heart size={19} />
                Wishlist
              </span>

              {wishlistCount > 0 && (
                <span className="rounded-full bg-[#5B3DF5] px-2.5 py-1 text-xs text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              onClick={() =>
                setIsMobileOpen(false)
              }
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag
                  size={19}
                />

                Cart
              </span>

              {cartCount > 0 && (
                <span className="rounded-full bg-[#5B3DF5] px-2.5 py-1 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href={
                user
                  ? "/account"
                  : "/login"
              }
              onClick={() =>
                setIsMobileOpen(false)
              }
              className="flex items-center gap-3"
            >
              <User size={19} />

              {user
                ? "Dashboard"
                : "Sign In"}
            </Link>

            {user && (
              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="flex items-center gap-3 text-red-600"
              >
                <LogOut size={19} />
                Sign Out
              </button>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
