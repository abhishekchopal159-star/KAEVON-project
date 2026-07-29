"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileDown,
  MapPin,
  Package,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { products as catalogProducts } from "@/data/products";

type OrderStatus =
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

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

type StoredOrder = {
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

const ORDERS_STORAGE_KEY = "styloverse-orders";
const EMPTY_ORDERS_SNAPSHOT = "[]";

const STATUS_STYLES: Record<
  OrderStatus,
  { badge: string; icon: typeof CheckCircle2 }
> = {
  Confirmed: {
    badge: "border-violet-400/25 bg-violet-400/10 text-violet-200",
    icon: CheckCircle2,
  },
  Processing: {
    badge: "border-amber-400/25 bg-amber-400/10 text-amber-200",
    icon: Clock3,
  },
  Shipped: {
    badge: "border-sky-400/25 bg-sky-400/10 text-sky-200",
    icon: Truck,
  },
  Delivered: {
    badge: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    icon: PackageCheck,
  },
  Cancelled: {
    badge: "border-rose-400/25 bg-rose-400/10 text-rose-200",
    icon: X,
  },
};

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsedValue) ? parsedValue : fallback;
  }

  return fallback;
}

function toStringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeStatus(value: unknown): OrderStatus {
  const status = toStringValue(value);
  return [
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ].includes(status)
    ? (status as OrderStatus)
    : "Confirmed";
}

function normalizePaymentStatus(value: unknown): PaymentStatus {
  const status = toStringValue(value);
  return ["Pending", "Paid", "Failed", "Refunded"].includes(status)
    ? (status as PaymentStatus)
    : "Pending";
}

function normalizeItem(rawItem: unknown): OrderItem | null {
  if (!rawItem || typeof rawItem !== "object") {
    return null;
  }

  const item = rawItem as Record<string, unknown>;
  const id = item.id ?? item.productId;
  const catalogProduct = catalogProducts.find(
    (product) =>
      String(product.id) === String(id ?? "") ||
      product.slug === String(item.slug ?? "")
  );
  const name = item.name ?? item.title ?? catalogProduct?.title;

  if (id == null || typeof name !== "string") {
    return null;
  }

  const price = toNumber(item.price ?? item.salePrice);

  return {
    id: String(id),
    name,
    image: toStringValue(
      item.image ??
        item.imageUrl ??
        item.thumbnail ??
        catalogProduct?.image
    ),
    price,
    originalPrice: toNumber(
      item.originalPrice ?? item.mrp,
      price
    ),
    quantity: Math.max(1, Math.floor(toNumber(item.quantity, 1))),
    size: toStringValue(item.size ?? item.selectedSize),
    color: toStringValue(item.color ?? item.selectedColor),
  };
}

function normalizeOrder(rawOrder: unknown): StoredOrder | null {
  if (!rawOrder || typeof rawOrder !== "object") {
    return null;
  }

  const order = rawOrder as Record<string, unknown>;
  const id = toStringValue(order.id);
  const createdAt = toStringValue(order.createdAt);
  const rawItems = Array.isArray(order.items) ? order.items : [];
  const items = rawItems
    .map(normalizeItem)
    .filter((item): item is OrderItem => item !== null);

  if (
    !id ||
    !createdAt ||
    Number.isNaN(new Date(createdAt).getTime()) ||
    items.length === 0
  ) {
    return null;
  }

  const customer =
    order.customer && typeof order.customer === "object"
      ? (order.customer as Record<string, unknown>)
      : {};
  const address =
    order.shippingAddress && typeof order.shippingAddress === "object"
      ? (order.shippingAddress as Record<string, unknown>)
      : {};
  const pricing =
    order.pricing && typeof order.pricing === "object"
      ? (order.pricing as Record<string, unknown>)
      : {};
  const calculatedSubtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return {
    id,
    userId: toStringValue(order.userId),
    userEmail: toStringValue(order.userEmail),
    createdAt,
    estimatedDelivery: toStringValue(order.estimatedDelivery),
    status: normalizeStatus(order.status),
    paymentMethod: toStringValue(order.paymentMethod, "Not specified"),
    paymentStatus: normalizePaymentStatus(order.paymentStatus),
    items,
    customer: {
      fullName: toStringValue(customer.fullName),
      email: toStringValue(customer.email),
      phone: toStringValue(customer.phone),
    },
    shippingAddress: {
      addressLine1: toStringValue(address.addressLine1),
      addressLine2: toStringValue(address.addressLine2),
      landmark: toStringValue(address.landmark),
      city: toStringValue(address.city),
      state: toStringValue(address.state),
      pincode: toStringValue(address.pincode),
      country: toStringValue(address.country, "India"),
    },
    pricing: {
      subtotal: toNumber(pricing.subtotal, calculatedSubtotal),
      savings: toNumber(pricing.savings),
      deliveryCharge: toNumber(pricing.deliveryCharge),
      total: toNumber(pricing.total, calculatedSubtotal),
    },
  };
}

