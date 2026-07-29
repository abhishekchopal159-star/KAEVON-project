"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ElementType,
} from "react";

import Link from "next/link";

import {
  ChevronRight,
  CircleCheck,
  Clock3,
  Heart,
  Loader2,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Truck,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

/* ==========================================================================
   TYPES
========================================================================== */

type StorageRecord = Record<string, unknown>;

type ActivityType =
  | "order"
  | "cart"
  | "wishlist";

type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  timestamp: number;
  icon: ElementType;
  iconColor: string;
  badgeClass: string;
  statusLabel: string;
  statusDot: string;
  href: string;
};

type OrderStatus =
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type NormalizedOrderItem = {
  id: string;
  name: string;
  image: string;
  quantity: number;
};

type NormalizedOrder = {
  id: string;
  userId: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  items: NormalizedOrderItem[];
  total: number;
};

type NormalizedProduct = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  createdAt: string;
};

/* ==========================================================================
   CONSTANTS
========================================================================== */

const ORDERS_STORAGE_KEY =
  "styloverse-orders";

const WISHLIST_STORAGE_KEY =
  "styloverse-wishlist";

const CART_STORAGE_KEY =
  "styloverse-cart";

const MAX_ACTIVITIES = 3;

/* ==========================================================================
   BASIC HELPERS
========================================================================== */

