"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ElementType,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Clock3,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
  XCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { cancelCloudOrder, cancelCloudOrderItem } from "@/services/order.service";

/* ==========================================================================
   TYPES
========================================================================== */

type ProductRecord = Record<string, unknown>;

type OrderStatus =
  | "Confirmed"
  | "Partially Cancelled"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded";

type OrderItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  size: string;
  color: string;
  cancellationStatus?: "cancelled";
};

type SavedOrder = {
  id: string;
  userId: string;
  userEmail: string;
  createdAt: string;
  estimatedDelivery: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  pricing: {
    subtotal: number;
    savings: number;
    deliveryCharge: number;
    total: number;
  };
};

type OrderFilter =
  | "All"
  | "Active"
  | "Delivered"
  | "Cancelled";

type FeedbackMessage = {
  type: "success" | "info" | "error";
  message: string;
};

/* ==========================================================================
   CONSTANTS
========================================================================== */

const ORDERS_STORAGE_KEY =
  "styloverse-orders";

const ORDER_FILTERS: OrderFilter[] = [
  "All",
  "Active",
  "Delivered",
  "Cancelled",
];

/* ==========================================================================
   HELPERS
========================================================================== */

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

function toText(
  value: unknown,
  fallback = ""
) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const objectValue =
      value as ProductRecord;

    if (
      typeof objectValue.name ===
      "string"
    ) {
      return objectValue.name;
    }

    if (
      typeof objectValue.label ===
      "string"
    ) {
      return objectValue.label;
    }

    if (
      typeof objectValue.value ===
      "string"
    ) {
      return objectValue.value;
    }
  }

  return fallback;
}

function getProductImage(
  product: ProductRecord
) {
  if (
    typeof product.image === "string"
  ) {
    return product.image;
  }

  if (
    typeof product.imageUrl ===
    "string"
  ) {
    return product.imageUrl;
  }

  if (
    typeof product.thumbnail ===
    "string"
  ) {
    return product.thumbnail;
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
        firstImage as ProductRecord;

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
    }
  }

  return "";
}

function normalizeOrderItem(
  rawItem: unknown,
  index: number
): OrderItem | null {
  if (
    !rawItem ||
    typeof rawItem !== "object"
  ) {
    return null;
  }

  const item =
    rawItem as ProductRecord;

  const price = toNumber(
    item.price ??
      item.salePrice ??
      item.discountedPrice
  );

  return {
    id: String(
      item.id ??
        item.productId ??
        item.slug ??
        `order-item-${index}`
    ),

    name: String(
      item.name ??
        item.title ??
        item.productName ??
        "Styloverse Product"
    ),

    image: getProductImage(item),

    price,

    originalPrice:
      toNumber(
        item.originalPrice ??
          item.oldPrice ??
          item.mrp,
        price
      ) || price,

    quantity: Math.max(
      1,
      Math.floor(
        toNumber(item.quantity, 1)
      )
    ),

    size: toText(
      item.size ??
        item.selectedSize
    ),

    color: toText(
      item.color ??
        item.selectedColor
    ),
    cancellationStatus: item.cancellationStatus === "cancelled" ? "cancelled" : undefined,
  };
}

function normalizeStatus(
  value: unknown
): OrderStatus {
  const status = String(value);

  if (
    status === "Processing" ||
    status === "Partially Cancelled" ||
    status === "Shipped" ||
    status === "Delivered" ||
    status === "Cancelled"
  ) {
    return status;
  }

  return "Confirmed";
}

function normalizePaymentStatus(
  value: unknown
): PaymentStatus {
  const status = String(value);

  if (
    status === "Paid" ||
    status === "Failed" ||
    status === "Refunded"
  ) {
    return status;
  }

  return "Pending";
}

