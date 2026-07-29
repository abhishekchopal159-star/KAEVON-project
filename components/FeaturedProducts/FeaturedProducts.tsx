"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Check,
  Heart,
  ShoppingBag,
  Star,
} from "lucide-react";

import {
  products as catalogProducts,
  type Product,
} from "@/data/products";
import {
  EMPTY_STORAGE_SNAPSHOT,
  addProductToCart,
  getWishlistSnapshot,
  subscribeToWishlist,
  toggleWishlistProduct,
  wishlistHasProduct,
} from "@/lib/storefront-storage";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";

const FILTERS = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Men",
    value: "MEN",
  },
  {
    label: "Women",
    value: "WOMEN",
  },
  {
    label: "Streetwear",
    value: "STREETWEAR",
  },
  {
    label: "Footwear",
    value: "FOOTWEAR",
  },
  {
    label: "Accessories",
    value: "ACCESSORIES",
  },
] as const;

const FEATURED_PRODUCT_NAMES = [
  "Sand Wool Tailored Blazer",
  "Natural Linen Tailored Blazer",
  "Oatmeal Essential Hoodie",
  "White Leather Platform Sneakers",
  "Camel Structured Tote Bag",
] as const;

type FilterValue =
  (typeof FILTERS)[number]["value"];

function calculateDiscount(
  price: number,
  oldPrice?: number
) {
  if (!oldPrice || oldPrice <= price) {
    return 0;
  }

  return Math.round(
    ((oldPrice - price) / oldPrice) *
      100
  );
}