function readStorageArray(
  storageKey: string
): unknown[] {
  try {
    const savedValue =
      window.localStorage.getItem(storageKey);

    if (!savedValue) {
      return [];
    }

    const parsedValue: unknown =
      JSON.parse(savedValue);

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
) {
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

function getProductImage(
  product: StorageRecord
) {
  if (
    typeof product.image === "string"
  ) {
    return product.image;
  }

  if (
    typeof product.imageUrl === "string"
  ) {
    return product.imageUrl;
  }

  if (
    typeof product.thumbnail === "string"
  ) {
    return product.thumbnail;
  }

  if (
    typeof product.coverImage === "string"
  ) {
    return product.coverImage;
  }

  if (
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    const firstImage =
      product.images[0];

    if (
      typeof firstImage === "string"
    ) {
      return firstImage;
    }

    if (
      firstImage &&
      typeof firstImage === "object"
    ) {
      const imageObject =
        firstImage as StorageRecord;

      if (
        typeof imageObject.url ===
        "string"
      ) {
        return imageObject.url;
      }

      if (
        typeof imageObject.src ===
        "string"
      ) {
        return imageObject.src;
      }

      if (
        typeof imageObject.image ===
        "string"
      ) {
        return imageObject.image;
      }
    }
  }

  return "";
}

function getTimestamp(
  value: string
) {
  const timestamp =
    new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function formatCurrency(
  amount: number
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(amount);
}

/* ==========================================================================
   RELATIVE TIME
========================================================================== */

function formatRelativeTime(
  value: string,
  fallback = "Recently"
) {
  const timestamp =
    getTimestamp(value);

  if (!timestamp) {
    return fallback;
  }

  const difference =
    Date.now() - timestamp;

  if (difference < 0) {
    return "Recently";
  }

  const minute =
    60 * 1000;

  const hour =
    60 * minute;

  const day =
    24 * hour;

  const week =
    7 * day;

  if (difference < minute) {
    return "Just now";
  }

  if (difference < hour) {
    const minutes =
      Math.floor(
        difference / minute
      );

    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  if (difference < day) {
    const hours =
      Math.floor(
        difference / hour
      );

    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  if (difference < 2 * day) {
    return "Yesterday";
  }

  if (difference < week) {
    const days =
      Math.floor(
        difference / day
      );

    return `${days} days ago`;
  }

  if (difference < 4 * week) {
    const weeks =
      Math.floor(
        difference / week
      );

    return `${weeks} ${
      weeks === 1
        ? "week"
        : "weeks"
    } ago`;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(timestamp));
}

/* ==========================================================================
   ORDER NORMALIZATION
========================================================================== */

function normalizeOrderStatus(
  value: unknown
): OrderStatus {
  const status = String(value);

  if (
    status === "Processing" ||
    status === "Shipped" ||
    status === "Delivered" ||
    status === "Cancelled"
  ) {
    return status;
  }

  return "Confirmed";
}

function normalizeOrderItem(
  rawItem: unknown,
  index: number
): NormalizedOrderItem | null {
  if (
    !rawItem ||
    typeof rawItem !== "object"
  ) {
    return null;
  }

  const item =
    rawItem as StorageRecord;

  return {
    id: String(
      item.id ??
        item.productId ??
        item.slug ??
        `order-product-${index}`
    ),

    name: String(
      item.name ??
        item.title ??
        item.productName ??
        "Styloverse Product"
    ),

    image: getProductImage(item),

    quantity: Math.max(
      1,
      Math.floor(
        toNumber(
          item.quantity,
          1
        )
      )
    ),
  };
}

function normalizeOrder(
  rawOrder: unknown,
  index: number
): NormalizedOrder | null {
  if (
    !rawOrder ||
    typeof rawOrder !== "object"
  ) {
    return null;
  }

  const order =
    rawOrder as StorageRecord;

  const customer =
    order.customer &&
    typeof order.customer === "object"
      ? (order.customer as StorageRecord)
      : {};

  const pricing =
    order.pricing &&
    typeof order.pricing === "object"
      ? (order.pricing as StorageRecord)
      : {};

  const items = Array.isArray(
    order.items
  )
    ? order.items
        .map(normalizeOrderItem)
        .filter(
          (
            item
          ): item is NormalizedOrderItem =>
            item !== null
        )
    : [];

  const calculatedSubtotal =
    items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  return {
    id: String(
      order.id ??
        `SV-${Date.now()}-${index}`
    ),

    userId: String(
      order.userId ?? ""
    ),

    userEmail: String(
      order.userEmail ??
        customer.email ??
        ""
    ),

    createdAt: String(
      order.createdAt ??
        new Date().toISOString()
    ),

    updatedAt: String(
      order.updatedAt ??
        order.statusUpdatedAt ??
        order.createdAt ??
        new Date().toISOString()
    ),

    status: normalizeOrderStatus(
      order.status
    ),

    items,

    total: toNumber(
      pricing.total ??
        order.total ??
        order.grandTotal,
      calculatedSubtotal
    ),
  };
}

function orderBelongsToUser(
  order: NormalizedOrder,
  userId: string,
  userEmail: string
) {
  const orderUserId =
    order.userId.trim();

  const orderUserEmail =
    order.userEmail
      .trim()
      .toLowerCase();

  const matchesUserId =
    Boolean(
      userId &&
        orderUserId === userId
    );

  const matchesUserEmail =
    Boolean(
      userEmail &&
        orderUserEmail === userEmail
    );

  return (
    matchesUserId ||
    matchesUserEmail
  );
}

function getOrderProductText(
  order: NormalizedOrder
) {
  const firstProduct =
    order.items[0];

  if (!firstProduct) {
    return "Styloverse order";
  }

  if (order.items.length === 1) {
    return firstProduct.name;
  }

  return `${firstProduct.name} + ${
    order.items.length - 1
  } more`;
}

function getOrderItemCount(
  order: NormalizedOrder
) {
  return order.items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );
}

/* ==========================================================================
   PRODUCT NORMALIZATION
========================================================================== */

function normalizeProduct(
  rawProduct: unknown,
  index: number
): NormalizedProduct | null {
  if (
    typeof rawProduct === "string" ||
    typeof rawProduct === "number"
  ) {
    return {
      id: String(rawProduct),
      name: "Saved Styloverse Product",
      image: "",
      quantity: 1,
      createdAt: "",
    };
  }

  if (
    !rawProduct ||
    typeof rawProduct !== "object"
  ) {
    return null;
  }

  const product =
    rawProduct as StorageRecord;

  return {
    id: String(
      product.id ??
        product.productId ??
        product.slug ??
        `saved-product-${index}`
    ),

    name: String(
      product.name ??
        product.title ??
        product.productName ??
        "Styloverse Product"
    ),

    image: getProductImage(product),

    quantity: Math.max(
      1,
      Math.floor(
        toNumber(
          product.quantity,
          1
        )
      )
    ),

    createdAt: String(
      product.addedAt ??
        product.savedAt ??
        product.updatedAt ??
        product.createdAt ??
        ""
    ),
  };
}

function removeDuplicateProducts(
  products: NormalizedProduct[]
) {
  const uniqueProducts =
    new Map<string, NormalizedProduct>();

  products.forEach((product) => {
    const productKey =
      product.id
        .trim()
        .toLowerCase();

    if (!productKey) {
      return;
    }

    uniqueProducts.set(
      productKey,
      product
    );
  });

  return Array.from(
    uniqueProducts.values()
  );
}

/* ==========================================================================
   ACTIVITY GENERATORS
========================================================================== */

function createOrderActivity(
  order: NormalizedOrder
): ActivityItem {
  const productText =
    getOrderProductText(order);

  const itemCount =
    getOrderItemCount(order);

  const activityDate =
    order.updatedAt ||
    order.createdAt;

  switch (order.status) {
    case "Processing":
      return {
        id: `order-processing-${order.id}`,
        type: "order",
        title: `${productText} is being prepared`,
        description: `Order #${order.id} with ${itemCount} ${
          itemCount === 1
            ? "item"
            : "items"
        } is currently processing.`,
        time: formatRelativeTime(
          activityDate
        ),
        timestamp:
          getTimestamp(activityDate),
        icon: Clock3,
        iconColor: "bg-[#F7B801]",
        badgeClass:
          "bg-amber-50 text-amber-700",
        statusLabel:
          "Order Processing",
        statusDot: "bg-amber-500",
        href: "/account/orders",
      };

    case "Shipped":
      return {
        id: `order-shipped-${order.id}`,
        type: "order",
        title: `${productText} has been shipped`,
        description: `Order #${order.id} is on the way to your delivery address.`,
        time: formatRelativeTime(
          activityDate
        ),
        timestamp:
          getTimestamp(activityDate),
        icon: Truck,
        iconColor: "bg-[#2196F3]",
        badgeClass:
          "bg-blue-50 text-blue-700",
        statusLabel: "Order Shipped",
        statusDot: "bg-blue-500",
        href: "/account/orders",
      };

    case "Delivered":
      return {
        id: `order-delivered-${order.id}`,
        type: "order",
        title: `${productText} was delivered`,
        description: `Order #${order.id} was delivered successfully.`,
        time: formatRelativeTime(
          activityDate
        ),
        timestamp:
          getTimestamp(activityDate),
        icon: CircleCheck,
        iconColor: "bg-[#06D6A0]",
        badgeClass:
          "bg-green-50 text-green-700",
        statusLabel:
          "Delivery Completed",
        statusDot: "bg-green-500",
        href: "/account/orders",
      };

    case "Cancelled":
      return {
        id: `order-cancelled-${order.id}`,
        type: "order",
        title: `Order #${order.id} was cancelled`,
        description: `${productText} is no longer being processed.`,
        time: formatRelativeTime(
          activityDate
        ),
        timestamp:
          getTimestamp(activityDate),
        icon: XCircle,
        iconColor: "bg-[#E5484D]",
        badgeClass:
          "bg-red-50 text-red-700",
        statusLabel:
          "Order Cancelled",
        statusDot: "bg-red-500",
        href: "/account/orders",
      };

    default:
      return {
        id: `order-confirmed-${order.id}`,
        type: "order",
        title: `Purchased ${productText}`,
        description: `Order #${order.id} was placed successfully for ${formatCurrency(
          order.total
        )}.`,
        time: formatRelativeTime(
          order.createdAt
        ),
        timestamp:
          getTimestamp(
            order.createdAt
          ),
        icon: ShoppingBag,
        iconColor: "bg-[#5B3DF5]",
        badgeClass:
          "bg-[#EEE9FF] text-[#5B3DF5]",
        statusLabel:
          "Order Confirmed",
        statusDot: "bg-[#5B3DF5]",
        href: "/account/orders",
      };
  }
}

function createCartActivity(
  products: NormalizedProduct[]
): ActivityItem | null {
  if (products.length === 0) {
    return null;
  }

  const quantity =
    products.reduce(
      (total, product) =>
        total + product.quantity,
      0
    );

  const firstProduct =
    products[0];

  const latestDate =
    products
      .map((product) =>
        getTimestamp(
          product.createdAt
        )
      )
      .sort(
        (first, second) =>
          second - first
      )[0] || 0;

  const productTitle =
    products.length === 1
      ? firstProduct.name
      : `${firstProduct.name} + ${
          products.length - 1
        } more`;

  return {
    id: "current-cart-activity",
    type: "cart",
    title: `${productTitle} in your shopping bag`,
    description: `${quantity} ${
      quantity === 1
        ? "item is"
        : "items are"
    } ready for checkout.`,
    time: latestDate
      ? formatRelativeTime(
          new Date(
            latestDate
          ).toISOString()
        )
      : "Current",
    timestamp:
      latestDate ||
      Date.now() - 1000,
    icon: ShoppingBag,
    iconColor: "bg-[#A67C52]",
    badgeClass:
      "bg-[#FFF1E6] text-[#A76532]",
    statusLabel:
      "Ready for Checkout",
    statusDot: "bg-[#A67C52]",
    href: "/cart",
  };
}

function createWishlistActivities(
  products: NormalizedProduct[]
): ActivityItem[] {
  return products
    .slice(0, 2)
    .map(
      (product, index) => {
        const timestamp =
          getTimestamp(
            product.createdAt
          );

        return {
          id: `wishlist-${product.id}`,
          type:
            "wishlist" as const,
          title: `${product.name} saved to wishlist`,
          description:
            "This product is saved in your private Styloverse collection.",
          time: timestamp
            ? formatRelativeTime(
                product.createdAt
              )
            : "Recently",
          timestamp:
            timestamp ||
            Date.now() -
              2000 -
              index,
          icon: Heart,
          iconColor:
            "bg-[#FF4D6D]",
          badgeClass:
            "bg-pink-50 text-pink-700",
          statusLabel:
            "Saved Product",
          statusDot:
            "bg-[#FF4D6D]",
          href: "/account/wishlist",
        };
      }
    );
}

/* ==========================================================================
   COMPONENT
========================================================================== */

export default function ActivityFeed() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    activities,
    setActivities,
  ] = useState<ActivityItem[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  /* ==========================================================================
     LOAD ACTIVITIES
  ========================================================================== */

  const loadActivities =
    useCallback(() => {
      const currentUserId =
        user?.uid ?? "";

      const currentUserEmail =
        user?.email
          ?.trim()
          .toLowerCase() ?? "";

      /* Orders */

      const orders =
        readStorageArray(
          ORDERS_STORAGE_KEY
        )
          .map(normalizeOrder)
          .filter(
            (
              order
            ): order is NormalizedOrder =>
              order !== null
          )
          .filter((order) =>
            orderBelongsToUser(
              order,
              currentUserId,
              currentUserEmail
            )
          );

      const orderActivities =
        orders.map(
          createOrderActivity
        );

      /* Cart */

      const cartProducts =
        readStorageArray(
          CART_STORAGE_KEY
        )
          .map(normalizeProduct)
          .filter(
            (
              product
            ): product is NormalizedProduct =>
              product !== null
          );

      const cartActivity =
        createCartActivity(
          cartProducts
        );

      /* Wishlist */

      const wishlistProducts =
        removeDuplicateProducts(
          readStorageArray(
            WISHLIST_STORAGE_KEY
          )
            .map(
              normalizeProduct
            )
            .filter(
              (
                product
              ): product is NormalizedProduct =>
                product !== null
            )
        );

      const wishlistActivities =
        createWishlistActivities(
          wishlistProducts
        );

      const combinedActivities = [
        ...orderActivities,
        ...(cartActivity
          ? [cartActivity]
          : []),
        ...wishlistActivities,
      ]
        .sort(
          (
            firstActivity,
            secondActivity
          ) =>
            secondActivity.timestamp -
            firstActivity.timestamp
        )
        .slice(
          0,
          MAX_ACTIVITIES
        );

      setActivities(
        combinedActivities
      );

      setIsLoading(false);
    }, [user?.email, user?.uid]);

  /* ==========================================================================
     INITIAL LOAD AND LIVE EVENTS
  ========================================================================== */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const initialLoadTimer =
      window.setTimeout(
        loadActivities,
        0
      );

    const handleActivityUpdate =
      () => {
        loadActivities();
      };

    const handleStorageChange =
      (event: StorageEvent) => {
        if (
          !event.key ||
          event.key ===
            ORDERS_STORAGE_KEY ||
          event.key ===
            WISHLIST_STORAGE_KEY ||
          event.key ===
            CART_STORAGE_KEY
        ) {
          loadActivities();
        }
      };

    const handleWindowFocus =
      () => {
        loadActivities();
      };

    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          loadActivities();
        }
      };

    window.addEventListener(
      "styloverse-orders-updated",
      handleActivityUpdate
    );

    window.addEventListener(
      "styloverse-wishlist-updated",
      handleActivityUpdate
    );

    window.addEventListener(
      "styloverse-cart-updated",
      handleActivityUpdate
    );

    window.addEventListener(
      "storage",
      handleStorageChange
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
        "styloverse-orders-updated",
        handleActivityUpdate
      );

      window.removeEventListener(
        "styloverse-wishlist-updated",
        handleActivityUpdate
      );

      window.removeEventListener(
        "styloverse-cart-updated",
        handleActivityUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
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
    loadActivities,
  ]);

  /* ==========================================================================
     MANUAL REFRESH
  ========================================================================== */

  const handleRefresh = () => {
    setIsRefreshing(true);

    loadActivities();

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  /* ==========================================================================
     LOADING UI
  ========================================================================== */

  if (
    isLoading ||
    authLoading
  ) {
    return (
      <section className="mt-7 md:mt-10">
        <div className="flex min-h-[180px] items-center justify-center rounded-[24px] border border-black/5 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={26}
              className="animate-spin text-[#5B3DF5]"
            />

            <p className="text-sm font-medium text-gray-500">
              Loading recent activity...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-7 md:mt-10">
      {/* ====================================================================
          HEADER
      ==================================================================== */}

      <div className="mb-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#A67C52]">
            Recent Activity
            </p>

            <h2 className="font-heading text-[28px] leading-none text-[#171717] md:text-3xl">
              Timeline
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {activities.length > 0 && (
              <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#F0ECFF] px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5B3DF5]">
                <Sparkles size={12} />
                Latest {activities.length}
              </span>
            )}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh recent activity"
              title="Refresh recent activity"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#171717] shadow-sm transition hover:border-[#5B3DF5] hover:bg-[#5B3DF5] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={
                  isRefreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>

        <p className="mt-2 text-xs leading-5 text-gray-500">
          Your three latest product updates.
        </p>
      </div>

      {/* ====================================================================
          EMPTY STATE
      ==================================================================== */}

      {activities.length === 0 ? (
        <div className="rounded-[24px] border border-black/5 bg-white px-6 py-8 text-center shadow-[0_12px_34px_rgba(0,0,0,0.055)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE9FF] text-[#5B3DF5]">
              <Clock3
                size={26}
                strokeWidth={1.5}
              />
            </div>

            <h3 className="mt-5 font-heading text-2xl text-[#171717]">
              No recent activity
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Add a product to your bag or wishlist and its update will appear here.
            </p>

            <Link
              href="/shop"
              className="group mt-5 inline-flex items-center gap-2 rounded-full bg-[#171717] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5B3DF5]"
            >
              Explore Products
              <ChevronRight size={14} />
            </Link>
        </div>
      ) : (
        /* ==================================================================
           ACTIVITY LIST
        ================================================================== */

        <div className="space-y-3">
          {activities.map(
            (activity) => {
              const Icon =
                activity.icon;

              return (
                <article
                  key={activity.id}
                  className="group relative overflow-hidden rounded-[20px] border border-black/5 bg-white p-3.5 shadow-[0_8px_26px_rgba(20,17,35,0.055)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5B3DF5]/15 hover:shadow-[0_14px_34px_rgba(20,17,35,0.1)] md:rounded-[22px] md:p-4"
                >
                  <div className="relative flex items-start gap-3.5">
                    {/* Icon */}

                    <div
                      className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] text-white shadow-md transition-transform duration-300 group-hover:scale-105 ${activity.iconColor}`}
                    >
                      <Icon
                        size={19}
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                      <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] ${activity.badgeClass}`}
                            >
                              {activity.type}
                            </span>

                            <span className="text-[10px] font-medium text-gray-400">
                              {activity.time}
                            </span>
                          </div>

                          <h3 className="mt-2 line-clamp-2 text-[17px] font-semibold leading-6 text-[#171717] transition-colors duration-300 group-hover:text-[#5B3DF5]">
                            {activity.title}
                          </h3>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                            {activity.description}
                          </p>
                      </div>

                      {/* Bottom */}

                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#F2F2F2] pt-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${activity.statusDot}`}
                          />

                          <p className="truncate text-[11px] font-medium text-[#171717]">
                            {activity.statusLabel}
                          </p>
                        </div>

                        <Link
                          href={activity.href}
                          className="flex shrink-0 items-center gap-1 rounded-full bg-[#171717] px-3 py-2 text-[10px] font-semibold text-white transition-colors duration-300 hover:bg-[#5B3DF5]"
                        >
                          Details

                          <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}