function normalizeOrder(
  rawOrder: unknown,
  index: number
): SavedOrder | null {
  if (
    !rawOrder ||
    typeof rawOrder !== "object"
  ) {
    return null;
  }

  const order =
    rawOrder as ProductRecord;

  const customer =
    order.customer &&
    typeof order.customer === "object"
      ? (order.customer as ProductRecord)
      : {};

  const address =
    order.shippingAddress &&
    typeof order.shippingAddress ===
      "object"
      ? (order.shippingAddress as ProductRecord)
      : {};

  const pricing =
    order.pricing &&
    typeof order.pricing === "object"
      ? (order.pricing as ProductRecord)
      : {};

  const items = Array.isArray(
    order.items
  )
    ? order.items
        .map(normalizeOrderItem)
        .filter(
          (
            item
          ): item is OrderItem =>
            item !== null
        )
    : [];

  const calculatedSubtotal =
    items.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );

  const subtotal = toNumber(
    pricing.subtotal,
    calculatedSubtotal
  );

  const deliveryCharge =
    toNumber(
      pricing.deliveryCharge,
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

    estimatedDelivery: String(
      order.estimatedDelivery ??
        ""
    ),

    status: normalizeStatus(
      order.status
    ),

    paymentMethod: String(
      order.paymentMethod ??
        "Cash on Delivery"
    ),

    paymentStatus:
      normalizePaymentStatus(
        order.paymentStatus
      ),

    items,

    customer: {
      fullName: String(
        customer.fullName ??
          "Styloverse Member"
      ),

      email: String(
        customer.email ??
          order.userEmail ??
          ""
      ),

      phone: String(
        customer.phone ?? ""
      ),
    },

    shippingAddress: {
      addressLine1: String(
        address.addressLine1 ?? ""
      ),

      addressLine2: String(
        address.addressLine2 ?? ""
      ),

      landmark: String(
        address.landmark ?? ""
      ),

      city: String(
        address.city ?? ""
      ),

      state: String(
        address.state ?? ""
      ),

      pincode: String(
        address.pincode ?? ""
      ),

      country: String(
        address.country ?? "India"
      ),
    },

    pricing: {
      subtotal,

      savings: toNumber(
        pricing.savings,
        0
      ),

      deliveryCharge,

      total: toNumber(
        pricing.total,
        subtotal + deliveryCharge
      ),
    },
  };
}

