"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import Navbar from "@/components/Navbar/Navbar";

import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ChevronRight,
  CreditCard,
  Gift,
  Loader2,
  LockKeyhole,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X,
} from "lucide-react";

/* ============================================================================
   TYPES
============================================================================ */

type CartItem = Record<string, unknown> & {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  size: string;
  color: string;
};

const CART_STORAGE_KEY = "styloverse-cart";
const SAVED_CART_STORAGE_KEY = "styloverse-saved-for-later";
const FREE_DELIVERY_AMOUNT = 10000;
const DELIVERY_CHARGE = 299;

/* ============================================================================
   HELPERS
============================================================================ */

function convertToNumber(
  value: unknown,
  fallback = 0
) {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : fallback;
  }

  if (typeof value === "string") {
    const parsedValue = Number(
      value.replace(/[^\d.-]/g, "")
    );

    return Number.isFinite(parsedValue)
      ? parsedValue
      : fallback;
  }

  return fallback;
}

function getOptionLabel(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const option = value as Record<
      string,
      unknown
    >;

    if (
      typeof option.name === "string"
    ) {
      return option.name;
    }

    if (
      typeof option.label === "string"
    ) {
      return option.label;
    }

    if (
      typeof option.value === "string"
    ) {
      return option.value;
    }
  }

  return "";
}

