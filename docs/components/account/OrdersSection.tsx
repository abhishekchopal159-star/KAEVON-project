"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ElementType,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleAlert,
  CircleCheck,
  Clock3,
  FileText,
  Loader2,
  Package,
  PackageCheck,
  ShoppingBag,
  Star,
  Truck,
  XCircle,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

/* ==========================================================================
   TYPES
========================================================================== */

type StorageRecord = Record<string, unknown>;

type OrderStatus =
  | "Confirmed"
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
};

type RecentOrder = {
  id: string;
  userId: string;
  userEmail: string;
  createdAt: string;
  estimatedDelivery: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    savings: number;
    deliveryCharge: number;
    total: number;
  };
};

type StatusDetails = {
  label: string;
  progress: number;
  completedSteps: number;
  icon: ElementType;
  iconColor: string;
  badge: string;
};

/* ==========================================================================
   CONSTANTS
========================================================================== */

const ORDERS_STORAGE_KEY =
  "styloverse-orders";

const MAX_RECENT_ORDERS = 4;

const TIMELINE_STEPS = [
  "Ordered",
  "Packed",
  "Shipped",
  "Delivered",
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
      value as StorageRecord;

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
  product: StorageRecord
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
    typeof product.coverImage ===
    "string"
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
    rawItem as StorageRecord;

  const price = toNumber(
    item.price ??
      item.salePrice ??
      item.discountedPrice
  );

  const originalPrice =
    toNumber(
      item.originalPrice ??
        item.oldPrice ??
        item.compareAtPrice ??
        item.mrp,
      price
    ) || price;

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

    originalPrice,

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
  };
}

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
): RecentOrder | null {
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
    pricing.subtotal ??
      order.subtotal,
    calculatedSubtotal
  );

  const deliveryCharge =
    toNumber(
      pricing.deliveryCharge ??
        order.deliveryCharge,
      0
    );

  const total = toNumber(
    pricing.total ??
      order.total ??
      order.grandTotal,
    subtotal + deliveryCharge
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
      order.estimatedDelivery ?? ""
    ),

    status: normalizeOrderStatus(
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

    pricing: {
      subtotal,

      savings: toNumber(
        pricing.savings ??
          order.savings,
        0
      ),

      deliveryCharge,

      total,
    },
  };
}

function readStoredOrders() {
  try {
    const storedOrders =
      window.localStorage.getItem(
        ORDERS_STORAGE_KEY
      );

    if (!storedOrders) {
      return [];
    }

    const parsedOrders: unknown =
      JSON.parse(storedOrders);

    return Array.isArray(parsedOrders)
      ? parsedOrders
      : [];
  } catch {
    return [];
  }
}

function belongsToCurrentUser(
  order: RecentOrder,
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

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(value);
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
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

function formatShortDate(
  value: string
) {
  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
    }
  ).format(date);
}

function getOrderItemCount(
  order: RecentOrder
) {
  return order.items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );
}

function getOrderProductTitle(
  order: RecentOrder
) {
  const firstProduct =
    order.items[0];

  if (!firstProduct) {
    return "Styloverse Order";
  }

  if (order.items.length === 1) {
    return firstProduct.name;
  }

  return `${firstProduct.name} + ${
    order.items.length - 1
  } more`;
}

function getStatusDetails(
  status: OrderStatus
): StatusDetails {
  switch (status) {
    case "Processing":
      return {
        label: "Processing",
        progress: 50,
        completedSteps: 2,
        icon: Clock3,
        iconColor: "text-amber-600",
        badge:
          "bg-amber-100 text-amber-700",
      };

    case "Shipped":
      return {
        label: "Shipped",
        progress: 75,
        completedSteps: 3,
        icon: Truck,
        iconColor: "text-blue-600",
        badge:
          "bg-blue-100 text-blue-700",
      };

    case "Delivered":
      return {
        label: "Delivered",
        progress: 100,
        completedSteps: 4,
        icon: CircleCheck,
        iconColor: "text-green-600",
        badge:
          "bg-green-100 text-green-700",
      };

    case "Cancelled":
      return {
        label: "Cancelled",
        progress: 0,
        completedSteps: 0,
        icon: XCircle,
        iconColor: "text-red-600",
        badge:
          "bg-red-100 text-red-700",
      };

    default:
      return {
        label: "Confirmed",
        progress: 25,
        completedSteps: 1,
        icon: PackageCheck,
        iconColor: "text-[#5B3DF5]",
        badge:
          "bg-[#EEE9FF] text-[#5B3DF5]",
      };
  }
}