function readStoredOrders() {
  try {
    const savedOrders =
      window.localStorage.getItem(
        ORDERS_STORAGE_KEY
      );

    if (!savedOrders) {
      return [];
    }

    const parsedOrders: unknown =
      JSON.parse(savedOrders);

    if (!Array.isArray(parsedOrders)) {
      return [];
    }

    return parsedOrders;
  } catch {
    return [];
  }
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

function formatDate(
  value: string
) {
  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function formatDateTime(
  value: string
) {
  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function getOrderItemCount(
  order: SavedOrder
) {
  return order.items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );
}

function getStatusDetails(
  status: OrderStatus
): {
  label: string;
  className: string;
  icon: ElementType;
} {
  switch (status) {
    case "Processing":
      return {
        label: "Processing",
        className:
          "border-blue-200 bg-blue-50 text-blue-700",
        icon: Clock3,
      };

    case "Shipped":
      return {
        label: "Shipped",
        className:
          "border-purple-200 bg-purple-50 text-purple-700",
        icon: Truck,
      };

    case "Delivered":
      return {
        label: "Delivered",
        className:
          "border-green-200 bg-green-50 text-green-700",
        icon: CheckCircle2,
      };

    case "Cancelled":
      return {
        label: "Cancelled",
        className:
          "border-red-200 bg-red-50 text-red-700",
        icon: XCircle,
      };

    default:
      return {
        label: "Confirmed",
        className:
          "border-amber-200 bg-amber-50 text-amber-700",
        icon: PackageCheck,
      };
  }
}

function matchesFilter(
  order: SavedOrder,
  filter: OrderFilter
) {
  if (filter === "All") {
    return true;
  }

  if (filter === "Active") {
    return [
      "Confirmed",
      "Processing",
      "Shipped",
    ].includes(order.status);
  }

  return order.status === filter;
}

function getTrackingStep(
  status: OrderStatus
) {
  switch (status) {
    case "Processing":
      return 2;

    case "Shipped":
      return 3;

    case "Delivered":
      return 4;

    case "Cancelled":
      return 0;

    default:
      return 1;
  }
}

function dispatchOrdersUpdate() {
  window.dispatchEvent(
    new Event(
      "styloverse-orders-updated"
    )
  );
}

/* ==========================================================================
   PAGE
========================================================================== */

export default function OrdersPage() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [orders, setOrders] =
    useState<SavedOrder[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    selectedFilter,
    setSelectedFilter,
  ] =
    useState<OrderFilter>("All");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    expandedOrderId,
    setExpandedOrderId,
  ] = useState<string | null>(
    null
  );

  const [
    cancellingOrderId,
    setCancellingOrderId,
  ] = useState<string | null>(
    null
  );
  const [cancellingLine, setCancellingLine] = useState("");

  const [
    feedback,
    setFeedback,
  ] =
    useState<FeedbackMessage | null>(
      null
    );

  /* ========================================================================
     LOAD ORDERS
  ======================================================================== */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const loadOrders = () => {
      const storedOrders =
        readStoredOrders();

      const normalizedOrders =
        storedOrders
          .map(normalizeOrder)
          .filter(
            (
              order
            ): order is SavedOrder =>
              order !== null
          );

      const currentUserEmail =
        user?.email
          ?.trim()
          .toLowerCase() ?? "";

      const currentUserId =
        user?.uid ?? "";

      const userOrders =
        normalizedOrders.filter(
          (order) => {
            const matchesUserId =
              Boolean(
                currentUserId &&
                  order.userId ===
                    currentUserId
              );

            const matchesEmail =
              Boolean(
                currentUserEmail &&
                  order.userEmail
                    .trim()
                    .toLowerCase() ===
                    currentUserEmail
              );

            return (
              matchesUserId ||
              matchesEmail
            );
          }
        );

      userOrders.sort(
        (firstOrder, secondOrder) =>
          new Date(
            secondOrder.createdAt
          ).getTime() -
          new Date(
            firstOrder.createdAt
          ).getTime()
      );

      setOrders(userOrders);
      setIsLoading(false);
    };

    loadOrders();

    const handleOrdersUpdate = () => {
      loadOrders();
    };

    const handleStorageUpdate = (
      event: StorageEvent
    ) => {
      if (
        !event.key ||
        event.key ===
          ORDERS_STORAGE_KEY
      ) {
        loadOrders();
      }
    };

    window.addEventListener(
      "styloverse-orders-updated",
      handleOrdersUpdate
    );

    window.addEventListener(
      "storage",
      handleStorageUpdate
    );

    return () => {
      window.removeEventListener(
        "styloverse-orders-updated",
        handleOrdersUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorageUpdate
      );
    };
  }, [
    authLoading,
    user?.email,
    user?.uid,
  ]);

  /* ========================================================================
     FEEDBACK TIMER
  ======================================================================== */

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setFeedback(null);
      }, 3500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [feedback]);

  /* ========================================================================
     FILTERED ORDERS
  ======================================================================== */

  const filteredOrders =
    useMemo(() => {
      const normalizedQuery =
        searchQuery
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {
          const filterMatches =
            matchesFilter(
              order,
              selectedFilter
            );

          if (!filterMatches) {
            return false;
          }

          if (!normalizedQuery) {
            return true;
          }

          const searchableText = [
            order.id,
            order.status,
            order.paymentMethod,
            order.shippingAddress.city,
            order.shippingAddress.state,
            ...order.items.map(
              (item) => item.name
            ),
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            normalizedQuery
          );
        }
      );
    }, [
      orders,
      searchQuery,
      selectedFilter,
    ]);

  /* ========================================================================
     STATISTICS
  ======================================================================== */

  const totalOrders =
    orders.length;

  const activeOrders =
    orders.filter((order) =>
      [
        "Confirmed",
        "Processing",
        "Shipped",
      ].includes(order.status)
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

  const totalSpent =
    orders
      .filter(
        (order) =>
          order.status !== "Cancelled"
      )
      .reduce(
        (total, order) =>
          total +
          order.pricing.total,
        0
      );

  /* ========================================================================
     CANCEL ORDER
  ======================================================================== */

  const cancelOrder = async (
    orderId: string
  ) => {
    if (!user) {
      setFeedback({
        type: "error",
        message:
          "Sign in again to update this order.",
      });
      return;
    }

    setCancellingOrderId(orderId);

    try {
      await cancelCloudOrder(
        user.uid,
        orderId
      );

      const storedOrders =
        readStoredOrders();

      const updatedStoredOrders =
        storedOrders.map(
            (rawOrder) => {
              if (
                !rawOrder ||
                typeof rawOrder !==
                  "object"
              ) {
                return rawOrder;
              }

              const order =
                rawOrder as ProductRecord;

              if (
                String(order.id) !==
                orderId
              ) {
                return rawOrder;
              }

              return {
                ...order,
                status: "Cancelled",
              };
            }
          );

      window.localStorage.setItem(
          ORDERS_STORAGE_KEY,
          JSON.stringify(
            updatedStoredOrders
          )
        );

      setOrders(
          (currentOrders) =>
            currentOrders.map(
              (order) =>
                order.id === orderId
                  ? {
                      ...order,
                      status:
                        "Cancelled",
                    }
                  : order
            )
        );

      dispatchOrdersUpdate();

      setFeedback({
        type: "info",
        message: `Order ${orderId} has been cancelled.`,
      });
    } catch (error) {
      console.error(
        "Unable to cancel cloud order:",
        error
      );
      setFeedback({
        type: "error",
        message:
          "Unable to securely cancel this order.",
      });
    } finally {
      setCancellingOrderId(
        null
      );
    }
  };

  const cancelOrderItem = async (orderId: string, itemIndex: number) => {
    if (!user) return;
    const key = `${orderId}:${itemIndex}`;
    setCancellingLine(key);
    try {
      await cancelCloudOrderItem(user.uid, orderId, itemIndex);
      setFeedback({ type: "success", message: "Selected item cancelled and reserved stock released." });
    } catch (failure) {
      setFeedback({ type: "error", message: failure instanceof Error ? failure.message : "Item cancellation failed." });
    } finally { setCancellingLine(""); }
  };

  /* ========================================================================
     LOADING
  ======================================================================== */

  if (
    isLoading ||
    authLoading
  ) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#FFF8F2] px-6 pt-32">
          <div className="flex flex-col items-center gap-5">
            <Loader2
              size={35}
              className="animate-spin text-[#5B3DF5]"
            />

            <p className="text-sm font-medium text-[#756D66]">
              Preparing your order history...
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF8F2] px-5 pb-24 pt-36 md:px-8 lg:pt-40">
        <section className="mx-auto max-w-[1450px]">
          {/* ================================================================
              HEADER
          ================================================================ */}

          <div className="flex flex-col justify-between gap-7 border-b border-[#E7DED5] pb-9 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-[#A67C52]">
                <Package size={16} />

                <p className="text-[10px] font-semibold uppercase tracking-[0.32em]">
                  Styloverse Order History
                </p>
              </div>

              <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-medium tracking-[-0.04em] text-[#171717] lg:text-6xl">
                My Orders
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#746D67]">
                Review your purchases,
                delivery details and order
                progress.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#171717] transition hover:text-[#5B3DF5]"
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </Link>
          </div>

          {/* ================================================================
              FEEDBACK
          ================================================================ */}

          {feedback && (
            <div
              className={`fixed right-6 top-28 z-[150] flex max-w-sm items-center gap-3 rounded-2xl border px-5 py-4 shadow-[0_20px_55px_rgba(0,0,0,0.15)] backdrop-blur-xl ${
                feedback.type ===
                "success"
                  ? "border-green-200 bg-green-50/95 text-green-800"
                  : feedback.type ===
                      "error"
                    ? "border-red-200 bg-red-50/95 text-red-700"
                    : "border-[#DCD3FF] bg-[#F3EFFF]/95 text-[#5B3DF5]"
              }`}
            >
              {feedback.type ===
              "error" ? (
                <CircleAlert size={19} />
              ) : (
                <Check size={19} />
              )}

              <p className="text-sm font-semibold leading-6">
                {feedback.message}
              </p>

              <button
                type="button"
                onClick={() =>
                  setFeedback(null)
                }
                aria-label="Close notification"
                className="ml-auto"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* ================================================================
              EMPTY ORDERS
          ================================================================ */}

          {orders.length === 0 ? (
            <div className="mt-12 overflow-hidden rounded-[40px] border border-[#E9E1D8] bg-white shadow-[0_25px_80px_rgba(45,32,20,0.08)]">
              <div className="px-7 py-16 text-center md:px-12 lg:py-24">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-[#EEE9FF] text-[#5B3DF5]">
                  <Package
                    size={42}
                    strokeWidth={1.5}
                  />
                </div>

                <p className="mt-9 text-xs font-semibold uppercase tracking-[0.35em] text-[#A67C52]">
                  Order History
                </p>

                <h2 className="mt-4 font-[var(--font-heading)] text-4xl font-medium tracking-[-0.04em] text-[#171717] md:text-5xl">
                  No orders yet
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#746D67]">
                  Your completed Styloverse
                  purchases will appear here
                  after you place your first
                  order.
                </p>

                <Link
                  href="/shop"
                  className="group mt-9 inline-flex items-center gap-3 rounded-2xl bg-[#171717] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#5B3DF5]"
                >
                  Start Shopping

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <div className="grid gap-px border-t border-[#EEE7DF] bg-[#EEE7DF] md:grid-cols-3">
                <div className="flex items-center gap-4 bg-[#FAF7F3] p-6">
                  <ShieldCheck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Secure Orders
                    </p>

                    <p className="mt-1 text-sm text-[#817A74]">
                      Protected purchases
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#FAF7F3] p-6">
                  <Truck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Delivery Tracking
                    </p>

                    <p className="mt-1 text-sm text-[#817A74]">
                      Follow your progress
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#FAF7F3] p-6">
                  <PackageCheck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Premium Packaging
                    </p>

                    <p className="mt-1 text-sm text-[#817A74]">
                      Prepared with care
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ============================================================
                  STATISTICS
              ============================================================ */}

              <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[24px] border border-[#E9E1D8] bg-white p-6 shadow-[0_15px_45px_rgba(45,32,20,0.05)]">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEE9FF] text-[#5B3DF5]">
                      <Package size={21} />
                    </span>

                    <div>
                      <p className="text-xs text-[#817A74]">
                        Total Orders
                      </p>

                      <p className="mt-1 text-2xl font-semibold text-[#171717]">
                        {totalOrders}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#E9E1D8] bg-white p-6 shadow-[0_15px_45px_rgba(45,32,20,0.05)]">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                      <Clock3 size={21} />
                    </span>

                    <div>
                      <p className="text-xs text-[#817A74]">
                        Active Orders
                      </p>

                      <p className="mt-1 text-2xl font-semibold text-[#171717]">
                        {activeOrders}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#E9E1D8] bg-white p-6 shadow-[0_15px_45px_rgba(45,32,20,0.05)]">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                      <CheckCircle2 size={21} />
                    </span>

                    <div>
                      <p className="text-xs text-[#817A74]">
                        Delivered
                      </p>

                      <p className="mt-1 text-2xl font-semibold text-[#171717]">
                        {deliveredOrders}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#E9E1D8] bg-white p-6 shadow-[0_15px_45px_rgba(45,32,20,0.05)]">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF1E6] text-[#A76532]">
                      <CreditCard size={21} />
                    </span>

                    <div>
                      <p className="text-xs text-[#817A74]">
                        Total Spending
                      </p>

                      <p className="mt-1 text-xl font-semibold text-[#171717]">
                        {formatCurrency(
                          totalSpent
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================
                  SEARCH AND FILTERS
              ============================================================ */}

              <div className="mt-8 flex flex-col gap-5 rounded-[28px] border border-[#E9E1D8] bg-white p-5 shadow-[0_18px_55px_rgba(45,32,20,0.05)] lg:flex-row lg:items-center lg:justify-between">
                <div className="flex h-13 w-full items-center rounded-2xl border border-[#DDD5CD] bg-[#FAF7F3] px-4 lg:max-w-md">
                  <Search
                    size={18}
                    className="shrink-0 text-[#948C85]"
                  />

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(
                        event.target.value
                      )
                    }
                    placeholder="Search order ID or product..."
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {ORDER_FILTERS.map(
                    (filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() =>
                          setSelectedFilter(
                            filter
                          )
                        }
                        className={`rounded-full px-5 py-3 text-xs font-semibold transition ${
                          selectedFilter ===
                          filter
                            ? "bg-[#171717] text-white"
                            : "border border-[#E3DCD5] bg-white text-[#6F6862] hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
                        }`}
                      >
                        {filter}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* ============================================================
                  NO FILTER RESULTS
              ============================================================ */}

              {filteredOrders.length ===
              0 ? (
                <div className="mt-8 rounded-[32px] border border-[#E9E1D8] bg-white px-6 py-16 text-center">
                  <Search
                    size={34}
                    className="mx-auto text-[#A69E97]"
                  />

                  <h2 className="mt-5 text-2xl font-semibold text-[#171717]">
                    No matching orders
                  </h2>

                  <p className="mt-3 text-sm text-[#817A74]">
                    Try changing the search
                    text or selected filter.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedFilter(
                        "All"
                      );
                    }}
                    className="mt-6 rounded-2xl bg-[#171717] px-6 py-3 text-sm font-semibold text-white"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                /* ==========================================================
                   ORDERS LIST
                ========================================================== */

                <div className="mt-8 space-y-6">
                  {filteredOrders.map(
                    (order) => {
                      const statusDetails =
                        getStatusDetails(
                          order.status
                        );

                      const StatusIcon =
                        statusDetails.icon;

                      const isExpanded =
                        expandedOrderId ===
                        order.id;

                      const trackingStep =
                        getTrackingStep(
                          order.status
                        );

                      const orderItemCount =
                        getOrderItemCount(
                          order
                        );

                      return (
                        <article
                          key={order.id}
                          className="overflow-hidden rounded-[32px] border border-[#E9E1D8] bg-white shadow-[0_20px_60px_rgba(45,32,20,0.06)]"
                        >
                          {/* Order Header */}

                          <div className="flex flex-col gap-5 border-b border-[#EEE7DF] bg-[#FAF7F3] px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                              <div>
                                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A928B]">
                                  Order ID
                                </p>

                                <p className="mt-1 font-semibold text-[#171717]">
                                  {order.id}
                                </p>
                              </div>

                              <div>
                                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A928B]">
                                  Ordered On
                                </p>

                                <p className="mt-1 text-sm font-medium text-[#171717]">
                                  {formatDate(
                                    order.createdAt
                                  )}
                                </p>
                              </div>

                              <div>
                                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A928B]">
                                  Total
                                </p>

                                <p className="mt-1 text-sm font-semibold text-[#5B3DF5]">
                                  {formatCurrency(
                                    order.pricing
                                      .total
                                  )}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${statusDetails.className}`}
                            >
                              <StatusIcon
                                size={15}
                              />

                              {
                                statusDetails.label
                              }
                            </span>
                          </div>

                          {/* Main Summary */}

                          <div className="p-6 lg:p-8">
                            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_250px]">
                              <div className="min-w-0">
                                <div className="flex -space-x-4">
                                  {order.items
                                    .slice(0, 4)
                                    .map(
                                      (
                                        item,
                                        index
                                      ) => (
                                        <div
                                          key={`${item.id}-${index}`}
                                          className="relative h-20 w-16 overflow-hidden rounded-2xl border-4 border-white bg-[#F3EEE8] shadow-sm"
                                        >
                                          {item.image ? (
                                            <Image
                                              src={
                                                item.image
                                              }
                                              alt={
                                                item.name
                                              }
                                              fill
                                              sizes="64px"
                                              className="object-cover"
                                            />
                                          ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                              <ShoppingBag
                                                size={
                                                  20
                                                }
                                              />
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}

                                  {order.items
                                    .length >
                                    4 && (
                                    <div className="relative flex h-20 w-16 items-center justify-center rounded-2xl border-4 border-white bg-[#171717] text-xs font-bold text-white shadow-sm">
                                      +
                                      {order
                                        .items
                                        .length -
                                        4}
                                    </div>
                                  )}
                                </div>

                                <h2 className="mt-5 font-[var(--font-heading)] text-2xl font-medium text-[#171717]">
                                  {order.items[0]
                                    ?.name ||
                                    "Styloverse Order"}
                                </h2>

                                <p className="mt-2 text-sm leading-7 text-[#817A74]">
                                  {orderItemCount}{" "}
                                  {orderItemCount ===
                                  1
                                    ? "item"
                                    : "items"}{" "}
                                  •{" "}
                                  {
                                    order.paymentMethod
                                  }
                                </p>

                                {order.status !==
                                  "Cancelled" &&
                                  order
                                    .estimatedDelivery && (
                                    <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-[#F5F1FF] px-4 py-3 text-sm font-medium text-[#5B3DF5]">
                                      <Truck
                                        size={17}
                                      />

                                      Estimated
                                      delivery:{" "}
                                      {formatDate(
                                        order.estimatedDelivery
                                      )}
                                    </div>
                                  )}
                              </div>

                              <div className="flex flex-col justify-center gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedOrderId(
                                      isExpanded
                                        ? null
                                        : order.id
                                    )
                                  }
                                  className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#171717] px-5 text-sm font-semibold text-white transition hover:bg-[#5B3DF5]"
                                >
                                  {isExpanded
                                    ? "Hide Details"
                                    : "View Details"}

                                  {isExpanded ? (
                                    <ChevronUp
                                      size={
                                        17
                                      }
                                    />
                                  ) : (
                                    <ChevronDown
                                      size={
                                        17
                                      }
                                    />
                                  )}
                                </button>

                                {["Confirmed", "Partially Cancelled"].includes(order.status) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      cancelOrder(
                                        order.id
                                      )
                                    }
                                    disabled={
                                      cancellingOrderId ===
                                      order.id
                                    }
                                    className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-red-200 px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                  >
                                    {cancellingOrderId ===
                                    order.id ? (
                                      <>
                                        <Loader2
                                          size={
                                            17
                                          }
                                          className="animate-spin"
                                        />

                                        Cancelling...
                                      </>
                                    ) : (
                                      <>
                                        <XCircle
                                          size={
                                            17
                                          }
                                        />

                                        Cancel Order
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Tracking */}

                            {order.status !==
                              "Cancelled" && (
                              <div className="mt-8 border-t border-[#EEE7DF] pt-7">
                                <div className="grid grid-cols-4">
                                  {[
                                    "Confirmed",
                                    "Processing",
                                    "Shipped",
                                    "Delivered",
                                  ].map(
                                    (
                                      step,
                                      index
                                    ) => {
                                      const stepNumber =
                                        index +
                                        1;

                                      const completed =
                                        stepNumber <=
                                        trackingStep;

                                      return (
                                        <div
                                          key={
                                            step
                                          }
                                          className="relative text-center"
                                        >
                                          {index <
                                            3 && (
                                            <div
                                              className={`absolute left-1/2 top-4 h-0.5 w-full ${
                                                stepNumber <
                                                trackingStep
                                                  ? "bg-[#5B3DF5]"
                                                  : "bg-[#E5DED7]"
                                              }`}
                                            />
                                          )}

                                          <span
                                            className={`relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                              completed
                                                ? "bg-[#5B3DF5] text-white"
                                                : "border border-[#DCD4CC] bg-white text-[#948C85]"
                                            }`}
                                          >
                                            {completed ? (
                                              <Check
                                                size={
                                                  14
                                                }
                                              />
                                            ) : (
                                              stepNumber
                                            )}
                                          </span>

                                          <p
                                            className={`mt-3 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                                              completed
                                                ? "text-[#5B3DF5]"
                                                : "text-[#9A928B]"
                                            }`}
                                          >
                                            {step}
                                          </p>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Expanded Details */}

                          {isExpanded && (
                            <div className="border-t border-[#EEE7DF] bg-[#FCFAF8] p-6 lg:p-8">
                              <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                                {/* Products */}

                                <div>
                                  <h3 className="flex items-center gap-2 text-lg font-semibold text-[#171717]">
                                    <ShoppingBag
                                      size={19}
                                      className="text-[#5B3DF5]"
                                    />

                                    Ordered Products
                                  </h3>

                                  <div className="mt-5 space-y-4">
                                    {order.items.map(
                                      (
                                        item,
                                        index
                                      ) => (
                                        <div
                                          key={`${item.id}-${index}`}
                                          className="grid grid-cols-[90px_minmax(0,1fr)] gap-4 rounded-[22px] border border-[#E9E1D8] bg-white p-4"
                                        >
                                          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#F3EEE8]">
                                            {item.image ? (
                                              <Image
                                                src={
                                                  item.image
                                                }
                                                alt={
                                                  item.name
                                                }
                                                fill
                                                sizes="90px"
                                                className="object-cover"
                                              />
                                            ) : (
                                              <div className="flex h-full w-full items-center justify-center">
                                                <ShoppingBag
                                                  size={
                                                    24
                                                  }
                                                />
                                              </div>
                                            )}
                                          </div>

                                          <div className="min-w-0">
                                            <Link
                                              href={`/product/${encodeURIComponent(
                                                item.id
                                              )}`}
                                              className="font-semibold text-[#171717] transition hover:text-[#5B3DF5]"
                                            >
                                              {
                                                item.name
                                              }
                                            </Link>

                                            <div className="mt-2 flex flex-wrap gap-2">
                                              {item.size && (
                                                <span className="rounded-full bg-[#F5F1ED] px-3 py-1.5 text-[10px] text-[#6E6761]">
                                                  Size:{" "}
                                                  {
                                                    item.size
                                                  }
                                                </span>
                                              )}

                                              {item.color && (
                                                <span className="rounded-full bg-[#F5F1ED] px-3 py-1.5 text-[10px] text-[#6E6761]">
                                                  {
                                                    item.color
                                                  }
                                                </span>
                                              )}
                                            </div>

                                            <div className="mt-4 flex items-center justify-between gap-3">
                                              <span className="text-xs text-[#817A74]">
                                                Qty:{" "}
                                                {
                                                  item.quantity
                                                }
                                              </span>

                                              <span className="font-semibold text-[#5B3DF5]">
                                                {formatCurrency(
                                                  item.price *
                                                    item.quantity
                                                )}
                                              </span>
                                            </div>
                                            {["Confirmed", "Partially Cancelled"].includes(order.status) && order.items.filter((entry)=>entry.cancellationStatus !== "cancelled").length > 1 && item.cancellationStatus !== "cancelled" && <button type="button" onClick={()=>void cancelOrderItem(order.id,index)} disabled={cancellingLine === `${order.id}:${index}`} className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-2 text-[8px] font-bold uppercase tracking-[.1em] text-red-600 disabled:opacity-50"><XCircle size={12}/>{cancellingLine === `${order.id}:${index}` ? "Cancelling" : "Cancel this item"}</button>}
                                            {item.cancellationStatus === "cancelled" && <span className="mt-3 inline-flex rounded-full bg-red-50 px-3 py-2 text-[8px] font-bold uppercase text-red-600">Item cancelled</span>}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* Address and Payment */}

                                <div className="space-y-5">
                                  <div className="rounded-[24px] border border-[#E9E1D8] bg-white p-5">
                                    <h3 className="flex items-center gap-2 font-semibold text-[#171717]">
                                      <MapPin
                                        size={18}
                                        className="text-[#5B3DF5]"
                                      />

                                      Delivery Address
                                    </h3>

                                    <p className="mt-4 text-sm font-semibold text-[#171717]">
                                      {
                                        order
                                          .customer
                                          .fullName
                                      }
                                    </p>

                                    <p className="mt-2 text-sm leading-7 text-[#746D67]">
                                      {
                                        order
                                          .shippingAddress
                                          .addressLine1
                                      }

                                      {order
                                        .shippingAddress
                                        .addressLine2 &&
                                        `, ${order.shippingAddress.addressLine2}`}

                                      {order
                                        .shippingAddress
                                        .landmark &&
                                        `, Near ${order.shippingAddress.landmark}`}

                                      <br />

                                      {
                                        order
                                          .shippingAddress
                                          .city
                                      }
                                      ,{" "}
                                      {
                                        order
                                          .shippingAddress
                                          .state
                                      }{" "}
                                      -{" "}
                                      {
                                        order
                                          .shippingAddress
                                          .pincode
                                      }

                                      <br />

                                      {
                                        order
                                          .shippingAddress
                                          .country
                                      }
                                    </p>

                                    {order.customer
                                      .phone && (
                                      <p className="mt-3 text-xs font-medium text-[#5B3DF5]">
                                        +91{" "}
                                        {
                                          order
                                            .customer
                                            .phone
                                        }
                                      </p>
                                    )}
                                  </div>

                                  <div className="rounded-[24px] border border-[#E9E1D8] bg-white p-5">
                                    <h3 className="flex items-center gap-2 font-semibold text-[#171717]">
                                      <Banknote
                                        size={18}
                                        className="text-green-700"
                                      />

                                      Payment
                                    </h3>

                                    <div className="mt-4 flex items-center justify-between text-sm">
                                      <span className="text-[#746D67]">
                                        Method
                                      </span>

                                      <span className="font-semibold text-[#171717]">
                                        {
                                          order.paymentMethod
                                        }
                                      </span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between text-sm">
                                      <span className="text-[#746D67]">
                                        Status
                                      </span>

                                      <span className="font-semibold text-amber-700">
                                        {
                                          order.paymentStatus
                                        }
                                      </span>
                                    </div>
                                  </div>

                                  <div className="rounded-[24px] border border-[#E9E1D8] bg-white p-5">
                                    <h3 className="font-semibold text-[#171717]">
                                      Price Summary
                                    </h3>

                                    <div className="mt-4 space-y-3 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-[#746D67]">
                                          Subtotal
                                        </span>

                                        <span className="font-medium">
                                          {formatCurrency(
                                            order
                                              .pricing
                                              .subtotal
                                          )}
                                        </span>
                                      </div>

                                      {order
                                        .pricing
                                        .savings >
                                        0 && (
                                        <div className="flex justify-between">
                                          <span className="text-[#746D67]">
                                            Savings
                                          </span>

                                          <span className="font-medium text-green-700">
                                            -
                                            {formatCurrency(
                                              order
                                                .pricing
                                                .savings
                                            )}
                                          </span>
                                        </div>
                                      )}

                                      <div className="flex justify-between">
                                        <span className="text-[#746D67]">
                                          Delivery
                                        </span>

                                        <span className="font-medium">
                                          {order
                                            .pricing
                                            .deliveryCharge ===
                                          0
                                            ? "Complimentary"
                                            : formatCurrency(
                                                order
                                                  .pricing
                                                  .deliveryCharge
                                              )}
                                        </span>
                                      </div>

                                      <div className="flex justify-between border-t border-[#EEE7DF] pt-4">
                                        <span className="font-semibold text-[#171717]">
                                          Total
                                        </span>

                                        <span className="font-[var(--font-heading)] text-xl font-semibold text-[#5B3DF5]">
                                          {formatCurrency(
                                            order
                                              .pricing
                                              .total
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 rounded-2xl bg-[#F5F1FF] px-5 py-4 text-xs font-medium text-[#5B3DF5]">
                                    <CalendarDays
                                      size={17}
                                    />

                                    Ordered on{" "}
                                    {formatDateTime(
                                      order.createdAt
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    }
                  )}
                </div>
              )}

              {/* ============================================================
                  SERVICES
              ============================================================ */}

              <section className="mt-12 grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-4 rounded-[24px] border border-[#E9E1D8] bg-white p-6">
                  <ShieldCheck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Protected Orders
                    </p>

                    <p className="mt-1 text-sm text-[#817A74]">
                      Secure member purchases
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-[24px] border border-[#E9E1D8] bg-white p-6">
                  <Truck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Delivery Updates
                    </p>

                    <p className="mt-1 text-sm text-[#817A74]">
                      Track every order stage
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-[24px] border border-[#E9E1D8] bg-white p-6">
                  <Sparkles className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Premium Experience
                    </p>

                    <p className="mt-1 text-sm text-[#817A74]">
                      Crafted by Styloverse
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </section>
      </main>
    </>
  );
}
