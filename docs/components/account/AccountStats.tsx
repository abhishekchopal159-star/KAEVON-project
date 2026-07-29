"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ElementType,
} from "react";

import Link from "next/link";

import {
  ArrowUpRight,
  Heart,
  Package,
  ShoppingBag,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

/* ==========================================================================
   TYPES
========================================================================== */

type StorageRecord = Record<string, unknown>;

type DashboardData = {
  totalOrders: number;
  activeOrders: number;
  wishlistCount: number;
  cartCount: number;
  totalSpending: number;
};

type StatCard = {
  title: string;
  value: string;
  subtitle: string;
  progress: number;
  icon: ElementType;
  color: string;
  badge: string;
  href: string;
  status: string;
};

/* ==========================================================================
   STORAGE KEYS
========================================================================== */

const ORDERS_STORAGE_KEY = "styloverse-orders";
const WISHLIST_STORAGE_KEY = "styloverse-wishlist";
const CART_STORAGE_KEY = "styloverse-cart";

/* ==========================================================================
   HELPERS
========================================================================== */

function readStorageArray(
  storageKey: string
): unknown[] {
  try {
    const storedValue =
      window.localStorage.getItem(storageKey);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    return Array.isArray(parsedValue)
      ? parsedValue
      : [];
  } catch {
    return [];
  }
}

function toNumber(
  value: unknown,
  fallback = 0
): number {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(
      value.replace(/[^\d.-]/g, "")
    );

    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return fallback;
}

function getOrderStatus(
  order: StorageRecord
): string {
  return String(
    order.status ?? "Confirmed"
  );
}

function getOrderTotal(
  order: StorageRecord
): number {
  if (
    order.pricing &&
    typeof order.pricing === "object"
  ) {
    const pricing =
      order.pricing as StorageRecord;

    return toNumber(
      pricing.total,
      0
    );
  }

  return toNumber(
    order.total ??
      order.grandTotal ??
      order.amount,
    0
  );
}

function belongsToCurrentUser(
  order: StorageRecord,
  userId: string,
  userEmail: string
): boolean {
  const orderUserId = String(
    order.userId ?? ""
  );

  const customer =
    order.customer &&
    typeof order.customer === "object"
      ? (order.customer as StorageRecord)
      : null;

  const orderUserEmail = String(
    order.userEmail ??
      customer?.email ??
      ""
  )
    .trim()
    .toLowerCase();

  const matchesUserId =
    Boolean(
      userId &&
        orderUserId === userId
    );

  const matchesEmail =
    Boolean(
      userEmail &&
        orderUserEmail === userEmail
    );

  return (
    matchesUserId ||
    matchesEmail
  );
}

function getUniqueWishlistCount(): number {
  const wishlistItems =
    readStorageArray(
      WISHLIST_STORAGE_KEY
    );

  const uniqueProductIds =
    wishlistItems
      .map((item, index) => {
        if (
          typeof item === "string" ||
          typeof item === "number"
        ) {
          return String(item)
            .trim()
            .toLowerCase();
        }

        if (
          item &&
          typeof item === "object"
        ) {
          const product =
            item as StorageRecord;

          return String(
            product.id ??
              product.productId ??
              product.slug ??
              `wishlist-item-${index}`
          )
            .trim()
            .toLowerCase();
        }

        return "";
      })
      .filter(
        (productId): productId is string =>
          Boolean(productId)
      );

  return new Set(
    uniqueProductIds
  ).size;
}

function getCartQuantity(): number {
  const cartItems =
    readStorageArray(
      CART_STORAGE_KEY
    );

  return cartItems.reduce<number>(
    (total, item) => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return total;
      }

      const cartItem =
        item as StorageRecord;

      const quantity = Math.max(
        1,
        Math.floor(
          toNumber(
            cartItem.quantity,
            1
          )
        )
      );

      return total + quantity;
    },
    0
  );
}

function formatCurrency(
  value: number
): string {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

function calculateProgress(
  value: number,
  target: number
): number {
  if (
    value <= 0 ||
    target <= 0
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      5,
      Math.round(
        (value / target) * 100
      )
    )
  );
}

/* ==========================================================================
   COMPONENT
========================================================================== */

