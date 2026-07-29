"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  IndianRupee,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
  WalletCards,
  Gift,
} from "lucide-react";

import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import {
  CART_STORAGE_KEY,
  CART_UPDATED_EVENT,
  ORDERS_STORAGE_KEY,
  ORDERS_UPDATED_EVENT,
} from "@/lib/storefront-storage";
import { placeCloudOrder, subscribeToUserOrders } from "@/services/order.service";
import { findCouponCampaign, subscribeToDiscountCampaigns } from "@/services/discount.service";
import { chooseBestPromotion, evaluatePromotion, normalizeCouponCode } from "@/lib/promotion-engine";
import type { CloudOrder } from "@/types/commerce";
import type { AppliedPromotion, DiscountCampaign, PromotionContext } from "@/types/discount";

type CartItem = {
  id: string;
  productDocumentId: string;
  variantId: string;
  sku: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  size: string;
  color: string;
  category: string;
};

type PaymentMethod = "UPI" | "Card" | "Wallet" | "Cash on Delivery";
type DeliveryMethod = "standard" | "express";

type CheckoutFields = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
};

const FREE_DELIVERY_AMOUNT = 10000;
const DELIVERY_CHARGE = 299;
const EMPTY_CART_SNAPSHOT = "[]";

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

function toLabel(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const option = value as Record<string, unknown>;
  const label = option.name ?? option.label ?? option.value;
  return typeof label === "string" ? label : "";
}

function getImageSource(item: Record<string, unknown>) {
  const directImage = item.image ?? item.imageUrl ?? item.thumbnail;

  if (typeof directImage === "string") {
    return directImage;
  }

  if (!Array.isArray(item.images) || item.images.length === 0) {
    return "";
  }

  const firstImage = item.images[0];

  if (typeof firstImage === "string") {
    return firstImage;
  }

  if (!firstImage || typeof firstImage !== "object") {
    return "";
  }

  const image = firstImage as Record<string, unknown>;
  const imageSource = image.url ?? image.src;
  return typeof imageSource === "string" ? imageSource : "";
}

function parseCart(snapshot: string): CartItem[] {
  try {
    const parsedCart: unknown = JSON.parse(snapshot);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.flatMap((rawItem) => {
      if (!rawItem || typeof rawItem !== "object") {
        return [];
      }

      const item = rawItem as Record<string, unknown>;
      const rawId = item.id ?? item.productId ?? item.slug;
      const rawName = item.name ?? item.title ?? item.productName;

      if (rawId == null || typeof rawName !== "string") {
        return [];
      }

      const price = toNumber(
        item.price ?? item.salePrice ?? item.discountedPrice
      );
      const originalPrice = toNumber(
        item.originalPrice ?? item.oldPrice ?? item.mrp,
        price
      );
      const quantity = Math.max(
        1,
        Math.min(10, Math.floor(toNumber(item.quantity, 1)))
      );

      return [
        {
          id: String(rawId),
          productDocumentId: String(
            item.productDocumentId ??
              item.productId ??
              rawId
          ),
          variantId: String(
            item.variantId ?? ""
          ),
          sku: String(item.sku ?? ""),
          name: rawName,
          image: getImageSource(item),
          price,
          originalPrice: originalPrice || price,
          quantity,
          size: toLabel(item.size ?? item.selectedSize),
          color: toLabel(item.color ?? item.selectedColor),
          category: String(item.category ?? "").toUpperCase(),
        },
      ];
    });
  } catch {
    return [];
  }
}

function getCartSnapshot() {
  return (
    window.localStorage.getItem(CART_STORAGE_KEY) ??
    EMPTY_CART_SNAPSHOT
  );
}