function parseOrders(snapshot: string) {
  try {
    const parsedOrders: unknown = JSON.parse(snapshot);

    if (!Array.isArray(parsedOrders)) {
      return [];
    }

    return parsedOrders
      .map(normalizeOrder)
      .filter((order): order is StoredOrder => order !== null);
  } catch {
    return [];
  }
}

function getOrdersSnapshot() {
  return (
    window.localStorage.getItem(ORDERS_STORAGE_KEY) ??
    EMPTY_ORDERS_SNAPSHOT
  );
}

function subscribeToOrders(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === ORDERS_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener("styloverse-orders-updated", onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(
      "styloverse-orders-updated",
      onStoreChange
    );
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "To be confirmed";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getItemCount(order: StoredOrder) {
  return order.items.reduce(
    (count, item) => count + item.quantity,
    0
  );
}

function getOrderTitle(order: StoredOrder) {
  const firstItem = order.items[0];

  if (!firstItem) {
    return "Styloverse order";
  }

  return order.items.length > 1
    ? `${firstItem.name} + ${order.items.length - 1} more`
    : firstItem.name;
}

function getAddress(order: StoredOrder) {
  return [
    order.shippingAddress.addressLine1,
    order.shippingAddress.addressLine2,
    order.shippingAddress.city,
    order.shippingAddress.state,
    order.shippingAddress.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}

function buildInvoice(order: StoredOrder) {
  const itemLines = order.items
    .map(
      (item) =>
        `${item.name} × ${item.quantity} — ${formatCurrency(
          item.price * item.quantity
        )}`
    )
    .join("\n");

  return [
    "STYLOVERSE ORDER INVOICE",
    "========================",
    `Order ID: ${order.id}`,
    `Ordered: ${formatDateTime(order.createdAt)}`,
    `Status: ${order.status}`,
    `Payment: ${order.paymentMethod} (${order.paymentStatus})`,
    "",
    itemLines,
    "",
    `Subtotal: ${formatCurrency(order.pricing.subtotal)}`,
    `Delivery: ${formatCurrency(order.pricing.deliveryCharge)}`,
    `Total: ${formatCurrency(order.pricing.total)}`,
    "",
    `Deliver to: ${getAddress(order)}`,
  ].join("\n");
}

function OrderDetails({
  order,
  onClose,
}: {
  order: StoredOrder;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0C0A0F]/70 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
      onClick={onClose}
    >
      <motion.section
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[34px] border border-white/10 bg-[#17151A] p-7 text-white shadow-[0_40px_120px_rgba(0,0,0,0.5)] sm:p-9"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D1A86F]">
              Order details
            </p>
            <h2
              id="order-details-title"
              className="mt-2 text-3xl font-semibold tracking-[-0.03em]"
            >
              {order.id}
            </h2>
            <p className="mt-2 text-sm text-white/50">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-white/25 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {order.items.map((item) => (
            <div
              key={`${order.id}-${item.id}-${item.size}-${item.color}`}
              className="flex items-center justify-between gap-5 rounded-2xl border border-white/8 bg-white/[0.035] p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{item.name}</p>
                <p className="mt-1 text-xs text-white/45">
                  Qty {item.quantity}
                  {item.size ? ` · Size ${item.size}` : ""}
                  {item.color ? ` · ${item.color}` : ""}
                </p>
              </div>
              <p className="shrink-0 font-semibold text-[#E1B77F]">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
            <div className="flex items-center gap-2 text-[#C0AEFF]">
              <MapPin size={16} />
              <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                Delivery
              </p>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/60">
              {getAddress(order) || "Delivery address unavailable"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
            <div className="flex items-center gap-2 text-[#E1B77F]">
              <ReceiptText size={16} />
              <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                Payment
              </p>
            </div>
            <p className="mt-3 text-sm text-white/70">
              {order.paymentMethod}
            </p>
            <p className="mt-1 text-xs text-white/40">
              {order.paymentStatus}
            </p>
          </div>
        </div>

        <div className="mt-7 flex items-end justify-between border-t border-white/10 pt-6">
          <p className="text-sm text-white/45">Total paid</p>
          <p className="text-3xl font-semibold tracking-[-0.03em] text-[#E1B77F]">
            {formatCurrency(order.pricing.total)}
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default function OrdersTable() {
  const { user, loading: authLoading } = useAuth();
  const ordersSnapshot = useSyncExternalStore(
    subscribeToOrders,
    getOrdersSnapshot,
    () => EMPTY_ORDERS_SNAPSHOT
  );
  const [toast, setToast] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] =
    useState<StoredOrder | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const orders = useMemo(() => {
    if (!user) {
      return [];
    }

    const userEmail = user.email?.trim().toLowerCase() ?? "";

    return parseOrders(ordersSnapshot)
      .filter((order) => {
        const matchesUserId = order.userId === user.uid;
        const matchesEmail = Boolean(
          userEmail && order.userEmail.trim().toLowerCase() === userEmail
        );
        return matchesUserId || matchesEmail;
      })
      .sort(
        (firstOrder, secondOrder) =>
          new Date(secondOrder.createdAt).getTime() -
          new Date(firstOrder.createdAt).getTime()
      );
  }, [ordersSnapshot, user]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function showToast(message: string) {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2800);
  }

  function downloadInvoice(order: StoredOrder) {
    const invoice = new Blob([buildInvoice(order)], {
      type: "text/plain;charset=utf-8",
    });
    const invoiceUrl = URL.createObjectURL(invoice);
    const downloadLink = document.createElement("a");
    downloadLink.href = invoiceUrl;
    downloadLink.download = `${order.id}-invoice.txt`;
    downloadLink.click();
    URL.revokeObjectURL(invoiceUrl);
    showToast(`Invoice ${order.id} downloaded`);
  }

  if (authLoading) {
    return (
      <div className="rounded-[34px] border border-black/[0.06] bg-white p-12 text-center shadow-[0_24px_70px_rgba(45,32,20,0.06)]">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#DCD3FF] border-t-[#5B3DF5]" />
        <p className="mt-4 text-sm font-medium text-[#746D67]">
          Loading your orders...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="relative overflow-hidden rounded-[38px] border border-[#E5DDD5] bg-[#17151A] px-7 py-14 text-center text-white shadow-[0_32px_90px_rgba(32,24,18,0.16)] sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#5B3DF5]/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#C9955B]/15 blur-[100px]" />
        <div className="relative z-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/10 bg-white/[0.06] text-[#C5B9FF] shadow-2xl">
            <Package size={34} strokeWidth={1.5} />
          </div>
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D1A86F]">
            Your private collection
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            No orders yet
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/50">
            Only purchases you actually place will appear here with their
            real order date, time and delivery status.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-13 items-center justify-center gap-3 rounded-2xl bg-[#D3A267] px-7 py-4 text-sm font-semibold text-[#17120E] transition hover:-translate-y-0.5 hover:bg-[#E0B37C]"
          >
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mb-7 grid gap-4 sm:grid-cols-3">
        <div className="group relative overflow-hidden rounded-[26px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_rgba(45,32,20,0.06)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#6B50E8]/10 blur-3xl transition group-hover:scale-125" />
          <ShoppingBag size={18} className="relative text-[#6B50E8]" />
          <p className="relative mt-4 font-heading text-3xl text-[#171717]">
            {orders.length}
          </p>
          <p className="relative mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#817A73]">
            Real orders
          </p>
        </div>
        <div className="group relative overflow-hidden rounded-[26px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_rgba(45,32,20,0.06)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#C9955B]/12 blur-3xl transition group-hover:scale-125" />
          <Sparkles size={18} className="relative text-[#B9874F]" />
          <p className="relative mt-4 font-heading text-3xl text-[#171717]">
            {orders.reduce(
              (total, order) => total + getItemCount(order),
              0
            )}
          </p>
          <p className="relative mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#817A73]">
            Pieces ordered
          </p>
        </div>
        <div className="group relative overflow-hidden rounded-[26px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_rgba(45,32,20,0.06)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-600/10 blur-3xl transition group-hover:scale-125" />
          <ShieldCheck size={18} className="relative text-emerald-700" />
          <p className="relative mt-4 font-heading text-3xl text-[#171717]">
            {formatCurrency(
              orders.reduce(
                (total, order) => total + order.pricing.total,
                0
              )
            )}
          </p>
          <p className="relative mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#817A73]">
            Total value
          </p>
        </div>
      </section>

      <div className="space-y-6">
        {orders.map((order) => {
          const statusStyle = STATUS_STYLES[order.status];
          const StatusIcon = statusStyle.icon;
          const firstItem = order.items[0];

          return (
            <motion.article
              key={order.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-[36px] border border-[#3A333B] bg-[linear-gradient(125deg,#171619_0%,#1E1B22_58%,#252039_100%)] text-white shadow-[0_28px_80px_rgba(25,20,17,0.22)]"
            >
              <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#DAB17A]/80 to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#7962F2]/12 blur-[95px] transition duration-700 group-hover:bg-[#7962F2]/20" />
              <div className="pointer-events-none absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-[#C9955B]/8 blur-[90px]" />

              <div className="relative grid gap-7 p-6 sm:p-8 xl:grid-cols-[165px_minmax(0,1fr)]">
                <div
                  role="img"
                  aria-label={firstItem?.name ?? "Order product"}
                  style={
                    firstItem?.image
                      ? { backgroundImage: `url(${firstItem.image})` }
                      : undefined
                  }
                  className="relative h-[165px] overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(145deg,#EEE7DF,#D9CFC5)] bg-contain bg-center bg-no-repeat shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
                >
                  {!firstItem?.image && (
                    <div className="flex h-full items-center justify-center text-white/20">
                      <ShoppingBag size={36} strokeWidth={1.4} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5" />
                  {order.items.length > 1 && (
                    <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-semibold backdrop-blur">
                      +{order.items.length - 1} more
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#C99A61]">
                        Order ID
                      </p>
                      <p className="mt-2 text-sm font-semibold tracking-[0.06em] text-white/70">
                        {order.id}
                      </p>
                      <h2 className="mt-3 truncate text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                        {getOrderTitle(order)}
                      </h2>
                    </div>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${statusStyle.badge}`}
                    >
                      <StatusIcon size={15} />
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[18px] border border-white/8 bg-white/[0.035] p-4">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/30">
                        Ordered
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white/75">
                        <CalendarDays size={14} className="text-[#C99A61]" />
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="rounded-[18px] border border-white/8 bg-white/[0.035] p-4">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/30">
                        Amount
                      </p>
                      <p className="mt-2 text-lg font-semibold text-[#E1B77F]">
                        {formatCurrency(order.pricing.total)}
                      </p>
                    </div>
                    <div className="rounded-[18px] border border-white/8 bg-white/[0.035] p-4">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/30">
                        Payment
                      </p>
                      <p className="mt-2 text-sm font-medium text-white/75">
                        {order.paymentMethod} · {order.paymentStatus}
                      </p>
                    </div>
                    <div className="rounded-[18px] border border-white/8 bg-white/[0.035] p-4">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/30">
                        Estimated delivery
                      </p>
                      <p className="mt-2 text-sm font-medium text-white/75">
                        {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        showToast(
                          `${order.id}: current status is ${order.status}`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#D1A05F] px-5 py-3 text-sm font-semibold text-[#17120E] transition hover:-translate-y-0.5 hover:bg-[#E1B77F]"
                    >
                      <Truck size={16} /> Track Order
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadInvoice(order)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/12 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
                    >
                      <FileDown size={16} /> Invoice
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/12 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-[#A998FF]/35 hover:bg-[#6D4CFF]/10 hover:text-white"
                    >
                      <Eye size={16} /> Details <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            className="fixed bottom-6 right-6 z-[140] flex max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-[#17151A]/95 px-5 py-4 text-sm font-medium text-white shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle2 size={17} className="shrink-0 text-emerald-400" />
            <span>{toast}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Close notification"
              className="ml-1 text-white/40 transition hover:text-white"
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