function createInvoiceText(
  order: RecentOrder
) {
  const productLines =
    order.items
      .map((item, index) => {
        const variantDetails = [
          item.size
            ? `Size: ${item.size}`
            : "",
          item.color
            ? `Color: ${item.color}`
            : "",
        ]
          .filter(Boolean)
          .join(", ");

        return [
          `${index + 1}. ${item.name}`,
          `   Quantity: ${item.quantity}`,
          variantDetails
            ? `   ${variantDetails}`
            : "",
          `   Amount: ${formatCurrency(
            item.price *
              item.quantity
          )}`,
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");

  return `
STYLOVERSE ORDER INVOICE
================================

Order ID: ${order.id}
Order Date: ${formatDate(
    order.createdAt
  )}
Order Status: ${order.status}
Payment Method: ${order.paymentMethod}
Payment Status: ${order.paymentStatus}

PRODUCTS
--------------------------------
${productLines || "No product information available."}

PRICE SUMMARY
--------------------------------
Subtotal: ${formatCurrency(
    order.pricing.subtotal
  )}
Savings: ${formatCurrency(
    order.pricing.savings
  )}
Delivery: ${
    order.pricing.deliveryCharge === 0
      ? "Complimentary"
      : formatCurrency(
          order.pricing
            .deliveryCharge
        )
  }
Total: ${formatCurrency(
    order.pricing.total
  )}

Thank you for shopping with Styloverse.
`.trim();
}

/* ==========================================================================
   COMPONENT
========================================================================== */

export default function OrdersSection() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [orders, setOrders] =
    useState<RecentOrder[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    downloadingOrderId,
    setDownloadingOrderId,
  ] = useState<string | null>(
    null
  );

  /* ==========================================================================
     LOAD RECENT ORDERS
  ========================================================================== */

  const loadRecentOrders =
    useCallback(() => {
      const currentUserId =
        user?.uid ?? "";

      const currentUserEmail =
        user?.email
          ?.trim()
          .toLowerCase() ?? "";

      const normalizedOrders =
        readStoredOrders()
          .map(normalizeOrder)
          .filter(
            (
              order
            ): order is RecentOrder =>
              order !== null
          );

      const userOrders =
        normalizedOrders.filter(
          (order) =>
            belongsToCurrentUser(
              order,
              currentUserId,
              currentUserEmail
            )
        );

      userOrders.sort(
        (
          firstOrder,
          secondOrder
        ) =>
          new Date(
            secondOrder.createdAt
          ).getTime() -
          new Date(
            firstOrder.createdAt
          ).getTime()
      );

      setOrders(
        userOrders.slice(
          0,
          MAX_RECENT_ORDERS
        )
      );

      setIsLoading(false);
    }, [user?.email, user?.uid]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const initialLoadTimer =
      window.setTimeout(
        loadRecentOrders,
        0
      );

    const handleOrdersUpdate = () => {
      loadRecentOrders();
    };

    const handleStorageChange = (
      event: StorageEvent
    ) => {
      if (
        !event.key ||
        event.key ===
          ORDERS_STORAGE_KEY
      ) {
        loadRecentOrders();
      }
    };

    const handleWindowFocus = () => {
      loadRecentOrders();
    };

    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          loadRecentOrders();
        }
      };

    window.addEventListener(
      "styloverse-orders-updated",
      handleOrdersUpdate
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
        handleOrdersUpdate
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
    loadRecentOrders,
  ]);

  /* ==========================================================================
     SUMMARY
  ========================================================================== */

  const summary = useMemo(() => {
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
          order.status ===
          "Delivered"
      ).length;

    return {
      activeOrders,
      deliveredOrders,
    };
  }, [orders]);

  /* ==========================================================================
     DOWNLOAD INVOICE
  ========================================================================== */

  const downloadInvoice = (
    order: RecentOrder
  ) => {
    setDownloadingOrderId(
      order.id
    );

    try {
      const invoiceText =
        createInvoiceText(order);

      const invoiceBlob =
        new Blob(
          [invoiceText],
          {
            type: "text/plain;charset=utf-8",
          }
        );

      const invoiceUrl =
        URL.createObjectURL(
          invoiceBlob
        );

      const downloadLink =
        document.createElement("a");

      downloadLink.href =
        invoiceUrl;

      downloadLink.download =
        `${order.id}-invoice.txt`;

      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();
      downloadLink.remove();

      URL.revokeObjectURL(
        invoiceUrl
      );
    } finally {
      window.setTimeout(() => {
        setDownloadingOrderId(
          null
        );
      }, 400);
    }
  };

  /* ==========================================================================
     LOADING
  ========================================================================== */

  if (
    isLoading ||
    authLoading
  ) {
    return (
      <section className="mt-20">
        <div className="flex min-h-[320px] items-center justify-center rounded-[34px] border border-black/5 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2
              size={32}
              className="animate-spin text-[#5B3DF5]"
            />

            <p className="text-sm font-medium text-gray-500">
              Loading recent orders...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-20">
      {/* ====================================================================
          SECTION HEADER
      ==================================================================== */}

      <div className="mb-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.45em] text-[#A67C52]">
            Purchase History
          </p>

          <h2 className="font-heading text-4xl text-[#171717] md:text-5xl">
            Recent Orders
          </h2>

          <p className="mt-4 max-w-xl leading-7 text-gray-500">
            Track every luxury purchase,
            monitor delivery progress and
            review your recent Styloverse
            orders.
          </p>

          {orders.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EEE9FF] px-4 py-2 text-xs font-semibold text-[#5B3DF5]">
                <Package size={14} />

                {orders.length} recent{" "}
                {orders.length === 1
                  ? "order"
                  : "orders"}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
                <Clock3 size={14} />

                {summary.activeOrders} active
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                <CircleCheck size={14} />

                {summary.deliveredOrders} delivered
              </span>
            </div>
          )}
        </div>

        <Link
          href="/account/orders"
          className="flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[#171717] hover:text-white"
        >
          View All

          <ArrowRight size={16} />
        </Link>
      </div>

      {/* ====================================================================
          EMPTY STATE
      ==================================================================== */}

      {orders.length === 0 ? (
        <div className="overflow-hidden rounded-[34px] border border-black/5 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
          <div className="px-7 py-16 text-center md:px-12">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-[#EEE9FF] text-[#5B3DF5]">
              <Package
                size={42}
                strokeWidth={1.5}
              />
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-[#A67C52]">
              Order History
            </p>

            <h3 className="mt-4 font-heading text-4xl text-[#171717]">
              No orders placed yet
            </h3>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-500">
              Your recent purchases and
              delivery progress will appear
              here after you place your first
              Styloverse order.
            </p>

            <Link
              href="/shop"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#171717] px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-[#5B3DF5]"
            >
              Explore Collection

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="grid gap-px border-t border-black/5 bg-black/5 md:grid-cols-3">
            <div className="flex items-center gap-4 bg-[#FAF8F5] p-6">
              <PackageCheck className="text-[#5B3DF5]" />

              <div>
                <p className="font-semibold text-[#171717]">
                  Secure Orders
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Protected purchase flow
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#FAF8F5] p-6">
              <Truck className="text-[#5B3DF5]" />

              <div>
                <p className="font-semibold text-[#171717]">
                  Delivery Progress
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Follow every stage
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#FAF8F5] p-6">
              <FileText className="text-[#5B3DF5]" />

              <div>
                <p className="font-semibold text-[#171717]">
                  Order Invoice
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Download order details
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================================================================
           ORDER CARDS
        ================================================================== */

        <div className="space-y-8">
          {orders.map((order) => {
            const statusDetails =
              getStatusDetails(
                order.status
              );

            const StatusIcon =
              statusDetails.icon;

            const firstProduct =
              order.items[0];

            const itemCount =
              getOrderItemCount(
                order
              );

            const isDownloading =
              downloadingOrderId ===
              order.id;

            return (
              <article
                key={order.id}
                className="group overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[170px_minmax(0,1fr)]">
                  {/* Product Image */}

                  <div className="relative h-[170px] overflow-hidden rounded-3xl bg-[#F5F5F5]">
                    {firstProduct?.image ? (
                      <Image
                        src={
                          firstProduct.image
                        }
                        alt={
                          firstProduct.name
                        }
                        fill
                        sizes="170px"
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <ShoppingBag
                          size={42}
                          strokeWidth={1.4}
                        />
                      </div>
                    )}

                    {order.items.length >
                      1 && (
                      <span className="absolute bottom-3 right-3 flex h-10 min-w-10 items-center justify-center rounded-full bg-[#171717] px-2 text-xs font-bold text-white shadow-lg">
                        +
                        {order.items.length -
                          1}
                      </span>
                    )}
                  </div>

                  {/* Product Information */}

                  <div className="min-w-0">
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-6">
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-[0.28em] text-[#A67C52] md:tracking-[0.35em]">
                              Order #{order.id}
                            </p>

                            <h3 className="mt-3 font-heading text-3xl leading-tight text-[#171717] md:text-4xl">
                              {getOrderProductTitle(
                                order
                              )}
                            </h3>

                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                              <span className="inline-flex items-center gap-2">
                                <CalendarDays
                                  size={15}
                                  className="text-[#A67C52]"
                                />

                                Ordered on{" "}
                                {formatDate(
                                  order.createdAt
                                )}
                              </span>

                              <span>
                                {itemCount}{" "}
                                {itemCount === 1
                                  ? "item"
                                  : "items"}
                              </span>

                              <span>
                                {
                                  order.paymentMethod
                                }
                              </span>
                            </div>
                          </div>

                          <div
                            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${statusDetails.badge}`}
                          >
                            <StatusIcon
                              size={18}
                              className={
                                statusDetails.iconColor
                              }
                            />

                            {
                              statusDetails.label
                            }
                          </div>
                        </div>

                        {/* Delivery Information */}

                        {order.status !==
                          "Cancelled" &&
                          order.estimatedDelivery && (
                            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-[#F7F4FF] px-4 py-3 text-sm font-medium text-[#5B3DF5]">
                              <Truck
                                size={17}
                              />

                              Estimated delivery:{" "}
                              {formatDate(
                                order.estimatedDelivery
                              )}
                            </div>
                          )}

                        {order.status ===
                          "Cancelled" && (
                          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            <CircleAlert
                              size={17}
                            />

                            This order was cancelled
                          </div>
                        )}

                        {/* Progress */}

                        <div className="mt-8">
                          <div className="mb-3 flex justify-between gap-5 text-sm">
                            <span className="text-gray-500">
                              {order.status ===
                              "Cancelled"
                                ? "Order Status"
                                : "Delivery Progress"}
                            </span>

                            <span
                              className={`font-semibold ${
                                order.status ===
                                "Cancelled"
                                  ? "text-red-600"
                                  : "text-[#171717]"
                              }`}
                            >
                              {
                                statusDetails.progress
                              }
                              %
                            </span>
                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-[#ECECEC]">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                order.status ===
                                "Cancelled"
                                  ? "bg-red-500"
                                  : "bg-gradient-to-r from-[#5B3DF5] via-[#7B5BFF] to-[#A68CFF]"
                              }`}
                              style={{
                                width:
                                  order.status ===
                                  "Cancelled"
                                    ? "100%"
                                    : `${statusDetails.progress}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Timeline */}

                        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {TIMELINE_STEPS.map(
                            (
                              step,
                              index
                            ) => {
                              const stepNumber =
                                index + 1;

                              const isCompleted =
                                stepNumber <=
                                statusDetails.completedSteps;

                              const isCancelled =
                                order.status ===
                                "Cancelled";

                              return (
                                <div
                                  key={step}
                                  className={`rounded-2xl border p-4 text-center transition ${
                                    isCancelled
                                      ? "border-red-100 bg-red-50/50"
                                      : isCompleted
                                        ? "border-[#5B3DF5] bg-[#5B3DF5]/5"
                                        : "border-[#ECECEC]"
                                  }`}
                                >
                                  <span
                                    className={`mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full ${
                                      isCancelled
                                        ? "bg-red-100 text-red-600"
                                        : isCompleted
                                          ? "bg-[#5B3DF5] text-white"
                                          : "bg-[#F2F2F2] text-gray-400"
                                    }`}
                                  >
                                    {isCancelled ? (
                                      <XCircle
                                        size={15}
                                      />
                                    ) : isCompleted ? (
                                      <Check
                                        size={14}
                                      />
                                    ) : (
                                      <Package
                                        size={14}
                                      />
                                    )}
                                  </span>

                                  <p
                                    className={`text-xs font-medium ${
                                      isCancelled
                                        ? "text-red-600"
                                        : isCompleted
                                          ? "text-[#5B3DF5]"
                                          : "text-gray-500"
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

                      {/* Card Bottom */}

                      <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-black/5 pt-7">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                            Order Total
                          </p>

                          <h3 className="mt-2 text-3xl font-bold text-[#A67C52] md:text-4xl">
                            {formatCurrency(
                              order.pricing.total
                            )}
                          </h3>

                          <p className="mt-2 text-xs text-gray-500">
                            Payment status:{" "}
                            <span
                              className={`font-semibold ${
                                order.paymentStatus ===
                                "Paid"
                                  ? "text-green-700"
                                  : order.paymentStatus ===
                                      "Failed"
                                    ? "text-red-600"
                                    : "text-amber-700"
                              }`}
                            >
                              {
                                order.paymentStatus
                              }
                            </span>
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Link
                            href="/account/orders"
                            className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[#171717] hover:text-white"
                          >
                            <Truck
                              size={17}
                            />

                            Track
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              downloadInvoice(
                                order
                              )
                            }
                            disabled={
                              isDownloading
                            }
                            className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[#171717] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isDownloading ? (
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <FileText
                                size={17}
                              />
                            )}

                            {isDownloading
                              ? "Preparing"
                              : "Invoice"}
                          </button>

                          {order.status ===
                            "Delivered" &&
                          firstProduct ? (
                            <Link
                              href={`/product/${encodeURIComponent(
                                firstProduct.id
                              )}`}
                              className="flex items-center gap-2 rounded-full bg-[#5B3DF5] px-5 py-3 text-sm font-semibold text-white transition hover:scale-105"
                            >
                              <Star
                                size={17}
                              />

                              Review
                            </Link>
                          ) : (
                            <Link
                              href="/account/orders"
                              className="flex items-center gap-2 rounded-full bg-[#5B3DF5] px-5 py-3 text-sm font-semibold text-white transition hover:scale-105"
                            >
                              View Order

                              <ArrowRight
                                size={16}
                              />
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Product Preview */}

                      {order.items.length >
                        1 && (
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                          {order.items
                            .slice(0, 5)
                            .map(
                              (
                                item,
                                index
                              ) => (
                                <Link
                                  key={`${item.id}-${index}`}
                                  href={`/product/${encodeURIComponent(
                                    item.id
                                  )}`}
                                  title={
                                    item.name
                                  }
                                  className="relative h-14 w-12 overflow-hidden rounded-xl border border-black/5 bg-[#F5F5F5] transition hover:-translate-y-1"
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
                                      sizes="48px"
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                      <ShoppingBag
                                        size={17}
                                      />
                                    </div>
                                  )}
                                </Link>
                              )
                            )}

                          <p className="ml-1 text-xs text-gray-500">
                            {order.items.length}{" "}
                            different{" "}
                            {order.items.length ===
                            1
                              ? "product"
                              : "products"}{" "}
                            in this order
                          </p>
                        </div>
                      )}

                      {order.estimatedDelivery &&
                        order.status !==
                          "Cancelled" && (
                          <p className="mt-5 text-xs text-gray-400">
                            Delivery date:{" "}
                            {formatShortDate(
                              order.estimatedDelivery
                            )}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ====================================================================
          VIEW ALL FOOTER
      ==================================================================== */}

      {orders.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Link
            href="/account/orders"
            className="group inline-flex items-center gap-3 rounded-full bg-[#171717] px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-[#5B3DF5]"
          >
            View Complete Order History

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      )}
    </section>
  );
}
