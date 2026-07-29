"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Eye,
  Heart,
  ShoppingBag,
  Star,
} from "lucide-react";

import {
  EMPTY_STORAGE_SNAPSHOT,
  addProductToCart,
  getWishlistSnapshot,
  subscribeToWishlist,
  toggleWishlistProduct,
  wishlistHasProduct,
} from "@/lib/storefront-storage";

type ProductCardProps = {
  id: number | string;
  image: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  stock?: number;
};

export default function ProductCard({
  id,
  image,
  title,
  category,
  price,
  oldPrice,
  badge,
  isNew = false,
  rating = 0,
  reviewCount = 0,
  stock = 0,
}: ProductCardProps) {
  const wishlistSnapshot = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    () => EMPTY_STORAGE_SNAPSHOT
  );
  const isWishlisted = wishlistHasProduct(wishlistSnapshot, id);
  const discount =
    oldPrice && oldPrice > price
      ? Math.round(
          ((oldPrice - price) /
            oldPrice) *
            100
        )
      : 0;

  const productHref =
    `/product/${id}`;

  const formattedCategory =
    category
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E9E1D8] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.09)]">
      {/* Image */}

      <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EEE8]">
        <Link
          href={productHref}
          aria-label={`View ${title}`}
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">
            View {title}
          </span>
        </Link>

        <Image
          src={image}
          alt={title}
          fill
          unoptimized={image.startsWith("data:")}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
          className="object-contain object-center p-5 scale-[0.94] transition-transform duration-700 group-hover:scale-[0.955] sm:p-6"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Badges */}

        <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-col items-start gap-2">
          {discount > 0 && (
            <span className="rounded-full bg-[#171717] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-md">
              -{discount}% Off
            </span>
          )}

          {(isNew ||
            badge === "NEW") && (
            <span className="rounded-full bg-[#5B3DF5] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-md">
              New
            </span>
          )}

          {badge &&
            badge !== "NEW" && (
              <span className="rounded-full bg-[#704820] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-md">
                {badge}
              </span>
            )}
        </div>

        {/* Actions */}

        <div className="absolute right-3 top-3 z-30 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => toggleWishlistProduct(id)}
            aria-label={
              isWishlisted
                ? `Remove ${title} from wishlist`
                : `Add ${title} to wishlist`
            }
            className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-md backdrop-blur transition hover:scale-105 ${
              isWishlisted
                ? "border-[#5B3DF5] bg-[#5B3DF5] text-white"
                : "border-black/5 bg-white/95 text-[#171717] hover:bg-[#5B3DF5] hover:text-white"
            }`}
          >
            <Heart
              size={17}
              strokeWidth={1.8}
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>

          <Link
            href={productHref}
            aria-label={`View ${title}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/95 text-[#171717] shadow-md backdrop-blur transition hover:scale-105 hover:bg-[#171717] hover:text-white"
          >
            <Eye
              size={17}
              strokeWidth={1.8}
            />
          </Link>
        </div>

        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 translate-y-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-white/95 px-4 py-3 text-sm font-semibold text-[#171717] shadow-lg backdrop-blur">
            <Eye size={16} />
            View Product
          </div>
        </div>
      </div>

      {/* Details */}

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A67C52]">
          {formattedCategory}
        </p>

        <Link href={productHref}>
          <h3 className="product-title-clamp mt-2 min-h-[52px] text-xl font-semibold leading-[1.3] text-[#171717] transition-colors hover:text-[#5B3DF5]">
            {title}
          </h3>
        </Link>

        <div className="mt-3 flex min-h-5 items-center gap-2">
          {rating > 0 ? (
            <>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={13}
                      fill={
                        star <=
                        Math.round(rating)
                          ? "#FACC15"
                          : "transparent"
                      }
                      color={
                        star <=
                        Math.round(rating)
                          ? "#FACC15"
                          : "#D1D5DB"
                      }
                    />
                  )
                )}
              </div>

              <span className="text-xs text-[#57514C]">
                {rating.toFixed(1)}
                {reviewCount > 0
                  ? ` (${reviewCount})`
                  : ""}
              </span>
            </>
          ) : (
            <span className="text-xs text-[#57514C]">
              New arrival
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-[#171717]">
            ₹
            {price.toLocaleString(
              "en-IN"
            )}
          </span>

          {oldPrice &&
            oldPrice > price && (
              <span className="text-sm text-[#615A54] line-through">
                ₹
                {oldPrice.toLocaleString(
                  "en-IN"
                )}
              </span>
            )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs font-medium text-green-700">
            Free shipping
          </p>

          <p
            className={`text-xs font-medium ${
              stock > 0
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {stock > 0
              ? "In stock"
              : "Out of stock"}
          </p>
        </div>

        <button
          type="button"
          disabled={stock === 0}
          onClick={() =>
            addProductToCart({
              id,
              name: title,
              image,
              price,
              originalPrice: oldPrice,
              stock,
            })
          }
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#5B3DF5] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <ShoppingBag size={17} />

          {stock > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
