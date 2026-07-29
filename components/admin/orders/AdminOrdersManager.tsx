"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeIndianRupee,
  Banknote,
  Check,
  ChevronDown,
  CircleCheckBig,
  Copy,
  CreditCard,
  Download,
  FileText,
  Filter,
  ListChecks,
  MapPin,
  MessageSquareText,
  PackageCheck,
  PackageSearch,
  Phone,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Truck,
  UserRound,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAdminAccess } from "@/contexts/AdminContext";
import { downloadStyloverseInvoice } from "@/lib/invoice-pdf";
import {
  canBulkTransition,
  getAllowedNextStatuses,
} from "@/lib/order-transitions";
import {
  addAdminOrderNote,
  ADMIN_ORDERS_PAGE_SIZE,
  bulkAssignAdminCarrier,
  bulkUpdateAdminOrderStatus,
  recordAdminCodCollection,
  subscribeToAdminOrdersPage,
  updateAdminOrderFulfilment,
  updateAdminOrderStatus,
  type AdminOrdersCursor,
} from "@/services/admin.service";
import {
  ADMIN_ORDER_STATUSES,
  ADMIN_PAYMENT_METHODS,
  ADMIN_PAYMENT_STATUSES,
  type AdminOrderRecord,
  type AdminOrderStatus,
  type AdminPaymentMethod,
  type AdminPaymentStatus,
} from "@/types/admin";

type DateFilter = "all" | "today" | "7d" | "30d";
type SortOrder = "newest" | "oldest" | "highest" | "lowest";
type DetailTab = "overview" | "journey" | "payment";

const PAYMENT_MODE =
  process.env.NEXT_PUBLIC_PAYMENT_MODE ?? "disabled";

const previewAuditDefaults = {
  paymentVerificationSource: "portfolio_preview",
  paymentVerifiedAt: "",
  statusHistory: [],
  lastActionByUid: "preview-admin",
  lastActionByName: "Abhishek",
  lastActionAt: "2026-07-28T12:00:00.000Z",
} satisfies Pick<
  AdminOrderRecord,
  | "paymentVerificationSource"
  | "paymentVerifiedAt"
  | "statusHistory"
  | "lastActionByUid"
  | "lastActionByName"
  | "lastActionAt"
>;

const previewOrders: AdminOrderRecord[] = [
  {
    id: "STY-PRV-2026-1048",
    userId: "preview-customer-1",
    customerName: "Meera Kapoor",
    customerEmail: "meera@example.com",
    customerPhone: "+91 98765 41230",
    createdAt: "2026-07-28T09:46:00.000Z",
    updatedAt: "2026-07-28T11:20:00.000Z",
    estimatedDelivery: "2026-08-02T12:00:00.000Z",
    status: "Processing",
    paymentMethod: "Card",
    paymentStatus: "Received",
    paymentProvider: "Preview gateway",
    transactionId: "pay_preview_1048",
    amountReceived: 11498,
    paidAt: "2026-07-28T09:47:00.000Z",
    refundAmount: 0,
    refundReference: "",
    paymentVerified: true,
    ...previewAuditDefaults,
    total: 11498,
    subtotal: 11498,
    savings: 2100,
    deliveryCharge: 0,
    itemCount: 2,
    items: [
      {
        id: "preview-dress",
        name: "Champagne Gold Draped Dress",
        image: "/images/shop/products/women/dresses/dress-champagne-gold-draped-dress-08.png",
        price: 6999,
        originalPrice: 8299,
        quantity: 1,
        size: "M",
        color: "Champagne Gold",
      },
      {
        id: "preview-necklace",
        name: "Gold Minimal Necklace",
        image: "/images/shop/products/accessories/jewelry/accessories-gold-minimal-necklace-02.png",
        price: 4499,
        originalPrice: 5299,
        quantity: 1,
        size: "One size",
        color: "Gold",
      },
    ],
    shippingAddress: {
      addressLine1: "24, Camellia House",
      addressLine2: "Bandra West",
      landmark: "Near Turner Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      country: "India",
    },
    trackingId: "",
    shippingCarrier: "",
    timeline: [
      {
        id: "preview-event-1",
        label: "Order confirmed",
        detail: "Customer completed the secure preview checkout.",
        createdAt: "2026-07-28T09:46:00.000Z",
        actorName: "Styloverse system",
        actorRole: "system",
      },
      {
        id: "preview-event-2",
        label: "Processing",
        detail: "The atelier accepted the order for preparation.",
        createdAt: "2026-07-28T11:20:00.000Z",
        actorName: "Abhishek",
        actorRole: "admin",
      },
    ],
    notes: [
      {
        id: "preview-note-1",
        message: "Client requested signature gift packaging.",
        createdAt: "2026-07-28T10:05:00.000Z",
        authorId: "preview-admin",
        authorName: "Abhishek",
      },
    ],
  },
  {
    id: "STY-PRV-2026-1047",
    userId: "preview-customer-2",
    customerName: "Aarav Mehta",
    customerEmail: "aarav@example.com",
    customerPhone: "+91 98111 24008",
    createdAt: "2026-07-28T07:12:00.000Z",
    updatedAt: "2026-07-28T12:00:00.000Z",
    estimatedDelivery: "2026-08-01T12:00:00.000Z",
    status: "Packed",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "COD Collection Pending",
    paymentProvider: "Manual COD collection",
    transactionId: "",
    amountReceived: 0,
    paidAt: "",
    refundAmount: 0,
    refundReference: "",
    paymentVerified: false,
    ...previewAuditDefaults,
    total: 7499,
    subtotal: 7499,
    savings: 1500,
    deliveryCharge: 0,
    itemCount: 1,
    items: [
      {
        id: "preview-kurta",
        name: "Black Embroidered Kurta Pajama",
        image: "/images/shop/products/men/kurta-pajama/men-black-embroidered-kurta-pajama-02.png",
        price: 7499,
        originalPrice: 8999,
        quantity: 1,
        size: "L",
        color: "Black",
      },
    ],
    shippingAddress: {
      addressLine1: "18, Golf Links",
      addressLine2: "Central Avenue",
      landmark: "Opposite Heritage Club",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110003",
      country: "India",
    },
    trackingId: "",
    shippingCarrier: "Delhivery",
    timeline: [
      {
        id: "preview-event-3",
        label: "Order confirmed",
        detail: "COD order entered the private office.",
        createdAt: "2026-07-28T07:12:00.000Z",
        actorName: "Styloverse system",
        actorRole: "system",
      },
      {
        id: "preview-event-4",
        label: "Packed",
        detail: "Quality inspection and signature packaging completed.",
        createdAt: "2026-07-28T12:00:00.000Z",
        actorName: "Abhishek",
        actorRole: "admin",
      },
    ],
    notes: [],
  },
  {
    id: "STY-PRV-2026-1044",
    userId: "preview-customer-3",
    customerName: "Ira Sharma",
    customerEmail: "ira@example.com",
    customerPhone: "+91 99220 10447",
    createdAt: "2026-07-27T14:34:00.000Z",
    updatedAt: "2026-07-28T06:30:00.000Z",
    estimatedDelivery: "2026-07-30T12:00:00.000Z",
    status: "Shipped",
    paymentMethod: "UPI",
    paymentStatus: "Received",
    paymentProvider: "Preview gateway",
    transactionId: "pay_preview_1044",
    amountReceived: 5998,
    paidAt: "2026-07-27T14:35:00.000Z",
    refundAmount: 0,
    refundReference: "",
    paymentVerified: true,
    ...previewAuditDefaults,
    total: 5998,
    subtotal: 5998,
    savings: 900,
    deliveryCharge: 0,
    itemCount: 2,
    items: [
      {
        id: "preview-heels",
        name: "Black Pointed Toe Heels",
        image: "/images/shop/products/footwear/heels/footwear-black-pointed-toe-heels-01.png",
        price: 3499,
        originalPrice: 3999,
        quantity: 1,
        size: "39",
        color: "Black",
      },
      {
        id: "preview-earrings",
        name: "Pearl Drop Earrings",
        image: "/images/shop/products/accessories/jewelry/accessories-pearl-drop-earrings-03.png",
        price: 2499,
        originalPrice: 2899,
        quantity: 1,
        size: "One size",
        color: "Pearl",
      },
    ],
    shippingAddress: {
      addressLine1: "71, Indiranagar",
      addressLine2: "12th Main",
      landmark: "Near Metro Station",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      country: "India",
    },
    trackingId: "DLV1044PREVIEW",
    shippingCarrier: "Delhivery",
    timeline: [
      {
        id: "preview-event-5",
        label: "Order confirmed",
        detail: "Payment verification completed in preview mode.",
        createdAt: "2026-07-27T14:34:00.000Z",
        actorName: "Styloverse system",
        actorRole: "system",
      },
      {
        id: "preview-event-6",
        label: "Shipped",
        detail: "Parcel handed to Delhivery · DLV1044PREVIEW.",
        createdAt: "2026-07-28T06:30:00.000Z",
        actorName: "Abhishek",
        actorRole: "admin",
      },
    ],
    notes: [],
  },
  {
    id: "STY-PRV-2026-1039",
    userId: "preview-customer-4",
    customerName: "Kabir Singh",
    customerEmail: "kabir@example.com",
    customerPhone: "+91 98880 10662",
    createdAt: "2026-07-25T08:20:00.000Z",
    updatedAt: "2026-07-27T16:14:00.000Z",
    estimatedDelivery: "2026-07-27T12:00:00.000Z",
    status: "Delivered",
    paymentMethod: "Wallet",
    paymentStatus: "Received",
    paymentProvider: "Preview wallet",
    transactionId: "wallet_preview_1039",
    amountReceived: 4499,
    paidAt: "2026-07-25T08:21:00.000Z",
    refundAmount: 0,
    refundReference: "",
    paymentVerified: true,
    ...previewAuditDefaults,
    total: 4499,
    subtotal: 4499,
    savings: 1200,
    deliveryCharge: 0,
    itemCount: 1,
    items: [
      {
        id: "preview-sweater",
        name: "Charcoal Turtleneck Sweater",
        image: "/images/shop/products/men/knitwear/men-charcoal-turtleneck-sweater-02.png",
        price: 4499,
        originalPrice: 5699,
        quantity: 1,
        size: "M",
        color: "Charcoal",
      },
    ],
    shippingAddress: {
      addressLine1: "9, Jubilee Hills",
      addressLine2: "Road No. 36",
      landmark: "Near Film Nagar",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033",
      country: "India",
    },
    trackingId: "BLUEDART1039",
    shippingCarrier: "Blue Dart",
    timeline: [
      {
        id: "preview-event-7",
        label: "Delivered",
        detail: "Order delivered successfully.",
        createdAt: "2026-07-27T16:14:00.000Z",
        actorName: "Styloverse system",
        actorRole: "system",
      },
    ],
    notes: [],
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string, withTime = true) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime
      ? { hour: "2-digit", minute: "2-digit" }
      : {}),
  }).format(date);
}

