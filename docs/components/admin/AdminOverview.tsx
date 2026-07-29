"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CircleCheckBig,
  CircleDollarSign,
  Clock3,
  ContactRound,
  PackagePlus,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAdminAccess } from "@/contexts/AdminContext";
import {
  subscribeToAdminCustomers,
  subscribeToAdminOrders,
} from "@/services/admin.service";
import {
  subscribeToAdminProducts,
  type AdminProductRecord,
} from "@/services/product.service";
import type {
  AdminCatalogSummary,
  AdminOrderRecord,
} from "@/types/admin";

function createPreviewOrder(
  order: Pick<
    AdminOrderRecord,
    | "id"
    | "customerName"
    | "customerEmail"
    | "createdAt"
    | "status"
    | "paymentStatus"
    | "total"
    | "itemCount"
  >
): AdminOrderRecord {
  return {
    ...order,
    userId: `preview-${order.id}`,
    customerPhone: "+91 90000 00000",
    updatedAt: order.createdAt,
    estimatedDelivery: "",
    paymentMethod: "UPI",
    paymentProvider: "Preview gateway",
    transactionId: "",
    amountReceived:
      order.paymentStatus === "Received"
        ? order.total
        : 0,
    paidAt: "",
    refundAmount: 0,
    refundReference: "",
    paymentVerified:
      order.paymentStatus === "Received",
    subtotal: order.total,
    savings: 0,
    deliveryCharge: 0,
    items: [],
    shippingAddress: {
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    trackingId: "",
    shippingCarrier: "",
    timeline: [],
    notes: [],
  };
}

const previewOrders: AdminOrderRecord[] =
  [
    createPreviewOrder({
      id: "STY-PREVIEW-241",
      customerName: "Aarav Mehta",
      customerEmail:
        "aarav@example.com",
      createdAt:
        "2026-07-28T10:30:00.000Z",
      status: "Processing",
      paymentStatus: "Received",
      total: 8798,
      itemCount: 2,
    }),
    createPreviewOrder({
      id: "STY-PREVIEW-240",
      customerName: "Meera Kapoor",
      customerEmail:
        "meera@example.com",
      createdAt:
        "2026-07-28T08:12:00.000Z",
      status: "Confirmed",
      paymentStatus: "Pending",
      total: 3999,
      itemCount: 1,
    }),
    createPreviewOrder({
      id: "STY-PREVIEW-239",
      customerName: "Kabir Singh",
      customerEmail:
        "kabir@example.com",
      createdAt:
        "2026-07-27T16:45:00.000Z",
      status: "Shipped",
      paymentStatus: "Received",
      total: 10497,
      itemCount: 3,
    }),
    createPreviewOrder({
      id: "STY-PREVIEW-238",
      customerName: "Ira Sharma",
      customerEmail:
        "ira@example.com",
      createdAt:
        "2026-07-27T12:22:00.000Z",
      status: "Delivered",
      paymentStatus: "Received",
      total: 6499,
      itemCount: 2,
    }),
  ];

const previewChart = [
  42, 56, 47, 71, 63, 83, 78, 96,
  88, 112, 103, 128,
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

function formatOrderDate(value: string) {
  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Recently";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function statusClass(status: string) {
  const normalized =
    status.toLowerCase();

  if (normalized === "delivered") {
    return "border-[#2E9D77]/20 bg-[#2E9D77]/10 text-[#197457]";
  }

  if (normalized === "shipped") {
    return "border-[#517BC8]/20 bg-[#517BC8]/10 text-[#3563B0]";
  }

  if (normalized === "cancelled") {
    return "border-[#C45C65]/20 bg-[#C45C65]/10 text-[#A63F49]";
  }

  if (normalized === "processing") {
    return "border-[#A37336]/20 bg-[#C99757]/12 text-[#93612A]";
  }

  return "border-[#7658D8]/20 bg-[#7658D8]/10 text-[#6145BF]";
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export default function AdminOverview({
  catalog,
}: {
  catalog: AdminCatalogSummary;
}) {
  const { profile, isPreview } =
    useAdminAccess();
  const [orders, setOrders] =
    useState<AdminOrderRecord[]>(
      isPreview ? previewOrders : []
    );
  const [customerCount, setCustomerCount] =
    useState(isPreview ? 184 : 0);
  const [cloudProducts, setCloudProducts] =
    useState<AdminProductRecord[]>([]);
  const [dataState, setDataState] =
    useState<
      "loading" | "live" | "preview" | "error"
    >(isPreview ? "preview" : "loading");

  useEffect(() => {
    if (isPreview) {
      return;
    }

    const stopOrders =
      subscribeToAdminOrders(
        (nextOrders) => {
          setOrders(nextOrders);
          setDataState("live");
        },
        (error) => {
          console.warn(
            "Unable to load admin orders:",
            error
          );
          setDataState("error");
        }
      );
    const stopCustomers =
      subscribeToAdminCustomers(
        (customers) => {
          setCustomerCount(
            customers.filter(
              (customer) =>
                customer.role !== "admin"
            ).length
          );
        },
        (error) => {
          console.warn(
            "Unable to load customers:",
            error
          );
        }
      );
    const stopProducts =
      subscribeToAdminProducts(
        setCloudProducts,
        (error) => {
          console.warn(
            "Unable to load admin catalogue:",
            error
          );
        }
      );

    return () => {
      stopOrders();
      stopCustomers();
      stopProducts();
    };
  }, [isPreview]);

  const liveCatalog = useMemo(() => {
    if (isPreview || !cloudProducts.length) {
      return catalog;
    }

    const activeCloudProducts =
      cloudProducts.filter(
        (product) =>
          product.status !== "archived"
      );
    const cloudLowStock = activeCloudProducts
      .filter((product) => product.stock <= 12)
      .map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        stock: product.stock,
        category: product.category,
      }));
    const lowStockProducts = [
      ...catalog.lowStockProducts,
      ...cloudLowStock,
    ].sort(
      (firstProduct, secondProduct) =>
        firstProduct.stock - secondProduct.stock
    );

    return {
      productCount:
        catalog.productCount +
        activeCloudProducts.length,
      inventoryUnits:
        catalog.inventoryUnits +
        activeCloudProducts.reduce(
          (total, product) =>
            total + product.stock,
          0
        ),
      lowStockCount: lowStockProducts.length,
      categoryCount: catalog.categoryCount,
      lowStockProducts,
    };
  }, [catalog, cloudProducts, isPreview]);

  const metrics = useMemo(() => {
    const revenue = orders
      .filter(
        (order) =>
          order.status.toLowerCase() !==
          "cancelled"
      )
      .reduce(
        (total, order) =>
          total + order.total,
        0
      );
    const openOrders = orders.filter(
      (order) =>
        ![
          "delivered",
          "cancelled",
        ].includes(
          order.status.toLowerCase()
        )
    ).length;
    const delivered = orders.filter(
      (order) =>
        order.status.toLowerCase() ===
        "delivered"
    ).length;

    return {
      revenue,
      openOrders,
      delivered,
    };
  }, [orders]);

  const chartData = useMemo(() => {
    if (isPreview) {
      return previewChart;
    }

    const currentMonth = Array.from(
      { length: 12 },
      () => 0
    );

    orders.forEach((order) => {
      const date = new Date(
        order.createdAt
      );

      if (
        Number.isNaN(date.getTime())
      ) {
        return;
      }

      const index = Math.min(
        11,
        Math.floor(
          (date.getDate() - 1) / 3
        )
      );
      currentMonth[index] +=
        order.total;
    });

    return currentMonth;
  }, [isPreview, orders]);

  const chartPeak = Math.max(
    ...chartData,
    1
  );
  const previewSuffix = isPreview
    ? "?preview=1"
    : "";

  const metricCards = [
    {
      label: "Gross order value",
      value: formatCurrency(
        metrics.revenue
      ),
      caption: isPreview
        ? "+18.4% preview trend"
        : `${orders.length} recorded orders`,
      icon: CircleDollarSign,
      accent:
        "from-[#25211E] to-[#4A3B2D]",
      light: false,
    },
    {
      label: "Open orders",
      value: metrics.openOrders.toString(),
      caption: `${metrics.delivered} delivered`,
      icon: ShoppingBag,
      accent:
        "from-[#F8F5F1] to-white",
      light: true,
    },
    {
      label: "Client profiles",
      value:
        customerCount.toLocaleString(
          "en-IN"
        ),
      caption: isPreview
        ? "Sample audience"
        : "Secure customer records",
      icon: ContactRound,
      accent:
        "from-[#F3EEE9] to-[#EEE5DB]",
      light: true,
    },
    {
      label: "Inventory units",
      value:
        liveCatalog.inventoryUnits.toLocaleString(
          "en-IN"
        ),
      caption: `${liveCatalog.lowStockCount} low-stock pieces`,
      icon: Boxes,
      accent:
        "from-[#E7DEFC] to-[#DCD0F7]",
      light: true,
    },
  ];

  return (
    <div className="admin-panel-enter">
      <section className="relative overflow-hidden rounded-[30px] border border-white/75 bg-[#191715] px-5 py-7 text-white shadow-[0_28px_80px_rgba(44,33,24,.16)] sm:px-8 sm:py-9 lg:rounded-[38px] lg:px-11 lg:py-11">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#7655E8]/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-36 left-[28%] h-72 w-72 rounded-full bg-[#C59456]/18 blur-[110px]" />

        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#E0BC7C]">
              <Sparkles size={13} />
              {isPreview
                ? "Portfolio preview · read only"
                : "Live private office"}
            </div>
            <p className="mt-7 font-[var(--font-heading)] text-xl text-[#D9B273]">
              {getGreeting()}
            </p>
            <h2 className="mt-1 max-w-3xl font-[var(--font-heading)] text-4xl leading-[.98] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
              {profile.displayName},
              <span className="mt-2 block text-white/42">
                your house is in motion.
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/products${previewSuffix}`}
              style={{
                color: "#171513",
              }}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-[11px] font-semibold text-[#171513] transition hover:bg-[#E9D9C1]"
            >
              <PackagePlus size={16} />
              Add product
            </Link>
            <Link
              href={`/admin/orders${previewSuffix}`}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/14 bg-white/[0.06] px-5 text-[11px] font-semibold text-white transition hover:bg-white/10"
            >
              Review orders
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="mt-4 grid grid-cols-2 gap-3 lg:mt-6 lg:grid-cols-4 lg:gap-5"
        aria-label="Business overview"
      >
        {metricCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className={`relative min-h-[164px] overflow-hidden rounded-[26px] border p-4 shadow-[0_18px_45px_rgba(62,45,30,.07)] sm:p-5 lg:min-h-[190px] lg:p-6 ${
                card.light
                  ? `border-white/80 bg-gradient-to-br ${card.accent} text-[#171513]`
                  : `border-white/10 bg-gradient-to-br ${card.accent} text-white`
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                  card.light
                    ? "bg-white/80 text-[#8E6235]"
                    : "bg-white/10 text-[#E1BC7E]"
                }`}
              >
                <Icon size={18} />
              </div>
              <p
                className={`mt-7 text-[8px] font-semibold uppercase tracking-[0.24em] ${
                  card.light
                    ? "text-[#7D746B]"
                    : "text-white/42"
                }`}
              >
                {card.label}
              </p>
              <p className="mt-2 font-[var(--font-heading)] text-[28px] leading-none sm:text-3xl">
                {card.value}
              </p>
              <p
                className={`mt-3 text-[9px] ${
                  card.light
                    ? "text-[#8B8177]"
                    : "text-[#DBB879]"
                }`}
              >
                {card.caption}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-5 grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(330px,.72fr)]">
        <article className="rounded-[30px] border border-white/85 bg-white/75 p-5 shadow-[0_24px_70px_rgba(62,45,30,.08)] backdrop-blur-2xl sm:p-7 lg:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A3723C]">
                Revenue movement
              </p>
              <h3 className="mt-2 font-[var(--font-heading)] text-3xl text-[#191613]">
                Sales pulse
              </h3>
              <p className="mt-2 text-[11px] text-[#867B71]">
                Twelve moments across the
                current month
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#DAD0C5] bg-[#FAF7F3] px-3 py-2 text-[9px] font-semibold text-[#6F655B]">
              <TrendingUp
                size={13}
                className="text-[#98703F]"
              />
              This month
            </div>
          </div>

          <div className="mt-8 flex h-[210px] items-end gap-2 sm:gap-3">
            {chartData.map(
              (value, index) => {
                const height =
                  value === 0
                    ? 8
                    : Math.max(
                        15,
                        (value /
                          chartPeak) *
                          100
                      );

                return (
                  <div
                    key={`${index}-${value}`}
                    className="group flex h-full flex-1 items-end"
                    title={formatCurrency(
                      value
                    )}
                  >
                    <div
                      className="w-full rounded-t-full bg-gradient-to-t from-[#2B2622] via-[#8F683E] to-[#E2BF82] opacity-85 transition group-hover:opacity-100"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>
                );
              }
            )}
          </div>

          <div className="mt-4 flex justify-between border-t border-[#E5DDD5] pt-4 text-[8px] font-medium uppercase tracking-[0.18em] text-[#9A9086]">
            <span>Start</span>
            <span>Mid month</span>
            <span>Today</span>
          </div>
        </article>

        <article className="flex flex-col rounded-[30px] border border-white/10 bg-[#201D1A] p-5 text-white shadow-[0_24px_70px_rgba(35,27,21,.17)] sm:p-7 lg:p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#D4AA69]">
                Operations
              </p>
              <h3 className="mt-2 font-[var(--font-heading)] text-3xl">
                House pulse
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.07] text-[#D7AF70]">
              <Sparkles size={18} />
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {[
              {
                icon: Clock3,
                label:
                  "Orders awaiting attention",
                value:
                  metrics.openOrders,
              },
              {
                icon: TriangleAlert,
                label:
                  "Low-stock products",
                value:
                  liveCatalog.lowStockCount,
              },
              {
                icon: CircleCheckBig,
                label:
                  "Delivered successfully",
                value:
                  metrics.delivered,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-[20px] border border-white/[0.08] bg-white/[0.045] p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D5AE70]/10 text-[#D8B372]">
                    <Icon size={17} />
                  </div>
                  <p className="min-w-0 flex-1 text-[10px] leading-4 text-white/48">
                    {item.label}
                  </p>
                  <span className="font-[var(--font-heading)] text-2xl">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>

          <Link
            href={`/admin/inventory${previewSuffix}`}
            className="mt-auto flex h-12 items-center justify-between border-t border-white/10 pt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E1BF86]"
          >
            Open operations
            <ArrowRight size={15} />
          </Link>
        </article>
      </section>

      <section className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.68fr)]">
        <article className="overflow-hidden rounded-[30px] border border-white/85 bg-white/78 shadow-[0_24px_70px_rgba(62,45,30,.08)] backdrop-blur-2xl">
          <div className="flex items-end justify-between gap-5 border-b border-[#E5DDD5] px-5 py-6 sm:px-7">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A3723C]">
                Latest activity
              </p>
              <h3 className="mt-2 font-[var(--font-heading)] text-3xl">
                Recent orders
              </h3>
            </div>
            <Link
              href={`/admin/orders${previewSuffix}`}
              className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#62584F] transition hover:text-[#A3723C]"
            >
              View all →
            </Link>
          </div>

          {orders.length ? (
            <div>
              <div className="hidden grid-cols-[1.15fr_.85fr_.65fr_.55fr] gap-4 border-b border-[#ECE5DE] px-7 py-3 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#998F85] md:grid">
                <span>Client / Order</span>
                <span>Placed</span>
                <span>Amount</span>
                <span>Status</span>
              </div>

              {orders
                .slice(0, 4)
                .map((order) => (
                  <div
                    key={order.id}
                    className="grid gap-4 border-b border-[#ECE5DE] px-5 py-5 last:border-0 sm:px-7 md:grid-cols-[1.15fr_.85fr_.65fr_.55fr] md:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F0E8DF] font-[var(--font-heading)] text-base text-[#865F34]">
                        {order.customerName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold">
                          {order.customerName}
                        </p>
                        <p className="mt-1 truncate text-[8px] uppercase tracking-[0.13em] text-[#92887E]">
                          {order.id}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#776D64]">
                      {formatOrderDate(
                        order.createdAt
                      )}
                    </p>
                    <div>
                      <p className="font-[var(--font-heading)] text-lg">
                        {formatCurrency(
                          order.total
                        )}
                      </p>
                      <p className="text-[8px] text-[#92887E]">
                        {order.itemCount}{" "}
                        {order.itemCount ===
                        1
                          ? "piece"
                          : "pieces"}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1.5 text-[8px] font-semibold ${statusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <ShoppingBag className="mx-auto text-[#B5AAA0]" />
              <p className="mt-4 font-[var(--font-heading)] text-2xl">
                No real orders yet.
              </p>
              <p className="mt-2 text-xs text-[#8D8379]">
                New customer orders will
                appear here automatically.
              </p>
            </div>
          )}

          {dataState === "error" ? (
            <p className="border-t border-[#E8DFD7] bg-[#B44B4B]/5 px-6 py-3 text-[9px] text-[#A54242]">
              Live data is unavailable. Check
              the Firebase admin role and
              deployed security rules.
            </p>
          ) : null}
        </article>

        <article className="rounded-[30px] border border-white/85 bg-[#F8F5F1] p-5 shadow-[0_24px_70px_rgba(62,45,30,.08)] sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A3723C]">
                Inventory watch
              </p>
              <h3 className="mt-2 font-[var(--font-heading)] text-3xl">
                Running low
              </h3>
            </div>
            <span className="rounded-full bg-[#C18C4D]/10 px-3 py-1.5 text-[8px] font-semibold text-[#93612A]">
              {liveCatalog.lowStockCount} alerts
            </span>
          </div>

          <div className="mt-7 space-y-3">
            {liveCatalog.lowStockProducts
              .slice(0, 4)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-[20px] border border-[#E4DBD2] bg-white/75 p-3"
                >
                  {/* Existing catalogue imagery is reused here; no generated asset is introduced. */}
                  <div
                    className="h-12 w-12 shrink-0 rounded-2xl bg-[#EEE8E1] bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${product.image}")`,
                    }}
                    role="img"
                    aria-label={product.name}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-semibold">
                      {product.name}
                    </p>
                    <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-[#948A80]">
                      {product.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-[var(--font-heading)] text-xl text-[#9A6730]">
                      {product.stock}
                    </p>
                    <p className="text-[7px] uppercase tracking-[0.16em] text-[#A0968C]">
                      left
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <Link
            href={`/admin/inventory${previewSuffix}`}
            className="mt-6 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#171513] text-[9px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#302A25]"
          >
            Manage inventory
            <ArrowRight size={14} />
          </Link>
        </article>
      </section>
    </div>
  );
}