function subscribeToCart(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === CART_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener("styloverse-cart-updated", onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(
      "styloverse-cart-updated",
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

function readStoredOrders(): unknown[] {
  try {
    const rawOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!rawOrders) {
      return [];
    }

    const parsedOrders: unknown = JSON.parse(rawOrders);
    return Array.isArray(parsedOrders) ? parsedOrders : [];
  } catch {
    return [];
  }
}

const fieldClassName =
  "h-14 w-full rounded-2xl border border-[#DED6CE] bg-white px-5 text-sm font-medium text-[#171717] outline-none transition focus:border-[#5B3DF5] focus:ring-4 focus:ring-[#5B3DF5]/10";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const cartSnapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    () => EMPTY_CART_SNAPSHOT
  );

  const cartItems = useMemo(
    () => parseCart(cartSnapshot),
    [cartSnapshot]
  );

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("UPI");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [giftWrap, setGiftWrap] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [campaigns, setCampaigns] = useState<DiscountCampaign[]>([]);
  const [previousOrders, setPreviousOrders] = useState<CloudOrder[]>([]);
  const [manualPromotion, setManualPromotion] = useState<AppliedPromotion | null>(null);
  const [fields, setFields] = useState<CheckoutFields>({
    fullName:
      profile?.displayName ??
      user?.displayName ??
      "",
    email: user?.email ?? "",
    phone:
      (
        profile?.phoneNumber ??
        user?.phoneNumber
      )?.replace(/^\+91/, "") ?? "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const savings = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          Math.max(0, item.originalPrice - item.price) * item.quantity,
        0
      ),
    [cartItems]
  );

  useEffect(() => subscribeToDiscountCampaigns(setCampaigns, () => setCampaigns([])), []);
  useEffect(() => {
    if (!user) return;
    try {
      const saved = window.localStorage.getItem(`styloverse-checkout-address:${user.uid}`);
      if (saved) window.setTimeout(() => setFields((current) => ({ ...current, ...(JSON.parse(saved) as Partial<CheckoutFields>), email: user.email ?? current.email })), 0);
    } catch { /* Invalid local preference is ignored safely. */ }
  }, [user]);
  useEffect(() => {
    if (!user) return;
    return subscribeToUserOrders(user.uid, setPreviousOrders, () => setPreviousOrders([]));
  }, [user]);

  const promotionContext: PromotionContext = useMemo(() => ({
    items: cartItems.map((item) => ({ productId: item.productDocumentId || item.id, category: item.category, price: item.price, quantity: item.quantity })),
    subtotal,
    customerId: user?.uid ?? "guest",
    membershipPlan: profile?.subscriptionPlan === "prive" ? "prive" : "free",
    previousOrderCount: previousOrders.length,
    customerUsageCount: 0,
  }), [cartItems, previousOrders.length, profile?.subscriptionPlan, subtotal, user?.uid]);

  const automaticPromotion = useMemo(() => chooseBestPromotion(campaigns, promotionContext), [campaigns, promotionContext]);
  const appliedPromotion = manualPromotion ?? automaticPromotion;

  const baseDeliveryCharge =
    subtotal === 0 || subtotal >= FREE_DELIVERY_AMOUNT
      ? 0
      : DELIVERY_CHARGE;
  const deliveryCharge = baseDeliveryCharge + (deliveryMethod === "express" ? 399 : 0);
  const giftWrapCharge = giftWrap ? 499 : 0;
  const discountAmount = appliedPromotion?.amount ?? 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryCharge + giftWrapCharge);

  async function applyCoupon() {
    setCouponMessage("");
    const code = normalizeCouponCode(couponCode);
    if (!code) { setCouponMessage("Enter a valid private offer code."); return; }
    try {
      const campaign = await findCouponCampaign(code);
      if (!campaign || campaign.automatic) { setManualPromotion(null); setCouponMessage("This offer code is not available."); return; }
      const customerUsageCount = previousOrders.filter((order) => {
        const promotion = order.appliedPromotion;
        return promotion && typeof promotion === "object" && String((promotion as Record<string, unknown>).campaignId) === campaign.id;
      }).length;
      const result = evaluatePromotion(campaign, { ...promotionContext, customerUsageCount });
      if (!result.valid) { setManualPromotion(null); setCouponMessage(result.reason); return; }
      setManualPromotion(result.promotion);
      setCouponMessage(`${result.promotion.name} applied successfully.`);
    } catch { setCouponMessage("Offer could not be verified. Please try again."); }
  }

  function updateField(field: keyof CheckoutFields, value: string) {
    setFields((currentFields) => ({
      ...currentFields,
      [field]: value,
    }));
    setErrorMessage("");
  }

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPlacingOrder) return;
    setErrorMessage("");

    if (!user) {
      router.replace(
        "/auth/checkout?mode=login&redirect=%2Fcheckout"
      );
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage("Your shopping bag is empty.");
      return;
    }

    if (!/^\d{10}$/.test(fields.phone)) {
      setErrorMessage("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(fields.pincode)) {
      setErrorMessage("Enter a valid 6-digit pincode.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const createdAt = new Date();
      const estimatedDelivery = new Date(createdAt);
      estimatedDelivery.setDate(estimatedDelivery.getDate() + (deliveryMethod === "express" ? 3 : 6));

      const nextOrderId = `STY-${createdAt
        .getTime()
        .toString(36)
        .toUpperCase()}`;
      const initialPaymentStatus =
        paymentMethod === "Cash on Delivery"
          ? "COD Collection Pending"
          : "Pending";
      const customerName = fields.fullName.trim();
      const customerActorName =
        customerName || user.displayName || "Styloverse client";

      const order: CloudOrder = {
        id: nextOrderId,
        userId: user.uid,
        userEmail: user.email ?? fields.email,
        createdAt: createdAt.toISOString(),
        estimatedDelivery: estimatedDelivery.toISOString(),
        status: "Confirmed",
        paymentMethod,
        paymentStatus: initialPaymentStatus,
        commerceMode:
          process.env.NEXT_PUBLIC_COMMERCE_MODE ?? "demo",
        paymentMode:
          process.env.NEXT_PUBLIC_PAYMENT_MODE ?? "disabled",
        items: cartItems,
        customer: {
          fullName: fields.fullName,
          email: fields.email,
          phone: fields.phone,
        },
        shippingAddress: {
          addressLine1: fields.addressLine1,
          addressLine2: fields.addressLine2,
          landmark: fields.landmark,
          city: fields.city,
          state: fields.state,
          pincode: fields.pincode,
          country: "India",
        },
        deliveryMethod,
        giftWrap: { selected: giftWrap, charge: giftWrapCharge, message: giftWrap ? "Presented in Styloverse signature packaging." : "" },
        pricing: {
          subtotal,
          savings,
          discountAmount,
          deliveryCharge,
          giftWrapCharge,
          total,
        },
        appliedPromotion,
        payment: {
          method: paymentMethod,
          status: initialPaymentStatus,
          provider: "Demo checkout",
          transactionId: "",
          amountReceived: 0,
          paidAt: "",
          refundAmount: 0,
          refundReference: "",
          verified: false,
          verificationSource:
            paymentMethod === "Cash on Delivery"
              ? "pending_collection"
              : "awaiting_secure_gateway",
          verifiedAt: "",
        },
        timeline: [
          {
            id: `event-${createdAt.getTime()}-created`,
            label: "Order placed",
            detail: "Customer order entered the Styloverse system.",
            createdAt: createdAt.toISOString(),
            actorName: customerActorName,
            actorRole: "customer",
          },
        ],
        statusHistory: [],
        auditTrail: [
          {
            id: `audit-${createdAt.getTime()}-created`,
            action: "order_created",
            detail: `Order created with ${paymentMethod}.`,
            createdAt: createdAt.toISOString(),
            actorUid: user.uid,
            actorName: customerActorName,
          },
        ],
        lastActionByUid: user.uid,
        lastActionByName: customerActorName,
        lastActionAt: createdAt.toISOString(),
      };

      await placeCloudOrder(order);

      window.localStorage.setItem(`styloverse-checkout-address:${user.uid}`, JSON.stringify(fields));

      window.localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify([order, ...readStoredOrders()])
      );
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(
        new Event(ORDERS_UPDATED_EVENT)
      );
      window.dispatchEvent(
        new Event(CART_UPDATED_EVENT)
      );
      setOrderId(nextOrderId);
    } catch (error) {
      console.error("Unable to place order:", error);
      setErrorMessage(
        "We could not securely save your order. Check your connection and try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  }

  if (orderId) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-[#FFF8F2] px-5 py-32">
          <section className="w-full max-w-xl rounded-[38px] border border-[#E6DED5] bg-white p-9 text-center shadow-[0_30px_90px_rgba(45,32,20,0.10)] sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-700">
              <PackageCheck size={38} />
            </div>
            <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A67C52]">
              Order Confirmed
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#171717]">
              Thank you for shopping with us.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#746D67]">
              Your order <strong>{orderId}</strong> has been placed and is
              now being prepared.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/orders"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-[#5B3DF5] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#4930D8]"
              >
                View Orders <ArrowRight size={16} />
              </Link>
              <Link
                href="/shop"
                className="inline-flex min-h-13 items-center justify-center rounded-2xl border border-[#DCD4CC] px-7 py-4 text-sm font-semibold text-[#302D2A] transition hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
              >
                Continue Shopping
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F4EFE9] px-3.5 pb-28 pt-[112px] md:bg-[#FFF8F2] md:px-8 md:pb-24 md:pt-36 lg:pt-40">
        <form
          onSubmit={placeOrder}
          className="mx-auto grid max-w-[1380px] gap-8 lg:grid-cols-[minmax(0,1fr)_410px]"
        >
          <section>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#6F6862] transition hover:text-[#5B3DF5]"
            >
              <ArrowLeft size={16} /> Back to Bag
            </Link>

            <div className="mt-6 border-b border-[#E7DED5] pb-6 md:mt-8 md:pb-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A67C52]">
                Secure Checkout
              </p>
              <h1 className="mt-3 text-[34px] font-semibold leading-[1.02] tracking-[-0.045em] text-[#171717] md:text-4xl sm:text-5xl">
                Delivery and payment
              </h1>
              <p className="mt-4 text-sm leading-7 text-[#746D67]">
                Complete your delivery details and review your order.
              </p>
            </div>

            <div className="mt-6 rounded-[26px] border border-[#E8E0D7] bg-white p-5 shadow-[0_18px_55px_rgba(45,32,20,0.05)] md:rounded-[32px] sm:p-8">
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0ECFF] text-[#5B3DF5]"><Truck size={21}/></span><div><p className="font-semibold text-[#171717]">Delivery experience</p><p className="mt-1 text-xs text-[#817A73]">Choose the pace and presentation.</p></div></div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">{([['standard','Complimentary / standard','4–6 business days'],['express','Private express','2–3 business days · ₹399']] as const).map(([value,label,detail])=><button key={value} type="button" onClick={()=>setDeliveryMethod(value)} aria-pressed={deliveryMethod===value} className={`min-h-24 rounded-2xl border p-4 text-left transition ${deliveryMethod===value?'border-[#5B3DF5] bg-[#F3F0FF]':'border-[#E2DAD2]'}`}><p className="text-sm font-semibold">{label}</p><p className="mt-2 text-xs text-[#817A73]">{detail}</p></button>)}</div>
              <button type="button" onClick={()=>setGiftWrap((current)=>!current)} aria-pressed={giftWrap} className={`mt-3 flex min-h-20 w-full items-center justify-between rounded-2xl border p-4 text-left ${giftWrap?'border-[#B98A4E] bg-[#FFF8EC]':'border-[#E2DAD2]'}`}><span className="flex items-center gap-3"><Gift size={20} className="text-[#A67C52]"/><span><span className="block text-sm font-semibold">Styloverse signature gift presentation</span><span className="mt-1 block text-xs text-[#817A73]">Luxury wrapping and considered unboxing · ₹499</span></span></span><span className={`flex h-6 w-6 items-center justify-center rounded-full border ${giftWrap?'border-[#5B3DF5] bg-[#5B3DF5] text-white':'border-[#CFC5BC]'}`}>{giftWrap&&<Check size={13}/>}</span></button>
            </div>

            <div className="mt-6 rounded-[26px] border border-[#E8E0D7] bg-white p-5 shadow-[0_18px_55px_rgba(45,32,20,0.05)] md:mt-8 md:rounded-[32px] md:p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0ECFF] text-[#5B3DF5]">
                  <MapPin size={21} />
                </span>
                <div>
                  <p className="font-semibold text-[#171717]">
                    Delivery address
                  </p>
                  <p className="mt-1 text-xs text-[#817A73]">
                    We will deliver your order to this address.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <input
                  required
                  value={fields.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  placeholder="Full name"
                  autoComplete="name"
                  className={fieldClassName}
                />
                <input
                  required
                  type="email"
                  value={fields.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  placeholder="Email address"
                  autoComplete="email"
                  className={fieldClassName}
                />
                <input
                  required
                  value={fields.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="Mobile number"
                  inputMode="numeric"
                  autoComplete="tel"
                  className={fieldClassName}
                />
                <input
                  required
                  value={fields.pincode}
                  onChange={(event) =>
                    updateField(
                      "pincode",
                      event.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  placeholder="Pincode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  className={fieldClassName}
                />
                <input
                  required
                  value={fields.addressLine1}
                  onChange={(event) =>
                    updateField("addressLine1", event.target.value)
                  }
                  placeholder="House number and street"
                  autoComplete="address-line1"
                  className={`${fieldClassName} sm:col-span-2`}
                />
                <input
                  value={fields.addressLine2}
                  onChange={(event) =>
                    updateField("addressLine2", event.target.value)
                  }
                  placeholder="Apartment, area or locality (optional)"
                  autoComplete="address-line2"
                  className={`${fieldClassName} sm:col-span-2`}
                />
                <input
                  value={fields.landmark}
                  onChange={(event) =>
                    updateField("landmark", event.target.value)
                  }
                  placeholder="Landmark (optional)"
                  className={fieldClassName}
                />
                <input
                  required
                  value={fields.city}
                  onChange={(event) =>
                    updateField("city", event.target.value)
                  }
                  placeholder="City"
                  autoComplete="address-level2"
                  className={fieldClassName}
                />
                <input
                  required
                  value={fields.state}
                  onChange={(event) =>
                    updateField("state", event.target.value)
                  }
                  placeholder="State"
                  autoComplete="address-level1"
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="mt-6 rounded-[26px] border border-[#E8E0D7] bg-white p-5 shadow-[0_18px_55px_rgba(45,32,20,0.05)] md:mt-8 md:rounded-[32px] md:p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0ECFF] text-[#5B3DF5]">
                  <CreditCard size={21} />
                </span>
                <div>
                  <p className="font-semibold text-[#171717]">
                    Payment method
                  </p>
                  <p className="mt-1 text-xs text-[#817A73]">
                    Choose how you would like to pay.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(
                  [
                    ["UPI", Smartphone],
                    ["Card", CreditCard],
                    ["Wallet", WalletCards],
                    ["Cash on Delivery", IndianRupee],
                  ] as const
                ).map(([method, Icon]) => {
                  const selected = paymentMethod === method;

                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      aria-pressed={selected}
                      className={`flex min-h-28 flex-col items-start justify-between rounded-2xl border p-5 text-left transition ${
                        selected
                          ? "border-[#5B3DF5] bg-[#F3F0FF] text-[#5B3DF5]"
                          : "border-[#E2DAD2] bg-white text-[#5F5852] hover:border-[#9E8EFA]"
                      }`}
                    >
                      <Icon size={21} />
                      <span className="text-sm font-semibold">{method}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="lg:pt-[120px]">
            <div className="sticky top-32 rounded-[26px] border border-[#E8E0D7] bg-white p-5 shadow-[0_22px_70px_rgba(45,32,20,0.08)] md:rounded-[32px] md:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={20} className="text-[#5B3DF5]" />
                  <h2 className="font-semibold text-[#171717]">
                    Order summary
                  </h2>
                </div>
                <span className="rounded-full bg-[#F2EEFF] px-3 py-1 text-xs font-semibold text-[#5B3DF5]">
                  {cartItems.reduce(
                    (count, item) => count + item.quantity,
                    0
                  )}{" "}
                  items
                </span>
              </div>

              {cartItems.length === 0 ? (
                <div className="mt-7 rounded-2xl border border-dashed border-[#DCD4CC] p-6 text-center">
                  <p className="text-sm font-semibold text-[#302D2A]">
                    Your shopping bag is empty.
                  </p>
                  <Link
                    href="/shop"
                    className="mt-4 inline-flex text-sm font-semibold text-[#5B3DF5]"
                  >
                    Browse products
                  </Link>
                </div>
              ) : (
                <div className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="rounded-2xl border border-[#EEE7DF] bg-[#FCFAF8] p-4"
                    >
                      <div className="flex justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#25211E]">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-[#817A73]">
                            Qty {item.quantity}
                            {item.size ? ` · Size ${item.size}` : ""}
                            {item.color ? ` · ${item.color}` : ""}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-[#171717]">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 rounded-[22px] border border-[#DED4CA] bg-[#F8F4F0] p-4">
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(event) => {
                      setCouponCode(normalizeCouponCode(event.target.value));
                      setCouponMessage("");
                    }}
                    placeholder="PRIVATE OFFER CODE"
                    aria-label="Private offer code"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-[#D8CEC4] bg-white px-4 text-[10px] font-bold uppercase tracking-[0.12em] outline-none focus:border-[#5B3DF5]"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="h-11 rounded-xl bg-[#211D1B] px-5 text-[9px] font-bold uppercase tracking-[0.12em] text-white"
                  >
                    Apply
                  </button>
                </div>
                {(couponMessage || appliedPromotion) && (
                  <p className={`mt-3 text-[10px] leading-5 ${appliedPromotion ? "text-emerald-700" : "text-[#8A5D35]"}`}>
                    {couponMessage || `${appliedPromotion?.name} applied automatically.`}
                  </p>
                )}
              </div>

              <div className="mt-7 space-y-4 border-y border-[#EEE7DF] py-6 text-sm">
                <div className="flex justify-between text-[#716A64]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#302D2A]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {giftWrap && <div className="flex justify-between text-[#716A64]"><span>Signature gift presentation</span><span className="font-semibold text-[#302D2A]">{formatCurrency(giftWrapCharge)}</span></div>}
                <div className="flex justify-between text-[#716A64]">
                  <span>Product savings</span>
                  <span className="font-semibold text-green-700">
                    −{formatCurrency(savings)}
                  </span>
                </div>
                {appliedPromotion && (
                  <div className="flex justify-between text-[#716A64]">
                    <span>{appliedPromotion.name}</span>
                    <span className="font-semibold text-emerald-700">
                      −{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#716A64]">
                  <span>Delivery</span>
                  <span className="font-semibold text-[#302D2A]">
                    {deliveryCharge === 0
                      ? "Complimentary"
                      : formatCurrency(deliveryCharge)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-xs text-[#817A73]">Total payable</p>
                  <p className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#171717]">
                    {formatCurrency(total)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-green-700">
                  <ShieldCheck size={15} /> Secure
                </div>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isPlacingOrder || cartItems.length === 0}
                className="mt-7 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#5B3DF5] px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#4930D8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  "Placing order..."
                ) : (
                  <>
                    <LockKeyhole size={17} /> Place Order
                  </>
                )}
              </button>

              <div className="mt-5 grid grid-cols-2 gap-3 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-[#746D67]">
                <div className="rounded-xl bg-[#F8F5F1] px-3 py-3">
                  <Truck size={16} className="mx-auto mb-2 text-[#5B3DF5]" />
                  Fast delivery
                </div>
                <div className="rounded-xl bg-[#F8F5F1] px-3 py-3">
                  <Check size={16} className="mx-auto mb-2 text-green-700" />
                  Easy returns
                </div>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </>
  );
}