export default function FeaturedProducts() {
  const { home } = useStorefrontContent();
  const [
    activeFilter,
    setActiveFilter,
  ] = useState<FilterValue>("ALL");

  const wishlistSnapshot = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    () => EMPTY_STORAGE_SNAPSHOT
  );

  const [addedProductId, setAddedProductId] =
    useState<number | null>(null);

  const featuredProducts = useMemo(() => {
    const selectors = home.featuredProductIds.length
      ? home.featuredProductIds
      : [...FEATURED_PRODUCT_NAMES];
    return selectors
      .map((selector) =>
        catalogProducts.find(
          (product) =>
            String(product.id) === selector ||
            product.slug === selector ||
            product.name === selector,
        ),
      )
      .filter((product): product is Product => Boolean(product));
  }, [home.featuredProductIds]);

  const visibleProducts =
    activeFilter === "ALL"
      ? featuredProducts
      : featuredProducts.filter(
          (product) =>
            product.category ===
            activeFilter
        );

  return (
    <section className="bg-[#FFF8F2] py-28">
      <div className="container">
        {/* Heading */}

        <div className="mb-14 flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-[#5B3DF5]/15 bg-[#EFE6FF] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#5B3DF5]">
            Featured Products
          </span>

          <h2 className="mt-6 font-serif text-5xl font-black leading-[0.98] tracking-[-0.01em] text-[#111] md:text-6xl">
            Best Sellers
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-8 text-[#666]">
            Handpicked premium pieces,
            edited for quality and quiet
            luxury.
          </p>
        </div>

        {/* Filters */}

        <div className="mb-14 flex flex-wrap items-center justify-center gap-3">
          {FILTERS.map((filter) => {
            const isActive =
              activeFilter ===
              filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setActiveFilter(
                    filter.value
                  )
                }
                className={`rounded-full px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                  isActive
                    ? "bg-[#5B3DF5] text-white shadow-[0_10px_30px_-10px_rgba(91,61,245,0.55)]"
                    : "border border-[#ECECEC] bg-white text-[#666] hover:border-[#5B3DF5]/30 hover:text-[#5B3DF5]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Products */}

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-5">
          {visibleProducts.map(
            (product, index) => {
              const isWished =
                wishlistHasProduct(
                  wishlistSnapshot,
                  product.id,
                  product.slug
                );

              const discount =
                calculateDiscount(
                  product.price,
                  product.oldPrice
                );

              const productHref =
                `/product/${product.id}`;

              return (
                <article
                  key={product.slug}
                  className="group relative overflow-hidden rounded-[28px] border border-[#ECECEC] bg-white shadow-[0_16px_45px_-24px_rgba(17,17,17,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-[#5B3DF5]/20 hover:shadow-[0_30px_70px_-24px_rgba(91,61,245,0.25)]"
                >
                  {/* Image */}

                  <div className="relative overflow-hidden bg-[#FAFAFA]">
                    <div className="absolute left-5 top-5 z-20 rounded-full border border-white/40 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#111] shadow-md backdrop-blur-md">
                      {product.badge ??
                        "BEST"}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        toggleWishlistProduct(
                          product.id,
                          product.slug
                        )
                      }
                      aria-label={`Add ${product.title} to wishlist`}
                      className={`absolute right-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 ${
                        isWished
                          ? "bg-[#5B3DF5] text-white"
                          : "bg-white/90 text-[#111] hover:bg-[#5B3DF5] hover:text-white"
                      }`}
                    >
                      <Heart
                        size={19}
                        fill={
                          isWished
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <Link
                      href={productHref}
                      aria-label={`View ${product.title}`}
                      className="block"
                    >
                      <div className="relative h-[300px] w-full overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          priority={index < 2}
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-contain object-center p-7 transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                        />
                      </div>
                    </Link>
                  </div>

                  {/* Content */}

                  <div className="px-6 pb-6 pt-5">
                    <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#5B3DF5]">
                      {product.category}
                    </p>

                    <Link
                      href={productHref}
                    >
                      <h3 className="mt-2 min-h-[64px] font-serif text-[24px] font-black leading-[1.2] text-[#111] transition-colors duration-300 hover:text-[#5B3DF5]">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="mt-3 flex min-h-6 items-center gap-2">
                      {product.rating > 0 ? (
                        <>
                          <div className="flex items-center gap-0.5">
                            {Array.from({
                              length: 5,
                            }).map(
                              (
                                _,
                                starIndex
                              ) => (
                                <Star
                                  key={
                                    starIndex
                                  }
                                  size={15}
                                  fill={
                                    starIndex <
                                    Math.round(
                                      product.rating
                                    )
                                      ? "#5B3DF5"
                                      : "transparent"
                                  }
                                  color={
                                    starIndex <
                                    Math.round(
                                      product.rating
                                    )
                                      ? "#5B3DF5"
                                      : "#D1D5DB"
                                  }
                                />
                              )
                            )}
                          </div>

                          <span className="text-[14px] font-semibold text-[#111]">
                            {product.rating.toFixed(
                              1
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-[#777]">
                          New arrival
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="text-[19px] font-black text-[#111]">
                        ₹
                        {product.price.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      {product.oldPrice && (
                        <span className="text-[15px] text-[#66615D] line-through">
                          ₹
                          {product.oldPrice.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      )}

                      {discount > 0 && (
                        <span className="rounded-full bg-[#EFE6FF] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#5B3DF5]">
                          {discount}% Off
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={product.stock <= 0}
                      onClick={() => {
                        addProductToCart({
                          id: product.id,
                          slug: product.slug,
                          name: product.title,
                          image: product.image,
                          price: product.price,
                          originalPrice: product.oldPrice,
                          stock: product.stock,
                          size: product.sizes[0] ?? "",
                          color: product.colors[0]?.name ?? "",
                        });
                        setAddedProductId(product.id);
                      }}
                      className="relative mt-6 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#6A4DFF] to-[#4E2EDB] py-3.5 text-[15px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_12px_30px_-10px_rgba(91,61,245,0.6)] transition-all duration-500 hover:shadow-[0_16px_40px_-8px_rgba(91,61,245,0.75)]"
                    >
                      {addedProductId === product.id ? (
                        <Check size={17} />
                      ) : (
                        <ShoppingBag size={17} />
                      )}

                      <span>
                        {product.stock <= 0
                          ? "Out of Stock"
                          : addedProductId === product.id
                            ? "Added to Bag"
                            : "Add to Bag"}
                      </span>
                    </button>

                    <Link
                      href={productHref}
                      className="group/quick mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#ECECEC] bg-white/60 py-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-[#111] backdrop-blur-sm transition-all duration-300 hover:border-[#5B3DF5]/40 hover:text-[#5B3DF5]"
                    >
                      Quick View

                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover/quick:translate-x-1"
                      />
                    </Link>
                  </div>
                </article>
              );
            }
          )}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-[#5B3DF5] px-9 py-3.5 text-[14px] font-semibold uppercase tracking-[0.14em] text-[#5B3DF5] transition-all duration-500 hover:bg-[#5B3DF5] hover:text-white"
          >
            View All Products

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