function toDateInput(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toISOString().slice(0, 10);
}

function formatAddress(order: AdminOrderRecord) {
  const address = order.shippingAddress;
  return [
    address.addressLine1,
    address.addressLine2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function statusClass(status: AdminOrderStatus) {
  if (status === "Delivered") {
    return "border-[#178365]/20 bg-[#178365]/10 text-[#11644D]";
  }

  if (status === "Shipped" || status === "Out for Delivery") {
    return "border-[#426FB8]/20 bg-[#426FB8]/10 text-[#315D9F]";
  }

  if (
    status === "Cancelled" ||
    status === "Return Requested" ||
    status === "Return Approved"
  ) {
    return "border-[#BC4F5C]/20 bg-[#BC4F5C]/10 text-[#9D3946]";
  }

  if (status === "Packed" || status === "Processing") {
    return "border-[#B67A35]/20 bg-[#C8914C]/12 text-[#8E5D28]";
  }

  return "border-[#7358D6]/20 bg-[#7358D6]/10 text-[#5C43B5]";
}

function paymentClass(status: AdminPaymentStatus) {
  if (status === "Received" || status === "COD Received") {
    return "bg-[#E7F7F0] text-[#11644D]";
  }

  if (status === "Failed") {
    return "bg-[#FBE9EC] text-[#A63846]";
  }

  if (status === "Refunded" || status === "Partially Refunded") {
    return "bg-[#EEE9FC] text-[#644AB9]";
  }

  return "bg-[#FFF3DF] text-[#916027]";
}

function paymentIcon(method: AdminPaymentMethod) {
  if (method === "Cash on Delivery") {
    return Banknote;
  }

  if (method === "UPI") {
    return Smartphone;
  }

  if (method === "Wallet") {
    return WalletCards;
  }

  return CreditCard;
}

function csvCell(value: unknown) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function orderMatchesDate(order: AdminOrderRecord, filter: DateFilter) {
  if (filter === "all") {
    return true;
  }

  const createdAt = new Date(order.createdAt).getTime();
  if (!Number.isFinite(createdAt)) {
    return false;
  }

  const now = new Date();
  const start = new Date(now);

  if (filter === "today") {
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(now.getDate() - (filter === "7d" ? 7 : 30));
  }

  return createdAt >= start.getTime();
}

export default function AdminOrdersManager() {
  const { profile, isPreview } = useAdminAccess();
  const [orders, setOrders] = useState<AdminOrderRecord[]>(
    isPreview ? previewOrders : []
  );
  const [dataState, setDataState] = useState<
    "loading" | "live" | "preview" | "error"
  >(isPreview ? "preview" : "loading");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminOrderStatus>(
    "all"
  );
  const [paymentFilter, setPaymentFilter] = useState<
    "all" | AdminPaymentStatus
  >("all");
  const [methodFilter, setMethodFilter] = useState<
    "all" | AdminPaymentMethod
  >("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [statusDraft, setStatusDraft] = useState<AdminOrderStatus>("Confirmed");
  const [trackingId, setTrackingId] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [note, setNote] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const [notice, setNotice] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  // Phase 1 Step 7 — cursor pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCursors, setPageCursors] = useState<
    AdminOrdersCursor[]
  >([null]);
  const [nextCursor, setNextCursor] =
    useState<AdminOrdersCursor>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isPageChanging, setIsPageChanging] = useState(false);

  // Phase 1 Step 8 — bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkPending, setBulkPending] = useState(false);
  const [showBulkCarrierInput, setShowBulkCarrierInput] = useState(false);
  const [bulkCarrierDraft, setBulkCarrierDraft] = useState("");

  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isPreview) {
      return;
    }

    const activeCursor = pageCursors[pageIndex] ?? null;
    return subscribeToAdminOrdersPage(
      {
        cursor: activeCursor,
        pageSize: ADMIN_ORDERS_PAGE_SIZE,
      },
      (page) => {
        setOrders(page.orders);
        setNextCursor(page.nextCursor);
        setHasNextPage(page.hasNext);
        setSelectedIds(new Set());
        setIsPageChanging(false);
        setDataState("live");
      },
      (error) => {
        console.warn("Unable to load admin orders:", error);
        setIsPageChanging(false);
        setDataState("error");
      }
    );
  }, [isPreview, pageCursors, pageIndex]);

  function showNextPage() {
    if (!hasNextPage || !nextCursor) {
      return;
    }

    setIsPageChanging(true);
    setPageCursors((previous) => [
      ...previous.slice(0, pageIndex + 1),
      nextCursor,
    ]);
    setPageIndex((previous) => previous + 1);
  }

  function showPreviousPage() {
    if (pageIndex === 0) {
      return;
    }
    setIsPageChanging(true);
    setPageIndex((previous) => Math.max(0, previous - 1));
  }

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  useEffect(() => {
    if (!selectedOrder) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedOrder]);

  // Phase 1 Step 10 — Escape closes, focus is trapped, focus returns on close.
  useEffect(() => {
    if (!selectedOrder) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => drawerRef.current?.focus(), 0);

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedOrderId("");
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) {
        return;
      }

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeydown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeydown);
      previouslyFocused?.focus?.();
    };
  }, [selectedOrder]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timer = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const metrics = useMemo(() => {
    const activeOrders = orders.filter((order) => order.status !== "Cancelled");
    const collected = orders.reduce(
      (total, order) => total + order.amountReceived,
      0
    );
    const open = activeOrders.filter(
      (order) => order.status !== "Delivered" && order.status !== "Return Received"
    ).length;
    const attention = orders.filter(
      (order) =>
        order.status === "Cancelled" ||
        order.status === "Return Requested" ||
        order.paymentStatus === "Failed"
    ).length;

    return {
      gross: activeOrders.reduce((total, order) => total + order.total, 0),
      collected,
      open,
      attention,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = orders.filter((order) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          order.id,
          order.customerName,
          order.customerEmail,
          order.customerPhone,
          order.trackingId,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

      return (
        matchesQuery &&
        (statusFilter === "all" || order.status === statusFilter) &&
        (paymentFilter === "all" || order.paymentStatus === paymentFilter) &&
        (methodFilter === "all" || order.paymentMethod === methodFilter) &&
        orderMatchesDate(order, dateFilter)
      );
    });

    return result.sort((first, second) => {
      if (sortOrder === "highest") {
        return second.total - first.total;
      }

      if (sortOrder === "lowest") {
        return first.total - second.total;
      }

      const firstDate = new Date(first.createdAt).getTime();
      const secondDate = new Date(second.createdAt).getTime();
      return sortOrder === "oldest"
        ? firstDate - secondDate
        : secondDate - firstDate;
    });
  }, [
    orders,
    query,
    statusFilter,
    paymentFilter,
    methodFilter,
    dateFilter,
    sortOrder,
  ]);

  const selectedOrders = useMemo(
    () => orders.filter((order) => selectedIds.has(order.id)),
    [orders, selectedIds]
  );

  const allVisibleSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedIds.has(order.id));

  function toggleSelectAllVisible() {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (allVisibleSelected) {
        filteredOrders.forEach((order) => next.delete(order.id));
      } else {
        filteredOrders.forEach((order) => next.add(order.id));
      }
      return next;
    });
  }

  function toggleSelectOne(orderId: string) {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
    setShowBulkCarrierInput(false);
    setBulkCarrierDraft("");
  }

  function showPreviewNotice() {
    setNotice({
      tone: "error",
      message: "Portfolio preview is read-only. Sign in with the verified admin account to manage real orders.",
    });
  }

  function openOrder(order: AdminOrderRecord) {
    setSelectedOrderId(order.id);
    setDetailTab("overview");
    setStatusDraft(order.status);
    setTrackingId(order.trackingId);
    setShippingCarrier(order.shippingCarrier);
    setEstimatedDelivery(toDateInput(order.estimatedDelivery));
    setNote("");
  }

  async function runAction(key: string, action: () => Promise<void>) {
    if (isPreview) {
      showPreviewNotice();
      return;
    }

    setPendingAction(key);
    try {
      await action();
      setNotice({ tone: "success", message: "Order workspace updated successfully." });
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "The order could not be updated.",
      });
    } finally {
      setPendingAction("");
    }
  }

  async function saveStatus(status: AdminOrderStatus) {
    if (!selectedOrder || status === selectedOrder.status) {
      return;
    }

    await runAction("status", () =>
      updateAdminOrderStatus({
        orderId: selectedOrder.id,
        currentStatus: selectedOrder.status,
        status,
        actor: profile,
      })
    );
  }

  async function saveFulfilment() {
    if (!selectedOrder) {
      return;
    }

    await runAction("fulfilment", () =>
      updateAdminOrderFulfilment({
        orderId: selectedOrder.id,
        trackingId,
        carrier: shippingCarrier,
        estimatedDelivery,
        actor: profile,
      })
    );
  }

  async function submitNote() {
    if (!selectedOrder || !note.trim()) {
      return;
    }

    await runAction("note", async () => {
      await addAdminOrderNote({
        orderId: selectedOrder.id,
        message: note,
        actor: profile,
      });
      setNote("");
    });
  }

  async function toggleCodCollection(received: boolean) {
    if (!selectedOrder) {
      return;
    }

    await runAction("cod", () =>
      recordAdminCodCollection({
        orderId: selectedOrder.id,
        amount: selectedOrder.total,
        received,
        actor: profile,
      })
    );
  }

  function copyOrderId(orderId: string) {
    void navigator.clipboard.writeText(orderId);
    setNotice({ tone: "success", message: `${orderId} copied to clipboard.` });
  }

  function downloadInvoice(order: AdminOrderRecord) {
    downloadStyloverseInvoice({
      orderId: order.id,
      issueDate: order.createdAt,
      orderStatus: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: formatAddress(order),
      items: order.items.map((item) => ({
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      subtotal: order.subtotal,
      savings: order.savings,
      deliveryCharge: order.deliveryCharge,
      total: order.total,
    });
    setNotice({
      tone: "success",
      message: `${order.id} branded PDF invoice downloaded.`,
    });
  }

  function exportOrdersList(list: AdminOrderRecord[], filenamePrefix: string) {
    const header = [
      "Order ID",
      "Placed",
      "Customer",
      "Email",
      "Phone",
      "Status",
      "Payment method",
      "Payment status",
      "Order total",
      "Amount received",
      "Items",
      "Tracking ID",
    ];
    const rows = list.map((order) => [
      order.id,
      order.createdAt,
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      order.status,
      order.paymentMethod,
      order.paymentStatus,
      order.total,
      order.amountReceived,
      order.itemCount,
      order.trackingId,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function exportOrders() {
    exportOrdersList(filteredOrders, "styloverse-orders");
  }

  function exportSelected() {
    exportOrdersList(selectedOrders, "styloverse-orders-selected");
  }

  async function runBulkAction(
    action: () => Promise<void>,
    confirmMessage: string
  ) {
    if (isPreview) {
      showPreviewNotice();
      return;
    }

    if (selectedOrders.length === 0) {
      return;
    }

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setBulkPending(true);
    try {
      await action();
      setNotice({
        tone: "success",
        message: `${selectedOrders.length} order(s) updated.`,
      });
      clearSelection();
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Bulk action failed. No changes were made.",
      });
    } finally {
      setBulkPending(false);
    }
  }

  function bulkMarkStatus(status: AdminOrderStatus) {
    const check = canBulkTransition(
      selectedOrders.map((order) => order.status),
      status
    );

    if (!check.allowed) {
      setNotice({
        tone: "error",
        message: `${check.invalidCount} selected order(s) cannot move to ${status}. No changes were made.`,
      });
      return;
    }

    void runBulkAction(
      () =>
        bulkUpdateAdminOrderStatus({
          orders: selectedOrders.map((order) => ({
            orderId: order.id,
            currentStatus: order.status,
          })),
          status,
          actor: profile,
        }),
      `Mark ${selectedOrders.length} selected order(s) as ${status}?`
    );
  }

  async function bulkAssignCarrier() {
    const carrier = bulkCarrierDraft.trim();
    if (!carrier) {
      return;
    }

    await runBulkAction(
      () =>
        bulkAssignAdminCarrier({
          orderIds: selectedOrders.map((order) => order.id),
          carrier,
          actor: profile,
        }),
      `Assign "${carrier}" as the delivery partner for ${selectedOrders.length} selected order(s)?`
    );
  }

  const filtersActive =
    query ||
    statusFilter !== "all" ||
    paymentFilter !== "all" ||
    methodFilter !== "all" ||
    dateFilter !== "all";

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setMethodFilter("all");
    setDateFilter("all");
  }

  const metricCards = [
    {
      label: "Gross order value",
      value: formatCurrency(metrics.gross),
      caption: `${orders.length} recorded orders`,
      icon: BadgeIndianRupee,
      style: "bg-[#191715] text-white",
      iconStyle: "bg-white/10 text-[#E2BC7B]",
    },
    {
      label: "Payment received",
      value: formatCurrency(metrics.collected),
      caption: PAYMENT_MODE === "live" ? "Gateway verified" : "Payment collection disabled",
      icon: ShieldCheck,
      style: "bg-gradient-to-br from-[#E8F5EE] to-[#F8FCFA] text-[#171513]",
      iconStyle: "bg-white text-[#18745A]",
    },
    {
      label: "Open fulfilment",
      value: metrics.open.toLocaleString("en-IN"),
      caption: "Orders in motion",
      icon: PackageSearch,
      style: "bg-gradient-to-br from-[#F7F2EB] to-white text-[#171513]",
      iconStyle: "bg-[#F1E4D2] text-[#93612A]",
    },
    {
      label: "Needs attention",
      value: metrics.attention.toLocaleString("en-IN"),
      caption: "Exceptions and returns",
      icon: AlertTriangle,
      style: "bg-gradient-to-br from-[#EEE9FC] to-[#FAF8FF] text-[#171513]",
      iconStyle: "bg-white text-[#6D53C8]",
    },
  ];

  return (
    <div className="admin-panel-enter pb-4">
      {notice ? (
        <div
          className={`fixed right-4 top-20 z-[90] flex max-w-sm items-start gap-3 rounded-[20px] border px-4 py-3 text-[11px] shadow-[0_20px_55px_rgba(35,28,22,.22)] backdrop-blur-xl sm:right-7 ${
            notice.tone === "success"
              ? "border-[#69A98F]/25 bg-[#F2FBF7]/95 text-[#155E49]"
              : "border-[#C96B75]/25 bg-[#FFF6F7]/95 text-[#9E3E49]"
          }`}
          role="status"
        >
          {notice.tone === "success" ? <CircleCheckBig size={16} /> : <AlertTriangle size={16} />}
          <span className="leading-5">{notice.message}</span>
        </div>
      ) : null}

      <section className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[#191715] px-5 py-7 text-white shadow-[0_30px_90px_rgba(42,31,22,.16)] sm:px-8 sm:py-9 lg:rounded-[38px] lg:px-11 lg:py-11">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#7755E8]/20 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-32 left-[24%] h-72 w-72 rounded-full bg-[#C89452]/16 blur-[110px]" />
        <div className="relative flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#E2BC7B]">
              <Sparkles size={13} />
              Private fulfilment command
            </div>
            <h1 className="mt-6 font-[var(--font-heading)] text-4xl leading-[.98] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
              Every order,
              <span className="block text-white/42">beautifully orchestrated.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[11px] leading-6 text-white/55 sm:text-xs">
              One operational view for clients, fulfilment, delivery and payment truth—built for calm decisions at scale.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex h-12 items-center gap-2 rounded-full border border-[#E3BD7D]/22 bg-[#E3BD7D]/10 px-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#E6C58D]">
              <ShieldCheck size={15} />
              {PAYMENT_MODE === "live" ? "Live payments" : "Payments disabled · ready"}
            </div>
            <button
              type="button"
              onClick={exportOrders}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-[9px] font-semibold uppercase tracking-[0.18em] !text-[#171513] transition hover:bg-[#EEDFC9]"
            >
              <Download size={15} />
              Export view
            </button>
          </div>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3 lg:mt-6 lg:grid-cols-4 lg:gap-5" aria-label="Order metrics">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className={`min-h-[150px] rounded-[25px] border border-white/75 p-4 shadow-[0_20px_55px_rgba(62,45,30,.07)] sm:p-5 lg:min-h-[180px] lg:p-6 ${card.style}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${card.iconStyle}`}>
                <Icon size={18} />
              </div>
              <p className="mt-6 text-[8px] font-semibold uppercase tracking-[0.22em] opacity-55">{card.label}</p>
              <p className="mt-2 font-[var(--font-heading)] text-[26px] leading-none sm:text-3xl">{card.value}</p>
              <p className="mt-3 text-[8px] opacity-50">{card.caption}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-5 overflow-hidden rounded-[30px] border border-white/85 bg-white/75 shadow-[0_26px_75px_rgba(62,45,30,.08)] backdrop-blur-2xl">
        <div className="border-b border-[#E7DED5] px-4 py-5 sm:px-6 lg:px-7 lg:py-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#A3723C]">Live order ledger</p>
              <div className="mt-2 flex items-end gap-3">
                <h2 className="font-[var(--font-heading)] text-3xl text-[#191613] sm:text-4xl">Orders</h2>
                <span className="mb-1 rounded-full bg-[#F0E8DF] px-3 py-1 text-[8px] font-semibold text-[#7B6F64]">
                  {filteredOrders.length} visible
                </span>
              </div>
            </div>
            <div className="relative w-full xl:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#91877E]" size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search order, client, phone or tracking…"
                className="h-12 w-full rounded-full border border-[#DDD3C9] bg-[#FBF8F5] pl-11 pr-4 text-[11px] outline-none transition focus:border-[#A87943] focus:bg-white focus:ring-4 focus:ring-[#A87943]/10"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-[1.2fr_1.1fr_1fr_.8fr_.8fr_auto]">
            <FilterSelect value={statusFilter} onChange={(value) => setStatusFilter(value as "all" | AdminOrderStatus)} label="Order status">
              <option value="all">All order stages</option>
              {ADMIN_ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </FilterSelect>
            <FilterSelect value={paymentFilter} onChange={(value) => setPaymentFilter(value as "all" | AdminPaymentStatus)} label="Payment status">
              <option value="all">All payment states</option>
              {ADMIN_PAYMENT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </FilterSelect>
            <FilterSelect value={methodFilter} onChange={(value) => setMethodFilter(value as "all" | AdminPaymentMethod)} label="Payment method">
              <option value="all">All methods</option>
              {ADMIN_PAYMENT_METHODS.map((method) => <option key={method} value={method}>{method}</option>)}
            </FilterSelect>
            <FilterSelect value={dateFilter} onChange={(value) => setDateFilter(value as DateFilter)} label="Date range">
              <option value="all">Any date</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </FilterSelect>
            <FilterSelect value={sortOrder} onChange={(value) => setSortOrder(value as SortOrder)} label="Sort orders">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest value</option>
              <option value="lowest">Lowest value</option>
            </FilterSelect>
            <button
              type="button"
              onClick={clearFilters}
              disabled={!filtersActive}
              className="col-span-1 inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#DDD3C9] bg-white px-4 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#71675E] transition hover:bg-[#F2ECE5] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <RefreshCcw size={13} />
              Reset
            </button>
          </div>
        </div>

        {selectedIds.size > 0 ? (
          <div className="flex flex-wrap items-center gap-2 border-b border-[#E7DED5] bg-[#FBF7F1] px-4 py-3 sm:px-6 lg:px-7">
            <span className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#6B6259]">
              <ListChecks size={14} /> {selectedIds.size} selected
            </span>
            <button
              type="button"
              onClick={exportSelected}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#DDD3C9] bg-white px-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#6B6259] transition hover:bg-[#F2ECE5]"
            >
              <Download size={12} /> Export selected
            </button>
            <button
              type="button"
              disabled={bulkPending}
              onClick={() => bulkMarkStatus("Processing")}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#DDD3C9] bg-white px-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#6B6259] transition hover:bg-[#F2ECE5] disabled:opacity-40"
            >
              Mark Processing
            </button>
            <button
              type="button"
              disabled={bulkPending}
              onClick={() => bulkMarkStatus("Packed")}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#DDD3C9] bg-white px-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#6B6259] transition hover:bg-[#F2ECE5] disabled:opacity-40"
            >
              Mark Packed
            </button>
            {showBulkCarrierInput ? (
              <span className="inline-flex items-center gap-1.5">
                <input
                  value={bulkCarrierDraft}
                  onChange={(event) => setBulkCarrierDraft(event.target.value)}
                  placeholder="Delivery partner"
                  className="h-9 rounded-full border border-[#DDD3C9] bg-white px-3 text-[9px] outline-none focus:border-[#A87943]"
                />
                <button
                  type="button"
                  disabled={bulkPending || !bulkCarrierDraft.trim()}
                  onClick={() => void bulkAssignCarrier()}
                  className="inline-flex h-9 items-center rounded-full bg-[#191715] px-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-40"
                >
                  Assign
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setShowBulkCarrierInput(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#DDD3C9] bg-white px-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#6B6259] transition hover:bg-[#F2ECE5]"
              >
                <Truck size={12} /> Assign carrier
              </button>
            )}
            <button
              type="button"
              onClick={clearSelection}
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#9A8F84] transition hover:bg-white"
            >
              <X size={12} /> Clear
            </button>
          </div>
        ) : null}

        {dataState === "loading" ? (
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-44 animate-pulse rounded-[24px] bg-[#EEE7DF]" />
            ))}
          </div>
        ) : filteredOrders.length ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <div className="min-w-[1120px]">
                <div className="grid grid-cols-[36px_1.22fr_.9fr_.78fr_.72fr_.72fr_44px] items-center gap-5 border-b border-[#ECE4DC] bg-[#FAF7F3]/75 px-7 py-3 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#998F85]">
                  <label className="flex h-4 w-4 items-center">
                    <span className="sr-only">Select all visible orders</span>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      className="h-4 w-4 rounded border-[#C9BCAE] accent-[#191715]"
                    />
                  </label>
                  <span>Client / order</span>
                  <span>Placed</span>
                  <span>Value</span>
                  <span>Payment</span>
                  <span>Fulfilment</span>
                  <span />
                </div>
                {filteredOrders.map((order) => {
                  const MethodIcon = paymentIcon(order.paymentMethod);
                  return (
                    <div
                      key={order.id}
                      className="grid grid-cols-[36px_1.22fr_.9fr_.78fr_.72fr_.72fr_44px] items-center gap-5 border-b border-[#ECE4DC] px-7 py-5 transition last:border-0 hover:bg-[#FBF7F2]"
                    >
                      <label className="flex h-9 w-9 items-center justify-center" onClick={(event) => event.stopPropagation()}>
                        <span className="sr-only">Select order {order.id}</span>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(order.id)}
                          onChange={() => toggleSelectOne(order.id)}
                          className="h-4 w-4 rounded border-[#C9BCAE] accent-[#191715]"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => openOrder(order)}
                        className="contents text-left"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#191715] font-[var(--font-heading)] text-base text-[#E2BC7B]">
                            {order.customerName.charAt(0).toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[11px] font-semibold text-[#211E1B]">{order.customerName}</span>
                            <span className="mt-1 block truncate text-[8px] uppercase tracking-[0.12em] text-[#968C82]">{order.id}</span>
                          </span>
                        </span>
                        <span>
                          <span className="block text-[10px] text-[#5F574F]">{formatDate(order.createdAt, false)}</span>
                          <span className="mt-1 block text-[8px] text-[#A0978E]">{order.itemCount} {order.itemCount === 1 ? "piece" : "pieces"}</span>
                        </span>
                        <span>
                          <span className="block font-[var(--font-heading)] text-lg text-[#211E1B]">{formatCurrency(order.total)}</span>
                          <span className="mt-1 block text-[8px] text-[#9B8F83]">{order.paymentMethod}</span>
                        </span>
                        <span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[8px] font-semibold ${paymentClass(order.paymentStatus)}`}>
                            <MethodIcon size={12} />
                            {order.paymentStatus}
                          </span>
                        </span>
                        <span>
                          <span className={`inline-flex rounded-full border px-3 py-1.5 text-[8px] font-semibold ${statusClass(order.status)}`}>{order.status}</span>
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1D8CF] bg-white text-[#62584F]">
                          <ArrowRight size={14} />
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2 lg:hidden">
              {filteredOrders.map((order) => {
                const MethodIcon = paymentIcon(order.paymentMethod);
                return (
                  <div
                    key={order.id}
                    className="relative rounded-[25px] border border-[#E5DDD5] bg-[#FCFAF7] p-4 shadow-[0_15px_35px_rgba(61,45,32,.05)]"
                  >
                    <label
                      className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-sm"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <span className="sr-only">Select order {order.id}</span>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(order.id)}
                        onChange={() => toggleSelectOne(order.id)}
                        className="h-4 w-4 rounded border-[#C9BCAE] accent-[#191715]"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => openOrder(order)}
                      className="contents text-left"
                    >
                      <span className="flex items-start justify-between gap-3 pr-10">
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#191715] font-[var(--font-heading)] text-[#E2BC7B]">{order.customerName.charAt(0)}</span>
                          <span className="min-w-0">
                            <span className="block truncate text-[11px] font-semibold">{order.customerName}</span>
                            <span className="mt-1 block truncate text-[7px] uppercase tracking-[0.12em] text-[#968C82]">{order.id}</span>
                          </span>
                        </span>
                        <ArrowRight size={15} className="mt-2 shrink-0 text-[#8B7F74]" />
                      </span>
                      <span className="mt-5 flex items-end justify-between gap-3">
                        <span>
                          <span className="block font-[var(--font-heading)] text-2xl">{formatCurrency(order.total)}</span>
                          <span className="mt-1 block text-[8px] text-[#958A80]">{formatDate(order.createdAt, false)} · {order.itemCount} pcs</span>
                        </span>
                        <span className={`rounded-full border px-3 py-1.5 text-[8px] font-semibold ${statusClass(order.status)}`}>{order.status}</span>
                      </span>
                      <span className="mt-4 flex items-center gap-2 border-t border-[#E9E1D9] pt-3 text-[8px] text-[#766C63]">
                        <MethodIcon size={13} />
                        {order.paymentMethod}
                        <span className={`ml-auto rounded-full px-2.5 py-1 ${paymentClass(order.paymentStatus)}`}>{order.paymentStatus}</span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {!isPreview ? (
              <nav className="flex flex-col items-center gap-3 border-t border-[#ECE4DC] p-5 sm:flex-row sm:justify-between" aria-label="Orders pagination">
                <p className="text-[8px] uppercase tracking-[0.15em] text-[#A79C90]">
                  Page {pageIndex + 1} · up to {ADMIN_ORDERS_PAGE_SIZE} orders
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={showPreviousPage}
                    disabled={pageIndex === 0 || isPageChanging}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-[#DDD3C9] bg-white px-6 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6B6259] transition hover:bg-[#F2ECE5] disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={showNextPage}
                    disabled={!hasNextPage || !nextCursor || isPageChanging}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[#191715] px-6 text-[9px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#332E29] disabled:opacity-35"
                  >
                    Next <ArrowRight size={13} />
                  </button>
                </div>
              </nav>
            ) : null}
          </>
        ) : (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#EEE8E1] text-[#92704A]">
              <ShoppingBag size={24} />
            </div>
            <h3 className="mt-6 font-[var(--font-heading)] text-3xl">No orders in this view.</h3>
            <p className="mx-auto mt-3 max-w-md text-[11px] leading-6 text-[#887E74]">
              {filtersActive ? "Reset the filters to reveal the complete order ledger." : "New authenticated checkout orders will appear here automatically."}
            </p>
            {filtersActive ? (
              <button type="button" onClick={clearFilters} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#191715] px-5 text-[9px] font-semibold uppercase tracking-[0.17em] text-white">
                <RefreshCcw size={13} /> Reset filters
              </button>
            ) : null}
          </div>
        )}

        {dataState === "error" ? (
          <div className="flex items-center gap-3 border-t border-[#D9707A]/20 bg-[#FFF4F5] px-5 py-4 text-[10px] text-[#A63F4C]">
            <AlertTriangle size={15} />
            Live order access failed. Verify the administrator role and deployed Firestore rules.
          </div>
        ) : null}
      </section>

      {selectedOrder ? (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="admin-order-detail-title" aria-describedby="admin-order-detail-description">
          <button type="button" className="absolute inset-0 bg-[#17130F]/55 backdrop-blur-[5px]" onClick={() => setSelectedOrderId("")} aria-label="Close order detail" />
          <aside ref={drawerRef} tabIndex={-1} className="absolute bottom-0 right-0 top-0 flex w-full flex-col overflow-hidden bg-[#F5F0EA] shadow-[-30px_0_90px_rgba(24,19,15,.25)] outline-none sm:w-[min(760px,92vw)] sm:rounded-l-[34px]">
            <div className="relative overflow-hidden bg-[#191715] px-5 pb-5 pt-5 text-white sm:px-7 sm:pt-7">
              <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#7655E8]/20 blur-[90px]" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#DDB777]">Private order dossier</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <h2 id="admin-order-detail-title" className="truncate font-[var(--font-heading)] text-3xl sm:text-4xl">{selectedOrder.id}</h2>
                    <button type="button" onClick={() => copyOrderId(selectedOrder.id)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white/65" aria-label="Copy order ID">
                      <Copy size={13} />
                    </button>
                    <button type="button" onClick={() => downloadInvoice(selectedOrder)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:bg-white/10" aria-label={`Download PDF invoice for ${selectedOrder.id}`}>
                      <Download size={13} /> PDF invoice
                    </button>
                  </div>
                  <p className="mt-2 text-[9px] text-white/42">Placed {formatDate(selectedOrder.createdAt)}</p>
                  <p id="admin-order-detail-description" className="sr-only">Manage fulfilment, audit history, payment state and invoice for order {selectedOrder.id}.</p>
                </div>
                <button type="button" onClick={() => setSelectedOrderId("")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white transition hover:bg-white/10" aria-label="Close order detail">
                  <X size={18} />
                </button>
              </div>
              <div className="relative mt-5 flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-3 py-1.5 text-[8px] font-semibold ${statusClass(selectedOrder.status)}`}>{selectedOrder.status}</span>
                <span className={`rounded-full px-3 py-1.5 text-[8px] font-semibold ${paymentClass(selectedOrder.paymentStatus)}`}>{selectedOrder.paymentStatus}</span>
                {isPreview ? <span className="rounded-full border border-[#E3BD7D]/25 bg-[#E3BD7D]/10 px-3 py-1.5 text-[8px] font-semibold text-[#E8C891]">Read-only preview</span> : null}
              </div>
            </div>

            <div className="grid grid-cols-3 border-b border-[#DED4CA] bg-white/65 px-3 py-3 sm:px-6">
              {([
                ["overview", "Overview", FileText],
                ["journey", "Journey", Activity],
                ["payment", "Payment", BadgeIndianRupee],
              ] as const).map(([tab, label, Icon]) => (
                <button key={tab} type="button" onClick={() => setDetailTab(tab)} className={`inline-flex h-10 items-center justify-center gap-2 rounded-full text-[8px] font-semibold uppercase tracking-[0.15em] transition ${detailTab === tab ? "bg-[#191715] text-white shadow-[0_10px_24px_rgba(25,23,21,.18)]" : "text-[#796F66] hover:bg-white"}`}>
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-7">
              {detailTab === "overview" ? (
                <div className="space-y-4">
                  <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ["Order value", formatCurrency(selectedOrder.total)],
                      ["Pieces", selectedOrder.itemCount.toString()],
                      ["Received", formatCurrency(selectedOrder.amountReceived)],
                      ["Savings", formatCurrency(selectedOrder.savings)],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[20px] border border-white/85 bg-white/75 p-4">
                        <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-[#998E84]">{label}</p>
                        <p className="mt-2 font-[var(--font-heading)] text-xl">{value}</p>
                      </div>
                    ))}
                  </section>

                  <DetailCard eyebrow="Client profile" title={selectedOrder.customerName} icon={UserRound}>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <InfoLine label="Email" value={selectedOrder.customerEmail || "Not available"} />
                      <InfoLine label="Phone" value={selectedOrder.customerPhone || "Not available"} icon={Phone} />
                    </div>
                  </DetailCard>

                  <DetailCard eyebrow="Delivery destination" title={selectedOrder.shippingAddress.city || "Address unavailable"} icon={MapPin}>
                    <p className="mt-4 text-[11px] leading-6 text-[#6F655C]">{formatAddress(selectedOrder) || "Customer address was not captured for this order."}</p>
                  </DetailCard>

                  <DetailCard eyebrow="The private edit" title={`${selectedOrder.itemCount} ${selectedOrder.itemCount === 1 ? "piece" : "pieces"}`} icon={ShoppingBag}>
                    <div className="mt-5 space-y-3">
                      {selectedOrder.items.length ? selectedOrder.items.map((item) => (
                        <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 rounded-[20px] border border-[#E3DAD1] bg-[#FBF8F4] p-3">
                          <div className="h-20 w-16 shrink-0 rounded-[15px] bg-[#E9E2DB] bg-cover bg-center" style={item.image ? { backgroundImage: `url("${item.image}")` } : undefined} role="img" aria-label={item.name} />
                          <div className="min-w-0 flex-1 py-1">
                            <p className="font-[var(--font-heading)] text-lg leading-tight">{item.name}</p>
                            <p className="mt-2 text-[8px] uppercase tracking-[0.14em] text-[#92877D]">{[item.size && `Size ${item.size}`, item.color, `Qty ${item.quantity}`].filter(Boolean).join(" · ")}</p>
                          </div>
                          <p className="shrink-0 pt-1 text-[10px] font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      )) : <p className="rounded-[18px] bg-[#F6F1EB] p-4 text-[10px] text-[#857A70]">Legacy order items are not available.</p>}
                    </div>
                    <div className="mt-5 space-y-2 border-t border-[#E6DED6] pt-4 text-[10px]">
                      <PriceLine label="Subtotal" value={selectedOrder.subtotal} />
                      <PriceLine label="Delivery" value={selectedOrder.deliveryCharge} />
                      <PriceLine label="Savings" value={-selectedOrder.savings} muted />
                      <PriceLine label="Total" value={selectedOrder.total} strong />
                    </div>
                  </DetailCard>

                  <DetailCard eyebrow="Private office notes" title="Internal context" icon={MessageSquareText}>
                    <div className="mt-5 space-y-3">
                      {selectedOrder.notes.length ? selectedOrder.notes.slice().reverse().map((entry) => (
                        <div key={entry.id} className="rounded-[18px] border border-[#E3DAD1] bg-[#FBF8F4] p-4">
                          <p className="text-[10px] leading-5 text-[#514A43]">{entry.message}</p>
                          <p className="mt-3 text-[7px] uppercase tracking-[0.13em] text-[#9A8F84]">{entry.authorName} · {formatDate(entry.createdAt)}</p>
                        </div>
                      )) : <p className="text-[10px] text-[#8A8076]">No private notes have been added.</p>}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={600} rows={2} placeholder="Add a private fulfilment note…" className="min-h-12 flex-1 resize-none rounded-[18px] border border-[#DCD1C7] bg-white px-4 py-3 text-[10px] outline-none focus:border-[#A87943] focus:ring-4 focus:ring-[#A87943]/10" />
                      <button type="button" onClick={() => void submitNote()} disabled={!note.trim() || pendingAction === "note"} className="flex w-12 items-center justify-center rounded-[18px] bg-[#191715] text-white disabled:opacity-40" aria-label="Add admin note">
                        {pendingAction === "note" ? <RefreshCcw className="animate-spin" size={15} /> : <Send size={15} />}
                      </button>
                    </div>
                  </DetailCard>
                </div>
              ) : null}

              {detailTab === "journey" ? (
                <div className="space-y-4">
                  <DetailCard eyebrow="Fulfilment control" title="Move the order with intent" icon={PackageCheck}>
                    <label className="mt-5 block text-[8px] font-semibold uppercase tracking-[0.17em] text-[#847970]">Current order stage</label>
                    <div className="mt-2 flex gap-2">
                      <div className="relative flex-1">
                        <select value={statusDraft} onChange={(event) => setStatusDraft(event.target.value as AdminOrderStatus)} className="h-12 w-full appearance-none rounded-[17px] border border-[#DCD1C7] bg-[#FBF8F4] px-4 pr-10 text-[10px] outline-none focus:border-[#A87943]">
                          <option value={selectedOrder.status}>{selectedOrder.status} (current)</option>
                          {getAllowedNextStatuses(selectedOrder.status).map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8D8176]" size={14} />
                      </div>
                      <button type="button" onClick={() => void saveStatus(statusDraft)} disabled={statusDraft === selectedOrder.status || pendingAction === "status"} className="rounded-[17px] bg-[#191715] px-5 text-[8px] font-semibold uppercase tracking-[0.15em] text-white disabled:opacity-35">
                        {pendingAction === "status" ? "Saving" : "Update"}
                      </button>
                      {getAllowedNextStatuses(selectedOrder.status).length === 0 ? (
                        <p className="mt-2 text-[8px] uppercase tracking-[0.13em] text-[#9A8F84]">This order is in a final status and cannot be moved further here.</p>
                      ) : null}
                    </div>
                    {getAllowedNextStatuses(selectedOrder.status)[0] ? (
                      <button type="button" onClick={() => void saveStatus(getAllowedNextStatuses(selectedOrder.status)[0])} className="mt-3 flex h-11 w-full items-center justify-between rounded-[17px] border border-[#D8C7B3] bg-[#F6EBDD] px-4 text-[9px] font-semibold text-[#7D552A]">
                        Advance to {getAllowedNextStatuses(selectedOrder.status)[0]}
                        <ArrowRight size={14} />
                      </button>
                    ) : null}
                    {getAllowedNextStatuses(selectedOrder.status).includes("Cancelled") ? (
                      <button type="button" onClick={() => void saveStatus("Cancelled")} className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[16px] border border-[#C66470]/25 bg-[#C66470]/7 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#A23F4A]">
                        <XCircle size={13} /> Cancel order
                      </button>
                    ) : null}
                  </DetailCard>

                  <DetailCard eyebrow="Delivery intelligence" title="Carrier and promise" icon={Truck}>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <Field label="Delivery partner" value={shippingCarrier} onChange={setShippingCarrier} placeholder="Blue Dart" />
                      <Field label="Tracking ID" value={trackingId} onChange={setTrackingId} placeholder="Shipment reference" />
                      <label className="sm:col-span-2">
                        <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#887D73]">Estimated delivery</span>
                        <input type="date" value={estimatedDelivery} onChange={(event) => setEstimatedDelivery(event.target.value)} className="mt-2 h-12 w-full rounded-[17px] border border-[#DCD1C7] bg-[#FBF8F4] px-4 text-[10px] outline-none focus:border-[#A87943]" />
                      </label>
                    </div>
                    <button type="button" onClick={() => void saveFulfilment()} disabled={pendingAction === "fulfilment"} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[17px] bg-[#191715] text-[8px] font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-50">
                      {pendingAction === "fulfilment" ? <RefreshCcw className="animate-spin" size={13} /> : <Check size={13} />}
                      Save delivery details
                    </button>
                  </DetailCard>

                  <DetailCard eyebrow="Order chronology" title="Every recorded movement" icon={Activity}>
                    <div className="relative mt-6 space-y-0 pl-8 before:absolute before:bottom-4 before:left-[10px] before:top-2 before:w-px before:bg-[#D7CCC1]">
                      {[
                        ...selectedOrder.timeline,
                        {
                          id: "created",
                          label: "Order placed",
                          detail: "Customer order entered the Styloverse system.",
                          createdAt: selectedOrder.createdAt,
                          actorName: selectedOrder.customerName,
                          actorRole: "customer" as const,
                        },
                      ]
                        .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
                        .map((event, index) => (
                          <div key={`${event.id}-${index}`} className="relative pb-6 last:pb-0">
                            <span className={`absolute -left-8 top-1 h-[21px] w-[21px] rounded-full border-4 border-[#FDFBF8] ${index === 0 ? "bg-[#A97942]" : "bg-[#CFC3B7]"}`} />
                            <p className="text-[10px] font-semibold text-[#332E29]">{event.label}</p>
                            <p className="mt-1 text-[9px] leading-5 text-[#81766C]">{event.detail}</p>
                            <p className="mt-2 text-[7px] uppercase tracking-[0.12em] text-[#A0958A]">{event.actorName} · {formatDate(event.createdAt)}</p>
                          </div>
                        ))}
                    </div>
                  </DetailCard>
                </div>
              ) : null}

              {detailTab === "payment" ? (
                <div className="space-y-4">
                  <section className="relative overflow-hidden rounded-[27px] bg-[#191715] p-5 text-white sm:p-6">
                    <div className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full bg-[#7655E8]/20 blur-[70px]" />
                    <div className="relative flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#DDB777]">Payment truth</p>
                        <p className="mt-3 font-[var(--font-heading)] text-4xl">{formatCurrency(selectedOrder.amountReceived)}</p>
                        <p className="mt-2 text-[9px] text-white/45">of {formatCurrency(selectedOrder.total)} received</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/10 text-[#E3BD7D]">
                        {(() => { const Icon = paymentIcon(selectedOrder.paymentMethod); return <Icon size={20} />; })()}
                      </div>
                    </div>
                    <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#C8924E] to-[#F1D69A]" style={{ width: `${Math.min(100, selectedOrder.total ? (selectedOrder.amountReceived / selectedOrder.total) * 100 : 0)}%` }} />
                    </div>
                  </section>

                  <DetailCard eyebrow="Payment record" title={selectedOrder.paymentMethod} icon={CreditCard}>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <InfoLine label="Payment status" value={selectedOrder.paymentStatus} />
                      <InfoLine label="Provider" value={selectedOrder.paymentProvider || "Not connected"} />
                      <InfoLine label="Transaction ID" value={selectedOrder.transactionId || "Not generated"} />
                      <InfoLine label="Payment date" value={selectedOrder.paidAt ? formatDate(selectedOrder.paidAt) : "Not received"} />
                      <InfoLine label="Refunded" value={formatCurrency(selectedOrder.refundAmount)} />
                      <InfoLine label="Verification" value={selectedOrder.paymentVerified ? "Verified" : "Awaiting verification"} />
                    </div>
                  </DetailCard>

                  {selectedOrder.paymentMethod === "Cash on Delivery" ? (
                    <DetailCard eyebrow="COD desk" title="Collection control" icon={Banknote}>
                      <p className="mt-4 text-[10px] leading-5 text-[#776D64]">Confirm cash only after the delivery partner reports successful collection. The action is recorded in the order timeline.</p>
                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => void toggleCodCollection(false)} disabled={pendingAction === "cod" || selectedOrder.paymentStatus === "COD Collection Pending"} className="h-11 rounded-[16px] border border-[#DCCFC2] bg-white text-[8px] font-semibold uppercase tracking-[0.14em] text-[#6F645A] disabled:opacity-35">Mark pending</button>
                        <button type="button" onClick={() => void toggleCodCollection(true)} disabled={pendingAction === "cod" || selectedOrder.paymentStatus === "COD Received"} className="h-11 rounded-[16px] bg-[#176C53] text-[8px] font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-35">Confirm received</button>
                      </div>
                    </DetailCard>
                  ) : (
                    <DetailCard eyebrow="Gateway boundary" title="Server verification only" icon={ShieldCheck}>
                      <div className="mt-4 rounded-[18px] border border-[#D8C9B7] bg-[#F7EDE0] p-4 text-[9px] leading-5 text-[#745737]">
                        Online payment cannot be marked Received from this browser. When a real gateway is connected, its secure webhook will update the verified amount, transaction ID and payment state automatically.
                      </div>
                      <div className="mt-4 flex items-center justify-between rounded-[18px] border border-[#E0D7CE] bg-white/70 p-4">
                        <span>
                          <span className="block text-[8px] font-semibold uppercase tracking-[0.17em] text-[#93887E]">Current mode</span>
                          <span className="mt-1 block text-[10px] font-semibold">{PAYMENT_MODE === "live" ? "Live gateway" : "Safe project mode"}</span>
                        </span>
                        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${PAYMENT_MODE === "live" ? "bg-[#E6F7EF] text-[#176C53]" : "bg-[#EEE8E1] text-[#86786B]"}`}>
                          <ShieldCheck size={17} />
                        </span>
                      </div>
                    </DetailCard>
                  )}
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8F84]" size={12} />
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full appearance-none rounded-2xl border border-[#DDD3C9] bg-[#FBF8F5] pl-8 pr-8 text-[8px] font-semibold uppercase tracking-[0.1em] text-[#6B6259] outline-none transition focus:border-[#A87943] focus:bg-white">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8F84]" size={12} />
    </label>
  );
}

function DetailCard({
  eyebrow,
  title,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: typeof FileText;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[27px] border border-white/85 bg-white/75 p-5 shadow-[0_18px_45px_rgba(58,43,31,.06)] sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] bg-[#F0E6D9] text-[#966536]">
          <Icon size={17} />
        </div>
        <div className="min-w-0">
          <p className="text-[7px] font-semibold uppercase tracking-[0.22em] text-[#A3723C]">{eyebrow}</p>
          <h3 className="mt-1 truncate font-[var(--font-heading)] text-2xl">{title}</h3>
        </div>
      </div>
      {children}
    </section>
  );
}

function InfoLine({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Phone;
}) {
  return (
    <div className="rounded-[17px] border border-[#E4DBD2] bg-[#FBF8F4] p-3.5">
      <p className="flex items-center gap-1.5 text-[7px] font-semibold uppercase tracking-[0.15em] text-[#9B9085]">
        {Icon ? <Icon size={11} /> : null}
        {label}
      </p>
      <p className="mt-2 break-words text-[10px] font-medium text-[#39332E]">{value}</p>
    </div>
  );
}

function PriceLine({
  label,
  value,
  strong = false,
  muted = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between ${strong ? "mt-3 border-t border-[#E2D8CF] pt-4 font-semibold" : ""}`}>
      <span className={muted ? "text-[#8B8177]" : "text-[#625A53]"}>{label}</span>
      <span className={muted ? "text-[#A36C35]" : "text-[#211E1B]"}>{value < 0 ? `−${formatCurrency(Math.abs(value))}` : formatCurrency(value)}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label>
      <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#887D73]">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-12 w-full rounded-[17px] border border-[#DCD1C7] bg-[#FBF8F4] px-4 text-[10px] outline-none focus:border-[#A87943] focus:ring-4 focus:ring-[#A87943]/10" />
    </label>
  );
}