export default function AccountStats() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    dashboardData,
    setDashboardData,
  ] = useState<DashboardData>({
    totalOrders: 0,
    activeOrders: 0,
    wishlistCount: 0,
    cartCount: 0,
    totalSpending: 0,
  });

  const loadDashboardData =
    useCallback(() => {
      const currentUserId =
        user?.uid ?? "";

      const currentUserEmail =
        user?.email
          ?.trim()
          .toLowerCase() ?? "";

      const storedOrders =
        readStorageArray(
          ORDERS_STORAGE_KEY
        );

      const userOrders =
        storedOrders
          .filter(
            (
              order
            ): order is StorageRecord =>
              Boolean(
                order &&
                  typeof order ===
                    "object"
              )
          )
          .filter((order) =>
            belongsToCurrentUser(
              order,
              currentUserId,
              currentUserEmail
            )
          );

      const nonCancelledOrders =
        userOrders.filter(
          (order) =>
            getOrderStatus(order) !==
            "Cancelled"
        );

      const activeOrders =
        userOrders.filter((order) =>
          [
            "Confirmed",
            "Processing",
            "Shipped",
          ].includes(
            getOrderStatus(order)
          )
        ).length;

      const totalSpending =
        nonCancelledOrders.reduce<number>(
          (total, order) => {
            return (
              total +
              getOrderTotal(order)
            );
          },
          0
        );

      const wishlistCount =
        getUniqueWishlistCount();

      const cartCount =
        getCartQuantity();

      setDashboardData({
        totalOrders:
          userOrders.length,
        activeOrders,
        wishlistCount,
        cartCount,
        totalSpending,
      });
    }, [
      user?.email,
      user?.uid,
    ]);

  /* ==========================================================================
     INITIAL LOAD AND LIVE UPDATES
  ========================================================================== */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const initialLoadTimer =
      window.setTimeout(
        loadDashboardData,
        0
      );

    const handleDataUpdate = () => {
      loadDashboardData();
    };

    const handleStorageChange = (
      event: StorageEvent
    ) => {
      if (
        !event.key ||
        event.key ===
          ORDERS_STORAGE_KEY ||
        event.key ===
          WISHLIST_STORAGE_KEY ||
        event.key ===
          CART_STORAGE_KEY
      ) {
        loadDashboardData();
      }
    };

    const handleWindowFocus = () => {
      loadDashboardData();
    };

    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          loadDashboardData();
        }
      };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      "styloverse-orders-updated",
      handleDataUpdate
    );

    window.addEventListener(
      "styloverse-wishlist-updated",
      handleDataUpdate
    );

    window.addEventListener(
      "styloverse-cart-updated",
      handleDataUpdate
    );

    window.addEventListener(
      "focus",
      handleWindowFocus
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.clearTimeout(
        initialLoadTimer
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "styloverse-orders-updated",
        handleDataUpdate
      );

      window.removeEventListener(
        "styloverse-wishlist-updated",
        handleDataUpdate
      );

      window.removeEventListener(
        "styloverse-cart-updated",
        handleDataUpdate
      );

      window.removeEventListener(
        "focus",
        handleWindowFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [
    authLoading,
    loadDashboardData,
  ]);

  /* ==========================================================================
     DYNAMIC STAT CARDS
  ========================================================================== */

  const stats =
    useMemo<StatCard[]>(
      () => [
        {
          title: "Orders Placed",

          value: String(
            dashboardData.totalOrders
          ),

          subtitle:
            dashboardData.activeOrders >
            0
              ? `${dashboardData.activeOrders} active ${
                  dashboardData.activeOrders ===
                  1
                    ? "order"
                    : "orders"
                }`
              : "No active orders",

          progress:
            calculateProgress(
              dashboardData.totalOrders,
              10
            ),

          icon: Package,

          color:
            "from-[#5B3DF5] via-[#7B61FF] to-[#9D88FF]",

          badge:
            dashboardData.activeOrders >
            0
              ? `${dashboardData.activeOrders} Active`
              : "Up to date",

          href: "/account/orders",

          status:
            dashboardData.totalOrders >
            0
              ? "Order history available"
              : "Start shopping",
        },

        {
          title: "Wishlist",

          value: String(
            dashboardData.wishlistCount
          ),

          subtitle:
            dashboardData.wishlistCount ===
            1
              ? "Saved product"
              : "Saved products",

          progress:
            calculateProgress(
              dashboardData.wishlistCount,
              10
            ),

          icon: Heart,

          color:
            "from-[#FF4D6D] via-[#FF758F] to-[#FF9FB2]",

          badge:
            dashboardData.wishlistCount >
            0
              ? `${dashboardData.wishlistCount} Liked`
              : "Empty",

          href: "/account/wishlist",

          status:
            dashboardData.wishlistCount >
            0
              ? "Private collection ready"
              : "Discover favourites",
        },

        {
          title: "Cart Items",

          value: String(
            dashboardData.cartCount
          ),

          subtitle:
            dashboardData.cartCount === 1
              ? "Item in shopping bag"
              : "Items in shopping bag",

          progress:
            calculateProgress(
              dashboardData.cartCount,
              10
            ),

          icon: ShoppingBag,

          color:
            "from-[#F7B801] via-[#F6AA1C] to-[#FFD166]",

          badge:
            dashboardData.cartCount > 0
              ? "Ready"
              : "Empty",

          href: "/cart",

          status:
            dashboardData.cartCount > 0
              ? "Ready for checkout"
              : "Add new products",
        },

        {
          title: "Total Spending",

          value: formatCurrency(
            dashboardData.totalSpending
          ),

          subtitle:
            dashboardData.totalOrders > 0
              ? "Across valid orders"
              : "No purchases yet",

          progress:
            calculateProgress(
              dashboardData.totalSpending,
              50000
            ),

          icon: WalletCards,

          color:
            "from-[#06D6A0] via-[#1B9AAA] to-[#34D399]",

          badge:
            dashboardData.totalSpending >
            0
              ? "Member"
              : "New",

          href: "/account/orders",

          status:
            dashboardData.totalSpending >
            0
              ? "Purchase summary"
              : "Begin your journey",
        },
      ],
      [dashboardData]
    );

  return (
    <section className="mobile-hide-scrollbar flex snap-x gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-2 md:gap-7 md:overflow-visible md:pb-0 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.title}
            className="group relative w-[76vw] max-w-[285px] shrink-0 snap-start overflow-hidden rounded-[26px] border border-black/5 bg-white p-5 shadow-[0_14px_36px_rgba(0,0,0,0.065)] transition-all duration-500 md:w-auto md:max-w-none md:rounded-[34px] md:p-7 md:shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:hover:-translate-y-3 md:hover:shadow-[0_28px_70px_rgba(0,0,0,0.10)]"
          >
            <div
              className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${item.color} opacity-10 blur-3xl transition-all duration-500 group-hover:scale-125`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-gradient-to-br ${item.color} text-white shadow-xl transition-transform duration-500 md:h-16 md:w-16 md:rounded-3xl md:group-hover:rotate-6 md:group-hover:scale-110`}
                >
                  <Icon
                    size={23}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="flex max-w-[112px] items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1.5 text-[9px] font-semibold text-green-700 md:max-w-[120px] md:gap-2 md:px-3.5 md:py-2 md:text-xs">
                  <TrendingUp
                    size={13}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {item.badge}
                  </span>
                </div>
              </div>

              <div className="mt-5 md:mt-8">
                <h2
                  className={`font-bold tracking-tight text-[#171717] ${
                    item.title ===
                    "Total Spending"
                      ? "text-[27px] md:text-3xl"
                      : "text-[38px] md:text-5xl"
                  }`}
                >
                  {item.value}
                </h2>

                <p className="mt-2 text-sm font-semibold text-[#171717] md:mt-3 md:text-lg">
                  {item.title}
                </p>

                <p className="mt-1 min-h-4 text-[10px] text-gray-500 md:min-h-5 md:text-sm">
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-5 md:mt-8">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="text-[10px] font-medium text-gray-500 md:text-sm">
                    Account activity
                  </span>

                  <span className="text-[10px] font-semibold text-[#171717] md:text-sm">
                    {item.progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#F1F1F1] md:h-3">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                    style={{
                      width: `${item.progress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#F3F3F3] pt-4 md:mt-8 md:gap-4 md:pt-6">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
                    Status
                  </p>

                  <p className="mt-1.5 line-clamp-1 text-[10px] font-semibold text-[#171717] md:mt-2 md:text-sm">
                    {item.status}
                  </p>
                </div>

                <Link
                  href={item.href}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#171717] px-3.5 py-2 text-[10px] font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#5B3DF5] md:gap-2 md:px-5 md:py-3 md:text-sm"
                >
                  View

                  <ArrowUpRight
                    size={16}
                  />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