function getImageSource(
  item: Record<string, unknown>
) {
  if (
    typeof item.image === "string"
  ) {
    return item.image;
  }

  if (
    typeof item.imageUrl === "string"
  ) {
    return item.imageUrl;
  }

  if (
    typeof item.thumbnail === "string"
  ) {
    return item.thumbnail;
  }

  if (
    Array.isArray(item.images) &&
    item.images.length > 0
  ) {
    const firstImage = item.images[0];

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
        firstImage as Record<
          string,
          unknown
        >;

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

function normalizeCartItem(
  rawItem: unknown,
  index: number
): CartItem | null {
  if (
    !rawItem ||
    typeof rawItem !== "object"
  ) {
    return null;
  }

  const item =
    rawItem as Record<string, unknown>;

  const id = String(
    item.id ??
      item.productId ??
      item.slug ??
      `cart-item-${index}`
  );

  const name = String(
    item.name ??
      item.title ??
      item.productName ??
      "Styloverse Product"
  );

  const price = convertToNumber(
    item.price ??
      item.salePrice ??
      item.discountedPrice
  );

  const originalPrice =
    convertToNumber(
      item.originalPrice ??
        item.oldPrice ??
        item.compareAtPrice ??
        item.mrp,
      price
    ) || price;

  const quantity = Math.max(
    1,
    Math.min(
      10,
      Math.floor(
        convertToNumber(
          item.quantity,
          1
        )
      )
    )
  );

  return {
    ...item,
    id,
    name,
    image: getImageSource(item),
    price,
    originalPrice,
    quantity,
    size: getOptionLabel(
      item.size ??
        item.selectedSize
    ),
    color: getOptionLabel(
      item.color ??
        item.selectedColor
    ),
  };
}

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

function dispatchCartUpdate() {
  window.dispatchEvent(
    new Event(
      "styloverse-cart-updated"
    )
  );
}

/* ============================================================================
   CART PAGE
============================================================================ */

export default function CartPage() {
  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    itemBeingRemoved,
    setItemBeingRemoved,
  ] = useState<number | null>(null);

  const [
    showCheckoutNotice,
    setShowCheckoutNotice,
  ] = useState(false);

  /* ==========================================================================
     LOAD CART
  ========================================================================== */

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart =
          window.localStorage.getItem(
            CART_STORAGE_KEY
          );

        if (!savedCart) {
          setCartItems([]);
          return;
        }

        const parsedCart: unknown =
          JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
          setCartItems([]);
          return;
        }

        const normalizedCart =
          parsedCart
            .map(normalizeCartItem)
            .filter(
              (
                item
              ): item is CartItem =>
                item !== null
            );

        setCartItems(normalizedCart);
        const rawSaved = window.localStorage.getItem(SAVED_CART_STORAGE_KEY);
        if (rawSaved) {
          const parsedSaved: unknown = JSON.parse(rawSaved);
          if (Array.isArray(parsedSaved)) setSavedItems(parsedSaved.map(normalizeCartItem).filter((item): item is CartItem => item !== null));
        }
      } catch (error) {
        console.error(
          "Unable to load cart:",
          error
        );

        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    const loadTimer =
      window.setTimeout(
        loadCart,
        0
      );

    return () => {
      window.clearTimeout(
        loadTimer
      );
    };
  }, []);

  /* ==========================================================================
     SAVE CART
  ========================================================================== */

  const saveCart = (
    updatedCart: CartItem[]
  ) => {
    setCartItems(updatedCart);

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(updatedCart)
    );

    dispatchCartUpdate();
  };

  /* ==========================================================================
     CALCULATIONS
  ========================================================================== */

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const productDiscount =
    useMemo(() => {
      return cartItems.reduce(
        (total, item) => {
          const discountPerItem =
            Math.max(
              0,
              item.originalPrice -
                item.price
            );

          return (
            total +
            discountPerItem *
              item.quantity
          );
        },
        0
      );
    }, [cartItems]);

  const deliveryCharge =
    subtotal === 0 ||
    subtotal >=
      FREE_DELIVERY_AMOUNT
      ? 0
      : DELIVERY_CHARGE;

  const grandTotal =
    subtotal + deliveryCharge;

  const amountForFreeDelivery =
    Math.max(
      0,
      FREE_DELIVERY_AMOUNT -
        subtotal
    );

  const deliveryProgress =
    Math.min(
      100,
      (subtotal /
        FREE_DELIVERY_AMOUNT) *
        100
    );

  /* ==========================================================================
     QUANTITY
  ========================================================================== */

  const updateQuantity = (
    itemIndex: number,
    nextQuantity: number
  ) => {
    const safeQuantity = Math.max(
      1,
      Math.min(10, nextQuantity)
    );

    const updatedCart =
      cartItems.map(
        (item, index) =>
          index === itemIndex
            ? {
                ...item,
                quantity:
                  safeQuantity,
              }
            : item
      );

    saveCart(updatedCart);
  };

  /* ==========================================================================
     REMOVE ITEM
  ========================================================================== */

  const removeItem = (
    itemIndex: number
  ) => {
    setItemBeingRemoved(itemIndex);

    window.setTimeout(() => {
      const updatedCart =
        cartItems.filter(
          (_, index) =>
            index !== itemIndex
        );

      saveCart(updatedCart);
      setItemBeingRemoved(null);
    }, 220);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const saveForLater = (itemIndex: number) => {
    const item = cartItems[itemIndex];
    if (!item) return;
    const nextSaved = [...savedItems.filter((saved) => !(saved.id === item.id && saved.size === item.size && saved.color === item.color)), item];
    setSavedItems(nextSaved);
    window.localStorage.setItem(SAVED_CART_STORAGE_KEY, JSON.stringify(nextSaved));
    saveCart(cartItems.filter((_, index) => index !== itemIndex));
  };

  const moveToBag = (itemIndex: number) => {
    const item = savedItems[itemIndex];
    if (!item) return;
    const nextSaved = savedItems.filter((_, index) => index !== itemIndex);
    setSavedItems(nextSaved);
    window.localStorage.setItem(SAVED_CART_STORAGE_KEY, JSON.stringify(nextSaved));
    saveCart([...cartItems, item]);
  };

  /* ==========================================================================
     LOADING SCREEN
  ========================================================================== */

  if (isLoading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#FFF8F2] px-6 pt-32">
          <div className="flex flex-col items-center gap-5">
            <Loader2
              size={34}
              className="animate-spin text-[#5B3DF5]"
            />

            <p className="text-sm font-medium text-[#756D66]">
              Preparing your shopping
              bag...
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F4EFE9] px-3.5 pb-28 pt-[112px] md:bg-[#FFF8F2] md:px-8 md:pb-24 md:pt-36 lg:pt-40">
        <section className="mx-auto max-w-[1450px]">
          {/* ================================================================
              PAGE HEADER
          ================================================================ */}

          <div className="flex flex-col justify-between gap-4 border-b border-[#E7DED5] pb-6 md:gap-7 md:pb-9 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-[#A67C52]">
                <ShoppingBag
                  size={16}
                />

                <p className="text-[10px] font-semibold uppercase tracking-[0.32em]">
                  Styloverse Shopping Bag
                </p>
              </div>

              <h1 className="mt-3 font-[var(--font-heading)] text-[38px] font-medium leading-none tracking-[-0.04em] text-[#171717] md:mt-4 md:text-5xl lg:text-6xl">
                Your Cart
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#746D67]">
                {totalItems === 0
                  ? "Your curated selection is currently empty."
                  : `${totalItems} ${
                      totalItems === 1
                        ? "item"
                        : "items"
                    } in your shopping bag.`}
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
              EMPTY CART
          ================================================================ */}

          {cartItems.length === 0 ? (
            <>
            <div className="mt-8 overflow-hidden rounded-[28px] border border-[#E9E1D8] bg-white shadow-[0_25px_80px_rgba(45,32,20,0.08)] md:mt-12 md:rounded-[40px]">
              <div className="px-5 py-12 text-center md:px-12 md:py-16 lg:py-24">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[25px] bg-[#EEE9FF] text-[#5B3DF5] md:h-24 md:w-24 md:rounded-[32px]">
                  <ShoppingBag
                    size={40}
                    strokeWidth={1.5}
                  />
                </div>

                <p className="mt-9 text-xs font-semibold uppercase tracking-[0.35em] text-[#A67C52]">
                  Your Shopping Bag
                </p>

                <h2 className="mt-4 font-[var(--font-heading)] text-[34px] font-medium tracking-[-0.04em] text-[#171717] md:text-5xl">
                  Your cart is empty
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#746D67]">
                  Discover our curated
                  collections and add your
                  favourite pieces to your
                  Styloverse shopping bag.
                </p>

                <Link
                  href="/shop"
                  className="group mt-9 inline-flex items-center gap-3 rounded-2xl bg-[#171717] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#5B3DF5]"
                >
                  Explore Collection

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <div className="grid gap-px border-t border-[#EEE7DF] bg-[#EEE7DF] md:grid-cols-3">
                <div className="flex items-center gap-4 bg-[#FAF7F3] p-6">
                  <Truck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Free Delivery
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Above ₹10,000
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#FAF7F3] p-6">
                  <ShieldCheck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Secure Checkout
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Protected purchases
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#FAF7F3] p-6">
                  <PackageCheck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Easy Returns
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Hassle-free process
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {savedItems.length > 0 && <section className="mt-5 overflow-hidden rounded-[26px] border border-[#E9E1D8] bg-white shadow-[0_20px_60px_rgba(45,32,20,0.06)] md:mt-8 md:rounded-[32px]">
              <div className="border-b border-[#EEE7DF] px-6 py-5"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#A67C52]">Private shortlist</p><h2 className="mt-1 font-heading text-3xl">Saved for later</h2></div>
              <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">{savedItems.map((item,index)=><article key={`${item.id}-${item.size}-${index}`} className="flex gap-3 rounded-2xl bg-[#F8F4F0] p-3"><div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#EEE7E0]">{item.image && <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover"/>}</div><div className="min-w-0"><h3 className="font-heading text-lg leading-tight">{item.name}</h3><p className="mt-1 text-[9px] text-[#80756D]">{item.size || "One size"} · {formatCurrency(item.price)}</p><button type="button" onClick={()=>moveToBag(index)} className="mt-3 rounded-full bg-[#1B1816] px-4 py-2 text-[7px] font-bold uppercase tracking-[.12em] text-white">Move to bag</button></div></article>)}</div>
            </section>}
            </>
          ) : (
            <>
              {/* ============================================================
                  FREE DELIVERY PROGRESS
              ============================================================ */}

              <div className="mt-7 rounded-[22px] border border-[#DED6FF] bg-[#F4F1FF] px-4 py-4 md:mt-9 md:rounded-[24px] md:px-6 md:py-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#5B3DF5] text-white">
                    {amountForFreeDelivery >
                    0 ? (
                      <Truck size={20} />
                    ) : (
                      <Check size={20} />
                    )}
                  </div>

                  <div className="w-full">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <p className="text-sm font-semibold text-[#171717]">
                        {amountForFreeDelivery >
                        0
                          ? `Add ${formatCurrency(
                              amountForFreeDelivery
                            )} more for complimentary delivery`
                          : "You have unlocked complimentary delivery"}
                      </p>

                      <p className="text-xs font-medium text-[#5B3DF5]">
                        {Math.round(
                          deliveryProgress
                        )}
                        % complete
                      </p>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-[#5B3DF5] transition-all duration-500"
                        style={{
                          width: `${deliveryProgress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================
                  CART GRID
              ============================================================ */}

              <div className="mt-7 grid items-start gap-5 md:mt-10 md:gap-8 xl:grid-cols-[minmax(0,1fr)_410px]">
                {/* Cart items */}

                <section className="overflow-hidden rounded-[26px] border border-[#E9E1D8] bg-white shadow-[0_20px_60px_rgba(45,32,20,0.06)] md:rounded-[32px]">
                  <div className="flex items-center justify-between border-b border-[#EEE7DF] px-6 py-5 md:px-8">
                    <div>
                      <h2 className="text-lg font-semibold text-[#171717]">
                        Shopping Bag
                      </h2>

                      <p className="mt-1 text-xs text-[#817A74]">
                        Review your selected
                        products
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={clearCart}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-red-500 transition hover:text-red-700"
                    >
                      <Trash2 size={15} />
                      Clear Cart
                    </button>
                  </div>

                  <div className="divide-y divide-[#EEE7DF]">
                    {cartItems.map(
                      (item, index) => {
                        const isRemoving =
                          itemBeingRemoved ===
                          index;

                        return (
                          <article
                            key={`${item.id}-${item.size}-${item.color}-${index}`}
                            className={`grid grid-cols-[104px_minmax(0,1fr)] gap-3.5 p-4 transition-all duration-300 md:grid-cols-[170px_minmax(0,1fr)] md:gap-6 md:p-8 ${
                              isRemoving
                                ? "-translate-x-5 opacity-0"
                                : "translate-x-0 opacity-100"
                            }`}
                          >
                            {/* Image */}

                            <Link
                              href={`/product/${item.id}`}
                              className="group relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[#F3EEE8] md:rounded-[24px]"
                            >
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="(max-width: 767px) 104px, 170px"
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#A9A19A]">
                                  <ShoppingBag
                                    size={38}
                                    strokeWidth={1.3}
                                  />
                                </div>
                              )}

                              {item.originalPrice >
                                item.price && (
                                <span className="absolute left-3 top-3 rounded-full bg-[#171717] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                                  Sale
                                </span>
                              )}
                            </Link>

                            {/* Details */}

                            <div className="flex min-w-0 flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-5">
                                  <div>
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A67C52]">
                                      Styloverse
                                    </p>

                                    <Link
                                      href={`/product/${item.id}`}
                                      className="mt-1.5 block font-[var(--font-heading)] text-[17px] font-medium leading-[1.15] text-[#171717] transition hover:text-[#5B3DF5] md:mt-2 md:text-2xl"
                                    >
                                      {item.name}
                                    </Link>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeItem(
                                        index
                                      )
                                    }
                                    aria-label={`Remove ${item.name}`}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5DDD5] text-[#746D67] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 md:h-10 md:w-10"
                                  >
                                    <X size={17} />
                                  </button>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-1.5 md:mt-5 md:gap-2">
                                  {item.size && (
                                    <span className="rounded-full bg-[#F5F1ED] px-2.5 py-1.5 text-[8px] font-medium text-[#5F5954] md:px-4 md:py-2 md:text-xs">
                                      Size:{" "}
                                      <strong className="text-[#171717]">
                                        {item.size}
                                      </strong>
                                    </span>
                                  )}
                                  <button type="button" onClick={() => saveForLater(index)} className="inline-flex items-center gap-1.5 rounded-full border border-[#DDD3C9] px-2.5 py-1.5 text-[8px] font-semibold text-[#5F5954] transition hover:border-[#5B3DF5] hover:text-[#5B3DF5] md:px-4 md:py-2 md:text-[10px]"><Bookmark size={12}/>Save for later</button>

                                  {item.color && (
                                    <span className="rounded-full bg-[#F5F1ED] px-2.5 py-1.5 text-[8px] font-medium text-[#5F5954] md:px-4 md:py-2 md:text-xs">
                                      Colour:{" "}
                                      <strong className="text-[#171717]">
                                        {item.color}
                                      </strong>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="mt-4 flex flex-col justify-between gap-3 md:mt-8 md:gap-5 sm:flex-row sm:items-end">
                                <div>
                                  <p className="text-sm font-semibold text-[#171717] md:text-xl">
                                    {formatCurrency(
                                      item.price
                                    )}
                                  </p>

                                  {item.originalPrice >
                                    item.price && (
                                    <div className="mt-1 flex items-center gap-2">
                                      <span className="text-sm text-[#99918A] line-through">
                                        {formatCurrency(
                                          item.originalPrice
                                        )}
                                      </span>

                                      <span className="text-xs font-semibold text-green-700">
                                        Save{" "}
                                        {formatCurrency(
                                          item.originalPrice -
                                            item.price
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between gap-4 sm:justify-end">
                                  <div className="flex h-10 items-center overflow-hidden rounded-full border border-[#DDD5CD] bg-white md:h-12">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateQuantity(
                                          index,
                                          item.quantity -
                                            1
                                        )
                                      }
                                      disabled={
                                        item.quantity <=
                                        1
                                      }
                                      aria-label="Decrease quantity"
                                      className="flex h-full w-9 items-center justify-center text-[#171717] transition hover:bg-[#F5F1ED] disabled:cursor-not-allowed disabled:opacity-30 md:w-11"
                                    >
                                      <Minus
                                        size={
                                          15
                                        }
                                      />
                                    </button>

                                    <span className="flex h-full min-w-10 items-center justify-center text-sm font-semibold text-[#171717]">
                                      {
                                        item.quantity
                                      }
                                    </span>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateQuantity(
                                          index,
                                          item.quantity +
                                            1
                                        )
                                      }
                                      disabled={
                                        item.quantity >=
                                        10
                                      }
                                      aria-label="Increase quantity"
                                      className="flex h-full w-9 items-center justify-center text-[#171717] transition hover:bg-[#F5F1ED] disabled:cursor-not-allowed disabled:opacity-30 md:w-11"
                                    >
                                      <Plus
                                        size={
                                          15
                                        }
                                      />
                                    </button>
                                  </div>

                                  <p className="min-w-[72px] text-right text-[10px] font-semibold text-[#5B3DF5] md:min-w-[100px] md:text-sm">
                                    {formatCurrency(
                                      item.price *
                                        item.quantity
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      }
                    )}
                  </div>
                </section>

                {savedItems.length > 0 && <section className="overflow-hidden rounded-[26px] border border-[#E9E1D8] bg-white shadow-[0_20px_60px_rgba(45,32,20,0.06)] md:rounded-[32px] xl:col-start-1">
                  <div className="border-b border-[#EEE7DF] px-6 py-5"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#A67C52]">Private shortlist</p><h2 className="mt-1 font-heading text-3xl">Saved for later</h2></div>
                  <div className="grid gap-3 p-4 sm:grid-cols-2">{savedItems.map((item,index)=><article key={`${item.id}-${item.size}-${index}`} className="flex gap-3 rounded-2xl bg-[#F8F4F0] p-3"><div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#EEE7E0]">{item.image && <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover"/>}</div><div className="min-w-0"><h3 className="font-heading text-lg leading-tight">{item.name}</h3><p className="mt-1 text-[9px] text-[#80756D]">{item.size || "One size"} · {formatCurrency(item.price)}</p><button type="button" onClick={()=>moveToBag(index)} className="mt-3 rounded-full bg-[#1B1816] px-4 py-2 text-[7px] font-bold uppercase tracking-[.12em] text-white">Move to bag</button></div></article>)}</div>
                </section>}

                {/* ==========================================================
                    ORDER SUMMARY
                ========================================================== */}

                <aside className="sticky top-36 rounded-[26px] border border-[#E9E1D8] bg-white p-5 shadow-[0_20px_60px_rgba(45,32,20,0.07)] md:rounded-[32px] md:p-7 lg:p-8 xl:col-start-2 xl:row-start-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEE9FF] text-[#5B3DF5]">
                      <CreditCard
                        size={20}
                      />
                    </span>

                    <div>
                      <h2 className="text-lg font-semibold text-[#171717]">
                        Order Summary
                      </h2>

                      <p className="mt-1 text-xs text-[#817A74]">
                        {totalItems} selected{" "}
                        {totalItems === 1
                          ? "item"
                          : "items"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 space-y-4 border-y border-[#EEE7DF] py-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#746D67]">
                        Subtotal
                      </span>

                      <span className="font-semibold text-[#171717]">
                        {formatCurrency(
                          subtotal
                        )}
                      </span>
                    </div>

                    {productDiscount >
                      0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#746D67]">
                          Product savings
                        </span>

                        <span className="font-semibold text-green-700">
                          -
                          {formatCurrency(
                            productDiscount
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#746D67]">
                        Delivery
                      </span>

                      <span
                        className={`font-semibold ${
                          deliveryCharge ===
                          0
                            ? "text-green-700"
                            : "text-[#171717]"
                        }`}
                      >
                        {deliveryCharge ===
                        0
                          ? "Complimentary"
                          : formatCurrency(
                              deliveryCharge
                            )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#746D67]">
                        Taxes
                      </span>

                      <span className="font-medium text-[#171717]">
                        Included
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between py-6">
                    <div>
                      <p className="text-sm font-medium text-[#746D67]">
                        Total
                      </p>

                      <p className="mt-1 text-xs text-[#9A928B]">
                        Inclusive of taxes
                      </p>
                    </div>

                    <p className="font-[var(--font-heading)] text-3xl font-semibold text-[#171717]">
                      {formatCurrency(
                        grandTotal
                      )}
                    </p>
                  </div>

                  <Link
  href="/checkout"
  className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#171717] px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#5B3DF5] hover:shadow-[0_18px_40px_rgba(91,61,245,0.25)]"
>
  Proceed to Checkout

  <ArrowRight
    size={18}
    className="transition-transform group-hover:translate-x-1"
  />
</Link>

                  <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-[#746D67]">
                    <LockKeyhole
                      size={15}
                      className="text-green-700"
                    />

                    Secure encrypted checkout
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#FAF7F3] p-4 text-center">
                      <Truck
                        size={20}
                        className="mx-auto text-[#5B3DF5]"
                      />

                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#171717]">
                        Fast Delivery
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#FAF7F3] p-4 text-center">
                      <ShieldCheck
                        size={20}
                        className="mx-auto text-[#5B3DF5]"
                      />

                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#171717]">
                        Buyer Protection
                      </p>
                    </div>
                  </div>
                </aside>
              </div>

              {/* ============================================================
                  SERVICES
              ============================================================ */}

              <section className="mt-8 grid gap-3 md:mt-12 md:grid-cols-3 md:gap-4">
                <div className="flex items-center gap-4 rounded-[24px] border border-[#E9E1D8] bg-white p-6">
                  <Truck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Complimentary Delivery
                    </p>

                    <p className="mt-1 text-sm text-[#817A74]">
                      On orders above ₹10,000
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-[24px] border border-[#E9E1D8] bg-white p-6">
                  <PackageCheck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Easy Returns
                    </p>

                    <p className="mt-1 text-sm text-[#817A74]">
                      Simple return experience
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-[24px] border border-[#E9E1D8] bg-white p-6">
                  <Gift className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Premium Packaging
                    </p>

                    <p className="mt-1 text-sm text-[#817A74]">
                      Crafted for every order
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </section>
      </main>

      {/* =====================================================================
          CHECKOUT NOTICE
      ===================================================================== */}

      {showCheckoutNotice && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-5 backdrop-blur-md">
          <button
            type="button"
            aria-label="Close checkout message"
            onClick={() =>
              setShowCheckoutNotice(false)
            }
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full max-w-[470px] rounded-[32px] border border-white/70 bg-white p-8 text-center shadow-[0_35px_100px_rgba(0,0,0,0.25)]">
            <button
              type="button"
              onClick={() =>
                setShowCheckoutNotice(
                  false
                )
              }
              aria-label="Close"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F1ED] text-[#171717]"
            >
              <X size={17} />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#EEE9FF] text-[#5B3DF5]">
              <Sparkles size={27} />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#A67C52]">
              Styloverse Checkout
            </p>

            <h2 className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-[#171717]">
              Your cart is ready
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#746D67]">
              Checkout, delivery address
              and payment system will be
              connected in the next step.
              Your cart products are safely
              saved.
            </p>

            <button
              type="button"
              onClick={() =>
                setShowCheckoutNotice(
                  false
                )
              }
              className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#171717] text-sm font-semibold text-white transition hover:bg-[#5B3DF5]"
            >
              Continue Reviewing Cart
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
