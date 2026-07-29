"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Loader2,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import Navbar from "@/components/Navbar/Navbar";
import { products } from "@/data/products";

/* ==========================================================================
   TYPES
========================================================================== */

type ProductRecord = Record<string, unknown>;

type WishlistItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  category: string;
  rating: number;
  reviewCount: number;
  badge: string;
  sizes: string[];
  colors: string[];
  selectedSize: string;
  selectedColor: string;
};

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  size: string;
  color: string;
};

type FeedbackMessage = {
  type: "success" | "info";
  message: string;
};

/* ==========================================================================
   CONSTANTS
========================================================================== */

const WISHLIST_STORAGE_KEY =
  "styloverse-wishlist";

const CART_STORAGE_KEY =
  "styloverse-cart";

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

function getText(
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

    if (
      typeof objectValue.title ===
      "string"
    ) {
      return objectValue.title;
    }
  }

  return fallback;
}

function getStringArray(
  value: unknown
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => getText(item).trim())
    .filter(Boolean);
}

function getProductId(
  product: ProductRecord
) {
  return String(
    product.id ??
      product.productId ??
      product.slug ??
      ""
  );
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
    const firstImage = product.images[0];

    if (typeof firstImage === "string") {
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

function findProductFromCatalog(
  productId: string
): ProductRecord | null {
  const catalog =
    products as unknown as ProductRecord[];

  return (
    catalog.find((product) => {
      const id = String(
        product.id ?? ""
      );

      const slug = String(
        product.slug ?? ""
      );

      return (
        id === productId ||
        slug === productId
      );
    }) ?? null
  );
}

function normalizeWishlistItem(
  rawItem: unknown,
  index: number
): WishlistItem | null {
  let savedProduct: ProductRecord = {};
  let savedProductId = "";

  if (
    typeof rawItem === "string" ||
    typeof rawItem === "number"
  ) {
    savedProductId = String(rawItem);
  } else if (
    rawItem &&
    typeof rawItem === "object"
  ) {
    savedProduct =
      rawItem as ProductRecord;

    savedProductId =
      getProductId(savedProduct);
  } else {
    return null;
  }

  const catalogProduct =
    savedProductId
      ? findProductFromCatalog(
          savedProductId
        )
      : null;

  const mergedProduct: ProductRecord = {
    ...(catalogProduct ?? {}),
    ...savedProduct,
  };

  const id =
    getProductId(mergedProduct) ||
    savedProductId ||
    `wishlist-product-${index}`;

  const name = String(
    mergedProduct.name ??
      mergedProduct.title ??
      mergedProduct.productName ??
      "Styloverse Product"
  );

  const price = toNumber(
    mergedProduct.price ??
      mergedProduct.salePrice ??
      mergedProduct.discountedPrice
  );

  const originalPrice =
    toNumber(
      mergedProduct.originalPrice ??
        mergedProduct.oldPrice ??
        mergedProduct.compareAtPrice ??
        mergedProduct.mrp,
      price
    ) || price;

  const sizes = getStringArray(
    mergedProduct.sizes ??
      mergedProduct.sizeOptions ??
      mergedProduct.availableSizes
  );

  const colors = getStringArray(
    mergedProduct.colors ??
      mergedProduct.colorOptions ??
      mergedProduct.availableColors
  );

  const selectedSize =
    getText(
      mergedProduct.selectedSize ??
        mergedProduct.size
    ) ||
    sizes[0] ||
    "";

  const selectedColor =
    getText(
      mergedProduct.selectedColor ??
        mergedProduct.color
    ) ||
    colors[0] ||
    "";

  return {
    id,
    name,
    image: getProductImage(
      mergedProduct
    ),
    price,
    originalPrice,
    category: String(
      mergedProduct.category ??
        mergedProduct.collection ??
        "Premium Collection"
    ),
    rating: toNumber(
      mergedProduct.rating,
      4.8
    ),
    reviewCount: Math.max(
      0,
      Math.floor(
        toNumber(
          mergedProduct.reviewCount ??
            mergedProduct.reviewsCount ??
            mergedProduct.totalReviews,
          0
        )
      )
    ),
    badge: String(
      mergedProduct.badge ??
        mergedProduct.tag ??
        ""
    ),
    sizes,
    colors,
    selectedSize,
    selectedColor,
  };
}

function removeDuplicateWishlistItems(
  items: WishlistItem[]
) {
  const uniqueItems =
    new Map<string, WishlistItem>();

  items.forEach((item) => {
    const productKey = item.id
      .trim()
      .toLowerCase();

    if (!productKey) {
      return;
    }

    uniqueItems.set(productKey, item);
  });

  return Array.from(
    uniqueItems.values()
  );
}

function readStorageArray(
  storageKey: string
): unknown[] {
  try {
    const storedValue =
      window.localStorage.getItem(
        storageKey
      );

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

function createCartItemKey(item: {
  id: string;
  size?: string;
  color?: string;
}) {
  return [
    item.id,
    item.size ?? "",
    item.color ?? "",
  ]
    .join("::")
    .trim()
    .toLowerCase();
}

function normalizeExistingCartItem(
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
    rawItem as ProductRecord;

  const id = String(
    item.id ??
      item.productId ??
      item.slug ??
      `cart-item-${index}`
  );

  const price = toNumber(
    item.price ??
      item.salePrice ??
      item.discountedPrice
  );

  const originalPrice =
    toNumber(
      item.originalPrice ??
        item.oldPrice ??
        item.mrp,
      price
    ) || price;

  return {
    id,
    name: String(
      item.name ??
        item.title ??
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
    size: getText(
      item.size ??
        item.selectedSize
    ),
    color: getText(
      item.color ??
        item.selectedColor
    ),
  };
}

function dispatchWishlistUpdate(
  count: number
) {
  window.dispatchEvent(
    new CustomEvent(
      "styloverse-wishlist-updated",
      {
        detail: {
          count,
        },
      }
    )
  );
}

function dispatchCartUpdate() {
  window.dispatchEvent(
    new Event(
      "styloverse-cart-updated"
    )
  );
}

/* ==========================================================================
   PAGE
========================================================================== */

export default function WishlistPage() {
  const [
    wishlistItems,
    setWishlistItems,
  ] = useState<WishlistItem[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    removingProductId,
    setRemovingProductId,
  ] = useState<string | null>(null);

  const [
    movingProductId,
    setMovingProductId,
  ] = useState<string | null>(null);

  const [
    isMovingAll,
    setIsMovingAll,
  ] = useState(false);

  const [
    feedback,
    setFeedback,
  ] =
    useState<FeedbackMessage | null>(
      null
    );

  /* ========================================================================
     LOAD WISHLIST
  ======================================================================== */

  useEffect(() => {
    const loadWishlist = () => {
      const storedWishlist =
        readStorageArray(
          WISHLIST_STORAGE_KEY
        );

      const normalizedWishlist =
        storedWishlist
          .map(normalizeWishlistItem)
          .filter(
            (
              item
            ): item is WishlistItem =>
              item !== null
          );

      const uniqueWishlist =
        removeDuplicateWishlistItems(
          normalizedWishlist
        );

      setWishlistItems(
        uniqueWishlist
      );

      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(
          uniqueWishlist
        )
      );

      dispatchWishlistUpdate(
        uniqueWishlist.length
      );

      setIsLoading(false);
    };

    loadWishlist();

    const handleStorageChange = (
      event: StorageEvent
    ) => {
      if (
        !event.key ||
        event.key ===
          WISHLIST_STORAGE_KEY
      ) {
        loadWishlist();
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

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
      }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [feedback]);

  /* ========================================================================
     SAVE WISHLIST
  ======================================================================== */

  const saveWishlist = (
    updatedItems: WishlistItem[]
  ) => {
    const uniqueItems =
      removeDuplicateWishlistItems(
        updatedItems
      );

    window.localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(uniqueItems)
    );

    setWishlistItems(uniqueItems);

    dispatchWishlistUpdate(
      uniqueItems.length
    );
  };

  /* ========================================================================
     ADD ITEMS TO CART
  ======================================================================== */

  const addItemsToCart = (
    productsToAdd: WishlistItem[]
  ) => {
    const storedCart =
      readStorageArray(
        CART_STORAGE_KEY
      );

    const currentCart =
      storedCart
        .map(normalizeExistingCartItem)
        .filter(
          (
            item
          ): item is CartItem =>
            item !== null
        );

    let updatedCart = [
      ...currentCart,
    ];

    productsToAdd.forEach(
      (product) => {
        const newCartItem: CartItem = {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          originalPrice:
            product.originalPrice,
          quantity: 1,
          size:
            product.selectedSize ||
            product.sizes[0] ||
            "",
          color:
            product.selectedColor ||
            product.colors[0] ||
            "",
        };

        const newItemKey =
          createCartItemKey(
            newCartItem
          );

        const existingItemIndex =
          updatedCart.findIndex(
            (item) =>
              createCartItemKey(
                item
              ) === newItemKey
          );

        if (
          existingItemIndex >= 0
        ) {
          updatedCart =
            updatedCart.map(
              (item, index) =>
                index ===
                existingItemIndex
                  ? {
                      ...item,
                      quantity:
                        item.quantity +
                        1,
                    }
                  : item
            );
        } else {
          updatedCart.push(
            newCartItem
          );
        }
      }
    );

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(updatedCart)
    );

    dispatchCartUpdate();
  };

  /* ========================================================================
     REMOVE ITEM
  ======================================================================== */

  const removeFromWishlist = (
    product: WishlistItem
  ) => {
    setRemovingProductId(
      product.id
    );

    window.setTimeout(() => {
      const updatedWishlist =
        wishlistItems.filter(
          (item) =>
            item.id !== product.id
        );

      saveWishlist(
        updatedWishlist
      );

      setRemovingProductId(
        null
      );

      setFeedback({
        type: "info",
        message:
          "Product removed from your wishlist.",
      });
    }, 220);
  };

  /* ========================================================================
     MOVE SINGLE ITEM
  ======================================================================== */

  const moveToCart = (
    product: WishlistItem
  ) => {
    setMovingProductId(
      product.id
    );

    addItemsToCart([product]);

    window.setTimeout(() => {
      const updatedWishlist =
        wishlistItems.filter(
          (item) =>
            item.id !== product.id
        );

      saveWishlist(
        updatedWishlist
      );

      setMovingProductId(null);

      setFeedback({
        type: "success",
        message: `${product.name} moved to your cart.`,
      });
    }, 300);
  };

  /* ========================================================================
     MOVE ALL ITEMS
  ======================================================================== */

  const moveAllToCart = () => {
    if (
      wishlistItems.length === 0
    ) {
      return;
    }

    setIsMovingAll(true);

    addItemsToCart(
      wishlistItems
    );

    window.setTimeout(() => {
      saveWishlist([]);

      setIsMovingAll(false);

      setFeedback({
        type: "success",
        message:
          "All wishlist products moved to your cart.",
      });
    }, 400);
  };

  const clearWishlist = () => {
    saveWishlist([]);

    setFeedback({
      type: "info",
      message:
        "Your wishlist has been cleared.",
    });
  };

  /* ========================================================================
     TOTALS
  ======================================================================== */

  const wishlistValue =
    useMemo(() => {
      return wishlistItems.reduce(
        (total, product) =>
          total + product.price,
        0
      );
    }, [wishlistItems]);

  const wishlistSavings =
    useMemo(() => {
      return wishlistItems.reduce(
        (total, product) =>
          total +
          Math.max(
            0,
            product.originalPrice -
              product.price
          ),
        0
      );
    }, [wishlistItems]);

  /* ========================================================================
     LOADING
  ======================================================================== */

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
              Preparing your saved
              collection...
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
          {/* Header */}

          <div className="flex flex-col justify-between gap-7 border-b border-[#E7DED5] pb-9 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-[#A67C52]">
                <Sparkles size={16} />

                <p className="text-[10px] font-semibold uppercase tracking-[0.32em]">
                  Saved Collection
                </p>
              </div>

              <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-medium tracking-[-0.04em] text-[#171717] lg:text-6xl">
                Your Wishlist
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#746D67]">
                {wishlistItems.length ===
                0
                  ? "Save the pieces you love and return to them anytime."
                  : `${wishlistItems.length} ${
                      wishlistItems.length ===
                      1
                        ? "product"
                        : "products"
                    } saved in your private collection.`}
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

          {/* Feedback */}

          {feedback && (
            <div
              className={`fixed right-6 top-28 z-[150] flex max-w-sm items-center gap-3 rounded-2xl border px-5 py-4 shadow-[0_20px_55px_rgba(0,0,0,0.15)] backdrop-blur-xl ${
                feedback.type ===
                "success"
                  ? "border-green-200 bg-green-50/95 text-green-800"
                  : "border-[#DCD3FF] bg-[#F3EFFF]/95 text-[#5B3DF5]"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  feedback.type ===
                  "success"
                    ? "bg-green-700 text-white"
                    : "bg-[#5B3DF5] text-white"
                }`}
              >
                {feedback.type ===
                "success" ? (
                  <Check size={17} />
                ) : (
                  <Heart size={17} />
                )}
              </span>

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

          {/* Empty Wishlist */}

          {wishlistItems.length ===
          0 ? (
            <div className="mt-12 overflow-hidden rounded-[40px] border border-[#E9E1D8] bg-white shadow-[0_25px_80px_rgba(45,32,20,0.08)]">
              <div className="px-7 py-16 text-center md:px-12 lg:py-24">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-[#FCEEF4] text-[#D94D7C]">
                  <Heart
                    size={40}
                    strokeWidth={1.5}
                  />
                </div>

                <p className="mt-9 text-xs font-semibold uppercase tracking-[0.35em] text-[#A67C52]">
                  Private Collection
                </p>

                <h2 className="mt-4 font-[var(--font-heading)] text-4xl font-medium tracking-[-0.04em] text-[#171717] md:text-5xl">
                  Your wishlist is empty
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#746D67]">
                  Tap the heart icon on any
                  product to build your own
                  curated Styloverse
                  collection.
                </p>

                <Link
                  href="/shop"
                  className="group mt-9 inline-flex items-center gap-3 rounded-2xl bg-[#5B3DF5] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#4930D8]"
                >
                  Discover Products

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <div className="grid gap-px border-t border-[#EEE7DF] bg-[#EEE7DF] md:grid-cols-3">
                <div className="flex items-center gap-4 bg-[#FAF7F3] p-6">
                  <Heart className="text-[#D94D7C]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Save Favourites
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Keep products for later
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#FAF7F3] p-6">
                  <ShoppingBag className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Move to Cart
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Add products instantly
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#FAF7F3] p-6">
                  <ShieldCheck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Saved Securely
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Available after refresh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}

              <div className="mt-9 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-[#E9E1D8] bg-white p-6 shadow-[0_15px_45px_rgba(45,32,20,0.05)]">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCEEF4] text-[#D94D7C]">
                      <Heart size={21} />
                    </span>

                    <div>
                      <p className="text-xs font-medium text-[#817A74]">
                        Saved Products
                      </p>

                      <p className="mt-1 text-2xl font-semibold text-[#171717]">
                        {wishlistItems.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#E9E1D8] bg-white p-6 shadow-[0_15px_45px_rgba(45,32,20,0.05)]">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEE9FF] text-[#5B3DF5]">
                      <ShoppingBag size={21} />
                    </span>

                    <div>
                      <p className="text-xs font-medium text-[#817A74]">
                        Collection Value
                      </p>

                      <p className="mt-1 text-2xl font-semibold text-[#171717]">
                        {formatCurrency(
                          wishlistValue
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#E9E1D8] bg-white p-6 shadow-[0_15px_45px_rgba(45,32,20,0.05)]">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                      <Sparkles size={21} />
                    </span>

                    <div>
                      <p className="text-xs font-medium text-[#817A74]">
                        Available Savings
                      </p>

                      <p className="mt-1 text-2xl font-semibold text-green-700">
                        {formatCurrency(
                          wishlistSavings
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}

              <div className="mt-8 flex flex-col justify-between gap-5 rounded-[28px] border border-[#E9E1D8] bg-white p-5 shadow-[0_18px_55px_rgba(45,32,20,0.05)] md:flex-row md:items-center md:p-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#171717]">
                    Your Saved Pieces
                  </h2>

                  <p className="mt-1 text-sm text-[#817A74]">
                    Move products to your
                    cart or remove them from
                    this collection.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={clearWishlist}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-red-200 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Clear Wishlist
                  </button>

                  <button
                    type="button"
                    onClick={moveAllToCart}
                    disabled={isMovingAll}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#171717] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#5B3DF5] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isMovingAll ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />

                        Moving Products...
                      </>
                    ) : (
                      <>
                        <ShoppingBag
                          size={16}
                        />

                        Move All to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Wishlist Grid */}

              <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {wishlistItems.map(
                  (product) => {
                    const isRemoving =
                      removingProductId ===
                      product.id;

                    const isMoving =
                      movingProductId ===
                      product.id;

                    const discountPercentage =
                      product.originalPrice >
                      product.price
                        ? Math.round(
                            ((product.originalPrice -
                              product.price) /
                              product.originalPrice) *
                              100
                          )
                        : 0;

                    return (
                      <article
                        key={product.id}
                        className={`group overflow-hidden rounded-[30px] border border-[#E9E1D8] bg-white shadow-[0_18px_55px_rgba(45,32,20,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(45,32,20,0.11)] ${
                          isRemoving
                            ? "scale-[0.96] opacity-0"
                            : "scale-100 opacity-100"
                        }`}
                      >
                        <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EEE8]">
                          <Link
                            href={`/product/${encodeURIComponent(
                              product.id
                            )}`}
                            className="block h-full w-full"
                          >
                            {product.image ? (
                              <Image
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                                fill
                                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#AAA19A]">
                                <ShoppingBag
                                  size={42}
                                  strokeWidth={
                                    1.3
                                  }
                                />
                              </div>
                            )}
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromWishlist(
                                product
                              )
                            }
                            aria-label={`Remove ${product.name} from wishlist`}
                            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#D94D7C] shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-[#D94D7C] hover:text-white"
                          >
                            <Heart
                              size={19}
                              fill="currentColor"
                            />
                          </button>

                          {product.badge ? (
                            <span className="absolute left-4 top-4 rounded-full bg-[#171717] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-white">
                              {product.badge}
                            </span>
                          ) : (
                            discountPercentage >
                              0 && (
                              <span className="absolute left-4 top-4 rounded-full bg-[#5B3DF5] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-white">
                                {
                                  discountPercentage
                                }
                                % Off
                              </span>
                            )
                          )}
                        </div>

                        <div className="p-6">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A67C52]">
                            {product.category}
                          </p>

                          <Link
                            href={`/product/${encodeURIComponent(
                              product.id
                            )}`}
                            className="mt-2 block font-[var(--font-heading)] text-2xl font-medium leading-tight text-[#171717] transition hover:text-[#5B3DF5]"
                          >
                            {product.name}
                          </Link>

                          <div className="mt-4 flex items-center gap-2">
                            <div className="flex items-center gap-1 text-[#B9853D]">
                              <Star
                                size={14}
                                fill="currentColor"
                              />

                              <span className="text-xs font-semibold">
                                {product.rating.toFixed(
                                  1
                                )}
                              </span>
                            </div>

                            {product.reviewCount >
                              0 && (
                              <span className="text-xs text-[#948C85]">
                                (
                                {
                                  product.reviewCount
                                }{" "}
                                reviews)
                              </span>
                            )}
                          </div>

                          <div className="mt-5 flex flex-wrap gap-2">
                            {product.selectedSize && (
                              <span className="rounded-full bg-[#F5F1ED] px-3.5 py-2 text-[11px] font-medium text-[#625C57]">
                                Size:{" "}
                                <strong className="text-[#171717]">
                                  {
                                    product.selectedSize
                                  }
                                </strong>
                              </span>
                            )}

                            {product.selectedColor && (
                              <span className="rounded-full bg-[#F5F1ED] px-3.5 py-2 text-[11px] font-medium text-[#625C57]">
                                Colour:{" "}
                                <strong className="text-[#171717]">
                                  {
                                    product.selectedColor
                                  }
                                </strong>
                              </span>
                            )}
                          </div>

                          <div className="mt-6">
                            <p className="text-xl font-semibold text-[#171717]">
                              {formatCurrency(
                                product.price
                              )}
                            </p>

                            {product.originalPrice >
                              product.price && (
                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-sm text-[#A09891] line-through">
                                  {formatCurrency(
                                    product.originalPrice
                                  )}
                                </span>

                                <span className="text-xs font-semibold text-green-700">
                                  Save{" "}
                                  {formatCurrency(
                                    product.originalPrice -
                                      product.price
                                  )}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="mt-7 grid grid-cols-[1fr_auto] gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                moveToCart(
                                  product
                                )
                              }
                              disabled={isMoving}
                              className="group/button flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#171717] px-5 text-sm font-semibold text-white transition hover:bg-[#5B3DF5] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isMoving ? (
                                <>
                                  <Loader2
                                    size={17}
                                    className="animate-spin"
                                  />

                                  Moving...
                                </>
                              ) : (
                                <>
                                  <ShoppingBag
                                    size={17}
                                  />

                                  Move to Cart

                                  <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover/button:translate-x-1"
                                  />
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeFromWishlist(
                                  product
                                )
                              }
                              aria-label={`Remove ${product.name}`}
                              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E5DDD5] text-[#746D67] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2
                                size={18}
                              />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>

              {/* Services */}

              <section className="mt-12 grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-4 rounded-[24px] border border-[#E9E1D8] bg-white p-6">
                  <Truck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Complimentary Delivery
                    </p>

                    <p className="mt-1 text-sm text-[#817A74]">
                      On eligible orders
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
                      Hassle-free experience
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-[24px] border border-[#E9E1D8] bg-white p-6">
                  <ShieldCheck className="text-[#5B3DF5]" />

                  <div>
                    <p className="font-semibold text-[#171717]">
                      Secure Shopping
                    </p>

                    <p className="mt-1 text-sm text-[#817A74]">
                      Protected member access
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
