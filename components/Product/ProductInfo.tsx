"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  BadgeCheck,
  Check,
  Heart,
  Minus,
  PackageCheck,
  Palette,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";

import { useRouter } from "next/navigation";

import type { Product } from "@/data/products";
import { useAuth } from "@/contexts/AuthContext";
import {
  addProductToCart,
  getWishlistSnapshot,
  toggleWishlistProduct,
  wishlistHasProduct,
} from "@/lib/storefront-storage";

type ProductInfoProps = {
  product: Product;
};

const priceFormatter =
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

function formatPrice(price: number) {
  return priceFormatter.format(price);
}

function calculateDiscount(
  price: number,
  oldPrice?: number
) {
  if (!oldPrice || oldPrice <= price) {
    return 0;
  }

  return Math.round(
    ((oldPrice - price) /
      oldPrice) *
      100
  );
}

export default function ProductInfo({
  product,
}: ProductInfoProps) {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    selectedSize,
    setSelectedSize,
  ] = useState(
    product.sizes[0] ?? ""
  );

  const [
    selectedColor,
    setSelectedColor,
  ] = useState(
    product.colors[0]?.name ?? ""
  );

  const [quantity, setQuantity] =
    useState(1);

  const [
    isWishlisted,
    setIsWishlisted,
  ] = useState(false);

  const [
    statusMessage,
    setStatusMessage,
  ] = useState("");

  const discount =
    calculateDiscount(
      product.price,
      product.oldPrice
    );

  const isOutOfStock =
    product.stock <= 0;

  const selectedColorData =
    product.colors.find(
      (color) =>
        color.name === selectedColor
    );
  const selectedVariant =
    product.variants?.find(
      (variant) =>
        variant.size === selectedSize &&
        variant.colorName ===
          selectedColor
    );
  const selectedAvailableStock =
    selectedVariant
      ? Math.max(
          0,
          selectedVariant.stockOnHand -
            selectedVariant.stockReserved
        )
      : product.stock;
  const selectedIsOutOfStock =
    selectedAvailableStock <= 0;

  useEffect(() => {
    const syncProductTimer =
      window.setTimeout(() => {
        setSelectedSize(
          product.sizes[0] ?? ""
        );

        setSelectedColor(
          product.colors[0]?.name ?? ""
        );

        setQuantity(1);
        setStatusMessage("");

        setIsWishlisted(
          wishlistHasProduct(
            getWishlistSnapshot(),
            product.id,
            product.slug
          )
        );
      }, 0);

    return () => {
      window.clearTimeout(
        syncProductTimer
      );
    };
  }, [product]);

  function decreaseQuantity() {
    setQuantity(
      (currentQuantity) =>
        Math.max(
          1,
          currentQuantity - 1
        )
    );

    setStatusMessage("");
  }

  function increaseQuantity() {
    setQuantity(
      (currentQuantity) =>
        Math.min(
          selectedAvailableStock,
          currentQuantity + 1
        )
    );

    setStatusMessage("");
  }

  function toggleWishlist() {
    try {
      const isNowWishlisted =
        toggleWishlistProduct(
          product.id,
          product.slug
        );

      setIsWishlisted(
        isNowWishlisted
      );

      setStatusMessage(
        isNowWishlisted
          ? "Product added to your wishlist."
          : "Product removed from your wishlist."
      );
    } catch {
      setStatusMessage(
        "Wishlist update failed. Please try again."
      );
    }
  }

  function validateSelection() {
    if (
      isOutOfStock ||
      selectedIsOutOfStock
    ) {
      setStatusMessage(
        "This product is currently out of stock."
      );

      return false;
    }

    if (
      product.sizes.length > 0 &&
      !selectedSize
    ) {
      setStatusMessage(
        "Please select a size before continuing."
      );

      return false;
    }

    if (
      product.colors.length > 0 &&
      !selectedColor
    ) {
      setStatusMessage(
        "Please select a color before continuing."
      );

      return false;
    }

    return true;
  }

  function saveProductToCart() {
    addProductToCart({
      id: product.id,
      productDocumentId: String(
        product.id
      ),
      variantId:
        selectedVariant?.id ?? "",
      sku:
        selectedVariant?.sku ??
        product.sku,
      slug: product.slug,
      name: product.title,
      image: product.image,
      price: product.price,
      originalPrice:
        product.oldPrice ??
        product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      stock: selectedAvailableStock,
    });
  }

  function handleAddToCart() {
    setStatusMessage("");

    if (!validateSelection()) {
      return;
    }

    try {
      saveProductToCart();

      setStatusMessage(
        `${quantity} × ${product.title} added to your bag.`
      );
    } catch {
      setStatusMessage(
        "Product could not be added to your bag."
      );
    }
  }

  function handleBuyNow() {
    setStatusMessage("");

    if (!validateSelection()) {
      return;
    }

    if (authLoading) {
      setStatusMessage(
        "Checking your account. Please wait..."
      );

      return;
    }

    try {
      saveProductToCart();

      if (!user) {
        router.push(
          `/auth/checkout?redirect=${encodeURIComponent(
            "/checkout"
          )}`
        );

        return;
      }

      router.push("/checkout");
    } catch {
      setStatusMessage(
        "Unable to continue to checkout."
      );
    }
  }

  return (
    <div className="flex flex-col">
      {/* Badges and wishlist */}

      <div className="flex items-start justify-between gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EDFF] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#5B3DF5] md:gap-2 md:px-4 md:text-xs md:tracking-[0.2em]">
            <Sparkles size={15} />

            {product.badge ??
              "Premium Collection"}
          </span>

          {product.isNew && (
            <span className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              <Zap size={14} />
              New Arrival
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={
            isWishlisted
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-300 ${
            isWishlisted
              ? "border-[#5B3DF5] bg-[#5B3DF5] text-white"
              : "border-[#E5DED6] bg-white text-[#171717] hover:-translate-y-1 hover:border-[#5B3DF5] hover:text-[#5B3DF5]"
          }`}
        >
          <Heart
            size={21}
            fill={
              isWishlisted
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </div>

      {/* Product heading */}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[#A67C52]">
          {product.category}
        </span>

        <span className="h-1 w-1 rounded-full bg-gray-300" />

        <span className="text-sm font-medium text-gray-500">
          {product.brand}
        </span>

        <span className="h-1 w-1 rounded-full bg-gray-300" />

        <span className="text-sm text-gray-400">
          SKU: {product.sku}
        </span>
      </div>

      <h1 className="mt-4 text-[36px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#171717] md:text-5xl xl:text-6xl">
        {product.title}
      </h1>

      {/* Rating and stock */}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1">
          {Array.from({
            length: 5,
          }).map((_, index) => {
            const isFilled =
              index <
              Math.round(
                product.rating
              );

            return (
              <Star
                key={index}
                size={19}
                fill={
                  isFilled
                    ? "#FACC15"
                    : "transparent"
                }
                color={
                  isFilled
                    ? "#FACC15"
                    : "#D1D5DB"
                }
              />
            );
          })}
        </div>

        <span className="font-semibold text-[#171717]">
          {product.rating.toFixed(1)}
        </span>

        <span className="text-gray-400">
          •
        </span>

        <span className="text-sm font-medium text-gray-500">
          {product.reviewCount.toLocaleString(
            "en-IN"
          )}{" "}
          Reviews
        </span>

        <span
          className={`inline-flex items-center gap-2 text-sm font-semibold ${
            isOutOfStock
              ? "text-red-600"
              : "text-green-700"
          }`}
        >
          <PackageCheck size={17} />

          {selectedIsOutOfStock
            ? "Out of Stock"
            : selectedAvailableStock <= 5
              ? `Only ${selectedAvailableStock} left`
              : "In Stock"}
        </span>
      </div>

      {/* Price */}

      <div className="mt-6 rounded-[24px] border border-[#EAE2D9] bg-white p-4 shadow-[0_15px_45px_rgba(40,29,19,0.05)] md:mt-8 md:rounded-[28px] md:p-6">
        <div className="flex flex-wrap items-end gap-4">
          <span className="text-[34px] font-bold tracking-[-0.04em] text-[#5B3DF5] md:text-5xl">
            {formatPrice(
              product.price
            )}
          </span>

          {product.oldPrice && (
            <span className="pb-1 text-lg text-gray-400 line-through md:text-2xl">
              {formatPrice(
                product.oldPrice
              )}
            </span>
          )}

          {discount > 0 && (
            <span className="mb-1 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
              Save {discount}%
            </span>
          )}
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Inclusive of all taxes
        </p>
      </div>

      <p className="mt-5 text-[13px] leading-6 text-gray-600 md:mt-7 md:text-lg md:leading-8">
        {product.shortDescription}
      </p>

      {/* Color selection */}

      {product.colors.length > 0 && (
        <section className="mt-7 md:mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette
                size={20}
                className="text-[#5B3DF5]"
              />

              <h2 className="text-lg font-semibold text-[#171717]">
                Select Color
              </h2>
            </div>

            <span className="text-sm font-semibold text-gray-500">
              {selectedColorData?.name}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {product.colors.map(
              (color) => {
                const isSelected =
                  selectedColor ===
                  color.name;
                const isUnavailable =
                  Boolean(
                    product.variants?.length
                  ) &&
                  !product.variants?.some(
                    (variant) =>
                      variant.colorName ===
                        color.name &&
                      variant.stockOnHand -
                        variant.stockReserved >
                        0
                  );

                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => {
                      setSelectedColor(
                        color.name
                      );

                      setStatusMessage("");
                      setQuantity(1);
                    }}
                    disabled={isUnavailable}
                    className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                      isSelected
                        ? "border-[#5B3DF5] ring-2 ring-[#5B3DF5]/10"
                        : "border-[#E5DED6] hover:border-[#5B3DF5]/50"
                    } ${
                      isUnavailable
                        ? "cursor-not-allowed opacity-35"
                        : ""
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10"
                      style={{
                        backgroundColor:
                          color.value,
                      }}
                    >
                      {isSelected && (
                        <Check
                          size={15}
                          className="text-white"
                        />
                      )}
                    </span>

                    <span className="text-sm font-semibold">
                      {color.name}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* Size selection */}

      {product.sizes.length > 0 && (
        <section className="mt-7 md:mt-10">
          <div className="mb-5 flex items-center gap-2">
            <Ruler
              size={20}
              className="text-[#5B3DF5]"
            />

            <h2 className="text-lg font-semibold text-[#171717]">
              Select Size
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {product.sizes.map(
              (size) => {
                const isUnavailable =
                  Boolean(
                    product.variants?.length
                  ) &&
                  !product.variants?.some(
                    (variant) =>
                      variant.size === size &&
                      variant.colorName ===
                        selectedColor &&
                      variant.stockOnHand -
                        variant.stockReserved >
                        0
                  );

                return (
                  <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    setStatusMessage("");
                    setQuantity(1);
                  }}
                  disabled={isUnavailable}
                  className={`flex h-14 min-w-14 items-center justify-center rounded-2xl border-2 px-4 font-bold transition ${
                    selectedSize === size
                      ? "border-[#5B3DF5] bg-[#5B3DF5] text-white"
                      : "border-[#E1DAD2] bg-white hover:border-[#5B3DF5]"
                  } ${
                    isUnavailable
                      ? "cursor-not-allowed line-through opacity-35"
                      : ""
                  }`}
                >
                  {size}
                </button>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* Quantity */}

      <section className="mt-7 md:mt-10">
        <h2 className="mb-5 text-lg font-semibold text-[#171717]">
          Quantity
        </h2>

        <div className="flex w-fit items-center overflow-hidden rounded-2xl border border-[#DDD5CC] bg-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={decreaseQuantity}
            disabled={
              quantity <= 1 ||
              selectedIsOutOfStock
            }
            className="flex h-14 w-14 items-center justify-center disabled:opacity-30"
          >
            <Minus size={19} />
          </button>

          <span className="flex h-14 w-16 items-center justify-center border-x border-[#E8E1D8] text-lg font-bold">
            {quantity}
          </span>

          <button
            type="button"
            aria-label="Increase quantity"
            onClick={increaseQuantity}
            disabled={
              quantity >=
                product.stock ||
              selectedIsOutOfStock
            }
            className="flex h-14 w-14 items-center justify-center disabled:opacity-30"
          >
            <Plus size={19} />
          </button>
        </div>
      </section>

      {/* Purchase buttons */}

      <div className="mt-7 grid grid-cols-2 gap-2.5 md:mt-10 md:gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#5B3DF5] px-3 py-3 text-[12px] font-semibold text-white transition hover:-translate-y-1 hover:bg-[#4930D8] disabled:bg-gray-400 md:min-h-16 md:gap-3 md:px-6 md:py-4 md:text-lg"
        >
          <ShoppingBag size={21} />

          {isOutOfStock
            ? "Out of Stock"
            : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[#171717] bg-white px-3 py-3 text-[12px] font-semibold text-[#171717] transition hover:-translate-y-1 hover:bg-[#171717] hover:text-white disabled:border-gray-300 disabled:text-gray-400 md:min-h-16 md:gap-3 md:px-6 md:py-4 md:text-lg"
        >
          <Zap size={21} />

          Buy Now
        </button>
      </div>

      {statusMessage && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#DCD3FF] bg-[#F6F3FF] px-5 py-4 text-sm font-medium leading-6 text-[#4930D8]">
          <BadgeCheck
            size={20}
            className="mt-0.5 shrink-0"
          />

          {statusMessage}
        </div>
      )}

      {/* Benefits */}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-4 rounded-2xl border border-[#E8E1D8] bg-white p-5">
          <Truck className="text-[#5B3DF5]" />

          <div>
            <p className="font-semibold">
              Free Delivery
            </p>

            <p className="mt-1 text-sm text-gray-500">
              On eligible orders
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-[#E8E1D8] bg-white p-5">
          <ShieldCheck className="text-[#5B3DF5]" />

          <div>
            <p className="font-semibold">
              Secure Purchase
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Protected checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
